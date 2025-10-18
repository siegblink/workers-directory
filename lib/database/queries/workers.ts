// =====================================================
// Worker Queries
// =====================================================

import { 
  getSupabaseClient, 
  executeQuery, 
  executePaginatedQuery,
  applySorting 
} from '../base-query'
import type { 
  Worker, 
  WorkerWithDetails, 
  WorkerFilters,
  ApiResponse, 
  PaginatedResponse 
} from '../types'

/**
 * Get worker by ID
 */
export async function getWorkerById(workerId: number): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers')
      .select('*')
      .eq('id', workerId)
      .is('deleted_at', null)
      .single()

    return { data, error }
  })
}

/**
 * Get worker with full details including user, categories, and ratings
 */
export async function getWorkerWithDetails(workerId: number): Promise<ApiResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data: worker, error: workerError } = await supabase
      .from('workers')
      .select(`
        *,
        user:users!workers_user_id_fkey(*)
      `)
      .eq('id', workerId)
      .is('deleted_at', null)
      .single()

    if (workerError || !worker) {
      return { data: null, error: workerError }
    }

    // Get categories
    const { data: categories } = await supabase
      .from('workers_categories')
      .select(`
        category:category(*)
      `)
      .eq('worker_id', worker.worker_id)

    // Get ratings
    const { data: ratings } = await supabase
      .from('ratings')
      .select('*')
      .eq('worker_id', worker.worker_id)

    // Calculate average rating
    const average_rating = ratings && ratings.length > 0
      ? ratings.reduce((sum, r) => sum + (r.rating_value || 0), 0) / ratings.length
      : 0

    // Get total bookings
    const { count: total_bookings } = await supabase
      .from('bookings')
      .select('*', { count: 'exact', head: true })
      .eq('worker_id', workerId)
      .eq('status', 'completed')

    const result: WorkerWithDetails = {
      ...worker,
      categories: categories?.map(c => c.category).filter(Boolean) || [],
      ratings: ratings || [],
      average_rating,
      total_bookings: total_bookings || 0,
    }

    return { data: result, error: null }
  })
}

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLon = (lon2 - lon1) * Math.PI / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

/**
 * Search and filter workers with advanced filtering
 */
export async function searchWorkers(
  filters: WorkerFilters = {}
): Promise<PaginatedResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from('workers')
      .select(`
        *,
        user:users!workers_user_id_fkey(*)
      `, { count: 'exact' })
      .is('deleted_at', null)

    // Status filter
    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    // Availability filter
    if (filters.is_available !== undefined) {
      query = query.eq('is_available', filters.is_available)
    }

    // Skills filter
    if (filters.skills) {
      query = query.ilike('skills', `%${filters.skills}%`)
    }

    // Price range filters
    if (filters.min_hourly_rate !== undefined) {
      query = query.gte('hourly_rate', filters.min_hourly_rate)
    }
    if (filters.max_hourly_rate !== undefined) {
      query = query.lte('hourly_rate', filters.max_hourly_rate)
    }

    // Location text search
    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`)
    }

    // General search (name, skills)
    if (filters.search) {
      query = query.or(`
        user.firstname.ilike.%${filters.search}%,
        user.lastname.ilike.%${filters.search}%,
        skills.ilike.%${filters.search}%,
        location.ilike.%${filters.search}%
      `)
    }

    // Apply sorting
    query = applySorting(query, filters.sort)
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error || !data) {
      return { data: [], error, count: 0 }
    }

    // Enhance with categories and ratings for each worker
    let enhancedData = await Promise.all(
      data.map(async (worker) => {
        const { data: workerDetails } = await getWorkerWithDetails(worker.id)
        return workerDetails || worker
      })
    )

    // Apply post-query filters that can't be done in SQL

    // Category filter (single or multiple)
    if (filters.category_id) {
      enhancedData = enhancedData.filter(worker =>
        worker.categories?.some((cat: any) => cat.id === filters.category_id)
      )
    }
    if (filters.category_ids && filters.category_ids.length > 0) {
      enhancedData = enhancedData.filter(worker =>
        worker.categories?.some((cat: any) => filters.category_ids!.includes(cat.id))
      )
    }

    // Rating filters
    if (filters.min_rating !== undefined) {
      enhancedData = enhancedData.filter(worker =>
        (worker.average_rating || 0) >= filters.min_rating!
      )
    }
    if (filters.max_rating !== undefined) {
      enhancedData = enhancedData.filter(worker =>
        (worker.average_rating || 0) <= filters.max_rating!
      )
    }

    // Location radius filter
    if (filters.latitude && filters.longitude && filters.radius) {
      enhancedData = enhancedData.filter(worker => {
        if (!worker.latitude || !worker.longitude) return false
        const distance = calculateDistance(
          filters.latitude!,
          filters.longitude!,
          worker.latitude,
          worker.longitude
        )
        return distance <= filters.radius!
      })
    }

    // Availability schedule filter
    if (filters.available_days && filters.available_days.length > 0) {
      enhancedData = enhancedData.filter(worker => {
        if (!worker.availability_schedule) return false
        const schedule = worker.availability_schedule as any
        return filters.available_days!.some(day => schedule[day] === true)
      })
    }

    return { data: enhancedData, error: null, count }
  }, filters)
}

/**
 * Get workers by category
 */
export async function getWorkersByCategory(
  categoryId: number,
  filters: WorkerFilters = {}
): Promise<PaginatedResponse<WorkerWithDetails>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    // First get worker IDs from workers_categories
    const { data: workerCats } = await supabase
      .from('workers_categories')
      .select('worker_id')
      .eq('category_id', categoryId)

    const workerIds = workerCats?.map(wc => wc.worker_id) || []

    if (workerIds.length === 0) {
      return { data: [], error: null, count: 0 }
    }

    let query = supabase
      .from('workers')
      .select(`
        *,
        user:users!workers_user_id_fkey(*)
      `, { count: 'exact' })
      .in('worker_id', workerIds)
      .is('deleted_at', null)

    if (filters.status) {
      query = query.eq('status', filters.status)
    }

    query = applySorting(query, filters.sort)
    query = query.range(from, to)

    const { data, error, count } = await query

    if (error || !data) {
      return { data: [], error, count: 0 }
    }

    const enhancedData = await Promise.all(
      data.map(async (worker) => {
        const { data: workerDetails } = await getWorkerWithDetails(worker.id)
        return workerDetails || worker
      })
    )

    return { data: enhancedData, error: null, count }
  }, filters)
}

/**
 * Get top rated workers
 */
export async function getTopRatedWorkers(
  limit: number = 10
): Promise<ApiResponse<WorkerWithDetails[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    // Get all workers
    const { data: workers, error } = await supabase
      .from('workers')
      .select(`
        *,
        user:users!workers_user_id_fkey(*)
      `)
      .is('deleted_at', null)
      .eq('status', 'available')

    if (error || !workers) {
      return { data: null, error }
    }

    // Get details for all workers
    const workersWithDetails = await Promise.all(
      workers.map(async (worker) => {
        const { data } = await getWorkerWithDetails(worker.id)
        return data
      })
    )

    // Filter out nulls and sort by rating
    const sortedWorkers = workersWithDetails
      .filter((w): w is WorkerWithDetails => w !== null)
      .sort((a, b) => (b.average_rating || 0) - (a.average_rating || 0))
      .slice(0, limit)

    return { data: sortedWorkers, error: null }
  })
}

/**
 * Update worker status
 */
export async function updateWorkerStatus(
  workerId: number,
  status: 'available' | 'busy' | 'unavailable'
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers')
      .update({ status })
      .eq('id', workerId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Create worker profile
 */
export async function createWorkerProfile(
  userId: number,
  workerData: Partial<Worker>
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers')
      .insert({
        worker_id: userId,
        ...workerData,
      })
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Update worker profile
 */
export async function updateWorkerProfile(
  workerId: number,
  updates: Partial<Worker>
): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers')
      .update(updates)
      .eq('id', workerId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Delete worker profile (soft delete)
 */
export async function deleteWorkerProfile(workerId: number): Promise<ApiResponse<Worker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', workerId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Check if user is a worker
 */
export async function isUserAWorker(userId: number): Promise<boolean> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('workers')
      .select('id')
      .eq('worker_id', userId)
      .is('deleted_at', null)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}
