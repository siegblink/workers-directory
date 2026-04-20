import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Service-role client — server-side only, never import in client components.
// Used to look up auth.users data (emails) that the anon key cannot access.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SECRET_KEY;
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase admin environment variables");
  }
  return createSupabaseClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
