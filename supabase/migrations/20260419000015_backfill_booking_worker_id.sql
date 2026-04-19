-- Backfill: old bookings stored workers.id as worker_id.
-- The correct value is workers.user_id (auth UUID), matching the original FK
-- to users.id and the RLS policy worker_id = auth.uid().
UPDATE bookings b
SET worker_id = w.user_id
FROM workers w
WHERE b.worker_id = w.id;
