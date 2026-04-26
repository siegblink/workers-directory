import { createClient } from "@/lib/supabase/client";

type SavedWorkerDetail = {
  id: string;
  name: string;
  profession: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
};

type WorkerRow = {
  id: string;
  profession: string | null;
  hourly_rate_min: number | null;
  average_rating: string | null;
  user_data: {
    firstname?: string;
    lastname?: string;
    profile_pic_url?: string | null;
  } | null;
};

export async function getSavedWorkerIds(): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data } = await supabase
    .from("saved_workers")
    .select("worker_id")
    .eq("customer_id", user.id);

  return (data ?? []).map((r: { worker_id: string }) => r.worker_id);
}

export async function isWorkerSaved(workerId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data } = await supabase
    .from("saved_workers")
    .select("id")
    .eq("customer_id", user.id)
    .eq("worker_id", workerId)
    .maybeSingle();

  return !!data;
}

// Returns the new saved state: true = now saved, false = now unsaved.
// Returns false without mutating if the user is not authenticated.
export async function toggleSavedWorker(workerId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: existing } = await supabase
    .from("saved_workers")
    .select("id")
    .eq("customer_id", user.id)
    .eq("worker_id", workerId)
    .maybeSingle();

  if (existing) {
    await supabase
      .from("saved_workers")
      .delete()
      .eq("customer_id", user.id)
      .eq("worker_id", workerId);
    return false;
  }

  await supabase
    .from("saved_workers")
    .insert({ customer_id: user.id, worker_id: workerId });
  return true;
}

export async function getSavedWorkersWithDetails(): Promise<
  SavedWorkerDetail[]
> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: savedRows } = await supabase
    .from("saved_workers")
    .select("worker_id")
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (!savedRows || savedRows.length === 0) return [];

  const workerIds = savedRows.map((r: { worker_id: string }) => r.worker_id);

  const { data: workers } = await supabase
    .from("workers_with_details")
    .select("id, profession, hourly_rate_min, average_rating, user_data")
    .in("id", workerIds);

  const workerMap = new Map<string, WorkerRow>(
    ((workers as WorkerRow[]) ?? []).map((w) => [w.id, w]),
  );

  return workerIds
    .map((id: string) => {
      const w = workerMap.get(id);
      if (!w) return null;
      const ud = w.user_data;
      return {
        id,
        name: ud?.firstname
          ? `${ud.firstname} ${ud.lastname ?? ""}`.trim()
          : "Worker",
        profession: w.profession ?? "",
        rating:
          Math.round((parseFloat(w.average_rating ?? "0") || 0) * 10) / 10,
        hourlyRate: w.hourly_rate_min ?? 0,
        avatar: ud?.profile_pic_url ?? "",
      };
    })
    .filter((w): w is SavedWorkerDetail => w !== null);
}
