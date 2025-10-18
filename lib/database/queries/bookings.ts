// =====================================================
// Booking Queries
// =====================================================

import { 
  getSupabaseClient, 
  executeQuery, 
  executePaginatedQuery,
  applySorting,
  getCurrentUserId 
} from '../base-query'
import type { 
  Booking, 
  BookingWithDetails, 
  BookingFilters,
  BookingStatus,
  ApiResponse, 
  PaginatedResponse 
} from '../types'

/**
 * Get booking by ID
 */
export async function getBookingById(bookingId: number): Promise<ApiResponse<BookingWithDetails>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!bookings_customer_id_fkey(*),
        worker:workers!bookings_worker_id_fkey(
          *,
          user:users!workers_user_id_fkey(*)
        ),
        category:category!bookings_category_id_fkey(*),
        rating:ratings(*)
      `)
      .eq('id', bookingId)
      .single()

    return { data, error }
  })
}

/**
 * Get all bookings with filters
 */
export async function getBookings(
  filters: BookingFilters = {}
): Promise<PaginatedResponse<BookingWithDetails>> {
  const supabase = getSupabaseClient()

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:users!bookings_customer_id_fkey(*),
        worker:workers!bookings_worker_id_fkey(
          *,
          user:users!workers_user_id_fkey(*)
        ),
        category:category!bookings_category_id_fkey(*)
      `, { count: 'exact' })

    // Apply filters
    if (filters.customer_id) {
      query = query.eq('customer_id', filters.customer_id)
    }

    if (filters.worker_id) {
      query = query.eq('worker_id', filters.worker_id)
    }

    if (filters.category_id) {
      query = query.eq('category_id', filters.category_id)
    }

    if (filters.status) {
      if (Array.isArray(filters.status)) {
        query = query.in('status', filters.status)
      } else {
        query = query.eq('status', filters.status)
      }
    }

    if (filters.date_from) {
      query = query.gte('requested_at', filters.date_from)
    }

    if (filters.date_to) {
      query = query.lte('requested_at', filters.date_to)
    }

    query = applySorting(query, filters.sort ?? { column: 'created_at', ascending: false })
    query = query.range(from, to)

    const { data, error, count } = await query
    return { data, error, count }
  }, filters)
}

/**
 * Get current user's bookings
 */
export async function getMyBookings(
  filters: Omit<BookingFilters, 'customer_id'> = {}
): Promise<PaginatedResponse<BookingWithDetails>> {
  const userId = await getCurrentUserId()
  
  if (!userId) {
    return {
      data: [],
      pagination: { page: 1, limit: 10, total: 0, total_pages: 0 },
      error: new Error('User not authenticated'),
    }
  }

  return getBookings({ ...filters, customer_id: userId })
}

/**
 * Get bookings as worker
 */
export async function getWorkerBookings(
  workerId: number,
  filters: Omit<BookingFilters, 'worker_id'> = {}
): Promise<PaginatedResponse<BookingWithDetails>> {
  return getBookings({ ...filters, worker_id: workerId })
}

/**
 * Create new booking
 */
export async function createBooking(
  bookingData: {
    customer_id: number
    worker_id: number
    category_id: number
    description?: string
  }
): Promise<ApiResponse<Booking>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .insert({
        ...bookingData,
        requested_at: new Date().toISOString(),
        status: 'pending',
      })
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Update booking status
 */
export async function updateBookingStatus(
  bookingId: number,
  status: BookingStatus
): Promise<ApiResponse<Booking>> {
  const supabase = getSupabaseClient()

  const timestampField = {
    pending: null,
    accepted: 'accepted_at',
    completed: 'completed_at',
    canceled: 'canceled_at',
  }[status]

  const updates: any = { status }
  if (timestampField) {
    updates[timestampField] = new Date().toISOString()
  }

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .update(updates)
      .eq('id', bookingId)
      .select()
      .single()

    return { data, error }
  })
}

/**
 * Accept booking (worker)
 */
export async function acceptBooking(bookingId: number): Promise<ApiResponse<Booking>> {
  return updateBookingStatus(bookingId, 'accepted')
}

/**
 * Complete booking
 */
export async function completeBooking(bookingId: number): Promise<ApiResponse<Booking>> {
  return updateBookingStatus(bookingId, 'completed')
}

/**
 * Cancel booking
 */
export async function cancelBooking(bookingId: number): Promise<ApiResponse<Booking>> {
  return updateBookingStatus(bookingId, 'canceled')
}

/**
 * Get booking statistics for worker
 */
export async function getWorkerBookingStats(workerId: number): Promise<ApiResponse<{
  total: number
  pending: number
  accepted: number
  completed: number
  canceled: number
  completion_rate: number
}>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data: bookings, error } = await supabase
      .from('bookings')
      .select('status')
      .eq('worker_id', workerId)

    if (error || !bookings) {
      return { data: null, error }
    }

    const stats = {
      total: bookings.length,
      pending: bookings.filter(b => b.status === 'pending').length,
      accepted: bookings.filter(b => b.status === 'accepted').length,
      completed: bookings.filter(b => b.status === 'completed').length,
      canceled: bookings.filter(b => b.status === 'canceled').length,
      completion_rate: 0,
    }

    const totalNonPending = stats.accepted + stats.completed + stats.canceled
    if (totalNonPending > 0) {
      stats.completion_rate = (stats.completed / totalNonPending) * 100
    }

    return { data: stats, error: null }
  })
}

/**
 * Get pending bookings for worker
 */
export async function getPendingBookingsForWorker(
  workerId: number
): Promise<ApiResponse<BookingWithDetails[]>> {
  const supabase = getSupabaseClient()

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        customer:users!bookings_customer_id_fkey(*),
        category:category!bookings_category_id_fkey(*)
      `)
      .eq('worker_id', workerId)
      .eq('status', 'pending')
      .order('requested_at', { ascending: false })

    return { data, error }
  })
}

/**
 * Check if booking can be rated
 */
export async function canRateBooking(bookingId: number): Promise<boolean> {
  const supabase = getSupabaseClient()

  try {
    const { data: booking } = await supabase
      .from('bookings')
      .select('status')
      .eq('id', bookingId)
      .single()

    if (!booking || booking.status !== 'completed') {
      return false
    }

    // Check if already rated
    const { data: rating } = await supabase
      .from('ratings')
      .select('id')
      .eq('booking_id', bookingId)
      .single()

    return !rating
  } catch {
    return false
  }
}
