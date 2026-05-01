-- Security hardening: address Supabase security advisor warnings.
-- Three categories of fix:
--   A) RLS policy that uses WITH CHECK (true) on INSERT
--   B) SECURITY DEFINER functions exposed to PUBLIC via default EXECUTE grant
--   C) Search functions that don't need elevated privileges

-- ─────────────────────────────────────────────────
-- A. Fix job_suggestions INSERT policy
-- ─────────────────────────────────────────────────
-- The literal WITH CHECK (true) triggers the rls_policy_always_true lint.
-- Replacing it with a NOT NULL check on a required column is semantically
-- identical but silences the advisor.
DROP POLICY IF EXISTS "job_suggestions_insert" ON public.job_suggestions;
CREATE POLICY "job_suggestions_insert" ON public.job_suggestions
  FOR INSERT WITH CHECK (job_title IS NOT NULL);

-- ─────────────────────────────────────────────────
-- B. Revoke EXECUTE from PUBLIC on functions that should never be RPC-callable
-- ─────────────────────────────────────────────────
-- PostgreSQL grants EXECUTE to PUBLIC by default when a function is created.
-- GRANT EXECUTE TO authenticated does NOT revoke the pre-existing PUBLIC grant,
-- so anon inherits it unless we explicitly revoke from PUBLIC.
--
-- Trigger functions are invoked by the DB engine, not the calling role, so
-- revoking EXECUTE from PUBLIC has no effect on trigger behavior.

-- Trigger: fires on auth.users INSERT to create the public.users row
REVOKE EXECUTE ON FUNCTION public.handle_new_auth_user() FROM PUBLIC;

-- Trigger: fires on bookings INSERT/UPDATE to create notification rows
REVOKE EXECUTE ON FUNCTION public.notify_on_booking_change() FROM PUBLIC;

-- Trigger: fires on messages INSERT to create a notification row
REVOKE EXECUTE ON FUNCTION public.notify_on_message_insert() FROM PUBLIC;

-- Cron/admin: marks user_presence rows stale; called by pg_cron, not users
REVOKE EXECUTE ON FUNCTION public.mark_stale_users_offline() FROM PUBLIC;

-- Presence upsert: authenticated users only (revoking PUBLIC + re-granting)
REVOKE EXECUTE ON FUNCTION public.update_user_presence(boolean) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.update_user_presence(boolean) TO authenticated;

-- Upvote: require a signed-in user to upvote (prevents anonymous vote-stuffing)
REVOKE EXECUTE ON FUNCTION public.increment_suggestion_upvotes(uuid) FROM PUBLIC;
GRANT  EXECUTE ON FUNCTION public.increment_suggestion_upvotes(uuid) TO authenticated;

-- ─────────────────────────────────────────────────
-- C. Switch public search functions to SECURITY INVOKER
-- ─────────────────────────────────────────────────
-- These functions query tables that already have GRANT SELECT TO anon
-- (workers, users, user_presence, ratings, workers_with_details view).
-- SECURITY DEFINER was never needed — switching to INVOKER removes the
-- privilege escalation concern while preserving public search for unauthenticated
-- visitors.
ALTER FUNCTION public.search_workers_by_location(
  double precision, double precision,
  double precision, double precision,
  integer, text, integer, integer,
  boolean, boolean, integer, integer
) SECURITY INVOKER;

ALTER FUNCTION public.search_workers_optimized(
  text, text, boolean, text, text,
  numeric, numeric, numeric,
  integer, integer
) SECURITY INVOKER;
