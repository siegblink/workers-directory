// =====================================================
// Message & Chat Queries
// =====================================================

import {
  applySorting,
  executePaginatedQuery,
  executeQuery,
  getCurrentUserId,
  getSupabaseClient,
  subscribeToTable,
} from "../base-query";
import type {
  ApiResponse,
  Chat,
  ChatWithDetails,
  Message,
  MessageFilters,
  MessageWithUser,
  PaginatedResponse,
} from "../types";

/**
 * Get chat by ID with details
 */
export async function getChatById(
  chatId: number,
): Promise<ApiResponse<ChatWithDetails>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data: chat, error } = await supabase
      .from("chats")
      .select(`
        *,
        customer:users!chats_customer_id_fkey(*),
        worker:users!chats_worker_id_fkey(*)
      `)
      .eq("id", chatId)
      .single();

    if (error || !chat) {
      return { data: null, error };
    }

    // Get messages
    const { data: messages } = await supabase
      .from("messages")
      .select("*")
      .eq("chat_id", chatId)
      .order("created_at", { ascending: false })
      .limit(50);

    // Get last message
    const lastMessage = messages?.[0] || null;

    // Count unread messages for current user
    const userId = await getCurrentUserId();
    const unread_count =
      messages?.filter((m) => m.receiver_id === userId && m.status !== "read")
        .length || 0;

    const result: ChatWithDetails = {
      ...chat,
      messages: messages || [],
      last_message: lastMessage,
      unread_count,
    };

    return { data: result, error: null };
  });
}

/**
 * Get all chats for current user
 */
export async function getMyChats(): Promise<ApiResponse<ChatWithDetails[]>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data: chats, error } = await supabase
      .from("chats")
      .select(`
        *,
        customer:users!chats_customer_id_fkey(*),
        worker:users!chats_worker_id_fkey(*)
      `)
      .or(`customer_id.eq.${userId},worker_id.eq.${userId}`)
      .order("created_at", { ascending: false });

    if (error || !chats) {
      return { data: null, error };
    }

    // Enhance each chat with messages and unread count
    const enhancedChats = await Promise.all(
      chats.map(async (chat) => {
        const { data } = await getChatById(chat.id);
        return data || chat;
      }),
    );

    return { data: enhancedChats, error: null };
  });
}

/**
 * Get or create chat between customer and worker
 */
export async function getOrCreateChat(
  bookingId: number,
  customerId: number,
  workerId: number,
): Promise<ApiResponse<Chat>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    // Try to find existing chat
    const { data: existingChat } = await supabase
      .from("chats")
      .select("*")
      .eq("booking_id", bookingId)
      .single();

    if (existingChat) {
      return { data: existingChat, error: null };
    }

    // Create new chat
    const { data, error } = await supabase
      .from("chats")
      .insert({
        booking_id: bookingId,
        customer_id: customerId,
        worker_id: workerId,
      })
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Get messages for a chat
 */
export async function getChatMessages(
  chatId: number,
  filters: MessageFilters = {},
): Promise<PaginatedResponse<MessageWithUser>> {
  const supabase = getSupabaseClient();

  return executePaginatedQuery(async (from, to) => {
    let query = supabase
      .from("messages")
      .select(
        `
        *,
        sender:users!messages_sender_id_fkey(*),
        receiver:users!messages_receiver_id_fkey(*)
      `,
        { count: "exact" },
      )
      .eq("chat_id", chatId);

    if (filters.status) {
      query = query.eq("status", filters.status);
    }

    if (filters.date_from) {
      query = query.gte("sent_at", filters.date_from);
    }

    if (filters.date_to) {
      query = query.lte("sent_at", filters.date_to);
    }

    query = applySorting(
      query,
      filters.sort ?? { column: "created_at", ascending: false },
    );
    query = query.range(from, to);

    const { data, error, count } = await query;
    return { data, error, count };
  }, filters);
}

/**
 * Send a message
 */
export async function sendMessage(
  chatId: number,
  senderId: number,
  receiverId: number,
  messageText: string,
  mediaUrl?: string,
): Promise<ApiResponse<Message>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("messages")
      .insert({
        chat_id: chatId,
        sender_id: senderId,
        receiver_id: receiverId,
        message_text: messageText,
        media_url: mediaUrl,
        sent_at: new Date().toISOString(),
        status: "sent",
      })
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Mark message as read
 */
export async function markMessageAsRead(
  messageId: number,
): Promise<ApiResponse<Message>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("messages")
      .update({ status: "read" })
      .eq("id", messageId)
      .select()
      .single();

    return { data, error };
  });
}

/**
 * Mark all messages in chat as read
 */
export async function markChatAsRead(
  chatId: number,
): Promise<ApiResponse<number>> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return { data: null, error: new Error("User not authenticated") };
  }

  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { data, error } = await supabase
      .from("messages")
      .update({ status: "read" })
      .eq("chat_id", chatId)
      .eq("receiver_id", userId)
      .neq("status", "read")
      .select();

    return { data: data?.length || 0, error };
  });
}

/**
 * Get unread message count for user
 */
export async function getUnreadMessageCount(): Promise<number> {
  const userId = await getCurrentUserId();

  if (!userId) return 0;

  const supabase = getSupabaseClient();

  try {
    const { count } = await supabase
      .from("messages")
      .select("*", { count: "exact", head: true })
      .eq("receiver_id", userId)
      .neq("status", "read");

    return count || 0;
  } catch {
    return 0;
  }
}

/**
 * Subscribe to new messages in a chat
 */
export function subscribeToChat(
  chatId: number,
  callback: (message: Message) => void,
): () => void {
  return subscribeToTable(
    "messages",
    (payload) => {
      const newMessage = payload.new as Message;
      if (newMessage && newMessage.chat_id === chatId) {
        callback(newMessage);
      }
    },
    `chat_id=eq.${chatId}`,
  );
}

/**
 * Subscribe to all chats for current user
 */
export async function subscribeToMyChats(
  callback: (message: Message) => void,
): Promise<(() => void) | null> {
  const userId = await getCurrentUserId();

  if (!userId) return null;

  return subscribeToTable("messages", (payload) => {
    const newMessage = payload.new as Message;
    if (
      newMessage &&
      (newMessage.sender_id === userId || newMessage.receiver_id === userId)
    ) {
      callback(newMessage);
    }
  });
}

/**
 * Delete message
 */
export async function deleteMessage(
  messageId: number,
): Promise<ApiResponse<boolean>> {
  const supabase = getSupabaseClient();

  return executeQuery(async () => {
    const { error } = await supabase
      .from("messages")
      .delete()
      .eq("id", messageId);

    return { data: !error, error };
  });
}
