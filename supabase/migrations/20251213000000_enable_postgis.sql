-- Enable PostGIS extension for geospatial queries
CREATE EXTENSION IF NOT EXISTS postgis;

-- Add geography column to users table for efficient spatial queries
-- Geography type is better for lat/lon coordinates as it uses real-world distances
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS location geography(Point, 4326);

-- Create index on location column for fast spatial queries
CREATE INDEX IF NOT EXISTS users_location_gix
ON public.users
USING GIST (location);

-- Create a function to update the geography column from latitude/longitude
CREATE OR REPLACE FUNCTION update_user_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
  ELSE
    NEW.location = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update location column when lat/lon changes
DROP TRIGGER IF EXISTS update_user_location_trigger ON public.users;
CREATE TRIGGER update_user_location_trigger
BEFORE INSERT OR UPDATE OF latitude, longitude ON public.users
FOR EACH ROW
EXECUTE FUNCTION update_user_location();

-- Populate existing records with geography data
UPDATE public.users
SET location = ST_SetSRID(ST_MakePoint(longitude, latitude), 4326)::geography
WHERE latitude IS NOT NULL AND longitude IS NOT NULL AND location IS NULL;

-- Add comment explaining the column
COMMENT ON COLUMN public.users.location IS 'Geographic location point for spatial queries. Auto-populated from latitude/longitude columns.';
