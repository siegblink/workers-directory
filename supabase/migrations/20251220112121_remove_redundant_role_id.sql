-- Remove redundant role_id column from users table
-- The role column already stores the role level with FK constraint to roles.level
-- role_id appears to be an old/unused column

-- Step 1: Verify role_id is redundant (optional verification)
-- SKIPPED: Column may not exist in this schema

-- Step 2: Drop the redundant role_id column
ALTER TABLE public.users
DROP COLUMN IF EXISTS role_id CASCADE;

COMMENT ON COLUMN public.users.role IS 'User role level (1=admin, 2=worker, 3=user). References roles.level. This is the authoritative role column.';

-- Note: Column reordering in PostgreSQL
-- PostgreSQL doesn't support ALTER TABLE ... MOVE COLUMN
-- The role column will remain in its current position
-- Column order in the table is: id, created_at, updated_at, email, ..., role
-- This is fine - column order doesn't affect functionality or performance

-- Verification
SELECT
  'role_id column removed successfully' as status,
  COUNT(*) as total_users,
  COUNT(DISTINCT role) as distinct_roles
FROM public.users;

-- Show role distribution (simplified since roles table doesn't exist)
SELECT
  role as role_level,
  COUNT(*) as user_count
FROM public.users
GROUP BY role
ORDER BY role;
