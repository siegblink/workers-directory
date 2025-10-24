-- Migration: Optimize queries and add auth_id column
-- Fixes: N+1 query problems and auth ID mismatch

-- =====================================================
-- 1. ADD AUTH_ID COLUMN TO USERS TABLE
-- =====================================================

-- Add auth_id column to link auth.users.id (UUID) to public.users.id (number)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_users_auth_id ON users(auth_id);

-- Add comment
COMMENT ON COLUMN users.auth_id IS 'Foreign key to auth.users.id (UUID) for authentication mapping';

-- =====================================================
-- 2. CREATE VIEW FOR WORKERS WITH AGGREGATED DATA
-- =====================================================

-- Drop existing view if it exists
DROP VIEW IF EXISTS workers_with_details CASCADE;

-- Create optimized view that pre-calculates ratings and counts
CREATE OR REPLACE VIEW workers_with_details AS
SELECT
  w.id,
  w.worker_id,
  w.skills,
  w.status,
  w.hourly_rate,
  w.location,
  w.latitude,
  w.longitude,
  w.availability_schedule,
  w.is_available,
  w.created_at,
  w.deleted_at,
  -- User data
  jsonb_build_object(
    'id', u.id,
    'auth_id', u.auth_id,
    'firstname', u.firstname,
    'lastname', u.lastname,
    'profile_pic_url', u.profile_pic_url,
    'bio', u.bio,
    'is_online', u.is_online,
    'status', u.status,
    'created_at', u.created_at
  ) as user_data,
  -- Aggregate ratings
  COALESCE(AVG(r.rating_value), 0) as average_rating,
  COUNT(DISTINCT r.id) as total_ratings,
  -- Count completed bookings
  COUNT(DISTINCT CASE WHEN b.status = 'completed' THEN b.id END) as total_bookings
FROM workers w
INNER JOIN users u ON w.worker_id = u.id
LEFT JOIN ratings r ON r.worker_id = w.id
LEFT JOIN bookings b ON b.worker_id = w.id
WHERE w.deleted_at IS NULL
GROUP BY w.id, u.id, u.auth_id, u.firstname, u.lastname, u.profile_pic_url, u.bio, u.is_online, u.status, u.created_at;

-- Add comment
COMMENT ON VIEW workers_with_details IS 'Optimized view with pre-calculated worker ratings and booking counts';

-- =====================================================
-- 3. CREATE FUNCTION TO GET TOP RATED WORKERS
-- =====================================================

CREATE OR REPLACE FUNCTION get_top_rated_workers(
  result_limit INTEGER DEFAULT 10,
  min_ratings INTEGER DEFAULT 1
)
RETURNS TABLE (
  id BIGINT,
  worker_id BIGINT,
  skills TEXT,
  status TEXT,
  hourly_rate DECIMAL,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  availability_schedule JSONB,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  user_data JSONB,
  average_rating NUMERIC,
  total_ratings BIGINT,
  total_bookings BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.worker_id,
    w.skills,
    w.status::TEXT,
    w.hourly_rate,
    w.location,
    w.latitude,
    w.longitude,
    w.availability_schedule,
    w.is_available,
    w.created_at,
    w.user_data,
    w.average_rating,
    w.total_ratings,
    w.total_bookings
  FROM workers_with_details w
  WHERE w.status = 'available'
    AND w.total_ratings >= min_ratings
  ORDER BY w.average_rating DESC, w.total_ratings DESC
  LIMIT result_limit;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_top_rated_workers IS 'Efficiently fetch top-rated workers with pre-calculated ratings';

-- =====================================================
-- 4. CREATE FUNCTION TO SEARCH WORKERS WITH FILTERS
-- =====================================================

CREATE OR REPLACE FUNCTION search_workers_optimized(
  search_text TEXT DEFAULT NULL,
  filter_status TEXT DEFAULT NULL,
  filter_is_available BOOLEAN DEFAULT NULL,
  filter_skills TEXT DEFAULT NULL,
  filter_location TEXT DEFAULT NULL,
  min_hourly_rate DECIMAL DEFAULT NULL,
  max_hourly_rate DECIMAL DEFAULT NULL,
  min_rating DECIMAL DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  worker_id BIGINT,
  skills TEXT,
  status TEXT,
  hourly_rate DECIMAL,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  availability_schedule JSONB,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  user_data JSONB,
  average_rating NUMERIC,
  total_ratings BIGINT,
  total_bookings BIGINT,
  total_count BIGINT
) AS $$
DECLARE
  total_rows BIGINT;
BEGIN
  -- Get total count for pagination
  SELECT COUNT(*) INTO total_rows
  FROM workers_with_details w
  WHERE 1=1
    AND (filter_status IS NULL OR w.status = filter_status)
    AND (filter_is_available IS NULL OR w.is_available = filter_is_available)
    AND (filter_skills IS NULL OR w.skills ILIKE '%' || filter_skills || '%')
    AND (filter_location IS NULL OR w.location ILIKE '%' || filter_location || '%')
    AND (min_hourly_rate IS NULL OR w.hourly_rate >= min_hourly_rate)
    AND (max_hourly_rate IS NULL OR w.hourly_rate <= max_hourly_rate)
    AND (min_rating IS NULL OR w.average_rating >= min_rating)
    AND (search_text IS NULL OR (
      w.user_data->>'firstname' ILIKE '%' || search_text || '%' OR
      w.user_data->>'lastname' ILIKE '%' || search_text || '%' OR
      w.skills ILIKE '%' || search_text || '%' OR
      w.location ILIKE '%' || search_text || '%'
    ));

  RETURN QUERY
  SELECT
    w.id,
    w.worker_id,
    w.skills,
    w.status::TEXT,
    w.hourly_rate,
    w.location,
    w.latitude,
    w.longitude,
    w.availability_schedule,
    w.is_available,
    w.created_at,
    w.user_data,
    w.average_rating,
    w.total_ratings,
    w.total_bookings,
    total_rows
  FROM workers_with_details w
  WHERE 1=1
    AND (filter_status IS NULL OR w.status = filter_status)
    AND (filter_is_available IS NULL OR w.is_available = filter_is_available)
    AND (filter_skills IS NULL OR w.skills ILIKE '%' || filter_skills || '%')
    AND (filter_location IS NULL OR w.location ILIKE '%' || filter_location || '%')
    AND (min_hourly_rate IS NULL OR w.hourly_rate >= min_hourly_rate)
    AND (max_hourly_rate IS NULL OR w.hourly_rate <= max_hourly_rate)
    AND (min_rating IS NULL OR w.average_rating >= min_rating)
    AND (search_text IS NULL OR (
      w.user_data->>'firstname' ILIKE '%' || search_text || '%' OR
      w.user_data->>'lastname' ILIKE '%' || search_text || '%' OR
      w.skills ILIKE '%' || search_text || '%' OR
      w.location ILIKE '%' || search_text || '%'
    ))
  ORDER BY w.average_rating DESC, w.created_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION search_workers_optimized IS 'Optimized worker search with single query execution';

-- =====================================================
-- 5. CREATE FUNCTION FOR CATEGORIES WITH WORKER COUNT
-- =====================================================

CREATE OR REPLACE FUNCTION get_categories_with_worker_count()
RETURNS TABLE (
  id BIGINT,
  name TEXT,
  description TEXT,
  created_at TIMESTAMPTZ,
  worker_count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.description,
    c.created_at,
    COUNT(DISTINCT wc.worker_id) as worker_count
  FROM categories c
  LEFT JOIN workers_categories wc ON wc.category_id = c.id
  LEFT JOIN workers w ON w.id = wc.worker_id AND w.deleted_at IS NULL
  GROUP BY c.id, c.name, c.description, c.created_at
  ORDER BY c.name ASC;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_categories_with_worker_count IS 'Get all categories with worker count in single query';

-- =====================================================
-- 6. CREATE FUNCTION FOR WORKERS BY CATEGORY
-- =====================================================

CREATE OR REPLACE FUNCTION get_workers_by_category_optimized(
  target_category_id BIGINT,
  filter_status TEXT DEFAULT NULL,
  result_limit INTEGER DEFAULT 20,
  result_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
  id BIGINT,
  worker_id BIGINT,
  skills TEXT,
  status TEXT,
  hourly_rate DECIMAL,
  location TEXT,
  latitude DECIMAL,
  longitude DECIMAL,
  availability_schedule JSONB,
  is_available BOOLEAN,
  created_at TIMESTAMPTZ,
  user_data JSONB,
  average_rating NUMERIC,
  total_ratings BIGINT,
  total_bookings BIGINT,
  total_count BIGINT
) AS $$
DECLARE
  total_rows BIGINT;
BEGIN
  -- Get total count
  SELECT COUNT(DISTINCT w.id) INTO total_rows
  FROM workers_with_details w
  INNER JOIN workers_categories wc ON wc.worker_id = w.id
  WHERE wc.category_id = target_category_id
    AND (filter_status IS NULL OR w.status = filter_status);

  RETURN QUERY
  SELECT
    w.id,
    w.worker_id,
    w.skills,
    w.status::TEXT,
    w.hourly_rate,
    w.location,
    w.latitude,
    w.longitude,
    w.availability_schedule,
    w.is_available,
    w.created_at,
    w.user_data,
    w.average_rating,
    w.total_ratings,
    w.total_bookings,
    total_rows
  FROM workers_with_details w
  INNER JOIN workers_categories wc ON wc.worker_id = w.id
  WHERE wc.category_id = target_category_id
    AND (filter_status IS NULL OR w.status = filter_status)
  ORDER BY w.average_rating DESC, w.created_at DESC
  LIMIT result_limit
  OFFSET result_offset;
END;
$$ LANGUAGE plpgsql STABLE;

COMMENT ON FUNCTION get_workers_by_category_optimized IS 'Get workers by category with pre-calculated ratings in single query';

-- =====================================================
-- 7. GRANT PERMISSIONS
-- =====================================================

-- Grant execute permissions to authenticated and anon users
GRANT EXECUTE ON FUNCTION get_top_rated_workers TO authenticated, anon;
GRANT EXECUTE ON FUNCTION search_workers_optimized TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_categories_with_worker_count TO authenticated, anon;
GRANT EXECUTE ON FUNCTION get_workers_by_category_optimized TO authenticated, anon;

-- Grant select on view
GRANT SELECT ON workers_with_details TO authenticated, anon;
