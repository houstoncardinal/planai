-- Add missing columns to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS payment_method TEXT DEFAULT 'Not Set',
ADD COLUMN IF NOT EXISTS time_tracking JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS due_date TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS budget TEXT DEFAULT '$0',
ADD COLUMN IF NOT EXISTS time_spent TEXT DEFAULT '0h',
ADD COLUMN IF NOT EXISTS estimated_completion TEXT DEFAULT '2 weeks',
ADD COLUMN IF NOT EXISTS steps_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS total_steps INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS owner_id UUID REFERENCES auth.users(id);

-- Set owner_id to user_id for existing projects
UPDATE public.projects SET owner_id = user_id WHERE owner_id IS NULL;

-- Create project_collaborators table for sharing projects
CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  UNIQUE(project_id, user_id)
);

-- Enable RLS on project_collaborators
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- Policies for project_collaborators
CREATE POLICY "Users can view collaborations they're part of" 
ON public.project_collaborators FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = invited_by OR
  auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  )
);

CREATE POLICY "Project owners can invite collaborators" 
ON public.project_collaborators FOR INSERT 
WITH CHECK (
  auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  )
);

CREATE POLICY "Users can update their own collaboration status" 
ON public.project_collaborators FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Project owners can remove collaborators" 
ON public.project_collaborators FOR DELETE 
USING (
  auth.uid() IN (
    SELECT owner_id FROM public.projects WHERE id = project_id
  )
);

-- Update projects RLS policies to include collaborators
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

-- New policies that include collaboration
CREATE POLICY "Users can view their own and shared projects" 
ON public.projects FOR SELECT 
USING (
  auth.uid() = user_id OR 
  auth.uid() = owner_id OR
  auth.uid() IN (
    SELECT user_id FROM public.project_collaborators 
    WHERE project_id = id AND status = 'accepted'
  )
);

CREATE POLICY "Users can create their own projects" 
ON public.projects FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Owners and editors can update projects" 
ON public.projects FOR UPDATE 
USING (
  auth.uid() = user_id OR 
  auth.uid() = owner_id OR
  auth.uid() IN (
    SELECT user_id FROM public.project_collaborators 
    WHERE project_id = id AND status = 'accepted' AND role IN ('editor', 'admin')
  )
);

CREATE POLICY "Only owners can delete projects" 
ON public.projects FOR DELETE 
USING (auth.uid() = user_id OR auth.uid() = owner_id);

-- Create function to get user's email by ID (for displaying collaborator info)
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Create view for projects with collaboration info
CREATE OR REPLACE VIEW public.projects_with_collaborators AS
SELECT 
  p.*,
  COALESCE(
    json_agg(
      json_build_object(
        'user_id', pc.user_id,
        'role', pc.role,
        'status', pc.status,
        'invited_at', pc.invited_at,
        'accepted_at', pc.accepted_at
      )
    ) FILTER (WHERE pc.user_id IS NOT NULL),
    '[]'
  ) as collaborators,
  CASE 
    WHEN p.owner_id = auth.uid() OR p.user_id = auth.uid() THEN false
    ELSE true
  END as is_shared
FROM public.projects p
LEFT JOIN public.project_collaborators pc ON p.id = pc.project_id AND pc.status = 'accepted'
GROUP BY p.id;

-- Grant access to the view
GRANT SELECT ON public.projects_with_collaborators TO authenticated;
