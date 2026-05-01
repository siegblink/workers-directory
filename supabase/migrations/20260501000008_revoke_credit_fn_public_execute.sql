-- Revoke public EXECUTE on credit mutation functions.
-- Both functions are called only by service_role (webhook RPC) or DB triggers —
-- never directly by users. Revoking from PUBLIC blocks anon + authenticated
-- without affecting service_role (which bypasses all permission checks).

REVOKE EXECUTE ON FUNCTION public.add_user_credits(uuid, integer, text, text, text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.deduct_user_credits(uuid, integer, text, text) FROM PUBLIC;
