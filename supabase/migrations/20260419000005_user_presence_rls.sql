-- Add RLS policies for user_presence table.
-- Previously had RLS enabled but no policies, making the table inaccessible
-- to client-side queries and preventing online status from being written.

-- Anyone can view presence rows (needed for search/worker profile online badges)
CREATE POLICY "Anyone can view presence" ON public.user_presence
  FOR SELECT USING (true);

-- Authenticated users can upsert only their own presence row
CREATE POLICY "User manages own presence" ON public.user_presence
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "User updates own presence" ON public.user_presence
  FOR UPDATE USING (user_id = auth.uid());
