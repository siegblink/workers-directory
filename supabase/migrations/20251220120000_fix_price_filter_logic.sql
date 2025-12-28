-- Fix price filtering logic in search_workers_by_location function
--
-- Problem: Current logic filters by hourly_rate_max <= max_rate
-- This excludes workers whose minimum rate is affordable but max rate exceeds budget
--
-- Example Bug:
-- - User searches for ₱0-₱100 budget
-- - Worker charges ₱50-₱110/hr
-- - Current: HIDDEN (because 110 > 100)
-- - Fixed: SHOWN (because 50 <= 100, user can afford the minimum rate)
--
-- Solution: Filter by hourly_rate_min instead of hourly_rate_max
-- This shows workers whose starting rate is within the user's budget

CREATE OR REPLACE FUNCTION public.search_workers_by_location(
  user_lat double precision,
  user_lon double precision,
  filter_lat double precision DEFAULT NULL::double precision,
  filter_lon double precision DEFAULT NULL::double precision,
  radius_meters integer DEFAULT 50000,
  search_profession text DEFAULT NULL::text,
  min_rate integer DEFAULT NULL::integer,
  max_rate integer DEFAULT NULL::integer,
  verified_only boolean DEFAULT false,
  online_only boolean DEFAULT false,
  result_limit integer DEFAULT 10,
  result_offset integer DEFAULT 0
)
RETURNS TABLE(
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
  latitude numeric,
  longitude numeric,
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
AS $function$
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
    COALESCE(AVG(r.rating_value), 0) as average_rating,
    COUNT(r.id) as total_ratings
  FROM workers w
  INNER JOIN users u ON w.worker_id = u.id
  LEFT JOIN user_presence up ON u.id = up.user_id
  LEFT JOIN ratings r ON w.worker_id = r.worker_id
  WHERE w.status = 'available'
    AND w.deleted_at IS NULL
    AND u.location IS NOT NULL
    AND (
      filter_lat IS NULL OR filter_lon IS NULL OR
      ST_DWithin(
        u.location,
        ST_SetSRID(ST_MakePoint(filter_lon, filter_lat), 4326)::geography,
        radius_meters
      )
    )
    AND (search_profession IS NULL OR w.profession ILIKE '%' || search_profession || '%')
    -- FIXED: Check if minimum rate is within budget (not maximum rate)
    -- This shows workers whose starting rate is affordable
    AND (min_rate IS NULL OR w.hourly_rate_min >= min_rate)
    AND (max_rate IS NULL OR w.hourly_rate_min <= max_rate)
    AND (NOT verified_only OR w.is_verified = true)
    AND (NOT online_only OR COALESCE(up.is_online, false) = true)
  GROUP BY w.id, w.worker_id, w.profession, w.hourly_rate_min, w.hourly_rate_max,
           w.is_verified, w.years_experience, w.jobs_completed, w.response_time_minutes,
           u.firstname, u.lastname, u.city, u.state, u.latitude, u.longitude,
           u.profile_pic_url, u.bio, up.is_online, up.last_seen, u.location
  ORDER BY distance_km ASC
  LIMIT result_limit
  OFFSET result_offset;
END;
$function$;

-- Verification query
-- Test with ₱0-₱100 budget - should now return workers with min rate <= 100
SELECT
  'Price filter test' as test_name,
  COUNT(*) as workers_found
FROM workers w
WHERE w.status = 'available'
  AND w.hourly_rate_min <= 100;
