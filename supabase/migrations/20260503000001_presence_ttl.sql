-- Fix stale "Online" status caused by beforeunload not firing reliably.
-- A worker is only considered online if last_seen is within the last 2 minutes
-- (the heartbeat fires every 30 s, so 2 min is a safe 4× buffer).

CREATE OR REPLACE VIEW public.workers_with_details
  WITH (security_invoker = on)
AS
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
    WHEN (u.city IS NOT NULL AND u.state IS NOT NULL) THEN (u.city::text || ', '::text) || u.state::text
    WHEN u.city IS NOT NULL THEN u.city::text
    WHEN u.state IS NOT NULL THEN u.state::text
    ELSE NULL::text
  END AS location,
  jsonb_build_object(
    'id', u.id,
    'firstname', u.firstname,
    'lastname', u.lastname,
    'profile_pic_url', u.profile_pic_url,
    'bio', u.bio,
    'status', u.status,
    'city', u.city,
    'state', u.state,
    'created_at', u.created_at
  ) AS user_data,
  COALESCE(up.is_online AND up.last_seen > now() - interval '2 minutes', false) AS is_online,
  (SELECT COALESCE(avg(r.rating_value), 0)::text FROM public.ratings r WHERE r.worker_id = w.id) AS average_rating,
  (SELECT count(*)::text FROM public.ratings r WHERE r.worker_id = w.id) AS review_count
FROM public.workers w
  LEFT JOIN public.users u ON u.id = w.user_id
  LEFT JOIN public.user_presence up ON up.user_id = w.user_id
WHERE w.deleted_at IS NULL;

GRANT SELECT ON public.workers_with_details TO anon;
GRANT SELECT ON public.workers_with_details TO authenticated;
