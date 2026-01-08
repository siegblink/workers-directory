-- Update search function to sort online workers first, then offline
-- Within each group (online/offline), sort by distance

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
    u.latitude,
    u.longitude,
    u.profile_pic_url,
    u.bio,
    COALESCE(up.is_online, false) as is_online,
    up.last_seen,
    CASE
      WHEN u.location IS NOT NULL THEN
        ST_Distance(
          u.location,
          ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000.0
      ELSE 0
    END as distance_km,
    -- Aggregate ratings in the same query with 2 decimal precision
    COALESCE(ROUND(AVG(r.rating_value), 2), 0) as average_rating,
    COALESCE(COUNT(r.id), 0)::bigint as total_ratings
  FROM workers w
  INNER JOIN users u ON w.worker_id = u.id
  LEFT JOIN user_presence up ON u.id = up.user_id
  LEFT JOIN ratings r ON w.worker_id = r.worker_id
  WHERE w.status = 'available'
    AND w.deleted_at IS NULL
    AND u.location IS NOT NULL
    -- Apply location radius filter if provided
    AND (
      filter_lat IS NULL OR filter_lon IS NULL OR
      ST_DWithin(
        u.location,
        ST_SetSRID(ST_MakePoint(filter_lon, filter_lat), 4326)::geography,
        radius_meters
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
    u.latitude,
    u.longitude,
    u.profile_pic_url,
    u.bio,
    up.is_online,
    up.last_seen,
    u.location
  ORDER BY
    -- Online workers first (true > false in DESC order)
    COALESCE(up.is_online, false) DESC,
    -- Then sort by distance within each group
    distance_km ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;

-- Verification
SELECT 'Search sorting updated: online first, then by distance' as status;
