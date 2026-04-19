-- T1-B: Notifications — add link column, UPDATE policy, Realtime publication

-- Deep-link so UI can navigate to the relevant page when a notification is clicked.
ALTER TABLE notifications ADD COLUMN IF NOT EXISTS link TEXT;

-- Allow users to mark their own notifications as read (status → 'read').
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'notifications'
      AND policyname = 'users_update_own_notifications'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY users_update_own_notifications
        ON notifications FOR UPDATE
        USING     (user_id = auth.uid())
        WITH CHECK (user_id = auth.uid())
    $policy$;
  END IF;
END $$;

-- Publish the table to Supabase Realtime so INSERT events are pushed to
-- subscribed clients without needing a manual dashboard toggle.
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
