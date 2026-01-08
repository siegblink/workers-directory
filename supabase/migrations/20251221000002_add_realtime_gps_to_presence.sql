-- Add real-time GPS location tracking to user_presence
-- This enables location-based search using workers' current GPS coordinates

-- Step 1: Add GPS location columns to user_presence
ALTER TABLE public.user_presence
ADD COLUMN IF NOT EXISTS latitude numeric(10,8),
ADD COLUMN IF NOT EXISTS longitude numeric(11,8),
ADD COLUMN IF NOT EXISTS current_location geography(Point, 4326),
ADD COLUMN IF NOT EXISTS location_updated_at timestamp with time zone;

-- Step 2: Create spatial index for efficient location queries
CREATE INDEX IF NOT EXISTS idx_user_presence_location
ON public.user_presence USING GIST (current_location);

-- Step 3: Create index on location_updated_at for filtering recent locations
CREATE INDEX IF NOT EXISTS idx_user_presence_location_updated
ON public.user_presence (location_updated_at DESC);

-- Step 4: Add comments
COMMENT ON COLUMN public.user_presence.latitude IS 'Worker''s current latitude from GPS (updated every 30 seconds when online)';
COMMENT ON COLUMN public.user_presence.longitude IS 'Worker''s current longitude from GPS (updated every 30 seconds when online)';
COMMENT ON COLUMN public.user_presence.current_location IS 'PostGIS geography point for efficient spatial queries';
COMMENT ON COLUMN public.user_presence.location_updated_at IS 'Timestamp of last GPS location update';

-- Verification
SELECT
  'GPS location columns added to user_presence' as status,
  column_name,
  data_type
FROM information_schema.columns
WHERE table_name = 'user_presence'
  AND column_name IN ('latitude', 'longitude', 'current_location', 'location_updated_at');
