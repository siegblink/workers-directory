-- =====================================================
-- Fix Security Advisor Errors
-- 1. workers_with_details: change from SECURITY DEFINER to SECURITY INVOKER
-- 2. workers_posts: enable RLS
-- 3. spatial_ref_sys: enable RLS (PostGIS system table, no policies needed)
-- =====================================================

-- 1. Recreate workers_with_details view with SECURITY INVOKER
--    so it respects the querying user's RLS policies, not the owner's.
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
  COALESCE(up.is_online, false) AS is_online,
  (SELECT COALESCE(avg(r.rating_value), 0)::text FROM public.ratings r WHERE r.worker_id = w.id) AS average_rating,
  (SELECT count(*)::text FROM public.ratings r WHERE r.worker_id = w.id) AS review_count
FROM public.workers w
  LEFT JOIN public.users u ON u.id = w.user_id
  LEFT JOIN public.user_presence up ON up.user_id = w.user_id
WHERE w.deleted_at IS NULL;

-- Re-grant access (CREATE OR REPLACE resets grants on the view)
GRANT SELECT ON public.workers_with_details TO anon;
GRANT SELECT ON public.workers_with_details TO authenticated;


-- 2. Enable RLS on workers_posts
ALTER TABLE public.workers_posts ENABLE ROW LEVEL SECURITY;

-- Anyone can view published posts
CREATE POLICY "Everyone can view workers posts" ON public.workers_posts
  FOR SELECT USING (true);

-- A worker can manage their own posts
CREATE POLICY "Worker manages own workers posts" ON public.workers_posts
  USING (
    EXISTS (
      SELECT 1 FROM public.workers w
      WHERE w.id = workers_posts.worker_id
        AND w.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.workers w
      WHERE w.id = workers_posts.worker_id
        AND w.user_id = auth.uid()
    )
  );


-- 3. spatial_ref_sys is owned by the PostGIS extension (not alterable via migration).
--    This advisory warning cannot be resolved via SQL; it is a PostGIS system table
--    with only geographic reference data and no user data.
