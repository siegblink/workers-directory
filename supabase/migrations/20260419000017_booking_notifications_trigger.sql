-- T1-B: Auto-insert a notification row whenever a booking is created or its
-- status changes.  SECURITY DEFINER lets the function insert as postgres,
-- bypassing RLS (authenticated users have no INSERT policy on notifications).
--
-- NOTE: bookings.worker_id stores workers.id (the PK), NOT the auth UUID.
-- We join workers to resolve the auth UUID for the notification user_id.

CREATE OR REPLACE FUNCTION notify_on_booking_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_worker_auth_id UUID;
BEGIN
  -- Resolve the worker's auth UUID from the workers table PK
  SELECT user_id INTO v_worker_auth_id
  FROM workers
  WHERE id = NEW.worker_id;

  -- New booking → notify the worker
  IF TG_OP = 'INSERT' THEN
    IF v_worker_auth_id IS NOT NULL THEN
      INSERT INTO notifications (user_id, title, message, type, status, link)
      VALUES (
        v_worker_auth_id,
        'New Booking Request',
        'You have a new booking request.',
        'booking_new',
        'delivered',
        '/dashboard?tab=pending'
      );
    END IF;
    RETURN NEW;
  END IF;

  -- Status change → notify the relevant party
  IF TG_OP = 'UPDATE' AND OLD.status IS DISTINCT FROM NEW.status THEN
    CASE NEW.status
      WHEN 'accepted' THEN
        INSERT INTO notifications (user_id, title, message, type, status, link)
        VALUES (
          NEW.customer_id,
          'Booking Accepted',
          'Your booking has been accepted by the worker.',
          'booking_accepted',
          'delivered',
          '/bookings/' || NEW.id
        );
      WHEN 'canceled' THEN
        INSERT INTO notifications (user_id, title, message, type, status, link)
        VALUES (
          NEW.customer_id,
          'Booking Cancelled',
          'Your booking has been cancelled.',
          'booking_canceled',
          'delivered',
          '/bookings/' || NEW.id
        );
      WHEN 'completed' THEN
        INSERT INTO notifications (user_id, title, message, type, status, link)
        VALUES (
          NEW.customer_id,
          'Booking Completed',
          'Your booking has been marked as completed.',
          'booking_completed',
          'delivered',
          '/bookings/' || NEW.id
        );
      ELSE
        NULL;
    END CASE;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_booking_notifications ON bookings;

CREATE TRIGGER trg_booking_notifications
  AFTER INSERT OR UPDATE ON bookings
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_booking_change();
