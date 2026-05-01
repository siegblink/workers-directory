-- Ensure authenticated role has table-level permissions on user_presence.
-- The SECURITY INVOKER switch in 20260501000003 means the function body now
-- runs as the calling role (authenticated), which needs explicit INSERT/UPDATE
-- grants in addition to the RLS policies added in 20260501000006.

GRANT SELECT, INSERT, UPDATE ON public.user_presence TO authenticated;
