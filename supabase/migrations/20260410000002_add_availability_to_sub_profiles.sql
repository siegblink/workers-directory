-- Add per-sub-profile weekly availability.
-- Defaults to Mon–Fri 9 AM–5 PM, Sat–Sun Closed.
-- NOT NULL DEFAULT backfills all existing rows automatically.

ALTER TABLE public.sub_profiles
  ADD COLUMN availability JSONB NOT NULL DEFAULT '{
    "monday":    "9:00 AM - 5:00 PM",
    "tuesday":   "9:00 AM - 5:00 PM",
    "wednesday": "9:00 AM - 5:00 PM",
    "thursday":  "9:00 AM - 5:00 PM",
    "friday":    "9:00 AM - 5:00 PM",
    "saturday":  "Closed",
    "sunday":    "Closed"
  }'::jsonb;
