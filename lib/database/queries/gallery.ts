// =====================================================
// Gallery Queries
// =====================================================

import {
  applySorting,
  executePaginatedQuery,
  executeQuery,
  getSupabaseClient,
} from "../base-query";
import type {
  ApiResponse,
  Gallery,
  PaginatedResponse,
  PaginationOptions,
  SortOptions,
} from "../types";

export interface GalleryFilters extends PaginationOptions {
  workerId?: number;
  search?: string;
  sort?: SortOptions;
}

export interface CreateGalleryData {
  worker_id: number;
  title: string;
  description?: string | null;
  media_url?: string | null;
}

export interface UpdateGalleryData {
  title?: string;
  description?: string | null;
  media_url?: string | null;
}

/**
 * Get all gallery items for a specific worker
 */
export async function getWorkerGallery(
  workerId: number,
): Promise<ApiResponse<Gallery[]>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("worker_id", workerId)
      .order("created_at", { ascending: false });

    return { data, error };
  });
}

/**
 * Get gallery item by ID
 */
export async function getGalleryById(
  galleryId: string,
): Promise<ApiResponse<Gallery>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .eq("id", galleryId)
      .single();

    return { data, error };
  });
}

/**
 * Get gallery items with pagination and filters
 */
export async function searchGallery(
  filters: GalleryFilters = {},
): Promise<PaginatedResponse<Gallery>> {
  const supabase = getSupabaseClient();

  return executePaginatedQuery(async (from, to) => {
    let query = supabase.from("gallery").select("*", { count: "exact" });

    // Apply worker filter
    if (filters.workerId) {
      query = query.eq("worker_id", filters.workerId);
    }

    // Apply search filter
    if (filters.search) {
      query = query.or(`
        title.ilike.%${filters.search}%,
        description.ilike.%${filters.search}%
      `);
    }

    // Apply sorting
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
 * Create a new gallery item
 */
export async function createGalleryItem(
  galleryData: CreateGalleryData,
): Promise<ApiResponse<Gallery>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .insert(galleryData)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Update an existing gallery item
 */
export async function updateGalleryItem(
  galleryId: string,
  updates: UpdateGalleryData,
): Promise<ApiResponse<Gallery>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .update(updates)
      .eq("id", galleryId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Delete a gallery item
 */
export async function deleteGalleryItem(
  galleryId: string,
): Promise<ApiResponse<void>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("id", galleryId);

    return { data: null, error };
  });
}

/**
 * Delete all gallery items for a worker
 */
export async function deleteWorkerGallery(
  workerId: number,
): Promise<ApiResponse<void>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { error } = await supabase
      .from("gallery")
      .delete()
      .eq("worker_id", workerId);

    return { data: null, error };
  });
}

/**
 * Get gallery item count for a worker
 */
export async function getWorkerGalleryCount(
  workerId: number,
): Promise<ApiResponse<number>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { count, error } = await supabase
      .from("gallery")
      .select("*", { count: "exact", head: true })
      .eq("worker_id", workerId);

    return { data: count || 0, error };
  });
}

/**
 * Check if a gallery item belongs to a specific worker
 */
export async function verifyGalleryOwnership(
  galleryId: string,
  workerId: number,
): Promise<ApiResponse<boolean>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("gallery")
      .select("worker_id")
      .eq("id", galleryId)
      .single();

    if (error) {
      return { data: false, error };
    }

    return { data: data?.worker_id === workerId, error: null };
  });
}
