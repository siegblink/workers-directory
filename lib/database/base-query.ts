// =====================================================
// Base Query Utilities
// Reusable database query functions with error handling
// =====================================================

import { createClient } from '@/lib/supabase/client'
import type { 
  ApiResponse, 
  PaginatedResponse, 
  PaginationOptions, 
  SortOptions 
} from './types'

/**
 * Get Supabase client instance
 */
export function getSupabaseClient() {
  return createClient()
}

/**
 * Execute a query with error handling
 */
export async function executeQuery<T>(
  queryFn: () => Promise<{ data: T | null; error: any; count?: number | null }>
): Promise<ApiResponse<T>> {
  try {
    const { data, error, count } = await queryFn()
    
    if (error) {
      console.error('Database query error:', error)
      return { data: null, error, count: count ?? undefined }
    }

    return { data, error: null, count: count ?? undefined }
  } catch (error) {
    console.error('Unexpected error:', error)
    return { 
      data: null, 
      error: error instanceof Error ? error : new Error('Unknown error'),
      count: undefined
    }
  }
}

/**
 * Execute a paginated query
 */
export async function executePaginatedQuery<T>(
  queryFn: (from: number, to: number) => Promise<{ data: T[] | null; error: any; count?: number | null }>,
  options: PaginationOptions = {}
): Promise<PaginatedResponse<T>> {
  const page = options.page ?? 1
  const limit = options.limit ?? 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  try {
    const { data, error, count } = await queryFn(from, to)
    
    if (error) {
      console.error('Paginated query error:', error)
      return {
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          total_pages: 0,
        },
        error,
      }
    }

    const total = count ?? 0
    const total_pages = Math.ceil(total / limit)

    return {
      data: data ?? [],
      pagination: {
        page,
        limit,
        total,
        total_pages,
      },
      error: null,
    }
  } catch (error) {
    console.error('Unexpected pagination error:', error)
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        total_pages: 0,
      },
      error: error instanceof Error ? error : new Error('Unknown error'),
    }
  }
}

/**
 * Apply sorting to a query
 */
export function applySorting<T>(
  query: any,
  sort?: SortOptions
) {
  if (!sort) return query
  
  return query.order(sort.column, { ascending: sort.ascending ?? false })
}

/**
 * Apply pagination to a query
 */
export function applyPagination(
  query: any,
  options: PaginationOptions = {}
) {
  const page = options.page ?? 1
  const limit = options.limit ?? 10
  const from = (page - 1) * limit
  const to = from + limit - 1

  return query.range(from, to)
}

/**
 * Get current authenticated user ID from public.users table
 * Maps auth.users.id (UUID) to public.users.id (number)
 */
export async function getCurrentUserId(): Promise<number | null> {
  const supabase = getSupabaseClient()

  try {
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return null

    // Get the corresponding user ID from public.users table
    // Using auth_id column that references auth.users.id
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('auth_id', user.id) // Match UUID from auth.users
      .single()

    if (error || !data) {
      console.error('Error fetching user ID from public.users:', error)
      return null
    }

    return data.id
  } catch (error) {
    console.error('Error getting current user:', error)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const supabase = getSupabaseClient()
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

/**
 * Format date for database queries
 */
export function formatDateForQuery(date: Date | string): string {
  if (typeof date === 'string') return date
  return date.toISOString()
}

/**
 * Build filter for array of values (OR condition)
 */
export function buildInFilter(column: string, values: any[]) {
  return values.map(value => `${column}.eq.${value}`).join(',')
}

/**
 * Safe JSON parse with fallback
 */
export function safeJsonParse<T>(json: string | null, fallback: T): T {
  if (!json) return fallback
  
  try {
    return JSON.parse(json)
  } catch {
    return fallback
  }
}

/**
 * Calculate offset from page and limit
 */
export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit
}

/**
 * Handle Supabase realtime subscription
 */
export function subscribeToTable<T>(
  table: string,
  callback: (payload: any) => void,
  filter?: string
) {
  const supabase = getSupabaseClient()
  
  const channel = supabase
    .channel(`${table}-changes`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: table,
        filter: filter,
      },
      callback
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}

/**
 * Batch insert with error handling
 */
export async function batchInsert<T>(
  table: string,
  records: Partial<T>[]
): Promise<ApiResponse<T[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from(table)
      .insert(records)
      .select()

    return { data: data as T[] | null, error }
  })
}

/**
 * Batch update with error handling
 */
export async function batchUpdate<T>(
  table: string,
  updates: Array<{ id: number; data: Partial<T> }>
): Promise<ApiResponse<T[]>> {
  const supabase = getSupabaseClient()
  const results: T[] = []
  let lastError = null

  for (const update of updates) {
    const { data, error } = await supabase
      .from(table)
      .update(update.data)
      .eq('id', update.id)
      .select()
      .single()

    if (error) {
      lastError = error
      console.error(`Error updating record ${update.id}:`, error)
    } else if (data) {
      results.push(data as T)
    }
  }

  return {
    data: results.length > 0 ? results : null,
    error: lastError,
  }
}

/**
 * Soft delete (if deleted_at column exists)
 */
export async function softDelete(
  table: string,
  id: number
): Promise<ApiResponse<any>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Count records with filters
 */
export async function countRecords(
  table: string,
  filters?: Record<string, any>
): Promise<number> {
  const supabase = getSupabaseClient()

  try {
    let query = supabase
      .from(table)
      .select('*', { count: 'exact', head: true })

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        query = query.eq(key, value)
      })
    }

    const { count, error } = await query

    if (error) {
      console.error('Error counting records:', error)
      return 0
    }

    return count ?? 0
  } catch (error) {
    console.error('Unexpected error counting records:', error)
    return 0
  }
}
