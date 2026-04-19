-- T1-B: Auto-insert a notification row when a new message is sent.

CREATE OR REPLACE FUNCTION notify_on_message_insert()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO notifications (user_id, title, message, type, status, link)
  VALUES (
    NEW.receiver_id,
    'New Message',
    'You have received a new message.',
    'message_new',
    'delivered',
    '/messages'
  );
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_message_notifications ON messages;

CREATE TRIGGER trg_message_notifications
  AFTER INSERT ON messages
  FOR EACH ROW
  EXECUTE FUNCTION notify_on_message_insert();
