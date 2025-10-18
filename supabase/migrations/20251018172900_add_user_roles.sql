-- Create user roles enum
CREATE TYPE user_role AS ENUM ('admin', 'customer');

-- Add role column to profiles table
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer';

-- Set admin role for the specified email
UPDATE profiles 
SET role = 'admin' 
WHERE email = 'hunainm.qureshi@gmail.com';

-- Create function to automatically set admin role on profile creation
CREATE OR REPLACE FUNCTION set_admin_role()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.email = 'hunainm.qureshi@gmail.com' THEN
    NEW.role := 'admin';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to set admin role
DROP TRIGGER IF EXISTS set_admin_role_trigger ON profiles;
CREATE TRIGGER set_admin_role_trigger
  BEFORE INSERT OR UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_admin_role();

-- Create RLS policies for role-based access
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

-- Policy: Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Users can update their own profile (except role)
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (role IS NULL OR role = (SELECT role FROM profiles WHERE id = auth.uid()))
  );

-- Policy: Admins can update any profile
CREATE POLICY "Admins can update any profile"
  ON profiles FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create admin activity log table
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  admin_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  action TEXT NOT NULL,
  target_type TEXT,
  target_id UUID,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on admin activity log
ALTER TABLE admin_activity_log ENABLE ROW LEVEL SECURITY;

-- Policy: Only admins can view activity log
CREATE POLICY "Admins can view activity log"
  ON admin_activity_log FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Policy: Only admins can insert into activity log
CREATE POLICY "Admins can insert activity log"
  ON admin_activity_log FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create function to log admin actions
CREATE OR REPLACE FUNCTION log_admin_action(
  p_action TEXT,
  p_target_type TEXT DEFAULT NULL,
  p_target_id UUID DEFAULT NULL,
  p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  v_log_id UUID;
BEGIN
  INSERT INTO admin_activity_log (admin_id, action, target_type, target_id, details)
  VALUES (auth.uid(), p_action, p_target_type, p_target_id, p_details)
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create view for user management (admin only)
CREATE OR REPLACE VIEW admin_user_management AS
SELECT 
  p.id,
  p.email,
  p.full_name,
  p.role,
  p.created_at,
  p.updated_at,
  COUNT(DISTINCT pr.id) as project_count,
  COUNT(DISTINCT t.id) as task_count
FROM profiles p
LEFT JOIN projects pr ON pr.user_id = p.id
LEFT JOIN tasks t ON t.user_id = p.id
GROUP BY p.id, p.email, p.full_name, p.role, p.created_at, p.updated_at;

-- Grant access to admin view
GRANT SELECT ON admin_user_management TO authenticated;

-- Create RLS policy for admin view
CREATE POLICY "Only admins can view user management"
  ON admin_user_management FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_admin_id ON admin_activity_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_activity_log_created_at ON admin_activity_log(created_at DESC);

-- Comment on important objects
COMMENT ON TYPE user_role IS 'User role types: admin has full access, customer has limited access';
COMMENT ON COLUMN profiles.role IS 'User role determining access level';
COMMENT ON TABLE admin_activity_log IS 'Logs all admin actions for audit trail';
COMMENT ON FUNCTION log_admin_action IS 'Helper function to log admin actions';
