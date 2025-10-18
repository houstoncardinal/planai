-- =====================================================
-- SET ADMIN ROLE FOR YOUR ACCOUNT
-- Run this in Supabase SQL Editor to grant admin access
-- =====================================================

-- Update your profile to admin role
UPDATE public.profiles 
SET role = 'admin' 
WHERE email = 'hunainm.qureshi@gmail.com';

-- Verify the update
SELECT 
  id,
  email,
  full_name,
  role,
  created_at
FROM public.profiles
WHERE email = 'hunainm.qureshi@gmail.com';

-- If no rows are returned above, it means your profile doesn't exist yet
-- In that case, create it manually:

-- First, get your user ID from auth.users
SELECT id, email FROM auth.users WHERE email = 'hunainm.qureshi@gmail.com';

-- Then insert your profile (replace YOUR_USER_ID with the ID from above)
-- INSERT INTO public.profiles (id, email, full_name, role)
-- VALUES (
--   'YOUR_USER_ID',
--   'hunainm.qureshi@gmail.com',
--   'Hunain Qureshi',
--   'admin'
-- );

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check all profiles
SELECT 
  email,
  role,
  created_at
FROM public.profiles
ORDER BY created_at DESC;

-- Success message
SELECT 'Admin role set successfully!' as status;
