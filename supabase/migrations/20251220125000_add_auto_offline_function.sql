-- Add automatic offline detection for stale presence records
--
-- Purpose: Mark users as offline if they haven't sent a heartbeat in a while
-- This handles cases where:
-- - Browser crashes
-- - Network disconnects
-- - User closes browser without proper cleanup
--
-- The function will be called periodically to clean up stale presence records

-- Function to mark stale users as offline
CREATE OR REPLACE FUNCTION public.mark_stale_users_offline()
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  affected_count INTEGER;
  offline_threshold INTERVAL := '2 minutes'; -- Consider offline after 2 minutes of no heartbeat
BEGIN
  -- Update users who are marked online but haven't sent heartbeat recently
  UPDATE public.user_presence
  SET is_online = false
  WHERE is_online = true
    AND last_seen < (NOW() - offline_threshold);

  GET DIAGNOSTICS affected_count = ROW_COUNT;

  RETURN affected_count;
END;
$$;

-- Add comment
COMMENT ON FUNCTION public.mark_stale_users_offline() IS
'Marks users as offline if they haven''t sent a heartbeat in the last 2 minutes.
Returns the number of users marked offline.';

-- Test the function
SELECT mark_stale_users_offline() as users_marked_offline;

-- Show current online status summary
SELECT
  is_online,
  COUNT(*) as user_count,
  COUNT(*) FILTER (WHERE last_seen > NOW() - INTERVAL '2 minutes') as active_count,
  COUNT(*) FILTER (WHERE last_seen < NOW() - INTERVAL '2 minutes') as stale_count
FROM public.user_presence
GROUP BY is_online;
