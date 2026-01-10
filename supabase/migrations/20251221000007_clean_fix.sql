-- Drop ALL versions of the function
DROP FUNCTION IF EXISTS public.search_workers_by_location CASCADE;

-- Recreate with correct column names
CREATE FUNCTION public.search_workers_by_location(
  user_lat double precision DEFAULT 10.3157,
  user_lon double precision DEFAULT 123.8854,
  filter_lat double precision DEFAULT NULL,
  filter_lon double precision DEFAULT NULL,
  radius_meters integer DEFAULT 50000,
  search_profession text DEFAULT NULL,
  min_rate integer DEFAULT NULL,
  max_rate integer DEFAULT NULL,
  verified_only boolean DEFAULT false,
  online_only boolean DEFAULT false,
  result_limit integer DEFAULT 10,
  result_offset integer DEFAULT 0
)
RETURNS TABLE (
  id integer,
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
    up.latitude,
    up.longitude,
    u.profile_pic_url,
    u.bio,
    COALESCE(up.is_online, false) as is_online,
    up.last_seen,
    CASE
      WHEN up.latitude IS NOT NULL AND up.longitude IS NOT NULL AND user_lat IS NOT NULL AND user_lon IS NOT NULL THEN
        ST_Distance(
          ST_SetSRID(ST_MakePoint(up.longitude, up.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(user_lon, user_lat), 4326)::geography
        ) / 1000.0
      ELSE NULL
    END as distance_km,
    COALESCE(ROUND(AVG(r.rating_value), 2), 0) as average_rating,
    COALESCE(COUNT(r.id), 0)::bigint as total_ratings
  FROM workers w
  INNER JOIN users u ON w.worker_id = u.id
  LEFT JOIN user_presence up ON w.worker_id = up.user_id
  LEFT JOIN ratings r ON w.worker_id = r.worker_id
  WHERE w.status = 'available'
    AND w.deleted_at IS NULL
    AND (
      filter_lat IS NULL OR filter_lon IS NULL OR
      (
        up.latitude IS NOT NULL AND up.longitude IS NOT NULL AND
        ST_DWithin(
          ST_SetSRID(ST_MakePoint(up.longitude, up.latitude), 4326)::geography,
          ST_SetSRID(ST_MakePoint(filter_lon, filter_lat), 4326)::geography,
          10000
        )
      ) OR
      (up.latitude IS NULL OR up.longitude IS NULL)
    )
    AND (search_profession IS NULL OR w.profession ILIKE '%' || search_profession || '%')
    AND (min_rate IS NULL OR w.hourly_rate_min >= min_rate)
    AND (max_rate IS NULL OR w.hourly_rate_max <= max_rate)
    AND (NOT verified_only OR w.is_verified = true)
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
    up.last_seen
  ORDER BY
    COALESCE(up.is_online, false) DESC,
    distance_km ASC NULLS LAST
  LIMIT result_limit
  OFFSET result_offset;
END;
$$;
