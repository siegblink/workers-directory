import { useEffect, useRef } from "react";
import { createClient } from "@/lib/supabase/client";

const HEARTBEAT_INTERVAL = 30000; // 30 seconds
const OFFLINE_THRESHOLD = 60000; // 1 minute - consider offline if no heartbeat

/**
 * Hook to manage user online/offline presence
 * Updates user_presence table with heartbeat and handles cleanup
 */
export function usePresence(userId: string | undefined) {
  const intervalRef = useRef<NodeJS.Timeout>();
  const supabase = createClient();

  useEffect(() => {
    if (!userId) return;

    // Set user as online immediately
    const setOnline = async () => {
      try {
        // Use upsert to insert or update in one operation
        const { error } = await supabase
          .from("user_presence")
          .upsert({
            user_id: userId,
            is_online: true,
            last_seen: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });

        if (error) {
          console.error("Error setting user online:", error);
        }
      } catch (error) {
        console.error("Error setting user online:", error);
      }
    };

    // Send heartbeat to keep user marked as online
    const sendHeartbeat = async () => {
      try {
        await supabase
          .from("user_presence")
          .upsert({
            user_id: userId,
            is_online: true,
            last_seen: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });
      } catch (error) {
        console.error("Error sending heartbeat:", error);
      }
    };

    // Set user as offline
    const setOffline = async () => {
      try {
        await supabase
          .from("user_presence")
          .upsert({
            user_id: userId,
            is_online: false,
            last_seen: new Date().toISOString(),
          }, {
            onConflict: 'user_id',
            ignoreDuplicates: false
          });
      } catch (error) {
        console.error("Error setting user offline:", error);
      }
    };

    // Set online immediately
    setOnline();

    // Start heartbeat interval
    intervalRef.current = setInterval(sendHeartbeat, HEARTBEAT_INTERVAL);

    // Handle page visibility changes
    const handleVisibilityChange = () => {
      if (document.hidden) {
        setOffline();
      } else {
        setOnline();
      }
    };

    // Handle page unload (browser close, navigation away)
    const handleBeforeUnload = () => {
      // Use sendBeacon for reliable delivery even during page unload
      navigator.sendBeacon(
        "/api/presence/offline",
        JSON.stringify({ userId }),
      );
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      setOffline();
    };
  }, [userId, supabase]);
}

/**
 * Hook to subscribe to real-time presence updates for specific users
 */
export function usePresenceSubscription(
  userIds: string[],
  onPresenceUpdate: (userId: string, isOnline: boolean) => void,
) {
  const supabase = createClient();

  useEffect(() => {
    if (!userIds.length) return;

    // Subscribe to presence changes
    const channel = supabase
      .channel("user-presence")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_presence",
          filter: `user_id=in.(${userIds.join(",")})`,
        },
        (payload) => {
          const presence = payload.new as {
            user_id: string;
            is_online: boolean;
            last_seen: string;
          };

          // Check if last_seen is recent (within offline threshold)
          const lastSeen = new Date(presence.last_seen).getTime();
          const now = Date.now();
          const isActuallyOnline =
            presence.is_online && now - lastSeen < OFFLINE_THRESHOLD;

          onPresenceUpdate(presence.user_id, isActuallyOnline);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userIds, onPresenceUpdate, supabase]);
}
