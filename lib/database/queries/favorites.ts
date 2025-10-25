// =====================================================
// Favorites Queries
// =====================================================

import {
  executePaginatedQuery,
  executeQuery,
  getCurrentUserId,
  getSupabaseClient,
} from "../base-query";
import type {
  ApiResponse,
  Favorite,
  PaginatedResponse,
  PaginationOptions,
  WorkerWithDetails,
} from "../types";
import { getWorkerWithDetails } from "./workers";

/**
 * Get user's favorite workers
 */
export async function getMyFavorites(
  options: PaginationOptions = {},
): Promise<PaginatedResponse<WorkerWithDetails>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      error: new Error("User not authenticated"),
    };
  }

  const supabase = getSupabaseClient();

  return executePaginatedQuery(async (from, to) => {
    const {
      data: favorites,
      error,
      count,
    } = await supabase
      .from("favorites")
      .select("worker_id", { count: "exact" })
      .eq("customer_id", userId)
      .range(from, to);

    if (error || !favorites) {
      return { data: [], error, count: 0 };
    }

    // Get full worker details
    const workers = await Promise.all(
      favorites.map(async (fav) => {
        const { data } = await getWorkerWithDetails(fav.worker_id);
        return data;
      }),
    );

    return {
      data: workers.filter((w): w is WorkerWithDetails => w !== null),
      error: null,
      count,
    };
  }, options);
}

/**
 * Add worker to favorites
 */
export async function addFavorite(
  workerId: number,
): Promise<ApiResponse<Favorite>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("favorites")
      .insert({
        customer_id: userId,
        worker_id: workerId,
      })
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Remove worker from favorites
 */
export async function removeFavorite(
  workerId: number,
): Promise<ApiResponse<boolean>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("customer_id", userId)
      .eq("worker_id", workerId);

    return { data: !error, error };
  });
}

/**
 * Check if worker is favorited
 */
export async function isFavorite(workerId: number): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId) return false;

  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("favorites")
      .select("id")
      .eq("customer_id", userId)
      .eq("worker_id", workerId)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}

/**
 * Toggle favorite status
 */
export async function toggleFavorite(
  workerId: number,
): Promise<ApiResponse<boolean>> {
  const isFav = await isFavorite(workerId);

  if (isFav) {
    return removeFavorite(workerId);
  } else {
    const result = await addFavorite(workerId);
    return { data: !!result.data, error: result.error };
  }
}
