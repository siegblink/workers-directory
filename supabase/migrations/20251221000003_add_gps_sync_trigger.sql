-- Create trigger to automatically sync PostGIS geography point
-- When latitude/longitude are updated, the current_location geography point is synced

-- Step 1: Create trigger function
CREATE OR REPLACE FUNCTION sync_user_presence_gps_location()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  -- If latitude and longitude are provided, create/update the PostGIS geography point
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.current_location := ST_SetSRID(
      ST_MakePoint(NEW.longitude, NEW.latitude),
      4326
    )::geography;
  ELSE
    -- If either is NULL, clear the location
    NEW.current_location := NULL;
  END IF;

  RETURN NEW;
END;
$$;

-- Step 2: Create trigger
DROP TRIGGER IF EXISTS sync_presence_gps_trigger ON public.user_presence;
CREATE TRIGGER sync_presence_gps_trigger
  BEFORE INSERT OR UPDATE OF latitude, longitude
  ON public.user_presence
  FOR EACH ROW
  EXECUTE FUNCTION sync_user_presence_gps_location();

-- Step 3: Add comment
COMMENT ON FUNCTION sync_user_presence_gps_location() IS
'Trigger function that automatically syncs the current_location PostGIS geography point
when latitude or longitude are updated in user_presence table';

-- Verification
SELECT
  'GPS sync trigger created successfully' as status,
  tgname as trigger_name,
  proname as function_name
FROM pg_trigger
JOIN pg_proc ON pg_trigger.tgfoid = pg_proc.oid
WHERE tgname = 'sync_presence_gps_trigger';
