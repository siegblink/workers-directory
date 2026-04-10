-- Add per-worker weekly availability to the main workers table.
-- Same default as sub_profiles.availability: Mon–Fri 9 AM–5 PM, Sat–Sun Closed.
-- NOT NULL DEFAULT backfills all existing rows automatically.

ALTER TABLE public.workers
  ADD COLUMN IF NOT EXISTS availability JSONB NOT NULL DEFAULT '{
    "monday":    "9:00 AM - 5:00 PM",
    "tuesday":   "9:00 AM - 5:00 PM",
    "wednesday": "9:00 AM - 5:00 PM",
    "thursday":  "9:00 AM - 5:00 PM",
    "friday":    "9:00 AM - 5:00 PM",
    "saturday":  "Closed",
    "sunday":    "Closed"
  }'::jsonb;
