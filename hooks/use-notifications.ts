"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export type AppNotification = {
  id: string;
  title: string;
  message: string | null;
  type: string;
  status: string;
  link: string | null;
  created_at: string;
};

export function useNotifications(userId: string | null) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  const unreadCount = notifications.filter((n) => n.status === "delivered")
    .length;

  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();

    async function fetchInitial() {
      const { data } = await supabase
        .from("notifications")
        .select("id, title, message, type, status, link, created_at")
        .eq("user_id", userId!)
        .order("created_at", { ascending: false })
        .limit(20);
      if (data) setNotifications(data as AppNotification[]);
    }

    fetchInitial();

    // Realtime: prepend new notifications as they arrive
    const channel = supabase
      .channel(`notifications:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          setNotifications((prev) => [
            payload.new as AppNotification,
            ...prev,
          ]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function markRead(id: string) {
    const supabase = createClient();
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .eq("id", id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status: "read" } : n)),
    );
  }

  async function markAllRead() {
    if (unreadCount === 0) return;
    const supabase = createClient();
    const unreadIds = notifications
      .filter((n) => n.status === "delivered")
      .map((n) => n.id);
    await supabase
      .from("notifications")
      .update({ status: "read" })
      .in("id", unreadIds);
    setNotifications((prev) => prev.map((n) => ({ ...n, status: "read" })));
  }

  return { notifications, unreadCount, markRead, markAllRead };
}
