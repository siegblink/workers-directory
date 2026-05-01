-- Patches the job_suggestions table created by the earlier draft migration.
-- Adds: location column, corrected RLS policies, upvote RPC, and GRANTs.

-- 1. Add location column if it doesn't already exist
ALTER TABLE job_suggestions
  ADD COLUMN IF NOT EXISTS location VARCHAR(255);

-- 2. Drop old policies (idempotent — IF EXISTS prevents errors)
DROP POLICY IF EXISTS "Anyone can view job suggestions"    ON job_suggestions;
DROP POLICY IF EXISTS "Anyone can create job suggestions"  ON job_suggestions;
DROP POLICY IF EXISTS "Users can update own suggestions"   ON job_suggestions;
DROP POLICY IF EXISTS "job_suggestions_read"               ON job_suggestions;
DROP POLICY IF EXISTS "job_suggestions_insert"             ON job_suggestions;
DROP POLICY IF EXISTS "job_suggestions_owner_update"       ON job_suggestions;

-- 3. Re-create policies correctly
CREATE POLICY "job_suggestions_read" ON job_suggestions
  FOR SELECT USING (true);

CREATE POLICY "job_suggestions_insert" ON job_suggestions
  FOR INSERT WITH CHECK (true);

-- public.users.id = auth.uid() (confirmed across all migrations in this project)
CREATE POLICY "job_suggestions_owner_update" ON job_suggestions
  FOR UPDATE
  USING (user_id = auth.uid());

-- 4. Atomic upvote function — SECURITY DEFINER so any visitor can call it
--    without needing the broad UPDATE policy on the table.
CREATE OR REPLACE FUNCTION increment_suggestion_upvotes(suggestion_id uuid)
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  UPDATE job_suggestions
  SET upvotes    = upvotes + 1,
      updated_at = NOW()
  WHERE id = suggestion_id;
$$;

-- 5. Grants (safe to run multiple times)
GRANT SELECT, INSERT, UPDATE, DELETE ON job_suggestions TO authenticated;
GRANT SELECT, INSERT                  ON job_suggestions TO anon;
