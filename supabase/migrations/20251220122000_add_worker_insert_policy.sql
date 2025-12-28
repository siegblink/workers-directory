-- Add INSERT policy for workers table to allow users to become workers
--
-- Problem: Users cannot insert into workers table because there's no INSERT policy
-- This prevents the "Become a Worker" feature from working
--
-- Current policies:
-- - SELECT: Everyone can view worker profiles ✓
-- - UPDATE: Worker can update own worker record ✓
-- - INSERT: MISSING ✗
--
-- Solution: Add policy allowing authenticated users to create their own worker profile

-- Enable RLS on workers table (if not already enabled)
ALTER TABLE public.workers ENABLE ROW LEVEL SECURITY;

-- Add INSERT policy: Allow authenticated users to create their own worker profile
CREATE POLICY "User can create own worker profile"
ON public.workers
FOR INSERT
TO authenticated
WITH CHECK (worker_id = auth.uid());

-- Verification
SELECT
  'INSERT policy added successfully' as status,
  policyname,
  cmd
FROM pg_policies
WHERE tablename = 'workers'
ORDER BY cmd;
