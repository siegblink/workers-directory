-- Explicitly grant UPDATE on messages to authenticated role.
-- The original schema had GRANT ALL, but the DB appears to be missing
-- the UPDATE privilege in practice, causing 403s when marking messages as read.
GRANT UPDATE ON TABLE "public"."messages" TO "authenticated";
