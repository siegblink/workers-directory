"use client";

import {
  MoreVertical,
  Paperclip,
  Phone,
  Search,
  Send,
  Video,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import { formatMessageTime, timeAgo } from "@/lib/formatters";

type ConversationItem = {
  chatId: number;
  name: string;
  profession: string | null;
  avatar: string | null;
  lastMessage: string;
  lastMessageAt: string | null;
  unread: number;
  isOnline: boolean;
  otherUserId: string; // users.id of the other participant
  chatWorkerId: string; // workers.id from chats.worker_id (for URL param matching)
};

type MessageItem = {
  id: number;
  text: string;
  timestamp: string;
  isOwn: boolean;
};

export default function MessagesPage() {
  const searchParams = useSearchParams();
  const workerIdParam = searchParams.get("workerId");

  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<number | null>(null);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [messageText, setMessageText] = useState("");
  const [loadingChats, setLoadingChats] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // Load conversations on mount
  useEffect(() => {
    async function loadChats() {
      const supabase = createClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoadingChats(false);
        return;
      }

      // public.users.id is the auth UUID directly
      setCurrentUserId(user.id);

      // chats.worker_id is a FK to workers.id (not users.id), so we need
      // the current user's workers.id to filter chats where they are the worker
      const { data: myWorkerRecord } = await supabase
        .from("workers")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      const chatFilter = myWorkerRecord
        ? `customer_id.eq.${user.id},worker_id.eq.${myWorkerRecord.id}`
        : `customer_id.eq.${user.id}`;

      const { data: chats, error: chatsError } = await supabase
        .from("chats")
        .select("id, customer_id, worker_id, created_at")
        .or(chatFilter)
        .order("created_at", { ascending: false });

      if (chatsError || !chats || chats.length === 0) {
        setLoadingChats(false);
        return;
      }

      const items: ConversationItem[] = [];

      for (const chat of chats) {
        // Resolve the worker's users.id via the workers table
        const { data: workerRecord } = await supabase
          .from("workers")
          .select("user_id, profession")
          .eq("id", String(chat.worker_id))
          .maybeSingle();

        const workerUserId = workerRecord?.user_id ?? null;
        const isCurrentUserTheWorker = workerUserId === user.id;

        // otherUserId is always a users.id UUID
        const otherUserId = isCurrentUserTheWorker
          ? String(chat.customer_id)
          : (workerUserId ?? "");

        const { data: otherUser } = await supabase
          .from("users")
          .select("id, firstname, lastname, profile_pic_url")
          .eq("id", otherUserId)
          .maybeSingle();

        const { data: presence } = await supabase
          .from("user_presence")
          .select("is_online")
          .eq("user_id", otherUserId)
          .maybeSingle();

        const { data: lastMsgs } = await supabase
          .from("messages")
          .select("message_text, created_at")
          .eq("chat_id", chat.id)
          .order("created_at", { ascending: false })
          .limit(1);

        const { count: unreadCount } = await supabase
          .from("messages")
          .select("*", { count: "exact", head: true })
          .eq("chat_id", chat.id)
          .eq("receiver_id", user.id)
          .neq("status", "read");

        const lastMsg = lastMsgs?.[0];
        const name = otherUser
          ? `${otherUser.firstname} ${otherUser.lastname}`
          : "Unknown User";

        items.push({
          chatId: chat.id,
          name,
          profession: workerRecord?.profession ?? null,
          avatar: otherUser?.profile_pic_url ?? null,
          lastMessage: lastMsg?.message_text ?? "Start a conversation",
          lastMessageAt: lastMsg?.created_at ?? chat.created_at,
          unread: unreadCount ?? 0,
          isOnline: presence?.is_online ?? false,
          otherUserId,
          chatWorkerId: String(chat.worker_id),
        });
      }

      setConversations(items);

      // workerId URL param is a workers.id — match against chatWorkerId
      if (workerIdParam) {
        const match = items.find((c) => c.chatWorkerId === workerIdParam);
        setSelectedChatId(match ? match.chatId : (items[0]?.chatId ?? null));
      } else if (items.length > 0) {
        setSelectedChatId(items[0].chatId);
      }

      setLoadingChats(false);
    }

    loadChats();
  }, [workerIdParam]);

  // Load messages and subscribe to realtime when selected chat changes
  useEffect(() => {
    if (!selectedChatId || !currentUserId) return;

    let cancelled = false;
    setLoadingMessages(true);

    const supabase = createClient();

    supabase
      .from("messages")
      .select("id, message_text, created_at, sender_id")
      .eq("chat_id", selectedChatId)
      .order("created_at", { ascending: true })
      .limit(100)
      .then(({ data: msgs, error }) => {
        if (cancelled) return;
        if (!error && msgs) {
          setMessages(
            msgs.map((m) => ({
              id: m.id,
              text: m.message_text ?? "",
              timestamp: formatMessageTime(m.created_at),
              isOwn: String(m.sender_id) === currentUserId,
            })),
          );
        }
        setLoadingMessages(false);
      });

    // Mark all unread messages in this chat as read
    supabase
      .from("messages")
      .update({ status: "read" })
      .eq("chat_id", selectedChatId)
      .eq("receiver_id", currentUserId)
      .neq("status", "read")
      .then(() => {
        if (cancelled) return;
        setConversations((prev) =>
          prev.map((c) =>
            c.chatId === selectedChatId ? { ...c, unread: 0 } : c,
          ),
        );
      });

    // Supabase Realtime subscription for new messages
    const channel = supabase
      .channel(`chat-${selectedChatId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_id=eq.${selectedChatId}`,
        },
        (payload) => {
          if (cancelled) return;
          const m = payload.new as {
            id: number;
            message_text: string | null;
            created_at: string;
            sender_id: unknown;
          };
          // Skip if already added optimistically by handleSendMessage
          setMessages((prev) => {
            if (prev.some((msg) => msg.id === m.id)) return prev;
            return [
              ...prev,
              {
                id: m.id,
                text: m.message_text ?? "",
                timestamp: formatMessageTime(m.created_at),
                isOwn: String(m.sender_id) === currentUserId,
              },
            ];
          });
        },
      )
      .subscribe();

    return () => {
      cancelled = true;
      supabase.removeChannel(channel);
    };
  }, [selectedChatId, currentUserId]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [messages]);

  async function handleSendMessage() {
    if (!messageText.trim() || !selectedChatId || !currentUserId || sending)
      return;

    const text = messageText.trim();
    setMessageText("");
    setSending(true);

    const conversation = conversations.find((c) => c.chatId === selectedChatId);
    if (!conversation) {
      setSending(false);
      return;
    }

    const supabase = createClient();
    const { data: inserted } = await supabase
      .from("messages")
      .insert({
        chat_id: selectedChatId,
        sender_id: currentUserId,
        receiver_id: conversation.otherUserId,
        message_text: text,
        sent_at: new Date().toISOString(),
        status: "sent",
      })
      .select("id, created_at")
      .single();

    // Add the sent message to state immediately using the DB-assigned ID.
    // The Realtime handler will deduplicate by ID so it won't appear twice.
    if (inserted) {
      setMessages((prev) => [
        ...prev,
        {
          id: inserted.id,
          text,
          timestamp: formatMessageTime(inserted.created_at),
          isOwn: true,
        },
      ]);
    }

    // Update the conversation's last message preview
    setConversations((prev) =>
      prev.map((c) =>
        c.chatId === selectedChatId
          ? { ...c, lastMessage: text, lastMessageAt: new Date().toISOString() }
          : c,
      ),
    );

    setSending(false);
  }

  const selectedConversation = conversations.find(
    (c) => c.chatId === selectedChatId,
  );

  const filteredConversations = conversations.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="h-[calc(100vh-4rem)] bg-background flex flex-col">
      <div className="w-full max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex-1 flex flex-col min-h-0">
        <div className="flex flex-1 min-h-0">
          {/* Conversations List */}
          <div className="w-full md:w-96 bg-card border-r border-border flex flex-col">
            <div className="p-4 border-b border-border">
              <h2 className="text-xl font-bold mb-4 text-foreground">
                Messages
              </h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search conversations..."
                  className="pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="divide-y">
                {loadingChats ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="size-6" />
                  </div>
                ) : filteredConversations.length === 0 ? (
                  <div className="p-6 text-center text-muted-foreground text-sm">
                    {conversations.length === 0
                      ? "No conversations yet"
                      : "No results"}
                  </div>
                ) : (
                  filteredConversations.map((conversation) => (
                    <button
                      type="button"
                      key={conversation.chatId}
                      onClick={() => setSelectedChatId(conversation.chatId)}
                      className={`w-full p-4 flex gap-3 hover:bg-accent transition-colors ${
                        selectedChatId === conversation.chatId
                          ? "bg-accent"
                          : ""
                      }`}
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={conversation.avatar ?? undefined}
                            alt={conversation.name}
                          />
                          <AvatarFallback>
                            {conversation.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                        )}
                      </div>

                      <div className="flex-1 text-left min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm truncate text-foreground">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-muted-foreground">
                            {conversation.lastMessageAt
                              ? timeAgo(conversation.lastMessageAt)
                              : ""}
                          </span>
                        </div>
                        {conversation.profession && (
                          <p className="text-sm text-muted-foreground mb-1">
                            {conversation.profession}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage}
                        </p>
                      </div>

                      {conversation.unread > 0 && (
                        <Badge className="h-5 min-w-5 flex items-center justify-center rounded-full">
                          {conversation.unread}
                        </Badge>
                      )}
                    </button>
                  ))
                )}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area — desktop */}
          {selectedConversation ? (
            <div className="hidden md:flex flex-1 flex-col bg-card min-w-0">
              {/* Chat Header */}
              <div className="p-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage
                        src={selectedConversation.avatar ?? undefined}
                        alt={selectedConversation.name}
                      />
                      <AvatarFallback>
                        {selectedConversation.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-card" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {selectedConversation.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedConversation.isOnline ? "Online" : "Offline"}
                      {selectedConversation.profession &&
                        ` • ${selectedConversation.profession}`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="w-5 h-5" />
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="w-5 h-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Profile</DropdownMenuItem>
                      <DropdownMenuItem>Mute Conversation</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete Conversation
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Messages */}
              <div
                ref={messagesContainerRef}
                className="flex-1 overflow-y-auto min-h-0"
              >
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-12">
                    <Spinner className="size-6" />
                  </div>
                ) : (
                  <div className="p-4 space-y-4">
                    {messages.length === 0 ? (
                      <p className="text-center text-muted-foreground text-sm py-8">
                        No messages yet. Say hello!
                      </p>
                    ) : (
                      messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex w-full ${message.isOwn ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[70%] min-w-0 ${message.isOwn ? "order-2" : "order-1"}`}
                          >
                            <Card
                              className={`p-3 ${
                                message.isOwn
                                  ? "bg-blue-600 dark:bg-blue-700 text-white"
                                  : "bg-secondary text-foreground"
                              } shadow-none border-0`}
                            >
                              <p className="text-sm leading-relaxed">
                                {message.text}
                              </p>
                            </Card>
                            <p
                              className={`text-xs text-muted-foreground mt-1 ${message.isOwn ? "text-right" : "text-left"}`}
                            >
                              {message.timestamp}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-border">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    className="flex-1"
                    disabled={sending}
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageText.trim() || sending}
                  >
                    {sending ? <Spinner /> : <Send className="w-5 h-5" />}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="hidden md:flex flex-1 items-center justify-center bg-card">
              <p className="text-muted-foreground">
                {loadingChats
                  ? "Loading conversations..."
                  : "Select a conversation to start messaging"}
              </p>
            </div>
          )}

          {/* Mobile: placeholder */}
          <div className="md:hidden flex-1 flex items-center justify-center bg-background">
            <p className="text-muted-foreground">
              Select a conversation to start messaging
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
