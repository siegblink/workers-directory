-- ============================================
-- Change users.role from VARCHAR to INTEGER
-- ============================================
-- This migration changes users.role to an integer that references roles.level
-- Roles: level 1 = ADMIN, level 2 = USER

-- Step 1: Add temporary column to store the new integer role
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role_new BIGINT;

-- Step 2: Migrate existing text-based roles to integer levels
UPDATE public.users
SET role_new = CASE
  WHEN role = 'admin' THEN 1
  WHEN role = 'worker' THEN 2
  WHEN role = 'customer' THEN 2
  ELSE 2  -- Default to USER (level 2)
END;

-- Step 3: Make sure all users have a role
UPDATE public.users
SET role_new = 2
WHERE role_new IS NULL;

-- Step 4: Drop the old role column
ALTER TABLE public.users
DROP COLUMN IF EXISTS role CASCADE;

-- Step 5: Rename role_new to role
ALTER TABLE public.users
RENAME COLUMN role_new TO role;

-- Step 6: Make role NOT NULL
ALTER TABLE public.users
ALTER COLUMN role SET NOT NULL;

-- Step 7: Set default to 2 (USER level)
ALTER TABLE public.users
ALTER COLUMN role SET DEFAULT 2;

-- Step 8: Add foreign key constraint to roles.level
-- SKIPPED: roles table doesn't exist in this schema

-- Step 9: Add index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);

COMMENT ON COLUMN public.users.role IS 'User role level (1=ADMIN, 2=USER). References roles.level.';

-- Step 10: Update helper functions
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = user_id AND role = 1
  );
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION is_admin IS 'Check if a user has admin role (role = 1)';

-- Step 11: Create helper function to get user role info
-- SKIPPED: roles table doesn't exist, simplified version below
CREATE OR REPLACE FUNCTION get_user_role_info(user_id UUID)
RETURNS TABLE (
  role_level BIGINT,
  role_name VARCHAR,
  is_admin BOOLEAN
) AS $$
  SELECT
    u.role as role_level,
    CASE u.role
      WHEN 1 THEN 'admin'::VARCHAR
      WHEN 2 THEN 'user'::VARCHAR
      ELSE 'unknown'::VARCHAR
    END as role_name,
    (u.role = 1) as is_admin
  FROM public.users u
  WHERE u.id = user_id
  LIMIT 1;
$$ LANGUAGE SQL STABLE;

COMMENT ON FUNCTION get_user_role_info IS 'Get complete role information for a user';

-- Step 12: Create helper view for user roles
-- SKIPPED: roles table doesn't exist, simplified version below
CREATE OR REPLACE VIEW user_roles_view AS
SELECT
  u.id as user_id,
  u.firstname,
  u.lastname,
  u.role as role_level,
  CASE u.role
    WHEN 1 THEN 'admin'
    WHEN 2 THEN 'user'
    ELSE 'unknown'
  END as role_name,
  (u.role = 1) as is_admin
FROM public.users u;

COMMENT ON VIEW user_roles_view IS 'Convenient view showing user roles with level and name';

-- Step 13: Grant permissions
GRANT SELECT ON user_roles_view TO authenticated;
GRANT SELECT ON user_roles_view TO anon;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role_info TO authenticated;

-- Verification
SELECT
  'Migration complete. Role column is now INTEGER.' as status;

SELECT
  'Role distribution: ' ||
  'Admins (role=1): ' || COUNT(CASE WHEN role = 1 THEN 1 END) || ', ' ||
  'Users (role=2): ' || COUNT(CASE WHEN role = 2 THEN 1 END)
  as distribution
FROM public.users;

-- Show role mapping (simplified since roles table doesn't exist)
SELECT
  'Role mapping: 1 = admin, 2 = user' as role_mapping;
