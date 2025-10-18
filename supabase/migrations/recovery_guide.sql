-- =====================================================
-- PROJECT RECOVERY GUIDE
-- Your projects table is empty after migration
-- =====================================================

-- STEP 1: Verify the database structure is correct
SELECT 'Checking database structure...' as status;

-- Check if projects table exists with correct columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'projects'
ORDER BY ordinal_position;

-- STEP 2: Check if you have any users in auth
SELECT 'Checking auth users...' as status;
SELECT id, email, created_at 
FROM auth.users;

-- STEP 3: Check if profiles were created
SELECT 'Checking profiles...' as status;
SELECT id, email, role, created_at 
FROM public.profiles;

-- STEP 4: Check all tables for any data
SELECT 'Checking all tables for data...' as status;

SELECT 'projects' as table_name, COUNT(*) as row_count FROM public.projects
UNION ALL
SELECT 'steps' as table_name, COUNT(*) as row_count FROM public.steps
UNION ALL
SELECT 'tasks' as table_name, COUNT(*) as row_count FROM public.tasks
UNION ALL
SELECT 'learnings' as table_name, COUNT(*) as row_count FROM public.learnings
UNION ALL
SELECT 'goals' as table_name, COUNT(*) as row_count FROM public.goals
UNION ALL
SELECT 'ideas' as table_name, COUNT(*) as row_count FROM public.ideas
UNION ALL
SELECT 'voice_notes' as table_name, COUNT(*) as row_count FROM public.voice_notes;

-- =====================================================
-- RECOVERY OPTIONS
-- =====================================================

-- OPTION 1: If you have a backup from your old Supabase project
-- You would need to export data from the old project and import here
-- Instructions:
-- 1. Go to your OLD Supabase project
-- 2. SQL Editor → Run: SELECT * FROM projects;
-- 3. Export the results as CSV or JSON
-- 4. Use the import script below (after getting the data)

-- OPTION 2: Create a sample project to test the system
-- Uncomment and modify this to create a test project:

-- INSERT INTO public.projects (
--   user_id,
--   owner_id,
--   title,
--   description,
--   category,
--   status,
--   priority,
--   progress,
--   technologies,
--   created_at,
--   updated_at
-- ) VALUES (
--   (SELECT id FROM auth.users WHERE email = 'hunainm.qureshi@gmail.com'),
--   (SELECT id FROM auth.users WHERE email = 'hunainm.qureshi@gmail.com'),
--   'Test Project',
--   'This is a test project to verify the system works',
--   'Web Development',
--   'planning',
--   'high',
--   0,
--   ARRAY['React', 'TypeScript', 'Supabase'],
--   NOW(),
--   NOW()
-- );

-- OPTION 3: Check if data exists in old Supabase project
-- You need to:
-- 1. Log into your OLD Supabase project dashboard
-- 2. Go to Table Editor → projects table
-- 3. Export all data
-- 4. Then import it here

-- =====================================================
-- IMPORTANT NOTES
-- =====================================================

-- When you migrate Supabase projects, the data does NOT automatically transfer.
-- You need to:
-- 1. Export data from old project (SQL dump or CSV)
-- 2. Import data into new project
-- 
-- If you still have access to your old Supabase project, you can recover the data.
-- If not, you'll need to start fresh or restore from any backups you may have.

SELECT 'Recovery guide complete. Check the results above.' as status;
