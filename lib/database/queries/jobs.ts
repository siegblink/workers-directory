import { createClient } from "@/lib/supabase/client";

export type JobPost = {
  id: string;
  customerId: string;
  categoryId: string | null;
  categoryName: string | null;
  title: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string | null;
  status: "open" | "closed";
  createdAt: string;
  applicantCount: number;
};

export type JobApplicant = {
  id: string;
  workerId: string;
  workerName: string;
  workerProfession: string;
  workerAvatar: string | null;
  coverNote: string | null;
  appliedAt: string;
};

type CreateJobPostInput = {
  categoryId: string | null;
  title: string;
  description: string;
  budgetMin: number | null;
  budgetMax: number | null;
  location: string | null;
};

function toJobPost(
  p: {
    id: string;
    customer_id: string;
    category_id: string | null;
    title: string;
    description: string;
    budget_min: number | null;
    budget_max: number | null;
    location: string | null;
    status: string;
    created_at: string;
  },
  catMap: Map<string, string>,
  countMap: Map<string, number>,
): JobPost {
  return {
    id: p.id,
    customerId: p.customer_id,
    categoryId: p.category_id,
    categoryName: p.category_id ? (catMap.get(p.category_id) ?? null) : null,
    title: p.title,
    description: p.description,
    budgetMin: p.budget_min,
    budgetMax: p.budget_max,
    location: p.location,
    status: p.status as "open" | "closed",
    createdAt: p.created_at,
    applicantCount: countMap.get(p.id) ?? 0,
  };
}

async function buildCatMap(
  supabase: ReturnType<typeof createClient>,
  posts: { category_id: string | null }[],
): Promise<Map<string, string>> {
  const ids = [
    ...new Set(posts.map((p) => p.category_id).filter(Boolean)),
  ] as string[];
  if (!ids.length) return new Map();
  const { data } = await supabase
    .from("categories")
    .select("id, name")
    .in("id", ids);
  return new Map(
    (data ?? []).map((c: { id: string; name: string }) => [c.id, c.name]),
  );
}

async function buildCountMap(
  supabase: ReturnType<typeof createClient>,
  jobIds: string[],
): Promise<Map<string, number>> {
  if (!jobIds.length) return new Map();
  const { data } = await supabase
    .from("job_applications")
    .select("job_id")
    .in("job_id", jobIds);
  const map = new Map<string, number>();
  for (const row of data ?? []) {
    map.set(row.job_id, (map.get(row.job_id) ?? 0) + 1);
  }
  return map;
}

export async function getOpenJobs(categoryId?: number): Promise<JobPost[]> {
  const supabase = createClient();

  let query = supabase
    .from("job_posts")
    .select(
      "id, customer_id, category_id, title, description, budget_min, budget_max, location, status, created_at",
    )
    .eq("status", "open")
    .order("created_at", { ascending: false });

  if (categoryId) query = query.eq("category_id", categoryId);

  const { data: posts } = await query;
  if (!posts || !posts.length) return [];

  const [catMap, countMap] = await Promise.all([
    buildCatMap(supabase, posts),
    buildCountMap(
      supabase,
      posts.map((p) => p.id),
    ),
  ]);

  return posts.map((p) => toJobPost(p, catMap, countMap));
}

export async function getJobById(id: string): Promise<JobPost | null> {
  const supabase = createClient();

  const { data: post } = await supabase
    .from("job_posts")
    .select(
      "id, customer_id, category_id, title, description, budget_min, budget_max, location, status, created_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!post) return null;

  const [catMap, countMap] = await Promise.all([
    buildCatMap(supabase, [post]),
    buildCountMap(supabase, [post.id]),
  ]);

  return toJobPost(post, catMap, countMap);
}

export async function getMyJobPosts(): Promise<JobPost[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: posts } = await supabase
    .from("job_posts")
    .select(
      "id, customer_id, category_id, title, description, budget_min, budget_max, location, status, created_at",
    )
    .eq("customer_id", user.id)
    .order("created_at", { ascending: false });

  if (!posts || !posts.length) return [];

  const [catMap, countMap] = await Promise.all([
    buildCatMap(supabase, posts),
    buildCountMap(
      supabase,
      posts.map((p) => p.id),
    ),
  ]);

  return posts.map((p) => toJobPost(p, catMap, countMap));
}

export async function createJobPost(
  input: CreateJobPostInput,
): Promise<{ id: string } | null> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from("job_posts")
    .insert({
      customer_id: user.id,
      category_id: input.categoryId,
      title: input.title,
      description: input.description,
      budget_min: input.budgetMin,
      budget_max: input.budgetMax,
      location: input.location,
    })
    .select("id")
    .single();

  if (error) return null;
  return data;
}

export async function applyToJob(
  jobId: string,
  coverNote: string | null,
): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: worker } = await supabase
    .from("workers")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!worker) return false;

  const { error } = await supabase.from("job_applications").insert({
    job_id: jobId,
    worker_id: worker.id,
    cover_note: coverNote || null,
  });

  return !error;
}

export async function withdrawApplication(jobId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: worker } = await supabase
    .from("workers")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!worker) return false;

  const { error } = await supabase
    .from("job_applications")
    .delete()
    .eq("job_id", jobId)
    .eq("worker_id", worker.id);

  return !error;
}

export async function hasAppliedToJob(jobId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { data: worker } = await supabase
    .from("workers")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!worker) return false;

  const { data } = await supabase
    .from("job_applications")
    .select("id")
    .eq("job_id", jobId)
    .eq("worker_id", worker.id)
    .maybeSingle();

  return !!data;
}

export async function getAppliedJobIds(): Promise<string[]> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return [];

  const { data: worker } = await supabase
    .from("workers")
    .select("id")
    .eq("user_id", user.id)
    .is("deleted_at", null)
    .maybeSingle();

  if (!worker) return [];

  const { data } = await supabase
    .from("job_applications")
    .select("job_id")
    .eq("worker_id", worker.id);

  return (data ?? []).map((r: { job_id: string }) => r.job_id);
}

export async function getJobApplicants(jobId: string): Promise<JobApplicant[]> {
  const supabase = createClient();

  const { data: apps } = await supabase
    .from("job_applications")
    .select("id, worker_id, cover_note, created_at")
    .eq("job_id", jobId)
    .order("created_at", { ascending: true });

  if (!apps || !apps.length) return [];

  const workerIds = apps.map((a: { worker_id: string }) => a.worker_id);
  const { data: workers } = await supabase
    .from("workers")
    .select("id, profession, user_id")
    .in("id", workerIds);

  const userIds = [
    ...new Set(
      (workers ?? [])
        .map((w: { user_id: string }) => w.user_id)
        .filter(Boolean),
    ),
  ];
  const { data: users } = userIds.length
    ? await supabase
        .from("users")
        .select("id, firstname, lastname, profile_pic_url")
        .in("id", userIds)
    : { data: [] };

  const workerMap = new Map(
    (workers ?? []).map(
      (w: { id: string; profession: string | null; user_id: string }) => [
        w.id,
        w,
      ],
    ),
  );
  const userMap = new Map(
    (users ?? []).map(
      (u: {
        id: string;
        firstname: string;
        lastname: string;
        profile_pic_url: string | null;
      }) => [u.id, u],
    ),
  );

  return apps.map(
    (a: {
      id: string;
      worker_id: string;
      cover_note: string | null;
      created_at: string;
    }) => {
      const w = workerMap.get(a.worker_id) as
        | { id: string; profession: string | null; user_id: string }
        | undefined;
      const u = w
        ? (userMap.get(w.user_id) as
            | {
                id: string;
                firstname: string;
                lastname: string;
                profile_pic_url: string | null;
              }
            | undefined)
        : undefined;
      return {
        id: a.id,
        workerId: a.worker_id,
        workerName: u ? `${u.firstname} ${u.lastname}` : "Unknown Worker",
        workerProfession: w?.profession ?? "Service Provider",
        workerAvatar: u?.profile_pic_url ?? null,
        coverNote: a.cover_note,
        appliedAt: a.created_at,
      };
    },
  );
}

export async function closeJobPost(jobId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("job_posts")
    .update({ status: "closed", updated_at: new Date().toISOString() })
    .eq("id", jobId)
    .eq("customer_id", user.id);

  return !error;
}

export async function deleteJobPost(jobId: string): Promise<boolean> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return false;

  const { error } = await supabase
    .from("job_posts")
    .delete()
    .eq("id", jobId)
    .eq("customer_id", user.id);

  return !error;
}
