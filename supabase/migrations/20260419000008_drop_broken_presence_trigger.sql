-- Drop the sync_user_presence_gps_location trigger and function.
-- The trigger references NEW.current_location which does not exist in the
-- user_presence table schema, causing every INSERT to fail with error 42703.
DROP TRIGGER IF EXISTS sync_presence_gps_trigger ON public.user_presence;
DROP FUNCTION IF EXISTS public.sync_user_presence_gps_location() CASCADE;
