-- Re-add INSERT and UPDATE RLS policies for user_presence.
-- These were dropped in 20260419000007 when update_user_presence was SECURITY DEFINER
-- (function owner bypassed RLS). Migration 20260501000003 switched it to
-- SECURITY INVOKER, so the authenticated caller now needs explicit policies.

CREATE POLICY "User manages own presence"
  ON public.user_presence FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "User updates own presence"
  ON public.user_presence FOR UPDATE
  USING (user_id = auth.uid());
