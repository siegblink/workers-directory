-- Job suggestions: users (or anonymous visitors) suggest new job categories.
-- Upvotes use a SECURITY DEFINER function so any visitor can increment the
-- counter without needing a broad UPDATE policy on the table.

CREATE TABLE job_suggestions (
  id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
  job_title   VARCHAR(255) NOT NULL,
  description TEXT,
  location    VARCHAR(255),
  user_id     UUID         REFERENCES public.users(id) ON DELETE SET NULL,
  upvotes     INTEGER      NOT NULL DEFAULT 0,
  status      VARCHAR(50)  NOT NULL DEFAULT 'pending'
              CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

-- GIN index for full-text search on job_title
CREATE INDEX idx_job_suggestions_title
  ON job_suggestions USING gin(to_tsvector('english', job_title));

-- Newest-first ordering
CREATE INDEX idx_job_suggestions_created_at
  ON job_suggestions(created_at DESC);

-- Status filtering
CREATE INDEX idx_job_suggestions_status
  ON job_suggestions(status);

ALTER TABLE job_suggestions ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can read all suggestions
CREATE POLICY "job_suggestions_read" ON job_suggestions
  FOR SELECT USING (true);

-- Anyone (including anonymous visitors) can submit — the form says "No login required"
CREATE POLICY "job_suggestions_insert" ON job_suggestions
  FOR INSERT WITH CHECK (true);

-- Only the suggestion owner can edit their own row.
-- public.users.id = auth.uid() (consistent with all other tables in this project)
CREATE POLICY "job_suggestions_owner_update" ON job_suggestions
  FOR UPDATE
  USING (user_id = auth.uid());

-- Atomic increment — SECURITY DEFINER lets any visitor call this without
-- owning the row, while preventing arbitrary column edits via UPDATE policy.
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

GRANT SELECT, INSERT, UPDATE, DELETE ON job_suggestions TO authenticated;
GRANT SELECT, INSERT                  ON job_suggestions TO anon;
