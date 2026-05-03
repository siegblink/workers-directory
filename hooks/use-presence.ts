"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

const HEARTBEAT_INTERVAL_MS = 30_000;

export function usePresence() {
  useEffect(() => {
    const supabase = createClient();
    let interval: ReturnType<typeof setInterval>;

    async function setPresence(isOnline: boolean) {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      await supabase.rpc("update_user_presence", { p_is_online: isOnline });
    }

    function handleVisibilityChange() {
      setPresence(document.visibilityState === "visible");
    }

    setPresence(true);
    interval = setInterval(() => setPresence(true), HEARTBEAT_INTERVAL_MS);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);
}
