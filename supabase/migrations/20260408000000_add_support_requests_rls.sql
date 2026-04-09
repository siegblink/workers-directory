-- =====================================================
-- Support Requests Table
-- Created via the Supabase dashboard for the /contact-support form.
-- This migration ensures RLS is enabled and the table is properly secured.
-- =====================================================

CREATE TABLE IF NOT EXISTS public.support_requests (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  subject     VARCHAR(255) NOT NULL,
  message     TEXT NOT NULL,
  context     JSONB,
  user_id     UUID REFERENCES public.users(id) ON DELETE SET NULL,
  status      VARCHAR(50) DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- Enable Row Level Security
ALTER TABLE public.support_requests ENABLE ROW LEVEL SECURITY;

-- Anyone (including anonymous visitors) can submit a support request
CREATE POLICY "Anyone can submit a support request" ON public.support_requests
  FOR INSERT WITH CHECK (true);

-- Authenticated users can view their own requests
CREATE POLICY "Users can view own support requests" ON public.support_requests
  FOR SELECT USING (user_id = auth.uid());

-- Admins can view and manage all support requests
CREATE POLICY "Admins can manage all support requests" ON public.support_requests
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE users.id = auth.uid()
        AND (users.role)::text = 'admin'::text
    )
  );

GRANT ALL ON TABLE public.support_requests TO anon;
GRANT ALL ON TABLE public.support_requests TO authenticated;
GRANT ALL ON TABLE public.support_requests TO service_role;
