-- Add unique constraint on user_id in user_presence table
--
-- Purpose: Ensure each user has only one presence record
-- This enables efficient upsert operations for presence updates
--
-- Problem: Currently user_id has no unique constraint, which means:
-- 1. Users could have multiple presence records (data duplication)
-- 2. Upsert operations won't work properly
-- 3. Queries need to use DISTINCT or handle duplicates
--
-- Solution: Add unique constraint on user_id

-- First, clean up any duplicate records (keep the most recent one)
DELETE FROM public.user_presence p1
USING public.user_presence p2
WHERE p1.user_id = p2.user_id
  AND p1.last_seen < p2.last_seen;

-- Add unique constraint
ALTER TABLE public.user_presence
ADD CONSTRAINT user_presence_user_id_unique UNIQUE (user_id);

-- Verification
SELECT
  'Unique constraint added' as status,
  COUNT(*) as total_presence_records,
  COUNT(DISTINCT user_id) as unique_users
FROM public.user_presence;
