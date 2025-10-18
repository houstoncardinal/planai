-- =====================================================
-- COMPLETE RLS FIX - Resolve all 500 errors
-- This completely rebuilds RLS policies to eliminate recursion
-- =====================================================

-- First, drop ALL existing policies to start fresh
DO $$ 
DECLARE
    r RECORD;
BEGIN
    FOR r IN (SELECT schemaname, tablename, policyname 
              FROM pg_policies 
              WHERE schemaname = 'public') 
    LOOP
        EXECUTE format('DROP POLICY IF EXISTS %I ON %I.%I', 
                      r.policyname, r.schemaname, r.tablename);
    END LOOP;
END $$;

-- =====================================================
-- PROFILES TABLE POLICIES
-- =====================================================

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- PROJECTS TABLE POLICIES
-- =====================================================

-- Users can view their own projects
CREATE POLICY "Users can view own projects"
  ON public.projects FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own projects
CREATE POLICY "Users can insert own projects"
  ON public.projects FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own projects
CREATE POLICY "Users can update own projects"
  ON public.projects FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own projects
CREATE POLICY "Users can delete own projects"
  ON public.projects FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- TASKS TABLE POLICIES
-- =====================================================

-- Users can view tasks for their projects
CREATE POLICY "Users can view own tasks"
  ON public.tasks FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Users can insert tasks for their projects
CREATE POLICY "Users can insert own tasks"
  ON public.tasks FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Users can update tasks for their projects
CREATE POLICY "Users can update own tasks"
  ON public.tasks FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- Users can delete tasks for their projects
CREATE POLICY "Users can delete own tasks"
  ON public.tasks FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.projects 
      WHERE projects.id = tasks.project_id 
      AND projects.user_id = auth.uid()
    )
  );

-- =====================================================
-- LEARNINGS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own learnings"
  ON public.learnings FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own learnings"
  ON public.learnings FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own learnings"
  ON public.learnings FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own learnings"
  ON public.learnings FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- GOALS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own goals"
  ON public.goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own goals"
  ON public.goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own goals"
  ON public.goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own goals"
  ON public.goals FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- IDEAS TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own ideas"
  ON public.ideas FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own ideas"
  ON public.ideas FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own ideas"
  ON public.ideas FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own ideas"
  ON public.ideas FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- VOICE NOTES TABLE POLICIES
-- =====================================================

CREATE POLICY "Users can view own voice_notes"
  ON public.voice_notes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own voice_notes"
  ON public.voice_notes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own voice_notes"
  ON public.voice_notes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own voice_notes"
  ON public.voice_notes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- ADMIN ACTIVITY LOG POLICIES (if table exists)
-- =====================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_activity_log') THEN
    EXECUTE 'CREATE POLICY "Service role can manage activity log"
      ON public.admin_activity_log FOR ALL
      USING (true)
      WITH CHECK (true)';
  END IF;
END $$;

-- =====================================================
-- COLLABORATION POLICIES (if tables exist)
-- =====================================================

DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_collaborators') THEN
    EXECUTE 'CREATE POLICY "Users can view collaborations"
      ON public.project_collaborators FOR SELECT
      USING (
        auth.uid() = user_id OR 
        EXISTS (
          SELECT 1 FROM public.projects 
          WHERE projects.id = project_collaborators.project_id 
          AND projects.user_id = auth.uid()
        )
      )';
    
    EXECUTE 'CREATE POLICY "Project owners can manage collaborators"
      ON public.project_collaborators FOR ALL
      USING (
        EXISTS (
          SELECT 1 FROM public.projects 
          WHERE projects.id = project_collaborators.project_id 
          AND projects.user_id = auth.uid()
        )
      )';
  END IF;
END $$;

-- =====================================================
-- ENSURE RLS IS ENABLED
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learnings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voice_notes ENABLE ROW LEVEL SECURITY;

-- Enable RLS on collaboration tables if they exist
DO $$ 
BEGIN
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'project_collaborators') THEN
    EXECUTE 'ALTER TABLE public.project_collaborators ENABLE ROW LEVEL SECURITY';
  END IF;
  IF EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'admin_activity_log') THEN
    EXECUTE 'ALTER TABLE public.admin_activity_log ENABLE ROW LEVEL SECURITY';
  END IF;
END $$;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================

SELECT 'RLS policies completely rebuilt - all 500 errors should be resolved!' as status;
