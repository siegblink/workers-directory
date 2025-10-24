-- Seed data for local development
-- This file is automatically loaded when running: supabase db reset

-- =====================================================
-- CATEGORIES
-- =====================================================
INSERT INTO categories (id, name, description, created_at) VALUES
  (gen_random_uuid(), 'Plumber', 'Professional plumbing services including repairs, installations, and maintenance', NOW()),
  (gen_random_uuid(), 'Electrician', 'Electrical installation, repair, and maintenance services', NOW()),
  (gen_random_uuid(), 'Cleaner', 'Home and office cleaning services', NOW()),
  (gen_random_uuid(), 'Carpenter', 'Woodworking and furniture services', NOW()),
  (gen_random_uuid(), 'Painter', 'Interior and exterior painting services', NOW()),
  (gen_random_uuid(), 'Gardener', 'Landscaping and garden maintenance', NOW()),
  (gen_random_uuid(), 'HVAC Technician', 'Heating, ventilation, and air conditioning services', NOW()),
  (gen_random_uuid(), 'Handyman', 'General home repair and maintenance', NOW())
ON CONFLICT (name) DO NOTHING;

