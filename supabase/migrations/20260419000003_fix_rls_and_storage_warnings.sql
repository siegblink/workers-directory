-- 1. Drop duplicate support_requests INSERT policy created via the dashboard.
--    Migration 20260408000000 already has "Anyone can submit a support request";
--    the policy below is a near-identical duplicate.
DROP POLICY IF EXISTS "Anyone can submit support requests" ON public.support_requests;


-- 2. Drop the broad SELECT policy on storage.objects for the avatars bucket.
--    The bucket is already marked public=true, so Supabase serves object URLs
--    without a SELECT policy. The policy only adds API listing ability, which
--    would let any client enumerate all avatar filenames.
DROP POLICY IF EXISTS "Avatars are publicly readable" ON storage.objects;
