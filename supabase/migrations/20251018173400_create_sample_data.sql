-- =====================================================
-- CREATE SAMPLE DATA FOR TESTING
-- This creates a sample project to verify the system works
-- =====================================================

-- First, ensure your user has a profile
INSERT INTO public.profiles (id, email, full_name, role)
SELECT 
  id, 
  email, 
  COALESCE(raw_user_meta_data->>'full_name', email),
  CASE 
    WHEN email = 'hunainm.qureshi@gmail.com' THEN 'admin'::user_role
    ELSE 'customer'::user_role
  END
FROM auth.users
ON CONFLICT (id) DO UPDATE
SET email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    role = EXCLUDED.role;

-- Create a sample project for testing
-- This will only insert if you're logged in and have a user account
DO $$
DECLARE
  v_user_id UUID;
BEGIN
  -- Get the first user (should be you)
  SELECT id INTO v_user_id FROM auth.users LIMIT 1;
  
  IF v_user_id IS NOT NULL THEN
    -- Insert a sample project
    INSERT INTO public.projects (
      user_id,
      owner_id,
      title,
      description,
      category,
      status,
      priority,
      progress,
      technologies,
      team,
      budget,
      estimated_completion,
      created_at,
      updated_at
    ) VALUES (
      v_user_id,
      v_user_id,
      'Welcome to Plan.AI',
      'This is a sample project to help you get started. Feel free to edit or delete it and create your own projects!',
      'Web Development',
      'planning',
      'medium',
      0,
      ARRAY['React', 'TypeScript', 'Supabase', 'Tailwind CSS'],
      ARRAY['Solo Developer'],
      '$0',
      '2 weeks',
      NOW(),
      NOW()
    );
    
    RAISE NOTICE 'Sample project created successfully!';
  ELSE
    RAISE NOTICE 'No users found. Please sign up first, then run this migration again.';
  END IF;
END $$;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Show the created project
SELECT 
  'Sample project created:' as status,
  id,
  title,
  description,
  status,
  category
FROM public.projects
ORDER BY created_at DESC
LIMIT 1;

-- Show user profile
SELECT 
  'Your profile:' as status,
  id,
  email,
  role
FROM public.profiles;
