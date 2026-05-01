-- Grant EXECUTE on credit functions explicitly to service_role.
-- service_role bypasses RLS but still needs explicit EXECUTE privilege on functions.
-- The previous revoke-from-PUBLIC migration removed the implicit access.

GRANT EXECUTE ON FUNCTION public.add_user_credits(uuid, integer, text, text, text) TO service_role;
GRANT EXECUTE ON FUNCTION public.deduct_user_credits(uuid, integer, text, text) TO service_role;
