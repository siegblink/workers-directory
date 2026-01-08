-- Create search function using real-time GPS locations
-- Workers are located by their current GPS position (not static address)
-- Typed locations filter workers strictly within that city (10km radius)

DROP FUNCTION IF EXISTS search_workers_by_location;

CREATE OR REPLACE FUNCTION search_workers_by_location(
  user_lat double precision,
  user_lon double precision,
  filter_lat double precision DEFAULT NULL,
  filter_lon double precision DEFAULT NULL,
  radius_meters integer DEFAULT 50000, -- 50km default
  search_profession text DEFAULT NULL,
  min_rate integer DEFAULT NULL,
  max_rate integer DEFAULT NULL,
  verified_only boolean DEFAULT false,
  online_only boolean DEFAULT false,
  result_limit integer DEFAULT 10,
  result_offset integer DEFAULT 0
)
RETURNS TABLE (
  id uuid,
  worker_id uuid,
  profession character varying,
  hourly_rate_min integer,
  hourly_rate_max integer,
  is_verified boolean,
  years_experience integer,
  jobs_completed integer,
  response_time_minutes integer,
  firstname character varying,
  lastname character varying,
  city character varying,
  state character varying,
  latitude numeric(10,8),
  longitude numeric(11,8),
  profile_pic_url text,
  bio text,
  is_online boolean,
  last_seen timestamp with time zone,
  distance_km double precision,
  average_rating numeric,
  total_ratings bigint
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.worker_id,
    w.profession,
    w.hourly_rate_min,
    w.hourly_rate_max,
    w.is_verified,
    w.years_experience,
    w.jobs_completed,
    w.response_time_minutes,
    u.firstname,
    u.lastname,
    u.city,
    u.state,
    up.latitude,  -- Use real-time GPS latitude from presence
    up.longitude, -- Use real-time GPS longitude from presence
    u.profile_pic_url,
    u.bio,
    COALESCE(up.is_online, false) as is_online,
    up.last_seen,
    -- Calculate distance from worker's current GPS location
    CASE
      WHEN up.latitude IS NOT NULL AND up.longitude IS NOT NULL AND user_lat IS NOT NULL AND user_lon IS NOT NULL THEN
        ST_Distance(
          ST_SetSRID(ST_MakePoint(up.longitude, up.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000.0
      ELSE NULL
    END as distance_km,
    -- Aggregate ratings with 2 decimal precision
    COALESCE(ROUND(AVG(r.rating_value), 2), 0) as average_rating,
    COALESCE(COUNT(r.id), 0)::bigint as total_ratings
  FROM workers w
  INNER JOIN users u ON w.worker_id = u.id
  LEFT JOIN user_presence up ON u.id = up.user_id
  LEFT JOIN ratings r ON w.worker_id = r.worker_id
  WHERE w.status = 'available'
    AND w.deleted_at IS NULL
    -- Require GPS location data (current or last known)
    AND up.latitude IS NOT NULL
    AND up.longitude IS NOT NULL
    -- Note: We no longer require recent location updates
    -- Offline workers will show their last known GPS location
    -- STRICT CITY FILTERING:
    -- If filter_lat/filter_lon provided (user typed a location):
    -- Only show workers within 10km of that location (strict city match)
    AND (
      filter_lat IS NULL OR filter_lon IS NULL OR
      ST_DWithin(
        ST_SetSRID(ST_MakePoint(up.longitude, up.latitude), 4326)::geography,
        ST_SetSRID(ST_MakePoint(filter_lon, filter_lat), 4326)::geography,
        10000  -- 10km radius for strict city match
      )
    )
    -- Apply profession search filter
    AND (search_profession IS NULL OR w.profession ILIKE '%' || search_profession || '%')
    -- Apply rate filters
    AND (min_rate IS NULL OR w.hourly_rate_min >= min_rate)
    AND (max_rate IS NULL OR w.hourly_rate_max <= max_rate)
    -- Apply verified filter
    AND (NOT verified_only OR w.is_verified = true)
    -- Apply online filter
    AND (NOT online_only OR COALESCE(up.is_online, false) = true)
  GROUP BY
    w.id,
    w.worker_id,
    w.profession,
    w.hourly_rate_min,
    w.hourly_rate_max,
    w.is_verified,
    w.years_experience,
    w.jobs_completed,
    w.response_time_minutes,
    u.firstname,
    u.lastname,
    u.city,
    u.state,
    up.latitude,
    up.longitude,
    u.profile_pic_url,
    u.bio,
    up.is_online,
    up.last_seen,
    up.location_updated_at
  ORDER BY
    -- 1. Online workers first (true before false)
    COALESCE(up.is_online, false) DESC,
    -- 2. Then sort by distance within each group
    distance_km ASC NULLS LAST
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

-- Grant permissions
GRANT EXECUTE ON FUNCTION search_workers_by_location TO authenticated;
GRANT EXECUTE ON FUNCTION search_workers_by_location TO anon;

-- Add comment
COMMENT ON FUNCTION search_workers_by_location IS
'Search workers by their GPS location from user_presence table.
Online workers use real-time GPS (updated every 30 seconds).
Offline workers use their last known GPS location.
Typed locations filter workers strictly within 10km radius (city match).
Sorts: online first, then offline, then by distance.';

-- Verification
SELECT 'Real-time GPS search function created' as status;
