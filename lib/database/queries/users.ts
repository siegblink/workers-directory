// =====================================================
// User Queries
// =====================================================

import { 
  getSupabaseClient, 
  executeQuery, 
  executePaginatedQuery,
  applySorting,
  getCurrentUserId 
} from '../base-query'
import type { 
  User, 
  UserWithWorker, 
  ApiResponse, 
  PaginatedResponse,
  PaginationOptions,
  SortOptions 
} from '../types'

/**
 * Get user by ID
 */
export async function getUserById(userId: number): Promise<ApiResponse<User>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()

    return { data, error }
  })
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser(): Promise<ApiResponse<User>> {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    return { data: null, error: new Error('User not authenticated') }
  }

  return getUserById(userId)
}

/**
 * Get user with worker details
 */
export async function getUserWithWorker(userId: number): Promise<ApiResponse<UserWithWorker>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .select(`
        *,
        worker:workers!workers_user_id_fkey(*)
      `)
      .eq('id', userId)
      .single()

    return { data, error }
  })
}

/**
 * Update user profile
 */
export async function updateUser(
  userId: number,
  updates: Partial<User>
): Promise<ApiResponse<User>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Update current user profile
 */
export async function updateCurrentUser(
  updates: Partial<User>
): Promise<ApiResponse<User>> {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    return { data: null, error: new Error('User not authenticated') }
  }

  return updateUser(userId, updates)
}

/**
 * Search users by name
 */
export async function searchUsers(
  searchTerm: string,
  options: PaginationOptions & { sort?: SortOptions } = {}
): Promise<PaginatedResponse<User>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .or(`firstname.ilike.%${searchTerm}%,lastname.ilike.%${searchTerm}%`)
      .eq('status', 'active')

    query = applySorting(query, options.sort)
    query = query.range(from, to)

    const { data, error, count } = await query
    return { data, error, count }
  }, options)
}

/**
 * Get online users
 */
export async function getOnlineUsers(
  options: PaginationOptions & { sort?: SortOptions } = {}
): Promise<PaginatedResponse<User>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from('users')
      .select('*', { count: 'exact' })
      .eq('is_online', true)
      .eq('status', 'active')

    query = applySorting(query, options.sort)
    query = query.range(from, to)

    const { data, error, count } = await query
    return { data, error, count }
  }, options)
}

/**
 * Update user online status
 */
export async function updateOnlineStatus(
  userId: number,
  isOnline: boolean
): Promise<ApiResponse<User>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('users')
      .update({ is_online: isOnline })
      .eq('id', userId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Get user full name
 */
export function getUserFullName(user: User | null): string {
  if (!user) return 'Unknown User'
  return `${user.firstname} ${user.lastname}`.trim()
}

/**
 * Check if user exists
 */
export async function userExists(userId: number): Promise<boolean> {
  const supabase = getSupabaseClient()

  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    return !error && !!data
  } catch {
    return false
  }
}
