-- T1-A: Booking status lifecycle
-- Adds in_progress status and started_at timestamp to support the full
-- pending → accepted → in_progress → completed flow.

-- 1. Expand status constraint to include all lifecycle states.
--    The live DB already allows 'accepted'; we're adding 'in_progress'.
ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_status_check;
ALTER TABLE bookings ADD CONSTRAINT bookings_status_check
  CHECK (status IN ('pending', 'accepted', 'in_progress', 'completed', 'canceled'));

-- 2. Track when the worker actually starts the job on-site.
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS started_at TIMESTAMPTZ;
