-- promoted_listings: records active and past promotion purchases made by workers.
-- Inserted exclusively by the PayMongo webhook (service role); readable by anyone
-- so the search layer can check active promotions without auth overhead.

CREATE TABLE IF NOT EXISTS public.promoted_listings (
  id                      UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  worker_id               UUID        NOT NULL REFERENCES public.workers(id) ON DELETE CASCADE,
  plan                    TEXT        NOT NULL CHECK (plan IN ('basic', 'pro', 'premium')),
  paymongo_checkout_id    TEXT,
  paymongo_payment_id     TEXT,
  starts_at               TIMESTAMPTZ NOT NULL DEFAULT now(),
  expires_at              TIMESTAMPTZ NOT NULL,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX promoted_listings_worker_id_idx  ON public.promoted_listings(worker_id);
CREATE INDEX promoted_listings_expires_at_idx ON public.promoted_listings(expires_at);

ALTER TABLE public.promoted_listings ENABLE ROW LEVEL SECURITY;

-- Search queries (anonymous) need to read active promotions to reorder results.
CREATE POLICY "Public can view promoted listings"
  ON public.promoted_listings FOR SELECT
  USING (true);

GRANT SELECT ON public.promoted_listings TO anon, authenticated;
GRANT ALL    ON public.promoted_listings TO service_role;
