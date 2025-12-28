-- Add RLS policies for user_presence table
--
-- Purpose: Allow users to manage their own presence and view others' presence
--
-- Policies needed:
-- 1. SELECT: Everyone can view presence status (for showing online/offline indicators)
-- 2. INSERT: Authenticated users can create their own presence record
-- 3. UPDATE: Users can update their own presence record
-- 4. DELETE: Users can delete their own presence record (cleanup)

-- Enable RLS
ALTER TABLE public.user_presence ENABLE ROW LEVEL SECURITY;

-- Policy 1: Everyone can view presence status
CREATE POLICY "Everyone can view presence"
ON public.user_presence
FOR SELECT
TO public
USING (true);

-- Policy 2: Authenticated users can insert their own presence
CREATE POLICY "User can create own presence"
ON public.user_presence
FOR INSERT
TO authenticated
WITH CHECK (user_id = auth.uid());

-- Policy 3: Users can update their own presence
CREATE POLICY "User can update own presence"
ON public.user_presence
FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Policy 4: Users can delete their own presence
CREATE POLICY "User can delete own presence"
ON public.user_presence
FOR DELETE
TO authenticated
USING (user_id = auth.uid());

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_presence_user_id ON public.user_presence(user_id);
CREATE INDEX IF NOT EXISTS idx_user_presence_online ON public.user_presence(is_online);
CREATE INDEX IF NOT EXISTS idx_user_presence_last_seen ON public.user_presence(last_seen);

-- Verification
SELECT
  'User presence policies added' as status,
  COUNT(*) as policy_count
FROM pg_policies
WHERE tablename = 'user_presence';
