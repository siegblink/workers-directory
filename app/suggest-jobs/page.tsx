import { createClient } from "@/lib/supabase/server";
import { SuggestJobsClient } from "@/components/suggest-jobs/suggest-jobs-client";
import type { JobSuggestionWithUser } from "@/lib/database/types";

type UserProfile = {
  firstname: string;
  lastname: string;
  profile_pic_url: string | null;
};

export default async function SuggestJobsPage() {
  const supabase = await createClient();

  const [{ data: suggestions }, { data: authData }] = await Promise.all([
    supabase
      .from("job_suggestions")
      .select("*, user:users!user_id(firstname, lastname, profile_pic_url)")
      .order("created_at", { ascending: false })
      .limit(50),
    supabase.auth.getUser(),
  ]);

  let currentUser: UserProfile | null = null;
  if (authData.user) {
    const { data: profile } = await supabase
      .from("users")
      .select("firstname, lastname, profile_pic_url")
      .eq("id", authData.user.id)
      .single();
    currentUser = profile ?? null;
  }

  return (
    <SuggestJobsClient
      initialSuggestions={(suggestions as JobSuggestionWithUser[]) ?? []}
      currentUser={currentUser}
    />
  );
}
