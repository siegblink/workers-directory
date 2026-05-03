-- Apply the same 2-minute presence TTL to search_workers_optimized.
-- The view fix (20260503000001) was correct but search goes through this
-- RPC function directly, which had its own bare COALESCE(up.is_online, false)
-- checks in both the SELECT list and the filter_is_available WHERE clause.

CREATE OR REPLACE FUNCTION public.search_workers_optimized(
  search_text        text    DEFAULT NULL,
  filter_status      text    DEFAULT NULL,
  filter_is_available boolean DEFAULT NULL,
  filter_skills      text    DEFAULT NULL,
  filter_location    text    DEFAULT NULL,
  min_hourly_rate    numeric DEFAULT NULL,
  max_hourly_rate    numeric DEFAULT NULL,
  min_rating         numeric DEFAULT NULL,
  result_limit       integer DEFAULT 20,
  result_offset      integer DEFAULT 0
)
RETURNS TABLE(
  id                   uuid,
  user_id              uuid,
  slug                 text,
  profession           text,
  hourly_rate_min      integer,
  hourly_rate_max      integer,
  years_experience     integer,
  jobs_completed       integer,
  response_time_minutes integer,
  is_verified          boolean,
  skills               text[],
  status               text,
  created_at           timestamp with time zone,
  location             text,
  user_data            jsonb,
  is_online            boolean,
  average_rating       text,
  review_count         text,
  total_count          bigint
)
LANGUAGE sql
STABLE
SET search_path TO 'public'
AS $function$
  SELECT
    w.id,
    w.user_id,
    w.slug,
    w.profession,
    w.hourly_rate_min,
    w.hourly_rate_max,
    w.years_experience,
    w.jobs_completed,
    w.response_time_minutes,
    w.is_verified,
    w.skills,
    w.status,
    w.created_at,
    CASE
      WHEN u.city  IS NOT NULL AND u.state IS NOT NULL THEN u.city || ', ' || u.state
      WHEN u.city  IS NOT NULL THEN u.city
      WHEN u.state IS NOT NULL THEN u.state
      ELSE NULL
    END AS location,
    jsonb_build_object(
      'id',              u.id,
      'firstname',       u.firstname,
      'lastname',        u.lastname,
      'profile_pic_url', u.profile_pic_url,
      'bio',             u.bio,
      'status',          u.status,
      'city',            u.city,
      'state',           u.state,
      'created_at',      u.created_at
    ) AS user_data,
    COALESCE(up.is_online AND up.last_seen > now() - interval '2 minutes', false) AS is_online,
    (
      SELECT COALESCE(AVG(r.rating_value), 0)::TEXT
      FROM public.ratings r WHERE r.worker_id = w.id
    ) AS average_rating,
    (
      SELECT COUNT(*)::TEXT
      FROM public.ratings r WHERE r.worker_id = w.id
    ) AS review_count,
    COUNT(*) OVER () AS total_count
  FROM public.workers w
  LEFT JOIN public.users         u  ON u.id      = w.user_id
  LEFT JOIN public.user_presence up ON up.user_id = w.user_id
  WHERE
    w.deleted_at IS NULL
    AND (filter_status        IS NULL OR w.status = filter_status)
    AND (filter_is_available  IS NULL OR COALESCE(up.is_online AND up.last_seen > now() - interval '2 minutes', false) = filter_is_available)
    AND (
      filter_location IS NULL
      OR u.city  ILIKE '%' || filter_location || '%'
      OR u.state ILIKE '%' || filter_location || '%'
    )
    AND (min_hourly_rate IS NULL OR w.hourly_rate_min >= min_hourly_rate)
    AND (max_hourly_rate IS NULL OR w.hourly_rate_max <= max_hourly_rate)
    AND (
      filter_skills IS NULL
      OR EXISTS (
        SELECT 1 FROM unnest(w.skills) s
        WHERE s ILIKE '%' || filter_skills || '%'
      )
    )
    AND (
      search_text IS NULL
      OR w.profession ILIKE '%' || search_text || '%'
      OR u.firstname  ILIKE '%' || search_text || '%'
      OR u.lastname   ILIKE '%' || search_text || '%'
      OR EXISTS (
        SELECT 1 FROM unnest(w.skills) s
        WHERE s ILIKE '%' || search_text || '%'
      )
    )
    AND (
      min_rating IS NULL
      OR (
        SELECT COALESCE(AVG(r.rating_value), 0)
        FROM public.ratings r WHERE r.worker_id = w.id
      ) >= min_rating
    )
  ORDER BY w.created_at DESC
  LIMIT  result_limit
  OFFSET result_offset;
$function$;
