-- Create steps table
CREATE TABLE public.steps (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  completed BOOLEAN NOT NULL DEFAULT false,
  notes TEXT,
  learnings TEXT[],
  impact TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS
ALTER TABLE public.steps ENABLE ROW LEVEL SECURITY;

-- Create policies for steps
CREATE POLICY "Users can view their own steps"
ON public.steps FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own steps"
ON public.steps FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own steps"
ON public.steps FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own steps"
ON public.steps FOR DELETE
USING (auth.uid() = user_id);

-- Create learnings table
CREATE TABLE public.learnings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('success', 'failure', 'insight')),
  tags TEXT[],
  related_step TEXT,
  project TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learnings ENABLE ROW LEVEL SECURITY;

-- Create policies for learnings
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

-- Create code_issues table
CREATE TABLE public.code_issues (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  file TEXT NOT NULL,
  lines INTEGER NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('length', 'duplicate', 'complexity')),
  severity TEXT NOT NULL CHECK (severity IN ('low', 'medium', 'high')),
  description TEXT NOT NULL,
  suggestion TEXT NOT NULL,
  resolved BOOLEAN NOT NULL DEFAULT false,
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.code_issues ENABLE ROW LEVEL SECURITY;

-- Create policies for code_issues
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

-- Add triggers for updated_at
CREATE TRIGGER update_steps_updated_at
BEFORE UPDATE ON public.steps
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_learnings_updated_at
BEFORE UPDATE ON public.learnings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER update_code_issues_updated_at
BEFORE UPDATE ON public.code_issues
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();