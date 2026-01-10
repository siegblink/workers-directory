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

    // Get current location from browser geolocation API
    const getCurrentLocation = (forceRefresh = false): Promise<{ lat: number; lon: number } | null> => {
      return new Promise((resolve) => {
        if (!navigator.geolocation) {
          console.warn("Geolocation not supported");
          resolve(null);
          return;
        }

        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve({
              lat: position.coords.latitude,
              lon: position.coords.longitude,
            });
          },
          (error) => {
            console.warn("Error getting location:", error.message);
            resolve(null);
          },
          {
            enableHighAccuracy: false, // Use network location for faster response
            timeout: 5000,
            maximumAge: forceRefresh ? 0 : 30000, // Force fresh GPS on initial mount, cache for heartbeats
          }
        );
      });
    };

    // Set user as online immediately with GPS location
    const setOnline = async () => {
      try {
        const location = await getCurrentLocation(true); // Force fresh GPS on mount
        const presenceData: any = {
          user_id: userId,
          is_online: true,
          last_seen: new Date().toISOString(),
        };

        // Add GPS location data if available
        if (location) {
          presenceData.latitude = location.lat;
          presenceData.longitude = location.lon;
          presenceData.location_updated_at = new Date().toISOString();
          console.log(`[usePresence] Updated GPS for user ${userId}:`, {
            lat: location.lat,
            lon: location.lon,
          });
        } else {
          console.warn(`[usePresence] No GPS location available for user ${userId}`);
        }

        // Use upsert to insert or update in one operation
        const { error } = await supabase
          .from("user_presence")
          .upsert(presenceData, {
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

    // Send heartbeat to keep user marked as online with updated GPS location
    const sendHeartbeat = async () => {
      try {
        const location = await getCurrentLocation();
        const presenceData: any = {
          user_id: userId,
          is_online: true,
          last_seen: new Date().toISOString(),
        };

        // Add GPS location data if available
        if (location) {
          presenceData.latitude = location.lat;
          presenceData.longitude = location.lon;
          presenceData.location_updated_at = new Date().toISOString();
        }

        await supabase
          .from("user_presence")
          .upsert(presenceData, {
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
