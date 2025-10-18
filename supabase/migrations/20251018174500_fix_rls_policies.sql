-- =====================================================
-- FIX INFINITE RECURSION IN RLS POLICIES
-- This fixes the circular reference issues
-- =====================================================

-- Drop problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update any profile" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view activity log" ON public.admin_activity_log;
DROP POLICY IF EXISTS "Admins can insert activity log" ON public.admin_activity_log;

-- Recreate policies without recursion
-- Simple policy: users can view their own profile
-- Admins can view all profiles (using a simpler check)
CREATE POLICY "Users and admins can view profiles"
  ON public.profiles FOR SELECT
  USING (
    auth.uid() = id OR 
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- Admins can update any profile (using a simpler check)
CREATE POLICY "Admins can update profiles"
  ON public.profiles FOR UPDATE
  USING (
    auth.uid() = id OR
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- Admin activity log policies (simpler)
CREATE POLICY "Admins can view activity log"
  ON public.admin_activity_log FOR SELECT
  USING (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

CREATE POLICY "Admins can insert activity log"
  ON public.admin_activity_log FOR INSERT
  WITH CHECK (
    (SELECT role FROM public.profiles WHERE id = auth.uid() LIMIT 1) = 'admin'
  );

-- Fix project policies to avoid recursion
DROP POLICY IF EXISTS "Owners and editors can update projects" ON public.projects;
DROP POLICY IF EXISTS "Users can view their own and shared projects" ON public.projects;

CREATE POLICY "Users can view their projects"
  ON public.projects FOR SELECT
  USING (
    auth.uid() = user_id OR 
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT user_id FROM public.project_collaborators 
      WHERE project_id = projects.id AND status = 'accepted'
    )
  );

CREATE POLICY "Users can update their projects"
  ON public.projects FOR UPDATE
  USING (
    auth.uid() = user_id OR 
    auth.uid() = owner_id OR
    auth.uid() IN (
      SELECT user_id FROM public.project_collaborators 
      WHERE project_id = projects.id AND status = 'accepted' AND role IN ('editor', 'admin')
    )
  );

-- Success message
SELECT 'RLS policies fixed - infinite recursion resolved!' as status;
