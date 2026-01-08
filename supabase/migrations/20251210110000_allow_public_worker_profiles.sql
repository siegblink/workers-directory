-- Allow public read access to worker profiles
-- This enables the public search/listing functionality while maintaining privacy for non-workers

-- Drop existing policy if it exists
DROP POLICY IF EXISTS "Public can view worker profiles" ON public.users;

-- Allow public to view basic info for users who are workers
CREATE POLICY "Public can view worker profiles"
ON public.users
FOR SELECT
USING (
  role = '2'  -- WORKER role (string at this point in migration sequence)
  AND status = 'active'
  AND EXISTS (
    SELECT 1 FROM public.workers
    WHERE workers.worker_id = users.id
    AND workers.status = 'available'
    AND workers.deleted_at IS NULL
  )
);

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public can view available workers" ON public.workers;
DROP POLICY IF EXISTS "Public can view worker presence" ON public.user_presence;
DROP POLICY IF EXISTS "Public can view worker ratings" ON public.ratings;

-- Allow public to view worker data
CREATE POLICY "Public can view available workers"
ON public.workers
FOR SELECT
USING (
  status = 'available'
  AND deleted_at IS NULL
);

-- Allow public to view worker presence
CREATE POLICY "Public can view worker presence"
ON public.user_presence
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workers
    WHERE workers.worker_id = user_presence.user_id
    AND workers.status = 'available'
    AND workers.deleted_at IS NULL
  )
);

-- Allow public to view worker ratings
CREATE POLICY "Public can view worker ratings"
ON public.ratings
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.workers
    WHERE workers.worker_id = ratings.worker_id
    AND workers.status = 'available'
    AND workers.deleted_at IS NULL
  )
);
