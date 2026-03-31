// =====================================================
// Worker Queries - Optimized Version
// Fixes all N+1 query problems by using database views and functions
// =====================================================

import { executeQuery, getSupabaseClient } from "../base-query";
import type {
  ApiResponse,
  Category,
  PaginatedResponse,
  User,
  UserStatus,
  Worker,
  WorkerFilters,
  WorkerStatus,
  WorkerWithDetails,
} from "../types";

// =====================================================
// TYPE DEFINITIONS
// =====================================================

type WorkerViewRow = {
  id: string; // UUID
  user_id: string; // UUID
  slug: string | null;
  profession: string | null;
  hourly_rate_min: number | null;
  hourly_rate_max: number | null;
  years_experience: number | null;
  jobs_completed: number | null;
  response_time_minutes: number | null;
  is_verified: boolean | null;
  skills: string[] | null;
  status: WorkerStatus;
  created_at: string;
  location: string | null;
  user_data: {
    firstname: string;
    lastname: string;
    profile_pic_url: string | null;
    bio: string | null;
    status: string | null;
    city: string | null;
    state: string | null;
  } | null;
  is_online: boolean;
  average_rating: string;
  review_count: string;
  total_count?: number;
};

type WorkerCategoryRelation = {
  worker_id: string;
  category_id: number;
  category?: Category | null;
};

// =====================================================
// HELPER FUNCTIONS
// =====================================================

/**
 * Parse worker data from database view result
 */
function parseWorkerFromView(row: WorkerViewRow): WorkerWithDetails {
  const ud = row.user_data;
  return {
    id: row.id,
    user_id: row.user_id,
    profession: row.profession,
    skills: row.skills ?? [],
    hourly_rate_min: row.hourly_rate_min,
    hourly_rate_max: row.hourly_rate_max,
    years_experience: row.years_experience,
    jobs_completed: row.jobs_completed,
    response_time_minutes: row.response_time_minutes,
    is_verified: row.is_verified,
    status: row.status,
    created_at: row.created_at,
    deleted_at: null,
    location: row.location,
    is_online: row.is_online,
    average_rating: parseFloat(row.average_rating) || 0,
    review_count: parseInt(row.review_count, 10) || 0,
    user: ud
      ? {
          id: row.user_id,
          auth_id: null,
          firstname: ud.firstname,
          lastname: ud.lastname,
          profile_pic_url: ud.profile_pic_url,
          bio: ud.bio,
          status: (ud.status as UserStatus) ?? "active",
          city: ud.city,
          state: ud.state,
          created_at: "",
        }
      : undefined,
    ratings: [],
    categories: [],
  };
}

/**
 * Get categories for a worker (lightweight query)
 */
async function getWorkerCategories(workerId: string): Promise<Category[]> {
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
  workerId: string,
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
  workerId: string,
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

    // RPC unavailable — fall back to a direct table query
    if (error) {
      let fallbackQuery = supabase
        .from("workers")
        .select("*", { count: "exact" })
        .is("deleted_at", null);

      if (filters.search) {
        fallbackQuery = fallbackQuery.ilike(
          "profession",
          `%${filters.search}%`,
        );
      }
      if (filters.min_hourly_rate != null) {
        fallbackQuery = fallbackQuery.gte(
          "hourly_rate_min",
          filters.min_hourly_rate,
        );
      }
      if (filters.max_hourly_rate != null) {
        fallbackQuery = fallbackQuery.lte(
          "hourly_rate_max",
          filters.max_hourly_rate,
        );
      }
      if (filters.status) {
        fallbackQuery = fallbackQuery.eq("status", filters.status);
      }

      const {
        data: fallbackData,
        error: fallbackError,
        count,
      } = await fallbackQuery.range(offset, offset + limit - 1);

      if (fallbackError || !fallbackData) {
        return {
          data: [],
          pagination: { page, limit, total: 0, total_pages: 0 },
          error: fallbackError,
        };
      }

      const total = count ?? 0;
      const workers: WorkerWithDetails[] = (
        fallbackData as WorkerWithDetails[]
      ).map((row) => ({
        ...row,
        user: undefined,
        categories: [],
        ratings: [],
        average_rating: 0,
        total_bookings: 0,
      }));

      return {
        data: workers,
        pagination: {
          page,
          limit,
          total,
          total_pages: Math.ceil(total / limit),
        },
        error: null,
      };
    }

    // RPC succeeded but returned no results
    if (!data || data.length === 0) {
      return {
        data: [],
        pagination: { page, limit, total: 0, total_pages: 0 },
        error: null,
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

      const workerCategoryMap = new Map<string, number[]>();
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
    const categoryMap = new Map<string, Category[]>();
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
      const categoryMap = new Map<string, Category[]>();
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
  workerId: string,
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
  userId: string,
  workerData: Partial<Worker>,
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("workers")
      .insert({
        user_id: userId,
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
  workerId: string,
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
  workerId: string,
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
export async function isUserAWorker(userId: string): Promise<boolean> {
  const supabase = getSupabaseClient();

  try {
    const { data, error } = await supabase
      .from("workers")
      .select("id")
      .eq("user_id", userId)
      .is("deleted_at", null)
      .single();

    return !error && !!data;
  } catch {
    return false;
  }
}
