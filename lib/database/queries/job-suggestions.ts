// =====================================================
// Job Suggestions Queries
// =====================================================

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

/**
 * Get all job suggestions (public feed)
 * Returns paginated list with user info joined
 */
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

    // Apply status filter if provided
    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    // Apply search filter if provided
    if (filters.search) {
      query = query.ilike("job_title", `%${filters.search}%`);
    }

    // Apply sorting (default: newest first)
    query = applySorting(
      query,
      filters.sort || { column: "created_at", ascending: false },
    );

    query = query.range(from, to);

    const { data, error, count } = await query;

    return { data, error, count };
  }, filters);
}

/**
 * Autocomplete job titles from existing suggestions
 * Returns distinct job titles for autocomplete dropdown
 */
export async function autocompleteJobTitles(
  searchText: string,
  limit: number = 10,
): Promise<ApiResponse<string[]>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    // Return popular titles if search is empty
    if (!searchText || searchText.trim() === "") {
      const { data, error } = await supabase
        .from("job_suggestions")
        .select("job_title")
        .order("upvotes", { ascending: false })
        .limit(limit);

      const titles = [...new Set(data?.map((d) => d.job_title) || [])];
      return { data: titles, error };
    }

    // Search by title (case-insensitive)
    const { data, error } = await supabase
      .from("job_suggestions")
      .select("job_title")
      .ilike("job_title", `%${searchText.trim()}%`)
      .order("upvotes", { ascending: false })
      .limit(limit * 2); // Get more to ensure uniqueness after filtering

    // Return distinct titles
    const titles = [...new Set(data?.map((d) => d.job_title) || [])].slice(
      0,
      limit,
    );
    return { data: titles, error };
  });
}

/**
 * Create a new job suggestion
 * Works for both authenticated and anonymous users
 */
export async function createJobSuggestion(
  jobTitle: string,
  description?: string,
): Promise<ApiResponse<JobSuggestion>> {
  const supabase = getSupabaseClient();

  // Get current auth user ID if authenticated (null for anonymous)
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const userId = user?.id || null;

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("job_suggestions")
      .insert({
        job_title: jobTitle.trim(),
        description: description?.trim() || null,
        user_id: userId,
        status: "pending",
        upvotes: 0,
      })
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Upvote a job suggestion
 * Increments the upvote count by 1
 */
export async function upvoteJobSuggestion(
  suggestionId: string,
): Promise<ApiResponse<JobSuggestion>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    // First get current upvotes
    const { data: current, error: fetchError } = await supabase
      .from("job_suggestions")
      .select("upvotes")
      .eq("id", suggestionId)
      .single();

    if (fetchError || !current) {
      return { data: null, error: fetchError };
    }

    // Update with incremented value
    const { data, error } = await supabase
      .from("job_suggestions")
      .update({
        upvotes: (current.upvotes || 0) + 1,
        updated_at: new Date().toISOString(),
      })
      .eq("id", suggestionId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Get job suggestion by ID
 * Includes user info
 */
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

/**
 * Update job suggestion status (admin only)
 */
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
