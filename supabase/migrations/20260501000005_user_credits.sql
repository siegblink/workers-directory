-- user_credits: one row per user, tracks current balance.
-- user_credit_transactions: append-only audit log of every credit movement.

CREATE TABLE IF NOT EXISTS public.user_credits (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID        NOT NULL UNIQUE REFERENCES public.users(id) ON DELETE CASCADE,
  balance    INTEGER     NOT NULL DEFAULT 0 CHECK (balance >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.user_credit_transactions (
  id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID        NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  amount       INTEGER     NOT NULL,  -- positive = credit, negative = debit
  type         TEXT        NOT NULL CHECK (type IN ('purchase', 'spent', 'bonus', 'refund')),
  description  TEXT        NOT NULL,
  reference_id TEXT,                  -- PayMongo checkout ID, booking UUID, etc.
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX user_credit_transactions_user_id_idx    ON public.user_credit_transactions(user_id);
CREATE INDEX user_credit_transactions_created_at_idx ON public.user_credit_transactions(created_at DESC);

ALTER TABLE public.user_credits       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_credit_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits"
  ON public.user_credits FOR SELECT
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own transactions"
  ON public.user_credit_transactions FOR SELECT
  USING (user_id = auth.uid());

GRANT SELECT ON public.user_credits        TO authenticated;
GRANT SELECT ON public.user_credit_transactions TO authenticated;
GRANT ALL    ON public.user_credits        TO service_role;
GRANT ALL    ON public.user_credit_transactions TO service_role;

-- add_user_credits: upserts the balance row and logs the transaction.
-- Avoids ON CONFLICT (column) inside PL/pgSQL by using UPDATE + conditional INSERT.
-- Called by the PayMongo webhook (service_role) and by T3-C booking triggers.
CREATE OR REPLACE FUNCTION public.add_user_credits(
  p_user_id      UUID,
  p_amount       INTEGER,
  p_type         TEXT,
  p_description  TEXT,
  p_reference_id TEXT DEFAULT NULL
) RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.user_credits
  SET balance    = balance + p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  IF NOT FOUND THEN
    INSERT INTO public.user_credits (user_id, balance)
    VALUES (p_user_id, p_amount);
  END IF;

  INSERT INTO public.user_credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, p_amount, p_type, p_description, p_reference_id);
END;
$$;

-- deduct_user_credits: deducts credits, returns FALSE if balance is insufficient.
-- Uses SELECT FOR UPDATE to prevent race conditions on concurrent deductions.
-- Called by T3-C booking triggers.
CREATE OR REPLACE FUNCTION public.deduct_user_credits(
  p_user_id      UUID,
  p_amount       INTEGER,
  p_description  TEXT,
  p_reference_id TEXT DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_balance INTEGER;
BEGIN
  SELECT balance INTO v_balance
  FROM public.user_credits
  WHERE user_id = p_user_id
  FOR UPDATE;

  IF v_balance IS NULL OR v_balance < p_amount THEN
    RETURN FALSE;
  END IF;

  UPDATE public.user_credits
  SET balance    = balance - p_amount,
      updated_at = now()
  WHERE user_id = p_user_id;

  INSERT INTO public.user_credit_transactions (user_id, amount, type, description, reference_id)
  VALUES (p_user_id, -p_amount, 'spent', p_description, p_reference_id);

  RETURN TRUE;
END;
$$;
