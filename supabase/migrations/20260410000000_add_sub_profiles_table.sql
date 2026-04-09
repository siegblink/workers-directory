-- =====================================================
-- Sub Profiles Table
-- Stores additional worker personas per user
-- (e.g. a user who is both a Plumber and an Electrician).
-- The main profile lives in the workers table; additional
-- personas are stored here.
-- =====================================================

CREATE TABLE public.sub_profiles (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  label           TEXT NOT NULL,           -- display name, user-editable (e.g. "Electrician")
  profession      TEXT NOT NULL,           -- from categories table
  skills          TEXT[] DEFAULT '{}',
  hourly_rate_min NUMERIC(10,2),
  hourly_rate_max NUMERIC(10,2),
  years_experience INTEGER,
  status          TEXT NOT NULL DEFAULT 'available'
                    CHECK (status IN ('available', 'busy', 'offline')),
  created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  deleted_at      TIMESTAMPTZ              -- soft delete
);

-- Enable Row Level Security
ALTER TABLE public.sub_profiles ENABLE ROW LEVEL SECURITY;

-- Users can only read and write their own sub-profiles
CREATE POLICY "Users manage own sub-profiles" ON public.sub_profiles
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

GRANT ALL ON TABLE public.sub_profiles TO authenticated;
GRANT ALL ON TABLE public.sub_profiles TO service_role;
