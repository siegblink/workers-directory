// =====================================================
// Sub-Profile Queries
// =====================================================

import { executeQuery, getSupabaseClient } from "../base-query";
import type { ApiResponse, SubProfile } from "../types";

// In this schema, public.users.id IS the auth UUID directly.
// getCurrentUserId() uses an auth_id lookup that doesn't apply here.
async function getAuthUserId(): Promise<string | null> {
  const supabase = getSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

/**
 * Get all non-deleted sub-profiles for the current user
 */
export async function getMySubProfiles(): Promise<ApiResponse<SubProfile[]>> {
  const userId = await getAuthUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("sub_profiles")
      .select("*")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    return { data, error };
  });
}

/**
 * Create a new sub-profile for the current user
 */
export async function createSubProfile(
  data: Pick<
    SubProfile,
    | "label"
    | "profession"
    | "skills"
    | "hourly_rate_min"
    | "hourly_rate_max"
    | "years_experience"
    | "status"
  >,
): Promise<ApiResponse<SubProfile>> {
  const userId = await getAuthUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data: row, error } = await supabase
      .from("sub_profiles")
      .insert({ user_id: userId, ...data })
      .select()
      .single();

    return { data: row, error };
  });
}

/**
 * Update a sub-profile's editable fields
 */
export async function updateSubProfile(
  id: string,
  updates: Partial<
    Pick<
      SubProfile,
      | "label"
      | "profession"
      | "bio"
      | "skills"
      | "hourly_rate_min"
      | "hourly_rate_max"
      | "years_experience"
      | "status"
    >
  >,
): Promise<ApiResponse<SubProfile>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("sub_profiles")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Soft-delete a sub-profile (sets deleted_at = now())
 */
export async function deleteSubProfile(
  id: string,
): Promise<ApiResponse<SubProfile>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("sub_profiles")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    return { data, error };
  });
}
