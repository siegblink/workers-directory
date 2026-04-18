-- workers_categories is queried on public worker profile pages by any visitor.
-- The existing policy (USING worker_id = auth.uid()) blocks non-owners from
-- reading, causing 403s. Add a public SELECT policy to allow anyone to read
-- category associations while keeping the owner-only policy for writes.
--
-- PostgreSQL checks GRANTs before RLS — a missing GRANT returns 403 even if
-- an USING (true) policy exists. Re-assert SELECT grants defensively.

GRANT SELECT ON public.workers_categories TO anon, authenticated;

CREATE POLICY "Public can view worker categories"
  ON public.workers_categories FOR SELECT
  USING (true);
