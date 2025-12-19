// =====================================================
// Database Query Library - Main Export
// =====================================================

// Export base utilities
export * from "./base-query";
export * as BookingQueries from "./queries/bookings";
export {
  acceptBooking,
  cancelBooking,
  canRateBooking,
  completeBooking,
  createBooking,
  // Bookings
  getBookingById,
  getMyBookings,
  getWorkerBookings,
} from "./queries/bookings";
export * as CategoryQueries from "./queries/categories";
export {
  addWorkerCategory,
  autocompleteCategoriesByName,
  // Categories
  getAllCategories,
  getCategoriesWithWorkerCount,
  getCategoryById,
  getPopularCategories,
  getWorkerCategories,
  removeWorkerCategory,
  searchCategories,
  updateWorkerCategories,
} from "./queries/categories";
export * as FavoriteQueries from "./queries/favorites";
export {
  addFavorite,
  // Favorites
  getMyFavorites,
  isFavorite,
  removeFavorite,
  toggleFavorite,
} from "./queries/favorites";
export * as JobSuggestionQueries from "./queries/job-suggestions";
export {
  autocompleteJobTitles,
  createJobSuggestion,
  // Job Suggestions
  getAllJobSuggestions,
  getJobSuggestionById,
  updateJobSuggestionStatus,
  upvoteJobSuggestion,
} from "./queries/job-suggestions";

export * as GalleryQueries from "./queries/gallery";
export {
  createGalleryItem,
  deleteGalleryItem,
  deleteWorkerGallery,
  // Gallery
  getGalleryById,
  getWorkerGallery,
  getWorkerGalleryCount,
  searchGallery,
  updateGalleryItem,
  verifyGalleryOwnership,
} from "./queries/gallery";
export * as MessageQueries from "./queries/messages";
export {
  getChatById,
  getChatMessages,
  // Messages
  getMyChats,
  getOrCreateChat,
  getUnreadMessageCount,
  markChatAsRead,
  sendMessage,
  subscribeToChat,
} from "./queries/messages";
// Export query modules
export * as UserQueries from "./queries/users";
// Re-export commonly used functions for convenience
export {
  getCurrentUser,
  // Users
  getUserById,
  searchUsers,
  updateCurrentUser,
} from "./queries/users";
export * as WorkerQueries from "./queries/workers";
export {
  getTopRatedWorkers,
  // Workers
  getWorkerById,
  getWorkersByCategory,
  getWorkerWithDetails,
  isUserAWorker,
  searchWorkers,
} from "./queries/workers";
// Export all types
export * from "./types";
