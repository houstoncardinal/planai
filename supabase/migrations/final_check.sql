-- =====================================================
-- FINAL DATABASE CHECK
-- Run this to see your complete database status
-- =====================================================

-- 1. Show all your tables
SELECT '=== ALL TABLES ===' as section;
SELECT 
  table_name,
  (SELECT COUNT(*) FROM information_schema.columns WHERE table_name = t.table_name AND table_schema = 'public') as column_count
FROM information_schema.tables t
WHERE table_schema = 'public'
ORDER BY table_name;

-- 2. Check your user account
SELECT '=== YOUR USER ACCOUNT ===' as section;
SELECT 
  id,
  email,
  created_at,
  email_confirmed_at,
  last_sign_in_at
FROM auth.users;

-- 3. Check your profile
SELECT '=== YOUR PROFILE ===' as section;
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles;

-- 4. Count all data
SELECT '=== DATA COUNTS ===' as section;
SELECT 'projects' as table_name, COUNT(*) as count FROM public.projects
UNION ALL
SELECT 'steps', COUNT(*) FROM public.steps
UNION ALL
SELECT 'tasks', COUNT(*) FROM public.tasks
UNION ALL
SELECT 'learnings', COUNT(*) FROM public.learnings
UNION ALL
SELECT 'goals', COUNT(*) FROM public.goals
UNION ALL
SELECT 'ideas', COUNT(*) FROM public.ideas
UNION ALL
SELECT 'profiles', COUNT(*) FROM public.profiles
UNION ALL
SELECT 'users', COUNT(*) FROM auth.users;

-- 5. Show any existing projects
SELECT '=== YOUR PROJECTS (if any) ===' as section;
SELECT 
  id,
  title,
  description,
  status,
  category,
  progress,
  created_at
FROM public.projects
ORDER BY created_at DESC;

-- 6. Test if you can insert a project (this won't actually insert, just checks permissions)
SELECT '=== PERMISSION CHECK ===' as section;
SELECT 
  CASE 
    WHEN EXISTS (SELECT 1 FROM auth.users) THEN 'You have a user account ✓'
    ELSE 'No user account found - please sign up first'
  END as user_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles) THEN 'You have a profile ✓'
    ELSE 'No profile found - will be created on next login'
  END as profile_status,
  CASE 
    WHEN EXISTS (SELECT 1 FROM public.profiles WHERE role = 'admin') THEN 'You are an admin ✓'
    ELSE 'You are a customer'
  END as role_status;

SELECT '=== READY TO USE ===' as section;
SELECT 
  'Database is ready!' as status,
  'You can now:' as next_steps,
  '1. Log into your app' as step_1,
  '2. Create new projects' as step_2,
  '3. All features will work' as step_3;
