-- =====================================================
-- VERIFICATION AND FIX SCRIPT
-- Run this in your Supabase SQL Editor to verify
-- and fix any remaining issues
-- =====================================================

-- 1. Check if profiles table exists and has data
SELECT 'Profiles table check:' as step;
SELECT COUNT(*) as profile_count FROM public.profiles;

-- 2. Check if projects table exists and has data
SELECT 'Projects table check:' as step;
SELECT COUNT(*) as project_count FROM public.projects;

-- 3. List all your projects (to verify they're accessible)
SELECT 'Your projects:' as step;
SELECT 
  id,
  title,
  status,
  created_at,
  user_id
FROM public.projects
ORDER BY created_at DESC;

-- 4. Check if user_role type exists
SELECT 'User role type check:' as step;
SELECT typname FROM pg_type WHERE typname = 'user_role';

-- 5. Verify profiles have roles assigned
SELECT 'Profiles with roles:' as step;
SELECT 
  id,
  email,
  role,
  created_at
FROM public.profiles;

-- =====================================================
-- FIX SCRIPT (if needed)
-- Uncomment and run these if you encounter issues
-- =====================================================

-- If profiles table is missing or empty, create profiles for existing users:
-- INSERT INTO public.profiles (id, email, full_name, role)
-- SELECT 
--   id, 
--   email, 
--   COALESCE(raw_user_meta_data->>'full_name', email),
--   'customer'::user_role
-- FROM auth.users
-- ON CONFLICT (id) DO UPDATE
-- SET email = EXCLUDED.email,
--     full_name = EXCLUDED.full_name;

-- Set your admin role:
-- UPDATE public.profiles 
-- SET role = 'admin' 
-- WHERE email = 'hunainm.qureshi@gmail.com';

-- =====================================================
-- GRANT PERMISSIONS (run if you get permission errors)
-- =====================================================

-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
-- GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;
-- GRANT EXECUTE ON ALL FUNCTIONS IN SCHEMA public TO authenticated;

-- =====================================================
-- RESET RLS POLICIES (if projects aren't loading)
-- =====================================================

-- If you can't see your projects, temporarily disable RLS to test:
-- ALTER TABLE public.projects DISABLE ROW LEVEL SECURITY;
-- 
-- Then re-enable after verifying:
-- ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- COMPLETE
-- =====================================================

SELECT 'Verification complete!' as status;
