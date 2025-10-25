// =====================================================
// Reusable Database Hooks for React Components
// =====================================================

"use client";

import { useCallback, useEffect, useState } from "react";
import {
  type BookingFilters,
  type BookingWithDetails,
  type ChatWithDetails,
  getBookingById,
  getChatById,
  getCurrentUser,
  getMyBookings,
  getMyChats,
  getMyFavorites,
  getUnreadMessageCount,
  getWorkerBookings,
  getWorkerById,
  getWorkerWithDetails,
  isFavorite,
  type Message,
  type PaginationOptions,
  searchWorkers,
  subscribeToChat,
  type User,
  type Worker,
  type WorkerFilters,
  type WorkerWithDetails,
} from "@/lib/database";

// =====================================================
// USER HOOKS
// =====================================================

export function useCurrentUser() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function load() {
      const { data, error } = await getCurrentUser();
      setUser(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, []);

  const refresh = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getCurrentUser();
    setUser(data);
    setError(error);
    setLoading(false);
  }, []);

  return { user, loading, error, refresh };
}

// =====================================================
// WORKER HOOKS
// =====================================================

export function useWorker(workerId: number | null) {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    const validWorkerId = workerId;
    async function load() {
      setLoading(true);
      const { data, error } = await getWorkerById(validWorkerId);
      setWorker(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, [workerId]);

  return { worker, loading, error };
}

export function useWorkerWithDetails(workerId: number | null) {
  const [worker, setWorker] = useState<WorkerWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    const validWorkerId = workerId;
    async function load() {
      setLoading(true);
      const { data, error } = await getWorkerWithDetails(validWorkerId);
      setWorker(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, [workerId]);

  const refresh = useCallback(async () => {
    if (!workerId) return;
    const validWorkerId = workerId;
    setLoading(true);
    const { data, error } = await getWorkerWithDetails(validWorkerId);
    setWorker(data);
    setError(error);
    setLoading(false);
  }, [workerId]);

  return { worker, loading, error, refresh };
}

export function useWorkerSearch(filters: WorkerFilters = {}) {
  const [workers, setWorkers] = useState<WorkerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const loadWorkers = useCallback(async (newFilters: WorkerFilters) => {
    setLoading(true);
    const { data, pagination: pag, error } = await searchWorkers(newFilters);
    setWorkers(data);
    setPagination(pag);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadWorkers(filters);
  }, [filters, loadWorkers]);

  const nextPage = useCallback(() => {
    if (pagination.page < pagination.total_pages) {
      loadWorkers({ ...filters, page: pagination.page + 1 });
    }
  }, [pagination, filters, loadWorkers]);

  const prevPage = useCallback(() => {
    if (pagination.page > 1) {
      loadWorkers({ ...filters, page: pagination.page - 1 });
    }
  }, [pagination, filters, loadWorkers]);

  return {
    workers,
    loading,
    error,
    pagination,
    nextPage,
    prevPage,
    refresh: () => loadWorkers(filters),
  };
}

// =====================================================
// BOOKING HOOKS
// =====================================================

export function useBooking(bookingId: number | null) {
  const [booking, setBooking] = useState<BookingWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!bookingId) {
      setLoading(false);
      return;
    }

    const validBookingId = bookingId;
    async function load() {
      setLoading(true);
      const { data, error } = await getBookingById(validBookingId);
      setBooking(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, [bookingId]);

  const refresh = useCallback(async () => {
    if (!bookingId) return;
    const validBookingId = bookingId;
    setLoading(true);
    const { data, error } = await getBookingById(validBookingId);
    setBooking(data);
    setError(error);
    setLoading(false);
  }, [bookingId]);

  return { booking, loading, error, refresh };
}

export function useMyBookings(
  filters: Omit<BookingFilters, "customer_id"> = {},
) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const loadBookings = useCallback(async (newFilters: typeof filters) => {
    setLoading(true);
    const { data, pagination: pag, error } = await getMyBookings(newFilters);
    setBookings(data);
    setPagination(pag);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadBookings(filters);
  }, [filters, loadBookings]);

  return {
    bookings,
    loading,
    error,
    pagination,
    refresh: () => loadBookings(filters),
  };
}

export function useWorkerBookings(
  workerId: number | null,
  filters: Omit<BookingFilters, "worker_id"> = {},
) {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const loadBookings = useCallback(
    async (id: number, newFilters: typeof filters) => {
      setLoading(true);
      const {
        data,
        pagination: pag,
        error,
      } = await getWorkerBookings(id, newFilters);
      setBookings(data);
      setPagination(pag);
      setError(error);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    if (workerId) {
      loadBookings(workerId, filters);
    } else {
      setLoading(false);
    }
  }, [workerId, filters, loadBookings]);

  return {
    bookings,
    loading,
    error,
    pagination,
    refresh: () => workerId && loadBookings(workerId, filters),
  };
}

// =====================================================
// CHAT/MESSAGE HOOKS
// =====================================================

export function useMyChats() {
  const [chats, setChats] = useState<ChatWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadChats = useCallback(async () => {
    setLoading(true);
    const { data, error } = await getMyChats();
    setChats(data || []);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadChats();
  }, [loadChats]);

  return { chats, loading, error, refresh: loadChats };
}

export function useChat(chatId: number | null) {
  const [chat, setChat] = useState<ChatWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const validChatId = chatId;
    async function load() {
      setLoading(true);
      const { data, error } = await getChatById(validChatId);
      setChat(data);
      setError(error);
      setLoading(false);
    }
    load();
  }, [chatId]);

  const refresh = useCallback(async () => {
    if (!chatId) return;
    const validChatId = chatId;
    setLoading(true);
    const { data, error } = await getChatById(validChatId);
    setChat(data);
    setError(error);
    setLoading(false);
  }, [chatId]);

  return { chat, loading, error, refresh };
}

export function useChatMessages(chatId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!chatId) {
      setLoading(false);
      return;
    }

    const validChatId = chatId;
    async function load() {
      setLoading(true);
      const { data, error } = await getChatById(validChatId);
      setMessages(data?.messages || []);
      setError(error);
      setLoading(false);
    }
    load();

    // Subscribe to realtime updates
    const unsubscribe = subscribeToChat(validChatId, (newMessage) => {
      setMessages((prev) => [newMessage, ...prev]);
    });

    return () => unsubscribe();
  }, [chatId]);

  return { messages, loading, error };
}

export function useUnreadCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadCount = useCallback(async () => {
    setLoading(true);
    const unreadCount = await getUnreadMessageCount();
    setCount(unreadCount);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCount();
    // Refresh every 30 seconds
    const interval = setInterval(loadCount, 30000);
    return () => clearInterval(interval);
  }, [loadCount]);

  return { count, loading, refresh: loadCount };
}

// =====================================================
// FAVORITE HOOKS
// =====================================================

export function useMyFavorites(options: PaginationOptions = {}) {
  const [favorites, setFavorites] = useState<WorkerWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    total_pages: 0,
  });

  const loadFavorites = useCallback(async (opts: PaginationOptions) => {
    setLoading(true);
    const { data, pagination: pag, error } = await getMyFavorites(opts);
    setFavorites(data);
    setPagination(pag);
    setError(error);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadFavorites(options);
  }, [options, loadFavorites]);

  return {
    favorites,
    loading,
    error,
    pagination,
    refresh: () => loadFavorites(options),
  };
}

export function useIsFavorite(workerId: number | null) {
  const [isFav, setIsFav] = useState(false);
  const [loading, setLoading] = useState(true);

  const checkFavorite = useCallback(async (id: number) => {
    setLoading(true);
    const result = await isFavorite(id);
    setIsFav(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (workerId) {
      checkFavorite(workerId);
    } else {
      setLoading(false);
    }
  }, [workerId, checkFavorite]);

  return {
    isFavorite: isFav,
    loading,
    refresh: () => workerId && checkFavorite(workerId),
  };
}
