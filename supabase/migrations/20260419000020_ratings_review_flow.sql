-- T1-C: Review & rating submission flow
-- 1. Make ratings publicly readable (worker profiles are public pages).
-- 2. Enforce one review per booking at the DB level.

-- 1. Replace the restrictive "related users only" SELECT policy with a
--    public-read policy so worker profile pages show reviews to visitors.
DROP POLICY IF EXISTS "Ratings visible to related users" ON public.ratings;

CREATE POLICY "Ratings are publicly readable"
  ON public.ratings
  FOR SELECT
  USING (true);

-- 2. One review per booking — unique constraint prevents duplicates even
--    from concurrent inserts or direct API calls.
ALTER TABLE public.ratings
  ADD CONSTRAINT ratings_booking_id_key UNIQUE (booking_id);
