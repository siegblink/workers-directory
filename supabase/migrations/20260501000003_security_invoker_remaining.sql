-- Fix the two remaining authenticated-callable SECURITY DEFINER warnings.

-- ─────────────────────────────────────────────────
-- 1. update_user_presence → SECURITY INVOKER
-- ─────────────────────────────────────────────────
-- Safe because:
--   • user_presence has GRANT ALL TO authenticated (from production schema)
--   • INSERT RLS: WITH CHECK (user_id = auth.uid())
--   • UPDATE RLS: USING (user_id = auth.uid())
-- The function internally inserts/updates only the caller's own row (auth.uid()),
-- so it satisfies both RLS policies with no privilege escalation needed.
ALTER FUNCTION public.update_user_presence(boolean) SECURITY INVOKER;

-- ─────────────────────────────────────────────────
-- 2. increment_suggestion_upvotes → SECURITY INVOKER
-- ─────────────────────────────────────────────────
-- The function only touches upvotes + updated_at, so we can replace the broad
-- UPDATE grant with a column-scoped one. RLS can then be permissive on rows
-- without risk — the column grant is the real restriction.

-- Replace broad UPDATE with column-specific grant
REVOKE UPDATE ON public.job_suggestions FROM authenticated;
GRANT  UPDATE (upvotes, updated_at) ON public.job_suggestions TO authenticated;

-- Drop the owner-only UPDATE policy (superseded by the column grant, which already
-- prevents editing title/description/location/status for non-owners).
DROP POLICY IF EXISTS "job_suggestions_owner_update" ON public.job_suggestions;

-- Any authenticated user may update any row — safe because the column grant
-- above limits what they can actually change to upvotes + updated_at.
CREATE POLICY "job_suggestions_update" ON public.job_suggestions
  FOR UPDATE TO authenticated
  USING (true) WITH CHECK (true);

ALTER FUNCTION public.increment_suggestion_upvotes(uuid) SECURITY INVOKER;
