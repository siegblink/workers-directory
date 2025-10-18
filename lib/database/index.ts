// =====================================================
// Database Query Library - Main Export
// =====================================================

// Export all types
export * from './types'

// Export base utilities
export * from './base-query'

// Export query modules
export * as UserQueries from './queries/users'
export * as WorkerQueries from './queries/workers'
export * as BookingQueries from './queries/bookings'
export * as MessageQueries from './queries/messages'
export * as FavoriteQueries from './queries/favorites'
export * as CategoryQueries from './queries/categories'

// Re-export commonly used functions for convenience
export {
  // Users
  getUserById,
  getCurrentUser,
  updateCurrentUser,
  searchUsers,
} from './queries/users'

export {
  // Workers
  getWorkerById,
  getWorkerWithDetails,
  searchWorkers,
  getWorkersByCategory,
  getTopRatedWorkers,
  isUserAWorker,
} from './queries/workers'

export {
  // Bookings
  getBookingById,
  getMyBookings,
  getWorkerBookings,
  createBooking,
  acceptBooking,
  completeBooking,
  cancelBooking,
  canRateBooking,
} from './queries/bookings'

export {
  // Messages
  getMyChats,
  getChatById,
  getOrCreateChat,
  getChatMessages,
  sendMessage,
  markChatAsRead,
  getUnreadMessageCount,
  subscribeToChat,
} from './queries/messages'

export {
  // Favorites
  getMyFavorites,
  addFavorite,
  removeFavorite,
  isFavorite,
  toggleFavorite,
} from './queries/favorites'

export {
  // Categories
  getAllCategories,
  getCategoryById,
  autocompleteCategoriesByName,
  searchCategories,
  getCategoriesWithWorkerCount,
  getPopularCategories,
  getWorkerCategories,
  addWorkerCategory,
  removeWorkerCategory,
  updateWorkerCategories,
} from './queries/categories'
