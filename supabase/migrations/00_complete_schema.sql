-- =====================================================
-- PLAN.AI COMPLETE DATABASE SCHEMA
-- This migration creates all tables, functions, and policies
-- for the complete Plan.AI application
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- UTILITY FUNCTIONS
-- =====================================================

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user email by ID
CREATE OR REPLACE FUNCTION public.get_user_email(user_uuid UUID)
RETURNS TEXT AS $$
  SELECT email FROM auth.users WHERE id = user_uuid;
$$ LANGUAGE SQL SECURITY DEFINER;

-- =====================================================
-- PROJECTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL DEFAULT 'Web Development',
  status TEXT NOT NULL DEFAULT 'planning',
  priority TEXT NOT NULL DEFAULT 'medium',
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  technologies TEXT[] DEFAULT '{}',
  team TEXT[] DEFAULT '{}',
  due_date TIMESTAMP WITH TIME ZONE,
  budget TEXT DEFAULT '$0',
  payment_method TEXT DEFAULT 'Not Set',
  time_spent TEXT DEFAULT '0h',
  estimated_completion TEXT DEFAULT '2 weeks',
  steps_completed INTEGER DEFAULT 0,
  total_steps INTEGER DEFAULT 0,
  time_tracking JSONB DEFAULT '{}',
  account_email TEXT,
  account_platform TEXT DEFAULT 'lovable',
  project_url TEXT,
  account_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Set owner_id to user_id for existing projects
UPDATE public.projects SET owner_id = user_id WHERE owner_id IS NULL;

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Create trigger for updated_at
CREATE TRIGGER update_projects_updated_at
BEFORE UPDATE ON public.projects
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- PROJECT COLLABORATORS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.project_collaborators (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'viewer', -- viewer, editor, admin
  invited_by UUID REFERENCES auth.users(id),
  invited_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'pending', -- pending, accepted, declined
  UNIQUE(project_id, user_id)
);

-- Enable RLS
ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- LEARNINGS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.learnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL DEFAULT 'insight', -- success, failure, insight
  tags TEXT[] DEFAULT '{}',
  related_step TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.learnings ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_learnings_updated_at
BEFORE UPDATE ON public.learnings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- GOALS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  target_date DATE,
  progress INTEGER DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  status TEXT DEFAULT 'active', -- active, completed, archived
  priority TEXT DEFAULT 'medium', -- low, medium, high
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_goals_updated_at
BEFORE UPDATE ON public.goals
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- IDEAS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.ideas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  status TEXT DEFAULT 'concept', -- concept, planning, in-progress, completed
  priority TEXT DEFAULT 'medium', -- low, medium, high
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_ideas_updated_at
BEFORE UPDATE ON public.ideas
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- TASKS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.tasks (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'pending', -- pending, in-progress, completed, cancelled
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  due_date DATE,
  created_from_voice BOOLEAN DEFAULT FALSE,
  original_note TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_tasks_updated_at
BEFORE UPDATE ON public.tasks
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- VOICE NOTES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.voice_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  transcription TEXT NOT NULL,
  audio_url TEXT,
  processed BOOLEAN DEFAULT FALSE,
  ai_analysis JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_voice_notes_updated_at
BEFORE UPDATE ON public.voice_notes
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- STEPS TABLE (for project steps/milestones)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN DEFAULT FALSE,
  notes TEXT,
  learnings TEXT[] DEFAULT '{}',
  impact TEXT[] DEFAULT '{}',
  priority TEXT DEFAULT 'medium', -- low, medium, high, critical
  estimated_hours INTEGER,
  status TEXT DEFAULT 'not_started', -- not_started, in_progress, blocked, completed
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_steps_updated_at
BEFORE UPDATE ON public.steps
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- CODE ISSUES TABLE (for code analysis)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.code_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file_path TEXT NOT NULL,
  line_number INTEGER,
  issue_type TEXT NOT NULL, -- length, duplicate, complexity, security, performance
  severity TEXT NOT NULL DEFAULT 'medium', -- low, medium, high, critical
  description TEXT NOT NULL,
  suggestion TEXT,
  resolved BOOLEAN DEFAULT FALSE,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.code_issues ENABLE ROW LEVEL SECURITY;

-- Create trigger
CREATE TRIGGER update_code_issues_updated_at
BEFORE UPDATE ON public.code_issues
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- RLS POLICIES - PROJECTS
-- =====================================================

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

-- =====================================================
-- RLS POLICIES - PROJECT COLLABORATORS
-- =====================================================

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

-- =====================================================
-- RLS POLICIES - LEARNINGS
-- =====================================================

CREATE POLICY "Users can view their own learnings" 
ON public.learnings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own learnings" 
ON public.learnings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own learnings" 
ON public.learnings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own learnings" 
ON public.learnings FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - GOALS
-- =====================================================

CREATE POLICY "Users can view their own goals" 
ON public.goals FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own goals" 
ON public.goals FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own goals" 
ON public.goals FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own goals" 
ON public.goals FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - IDEAS
-- =====================================================

CREATE POLICY "Users can view their own ideas" 
ON public.ideas FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own ideas" 
ON public.ideas FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own ideas" 
ON public.ideas FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own ideas" 
ON public.ideas FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - TASKS
-- =====================================================

CREATE POLICY "Users can view their own tasks" 
ON public.tasks FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tasks" 
ON public.tasks FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks" 
ON public.tasks FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks" 
ON public.tasks FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - VOICE NOTES
-- =====================================================

CREATE POLICY "Users can view their own voice notes" 
ON public.voice_notes FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own voice notes" 
ON public.voice_notes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own voice notes" 
ON public.voice_notes FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own voice notes" 
ON public.voice_notes FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - STEPS
-- =====================================================

CREATE POLICY "Users can view steps for their projects" 
ON public.steps FOR SELECT 
USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT user_id FROM public.project_collaborators 
    WHERE project_id = steps.project_id AND status = 'accepted'
  )
);

CREATE POLICY "Users can create steps for their projects" 
ON public.steps FOR INSERT 
WITH CHECK (
  auth.uid() = user_id AND
  auth.uid() IN (
    SELECT user_id FROM public.projects WHERE id = project_id
  )
);

CREATE POLICY "Users can update steps for their projects" 
ON public.steps FOR UPDATE 
USING (
  auth.uid() = user_id OR
  auth.uid() IN (
    SELECT user_id FROM public.project_collaborators 
    WHERE project_id = steps.project_id AND status = 'accepted' AND role IN ('editor', 'admin')
  )
);

CREATE POLICY "Users can delete steps for their projects" 
ON public.steps FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- RLS POLICIES - CODE ISSUES
-- =====================================================

CREATE POLICY "Users can view their own code issues" 
ON public.code_issues FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own code issues" 
ON public.code_issues FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own code issues" 
ON public.code_issues FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own code issues" 
ON public.code_issues FOR DELETE 
USING (auth.uid() = user_id);

-- =====================================================
-- VIEWS
-- =====================================================

-- View for projects with collaboration info
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

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_owner_id ON public.projects(owner_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_collaborators_project_id ON public.project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_user_id ON public.project_collaborators(user_id);
CREATE INDEX IF NOT EXISTS idx_collaborators_status ON public.project_collaborators(status);

CREATE INDEX IF NOT EXISTS idx_learnings_user_id ON public.learnings(user_id);
CREATE INDEX IF NOT EXISTS idx_learnings_project_id ON public.learnings(project_id);

CREATE INDEX IF NOT EXISTS idx_goals_user_id ON public.goals(user_id);
CREATE INDEX IF NOT EXISTS idx_goals_status ON public.goals(status);

CREATE INDEX IF NOT EXISTS idx_ideas_user_id ON public.ideas(user_id);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON public.ideas(status);

CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON public.tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON public.tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON public.tasks(status);

CREATE INDEX IF NOT EXISTS idx_voice_notes_user_id ON public.voice_notes(user_id);
CREATE INDEX IF NOT EXISTS idx_voice_notes_processed ON public.voice_notes(processed);

CREATE INDEX IF NOT EXISTS idx_steps_project_id ON public.steps(project_id);
CREATE INDEX IF NOT EXISTS idx_steps_user_id ON public.steps(user_id);
CREATE INDEX IF NOT EXISTS idx_steps_status ON public.steps(status);

CREATE INDEX IF NOT EXISTS idx_code_issues_user_id ON public.code_issues(user_id);
CREATE INDEX IF NOT EXISTS idx_code_issues_project_id ON public.code_issues(project_id);
CREATE INDEX IF NOT EXISTS idx_code_issues_resolved ON public.code_issues(resolved);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- COMPLETE
-- =====================================================

-- This migration is complete and ready to use!
-- All tables, functions, policies, and indexes have been created.
