-- =====================================================
-- Job Suggestions Table
-- Allows users (including anonymous) to suggest new job categories
-- =====================================================

CREATE TABLE job_suggestions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  job_title VARCHAR(255) NOT NULL,
  description TEXT,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  upvotes INTEGER DEFAULT 0,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'implemented')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for autocomplete search performance
CREATE INDEX idx_job_suggestions_title ON job_suggestions USING gin(to_tsvector('english', job_title));

-- Index for sorting by created_at (newest first)
CREATE INDEX idx_job_suggestions_created_at ON job_suggestions(created_at DESC);

-- Index for filtering by status
CREATE INDEX idx_job_suggestions_status ON job_suggestions(status);

-- Enable Row Level Security
ALTER TABLE job_suggestions ENABLE ROW LEVEL SECURITY;

-- Public read access (anyone can view all suggestions)
CREATE POLICY "Anyone can view job suggestions" ON job_suggestions
  FOR SELECT USING (true);

-- Public insert access (anonymous submissions allowed)
CREATE POLICY "Anyone can create job suggestions" ON job_suggestions
  FOR INSERT WITH CHECK (true);

-- Users can update their own suggestions
CREATE POLICY "Users can update own suggestions" ON job_suggestions
  FOR UPDATE USING (user_id = auth.uid());
