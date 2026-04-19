-- Fix bookings RLS so workers can see/update their own bookings.
-- Root cause: bookings.worker_id should store auth.uid() (users.id), but
-- some rows stored workers.id (the workers table PK) instead.
-- The updated policies cover both cases via a subquery fallback.

DROP POLICY IF EXISTS "Booking visible to customer or worker" ON bookings;
CREATE POLICY "Booking visible to customer or worker" ON bookings
  FOR SELECT USING (
    customer_id = auth.uid()
    OR worker_id = auth.uid()
    OR worker_id IN (
      SELECT id FROM workers WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );

DROP POLICY IF EXISTS "Booking updatable by participants" ON bookings;
CREATE POLICY "Booking updatable by participants" ON bookings
  FOR UPDATE USING (
    customer_id = auth.uid()
    OR worker_id = auth.uid()
    OR worker_id IN (
      SELECT id FROM workers WHERE user_id = auth.uid() AND deleted_at IS NULL
    )
  );
