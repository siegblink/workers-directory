-- T1-B fix: distinguish who cancelled so the trigger notifies the right party.
-- Without this, cancelling always notified customer_id regardless of whether
-- the customer or worker initiated it.

ALTER TABLE bookings ADD COLUMN IF NOT EXISTS canceled_by UUID;

-- Replace the booking notification trigger with a version that checks canceled_by.
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
        IF NEW.canceled_by = NEW.customer_id THEN
          -- Customer initiated: notify the worker
          IF v_worker_auth_id IS NOT NULL THEN
            INSERT INTO notifications (user_id, title, message, type, status, link)
            VALUES (
              v_worker_auth_id,
              'Booking Cancelled',
              'A customer has cancelled their booking.',
              'booking_canceled',
              'delivered',
              '/dashboard?tab=pending'
            );
          END IF;
        ELSE
          -- Worker declined (or unknown): notify the customer
          INSERT INTO notifications (user_id, title, message, type, status, link)
          VALUES (
            NEW.customer_id,
            'Booking Declined',
            'Your booking request has been declined.',
            'booking_canceled',
            'delivered',
            '/bookings/' || NEW.id
          );
        END IF;

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
