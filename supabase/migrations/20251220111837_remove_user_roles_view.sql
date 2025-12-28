-- Remove redundant user_roles_view
-- The view is unnecessary because:
-- 1. users.role already stores the role level (1=ADMIN, 2=USER)
-- 2. roles table already has the mapping (level → name)
-- 3. is_admin() function provides admin check
-- 4. get_user_role_info() function provides role info for specific users
-- 5. Simple JOIN query provides the same data without the view overhead

-- Drop the view
DROP VIEW IF EXISTS user_roles_view;

-- Alternative queries to use instead:

-- For specific user role info:
-- SELECT * FROM get_user_role_info('user-uuid-here');

-- For batch/reporting queries:
-- SELECT
--   u.id,
--   u.role as role_level,
--   r.name as role_name,
--   (u.role = 1) as is_admin
-- FROM users u
-- LEFT JOIN roles r ON u.role = r.level;

-- For admin check:
-- SELECT is_admin('user-uuid-here');
-- or
-- SELECT role = 1 FROM users WHERE id = 'user-uuid-here';

-- Verification
SELECT 'user_roles_view removed - use get_user_role_info() function or direct JOIN queries instead' as status;
