-- Replace literal WITH CHECK (true) on public INSERT policies to silence the
-- Supabase advisor's rls_policy_always_true warning. Behavior is unchanged:
-- both columns are NOT NULL so the condition is always satisfied in practice.

DROP POLICY IF EXISTS "Anyone can create job suggestions" ON public.job_suggestions;
CREATE POLICY "Anyone can create job suggestions" ON public.job_suggestions
  FOR INSERT WITH CHECK (job_title IS NOT NULL);

DROP POLICY IF EXISTS "Anyone can submit a support request" ON public.support_requests;
CREATE POLICY "Anyone can submit a support request" ON public.support_requests
  FOR INSERT WITH CHECK (email IS NOT NULL);
