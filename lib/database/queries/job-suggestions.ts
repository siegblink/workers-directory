import {
  applySorting,
  executePaginatedQuery,
  executeQuery,
  getSupabaseClient,
} from "../base-query";
import type {
  ApiResponse,
  JobSuggestion,
  JobSuggestionFilters,
  JobSuggestionWithUser,
  PaginatedResponse,
} from "../types";

export async function getAllJobSuggestions(
  filters: JobSuggestionFilters = {},
): Promise<PaginatedResponse<JobSuggestionWithUser>> {
  const supabase = getSupabaseClient();

  return executePaginatedQuery(async (from, to) => {
    let query = supabase.from("job_suggestions").select(
      `
        *,
        user:users!user_id(firstname, lastname, profile_pic_url)
      `,
      { count: "exact" },
    );

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.search) {
      query = query.ilike("job_title", `%${filters.search}%`);
    }

    query = applySorting(
      query,
      filters.sort || { column: "created_at", ascending: false },
    );

    query = query.range(from, to);

    const { data, error, count } = await query;

    return { data, error, count };
  }, filters);
}

export async function autocompleteJobTitles(
  searchText: string,
  limit: number = 10,
): Promise<ApiResponse<string[]>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    if (!searchText || searchText.trim() === "") {
      const { data, error } = await supabase
        .from("job_suggestions")
        .select("job_title")
        .order("upvotes", { ascending: false })
        .limit(limit);

      const titles = [...new Set(data?.map((d) => d.job_title) || [])];
      return { data: titles, error };
    }

    const { data, error } = await supabase
      .from("job_suggestions")
      .select("job_title")
      .ilike("job_title", `%${searchText.trim()}%`)
      .order("upvotes", { ascending: false })
      .limit(limit * 2);

    const titles = [...new Set(data?.map((d) => d.job_title) || [])].slice(
      0,
      limit,
    );
    return { data: titles, error };
  });
}

export async function createJobSuggestion(
  jobTitle: string,
  description?: string,
  location?: string,
): Promise<ApiResponse<JobSuggestion>> {
  const supabase = getSupabaseClient();

  // public.users.id = auth.uid() across this entire project, so user.id
  // from getUser() is the correct value for user_id.
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id ?? null;

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("job_suggestions")
      .insert({
        job_title: jobTitle.trim(),
        description: description?.trim() || null,
        location: location?.trim() || null,
        user_id: userId,
        status: "pending",
        upvotes: 0,
      })
      .select()
      .single();

    return { data, error };
  });
}

export async function upvoteJobSuggestion(
  suggestionId: string,
): Promise<ApiResponse<null>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { error } = await supabase.rpc("increment_suggestion_upvotes", {
      suggestion_id: suggestionId,
    });
    // Return null data — callers rely on error being null to confirm success.
    return { data: null, error };
  });
}

export async function getJobSuggestionById(
  id: string,
): Promise<ApiResponse<JobSuggestionWithUser>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("job_suggestions")
      .select(
        `
        *,
        user:users!user_id(firstname, lastname, profile_pic_url)
      `,
      )
      .eq("id", id)
      .single();

    return { data, error };
  });
}

export async function updateJobSuggestionStatus(
  id: string,
  status: "pending" | "approved" | "rejected" | "implemented",
): Promise<ApiResponse<JobSuggestion>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("job_suggestions")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  });
}
