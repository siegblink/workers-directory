// =====================================================
// Worker Queries - Optimized Version
// Fixes all N+1 query problems by using database views and functions
// =====================================================

import { executeQuery, getSupabaseClient } from "../base-query";
import type {
  ApiResponse,
  Category,
  Json,
  PaginatedResponse,
  User,
  Worker,
  WorkerFilters,
  WorkerStatus,
  WorkerWithDetails,
} from "../types";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

interface WorkerViewRow {
  id: number;
  worker_id: number;
  skills: string | null;
  status: WorkerStatus;
  hourly_rate: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  availability_schedule: Json | null;
  is_available: boolean | null;
  created_at: string;
  user_data: User | null;
  average_rating: string;
  total_bookings: string;
  total_count?: number;
}

interface WorkerCategoryRelation {
  worker_id: number;
  category_id: number;
  category?: Category | null;
}

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Parse worker data from database view result
 */
function parseWorkerFromView(row: WorkerViewRow): WorkerWithDetails {
  return {
    id: row.id,
    worker_id: row.worker_id,
    skills: row.skills,
    status: row.status,
    hourly_rate: row.hourly_rate,
    location: row.location,
    latitude: row.latitude,
    longitude: row.longitude,
    availability_schedule: row.availability_schedule,
    is_available: row.is_available,
    created_at: row.created_at,
    deleted_at: null,
    user: row.user_data ?? undefined,
    average_rating: parseFloat(row.average_rating) || 0,
    total_bookings: parseInt(row.total_bookings, 10) || 0,
    ratings: [], // Not included in view for performance
    categories: [], // Will be fetched separately when needed
  };
}

/**
 * Get categories for a worker (lightweight query)
 */
async function getWorkerCategories(workerId: number): Promise<Category[]> {
  const supabase = getSupabaseClient();

  const { data, error } = await supabase
    .from("workers_categories")
    .select(`
      category:categories(*)
    `)
    .eq("worker_id", workerId);

  if (error || !data) return [];

  const categories: Category[] = [];
  for (const item of data) {
    if (item.category) {
      // Handle both single object and array cases
      const categoryData = Array.isArray(item.category)
        ? item.category
        : [item.category];
      categories.push(
        ...categoryData.filter(
          (c): c is Category => c !== null && c !== undefined,
        ),
      );
    }
  }
  return categories;
}

// =====================================================
// BASIC QUERIES
// =====================================================

/**
 * Get worker by ID (basic info only)
 */
export async function getWorkerById(
  workerId: number,
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .select("*")
      .eq("id", workerId)
      .is("deleted_at", null)
      .single();

    return { data, error };
  });
}

/**
 * Get worker with full details using optimized view
 * FIXED: No longer uses N+1 queries - single view query
 */
export async function getWorkerWithDetails(
  workerId: number,
): Promise<ApiResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    // Use the optimized view instead of multiple queries
    const { data, error } = await supabase
      .from("workers_with_details")
      .select("*")
      .eq("id", workerId)
      .single();

    if (error || !data) {
      return { data: null, error };
    }

    // Parse the worker data
    const worker = parseWorkerFromView(data);

    // Fetch categories separately (one additional query instead of N)
    worker.categories = await getWorkerCategories(workerId);

    return { data: worker, error: null };
  });
}

// =====================================================
// OPTIMIZED SEARCH QUERIES
// =====================================================

/**
 * Search and filter workers using optimized database function
 * FIXED: No more N+1 queries - single RPC call
 */
export async function searchWorkers(
  filters: WorkerFilters = {},
): Promise<PaginatedResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  return executeQuery(async () => {
    // Call the optimized database function
    const { data, error } = await supabase.rpc("search_workers_optimized", {
      search_text: filters.search || null,
      filter_status: filters.status || null,
      filter_is_available: filters.is_available ?? null,
      filter_skills: filters.skills || null,
      filter_location: filters.location || null,
      min_hourly_rate: filters.min_hourly_rate ?? null,
      max_hourly_rate: filters.max_hourly_rate ?? null,
      min_rating: filters.min_rating ?? null,
      result_limit: limit,
      result_offset: offset,
    });

    if (error || !data || data.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          total_pages: 0,
        },
        error,
      };
    }

    // Parse all workers
    const workers = data.map(parseWorkerFromView);
    const totalCount = data[0]?.total_count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Apply client-side filters that can't be done in SQL
    let filteredWorkers = workers;

    // Category filter (if provided)
    if (filters.category_id || filters.category_ids) {
      // Fetch categories for all workers in one batch
      const workerIds = workers.map((w: WorkerWithDetails) => w.id);
      const { data: categoriesData } = await supabase
        .from("workers_categories")
        .select("worker_id, category_id")
        .in("worker_id", workerIds);

      const workerCategoryMap = new Map<number, number[]>();
      categoriesData?.forEach((wc: WorkerCategoryRelation) => {
        if (!workerCategoryMap.has(wc.worker_id)) {
          workerCategoryMap.set(wc.worker_id, []);
        }
        workerCategoryMap.get(wc.worker_id)?.push(wc.category_id);
      });

      if (filters.category_id) {
        filteredWorkers = filteredWorkers.filter((w: WorkerWithDetails) => {
          const categoryId = filters.category_id;
          if (!categoryId) return false;
          return workerCategoryMap.get(w.id)?.includes(categoryId) ?? false;
        });
      } else if (filters.category_ids) {
        filteredWorkers = filteredWorkers.filter((w: WorkerWithDetails) => {
          const workerCats = workerCategoryMap.get(w.id) || [];
          return workerCats.some((catId: number) =>
            filters.category_ids?.includes(catId),
          );
        });
      }
    }

    // Location radius filter (if provided)
    if (filters.latitude && filters.longitude && filters.radius) {
      const {
        latitude: filterLat,
        longitude: filterLon,
        radius: filterRadius,
      } = filters;
      filteredWorkers = filteredWorkers.filter((worker: WorkerWithDetails) => {
        if (!worker.latitude || !worker.longitude) return false;
        if (
          filterLat === undefined ||
          filterLon === undefined ||
          filterRadius === undefined
        )
          return false;
        const distance = calculateDistance(
          filterLat,
          filterLon,
          worker.latitude,
          worker.longitude,
        );
        return distance <= filterRadius;
      });
    }

    return {
      data: filteredWorkers,
      pagination: {
        page,
        limit,
        total: totalCount,
        total_pages: totalPages,
      },
      error: null,
    };
  }) as Promise<PaginatedResponse<WorkerWithDetails>>;
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Get workers by category using optimized database function
 * FIXED: No more N+1 queries - single RPC call
 */
export async function getWorkersByCategory(
  categoryId: number,
  filters: WorkerFilters = {},
): Promise<PaginatedResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient();

  const page = filters.page ?? 1;
  const limit = filters.limit ?? 20;
  const offset = (page - 1) * limit;

  return executeQuery(async () => {
    // Call the optimized database function
    const { data, error } = await supabase.rpc(
      "get_workers_by_category_optimized",
      {
        target_category_id: categoryId,
        filter_status: filters.status || null,
        result_limit: limit,
        result_offset: offset,
      },
    );

    if (error || !data || data.length === 0) {
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          total_pages: 0,
        },
        error,
      };
    }

    // Parse all workers
    const workers = data.map(parseWorkerFromView);
    const totalCount = data[0]?.total_count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    // Fetch categories for all workers in batch
    const workerIds = workers.map((w: WorkerWithDetails) => w.id);
    const { data: categoriesData } = await supabase
      .from("workers_categories")
      .select(`
        worker_id,
        category:categories(*)
      `)
      .in("worker_id", workerIds);

    // Map categories to workers
    const categoryMap = new Map<number, Category[]>();
    categoriesData?.forEach((wc) => {
      if (!categoryMap.has(wc.worker_id)) {
        categoryMap.set(wc.worker_id, []);
      }
      if (wc.category) {
        const categories = Array.isArray(wc.category)
          ? wc.category
          : [wc.category];
        categoryMap.get(wc.worker_id)?.push(...categories);
      }
    });

    workers.forEach((worker: WorkerWithDetails) => {
      worker.categories = categoryMap.get(worker.id) || [];
    });

    return {
      data: workers,
      pagination: {
        page,
        limit,
        total: totalCount,
        total_pages: totalPages,
      },
      error: null,
    };
  }) as Promise<PaginatedResponse<WorkerWithDetails>>;
}

/**
 * Get top rated workers using optimized database function
 * FIXED: No more N+1 queries - single RPC call
 */
export async function getTopRatedWorkers(
  limit: number = 10,
  minRatings: number = 1,
): Promise<ApiResponse<WorkerWithDetails[]>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    // Call the optimized database function
    const { data, error } = await supabase.rpc("get_top_rated_workers", {
      result_limit: limit,
      min_ratings: minRatings,
    });

    if (error || !data) {
      return { data: null, error };
    }

    // Parse all workers
    const workers = data.map(parseWorkerFromView);

    // Fetch categories for all workers in batch
    if (workers.length > 0) {
      const workerIds = workers.map((w: WorkerWithDetails) => w.id);
      const { data: categoriesData } = await supabase
        .from("workers_categories")
        .select(`
          worker_id,
          category:categories(*)
        `)
        .in("worker_id", workerIds);

      // Map categories to workers
      const categoryMap = new Map<number, Category[]>();
      categoriesData?.forEach((wc) => {
        if (!categoryMap.has(wc.worker_id)) {
          categoryMap.set(wc.worker_id, []);
        }
        if (wc.category) {
          const categories = Array.isArray(wc.category)
            ? wc.category
            : [wc.category];
          categoryMap.get(wc.worker_id)?.push(...categories);
        }
      });

      workers.forEach((worker: WorkerWithDetails) => {
        worker.categories = categoryMap.get(worker.id) || [];
      });
    }

    return { data: workers, error: null };
  });
}

// =====================================================
// UPDATE / CREATE OPERATIONS
// =====================================================

/**
 * Update worker status
 */
export async function updateWorkerStatus(
  workerId: number,
  status: "available" | "busy" | "unavailable",
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .update({ status })
      .eq("id", workerId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Create worker profile
 */
export async function createWorkerProfile(
  userId: number,
  workerData: Partial<Worker>,
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .insert({
        worker_id: userId,
        ...workerData,
      })
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Update worker profile
 */
export async function updateWorkerProfile(
  workerId: number,
  updates: Partial<Worker>,
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .update(updates)
      .eq("id", workerId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Delete worker profile (soft delete)
 */
export async function deleteWorkerProfile(
  workerId: number,
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .update({ deleted_at: new Date().toISOString() })
      .eq("id", workerId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Check if user is a worker
 */
export async function isUserAWorker(userId: number): Promise<boolean> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("workers")
      .select("id")
      .eq("worker_id", userId)
      .is("deleted_at", null)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}
