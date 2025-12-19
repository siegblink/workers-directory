-- Add worker profile fields needed for search page
-- This migration adds fields for location, rates, experience, and verification

-- Add location fields to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS city VARCHAR,
ADD COLUMN IF NOT EXISTS state VARCHAR,
ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8),
ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);

-- Add worker-specific fields to workers table
ALTER TABLE public.workers
ADD COLUMN IF NOT EXISTS hourly_rate_min INTEGER,
ADD COLUMN IF NOT EXISTS hourly_rate_max INTEGER,
ADD COLUMN IF NOT EXISTS years_experience INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS jobs_completed INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS response_time_minutes INTEGER DEFAULT 60,
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS profession VARCHAR;

-- Add indexes for search performance
CREATE INDEX IF NOT EXISTS idx_users_city ON public.users(city);
CREATE INDEX IF NOT EXISTS idx_users_state ON public.users(state);
CREATE INDEX IF NOT EXISTS idx_users_location ON public.users(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_workers_profession ON public.workers(profession);
CREATE INDEX IF NOT EXISTS idx_workers_hourly_rate ON public.workers(hourly_rate_min, hourly_rate_max);
CREATE INDEX IF NOT EXISTS idx_workers_verified ON public.workers(is_verified);

-- Add comments for documentation
COMMENT ON COLUMN public.users.city IS 'City where the user is located';
COMMENT ON COLUMN public.users.state IS 'State/Province where the user is located';
COMMENT ON COLUMN public.users.latitude IS 'Latitude coordinate for location-based search';
COMMENT ON COLUMN public.users.longitude IS 'Longitude coordinate for location-based search';
COMMENT ON COLUMN public.workers.hourly_rate_min IS 'Minimum hourly rate in PHP';
COMMENT ON COLUMN public.workers.hourly_rate_max IS 'Maximum hourly rate in PHP';
COMMENT ON COLUMN public.workers.years_experience IS 'Number of years of professional experience';
COMMENT ON COLUMN public.workers.jobs_completed IS 'Total number of completed jobs';
COMMENT ON COLUMN public.workers.response_time_minutes IS 'Average response time in minutes';
COMMENT ON COLUMN public.workers.is_verified IS 'Whether the worker has been verified';
COMMENT ON COLUMN public.workers.profession IS 'Primary profession/service category';
