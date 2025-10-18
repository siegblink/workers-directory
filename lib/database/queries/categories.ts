// =====================================================
// Category Queries
// =====================================================

import {
  getSupabaseClient,
  executeQuery,
  executePaginatedQuery,
  applySorting
} from '../base-query'
import type {
  Category,
  ApiResponse,
  PaginatedResponse,
  PaginationOptions,
  SortOptions
} from '../types'

export interface CategoryFilters extends PaginationOptions {
  search?: string
  sort?: SortOptions
}

/**
 * Get all categories
 */
export async function getAllCategories(): Promise<ApiResponse<Category[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .order('name', { ascending: true })

    return { data, error }
  })
}

/**
 * Get category by ID
 */
export async function getCategoryById(categoryId: number): Promise<ApiResponse<Category>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .eq('id', categoryId)
      .single()

    return { data, error }
  })
}

/**
 * Autocomplete categories by search text
 * Returns a simple list of matching categories for dropdown/autocomplete
 */
export async function autocompleteCategoriesByName(
  searchText: string,
  limit: number = 10
): Promise<ApiResponse<Category[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    // Return all categories if search is empty
    if (!searchText || searchText.trim() === '') {
      const { data, error } = await supabase
        .from('category')
        .select('*')
        .order('name', { ascending: true })
        .limit(limit)

      return { data, error }
    }

    // Search categories by name (case-insensitive)
    const { data, error } = await supabase
      .from('category')
      .select('*')
      .ilike('name', `%${searchText.trim()}%`)
      .order('name', { ascending: true })
      .limit(limit)

    return { data, error }
  })
}

/**
 * Search categories
 */
export async function searchCategories(
  filters: CategoryFilters = {}
): Promise<PaginatedResponse<Category>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from('category')
      .select('*', { count: 'exact' })

    // Apply search filter
    if (filters.search) {
      query = query.or(`
        name.ilike.%${filters.search}%,
        description.ilike.%${filters.search}%
      `)
    }

    // Apply sorting
    query = applySorting(query, filters.sort || { column: 'name', ascending: true })
    query = query.range(from, to)

    const { data, error, count } = await query

    return { data, error, count }
  }, filters)
}

/**
 * Get categories with worker count
 */
export async function getCategoriesWithWorkerCount(): Promise<ApiResponse<Array<Category & { worker_count: number }>>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data: categories, error } = await supabase
      .from('category')
      .select('*')
      .order('name', { ascending: true })

    if (error || !categories) {
      return { data: null, error }
    }

    // Get worker count for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('workers_categories')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)

        return {
          ...category,
          worker_count: count || 0
        }
      })
    )

    return { data: categoriesWithCount, error: null }
  })
}

/**
 * Get popular categories (by booking count)
 */
export async function getPopularCategories(limit: number = 10): Promise<ApiResponse<Array<Category & { booking_count: number }>>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data: categories, error } = await supabase
      .from('category')
      .select('*')

    if (error || !categories) {
      return { data: null, error }
    }

    // Get booking count for each category
    const categoriesWithBookings = await Promise.all(
      categories.map(async (category) => {
        const { count } = await supabase
          .from('bookings')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)

        return {
          ...category,
          booking_count: count || 0
        }
      })
    )

    // Sort by booking count and limit
    const sortedCategories = categoriesWithBookings
      .sort((a, b) => b.booking_count - a.booking_count)
      .slice(0, limit)

    return { data: sortedCategories, error: null }
  })
}

/**
 * Create category (admin only)
 */
export async function createCategory(
  categoryData: Omit<Category, 'id' | 'created_at'>
): Promise<ApiResponse<Category>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('category')
      .insert(categoryData)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Update category (admin only)
 */
export async function updateCategory(
  categoryId: number,
  updates: Partial<Omit<Category, 'id' | 'created_at'>>
): Promise<ApiResponse<Category>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('category')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Delete category (admin only)
 */
export async function deleteCategory(categoryId: number): Promise<ApiResponse<Category>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    // First, remove all worker associations
    await supabase
      .from('workers_categories')
      .delete()
      .eq('category_id', categoryId)

    // Then delete the category
    const { data, error } = await supabase
      .from('category')
      .delete()
      .eq('id', categoryId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Get worker categories
 */
export async function getWorkerCategories(workerId: number): Promise<ApiResponse<Category[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers_categories')
      .select(`
        category:category(*)
      `)
      .eq('worker_id', workerId)

    if (error || !data) {
      return { data: null, error }
    }

    const categories = data
      .map((item: any) => item.category)
      .filter((cat: any): cat is Category => cat !== null && cat !== undefined)

    return { data: categories, error: null }
  })
}

/**
 * Add category to worker
 */
export async function addWorkerCategory(
  workerId: number,
  categoryId: number
): Promise<ApiResponse<{ id: number }>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('workers_categories')
      .insert({ worker_id: workerId, category_id: categoryId })
      .select('id')
      .single()

    return { data, error }
  })
}

/**
 * Remove category from worker
 */
export async function removeWorkerCategory(
  workerId: number,
  categoryId: number
): Promise<ApiResponse<void>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { error } = await supabase
      .from('workers_categories')
      .delete()
      .eq('worker_id', workerId)
      .eq('category_id', categoryId)

    return { data: null, error }
  })
}

/**
 * Update worker categories (replace all)
 */
export async function updateWorkerCategories(
  workerId: number,
  categoryIds: number[]
): Promise<ApiResponse<void>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    // Remove all existing categories
    await supabase
      .from('workers_categories')
      .delete()
      .eq('worker_id', workerId)

    // Add new categories
    if (categoryIds.length > 0) {
      const inserts = categoryIds.map(categoryId => ({
        worker_id: workerId,
        category_id: categoryId
      }))

      const { error } = await supabase
        .from('workers_categories')
        .insert(inserts)

      return { data: null, error }
    }

    return { data: null, error: null }
  })
}
