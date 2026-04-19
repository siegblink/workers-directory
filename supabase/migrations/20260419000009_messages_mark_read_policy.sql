-- Allow message receivers to update the status column (e.g. mark as read).
-- Senders cannot update their own messages via this policy.
CREATE POLICY "Receivers can mark messages as read" ON "public"."messages"
  FOR UPDATE
  USING ("receiver_id" = "auth"."uid"())
  WITH CHECK ("receiver_id" = "auth"."uid"());
