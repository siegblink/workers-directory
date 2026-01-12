// =====================================================
// Database Types - Auto-generated from Supabase Schema
// =====================================================

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// =====================================================
// ENUMS
// =====================================================

export type BookingStatus = "pending" | "accepted" | "completed" | "canceled";
export type UserStatus = "active" | "inactive" | "suspended";
export type WorkerStatus = "available" | "busy" | "unavailable";
export type PaymentStatus = "pending" | "completed" | "failed" | "refunded";
export type MessageStatus = "sent" | "delivered" | "read";
export type NotificationStatus = "unread" | "read" | "archived";
export type NotificationType =
  | "booking"
  | "message"
  | "payment"
  | "rating"
  | "system";
export type JobSuggestionStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "implemented";

// =====================================================
// TABLE TYPES
// =====================================================

export interface User {
  id: number;
  auth_id: string | null; // UUID from auth.users table
  firstname: string;
  lastname: string;
  profile_pic_url: string | null;
  bio: string | null;
  is_online: boolean;
  status: UserStatus;
  created_at: string;
}

export interface Worker {
  id: number;
  worker_id: number;
  skills: string | null;
  status: WorkerStatus;
  hourly_rate: number | null;
  location: string | null;
  latitude: number | null;
  longitude: number | null;
  availability_schedule: Json | null; // JSON object for weekly schedule
  is_available: boolean | null;
  created_at: string;
  deleted_at: string | null;
}

export interface Category {
  id: number;
  name: string | null;
  description: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  customer_id: number;
  worker_id: number;
  category_id: number;
  description: string | null;
  requested_at: string | null;
  accepted_at: string | null;
  completed_at: string | null;
  canceled_at: string | null;
  status: BookingStatus;
  created_at: string;
}

export interface Chat {
  id: number;
  booking_id: number;
  customer_id: number;
  worker_id: number;
  created_at: string;
}

export interface Message {
  id: number;
  chat_id: number;
  sender_id: number;
  receiver_id: number;
  message_text: string | null;
  media_url: string | null;
  sent_at: string | null;
  status: MessageStatus | null;
  created_at: string;
}

export interface Rating {
  id: number;
  booking_id: number | null;
  customer_id: number;
  worker_id: number;
  rating_value: number | null;
  review_comment: string | null;
  created_at: string;
}

export interface Payment {
  id: number;
  booking_id: number | null;
  customer_id: number | null;
  worker_id: number | null;
  transaction_reference: string;
  amount: number;
  currency: string | null;
  payment_method: string | null;
  payment_status: PaymentStatus | null;
  paid_at: string | null;
  created_at: string;
}

export interface Credit {
  id: number;
  worker_id: number;
  balance: number;
  currency: string | null;
  created_at: string;
}

export interface CreditTransaction {
  id: number;
  credit_id: number;
  booking_id: number;
  amount: number;
  type: boolean; // true = credit, false = debit
  description: string | null;
  created_at: string;
}

export interface Favorite {
  id: number;
  customer_id: number;
  worker_id: number;
  created_at: string;
}

export interface Notification {
  id: number;
  user_id: number;
  title: string;
  message: string;
  type: NotificationType;
  status: NotificationStatus;
  sent_at: string | null;
  created_at: string;
}

export interface WorkerCategory {
  id: number;
  worker_id: number;
  category_id: number;
  created_at: string;
}

export interface WorkerPost {
  id: number;
  worker_id: number;
  title: string | null;
  content: string | null;
  media_url: string | null;
  status: string | null;
  created_at: string;
}

export interface ProfileSetting {
  id: number;
  user_id: number;
  preference_key: string;
  preference_value: string | null;
  created_at: string;
}

export interface GlobalSetting {
  id: number;
  key: string;
  value: string | null;
  created_at: string;
}

export interface JobSuggestion {
  id: string; // UUID
  job_title: string;
  description: string | null;
  user_id: string | null; // UUID
  upvotes: number;
  status: JobSuggestionStatus;
  created_at: string;
  updated_at: string;
}

// =====================================================
// JOINED TYPES (for common queries)
// =====================================================

export interface UserWithWorker extends User {
  worker?: Worker | null;
}

export interface BookingWithDetails extends Booking {
  customer?: User;
  worker?: Worker & { user?: User };
  category?: Category;
  rating?: Rating;
  payment?: Payment;
}

export interface WorkerWithDetails extends Worker {
  user?: User;
  categories?: Category[];
  ratings?: Rating[];
  average_rating?: number;
  total_bookings?: number;
}

export interface ChatWithDetails extends Chat {
  customer?: User;
  worker?: User;
  messages?: Message[];
  last_message?: Message;
  unread_count?: number;
}

export interface MessageWithUser extends Message {
  sender?: User;
  receiver?: User;
}

export interface RatingWithDetails extends Rating {
  customer?: User;
  worker?: Worker & { user?: User };
  booking?: Booking;
}

export interface NotificationWithUser extends Notification {
  user?: User;
}

export interface JobSuggestionWithUser extends JobSuggestion {
  user?: {
    firstname: string;
    lastname: string;
    profile_pic_url: string | null;
  } | null;
}

// =====================================================
// QUERY FILTERS & OPTIONS
// =====================================================

export interface PaginationOptions {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface SortOptions {
  column: string;
  ascending?: boolean;
}

export interface BookingFilters extends PaginationOptions {
  customer_id?: number;
  worker_id?: number;
  category_id?: number;
  status?: BookingStatus | BookingStatus[];
  date_from?: string;
  date_to?: string;
  sort?: SortOptions;
}

export interface WorkerFilters extends PaginationOptions {
  category_id?: number;
  category_ids?: number[]; // Multiple categories
  status?: WorkerStatus;
  skills?: string;
  min_rating?: number;
  max_rating?: number;
  search?: string;
  // Price range filters
  min_hourly_rate?: number;
  max_hourly_rate?: number;
  // Location filters
  location?: string; // City/area name search
  latitude?: number; // For radius-based search
  longitude?: number; // For radius-based search
  radius?: number; // Search radius in kilometers
  // Availability filters
  is_available?: boolean;
  available_on?: string; // ISO date string for specific date availability
  available_days?: string[]; // e.g., ['monday', 'tuesday']
  available_time?: string; // e.g., 'morning', 'afternoon', 'evening'
  sort?: SortOptions;
}

export interface MessageFilters extends PaginationOptions {
  chat_id?: number;
  sender_id?: number;
  receiver_id?: number;
  status?: MessageStatus;
  date_from?: string;
  date_to?: string;
  sort?: SortOptions;
}

export interface JobSuggestionFilters extends PaginationOptions {
  status?: JobSuggestionStatus;
  search?: string;
  sort?: SortOptions;
}

// =====================================================
// API RESPONSE TYPES
// =====================================================

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
  count?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
  error: Error | null;
}

// =====================================================
// DATABASE TABLES ENUM (for type safety)
// =====================================================

export enum Tables {
  USERS = "users",
  WORKERS = "workers",
  CATEGORIES = "category",
  BOOKINGS = "bookings",
  CHATS = "chats",
  MESSAGES = "messages",
  RATINGS = "ratings",
  PAYMENTS = "payments",
  CREDITS = "credits",
  CREDIT_TRANSACTIONS = "credits_transactions",
  FAVORITES = "favorites",
  NOTIFICATIONS = "notifications",
  WORKER_CATEGORIES = "workers_categories",
  WORKER_POSTS = "workers_posts",
  PROFILE_SETTINGS = "profile_settings",
  GLOBAL_SETTINGS = "global_settings",
  JOB_SUGGESTIONS = "job_suggestions",
}
