"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AnnouncementContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  announcementHeight: number;
  isOnHomePage: boolean;
  setIsOnHomePage: (value: boolean) => void;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(
  undefined,
);

function setCookie(name: string, value: string) {
  if ("cookieStore" in window) {
    cookieStore.set({
      name,
      value,
      path: "/",
      expires: Date.now() + 31536000 * 1000,
      sameSite: "lax",
    });
  } else {
    // biome-ignore lint/suspicious/noDocumentCookie: fallback for browsers without Cookie Store API
    document.cookie = `${name}=${value}; path=/; max-age=31536000; SameSite=Lax`;
  }
}

export function AnnouncementProvider({
  children,
  initialDismissed = false,
}: {
  children: React.ReactNode;
  initialDismissed?: boolean;
}) {
  const [isVisible, setIsVisibleState] = useState(!initialDismissed);
  // Track whether the announcement strip is rendered on the current page
  const [isOnHomePage, setIsOnHomePage] = useState(false);

  // One-time migration: if localStorage says dismissed but no cookie exists yet,
  // set the cookie so future SSR loads are flash-free
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("announcements-dismissed");
      if (dismissed === "true") {
        setIsVisibleState(false);
        // Set cookie if it doesn't exist yet (migration from localStorage-only)
        if (!document.cookie.includes("announcements-dismissed=true")) {
          setCookie("announcements-dismissed", "true");
        }
      }
    } catch {
      // Silently fail if localStorage is unavailable (e.g., private browsing)
    }
  }, []);

  // Wrapper function that updates state, localStorage, and cookie
  function setIsVisible(visible: boolean) {
    setIsVisibleState(visible);
    const dismissed = visible ? "false" : "true";

    try {
      localStorage.setItem("announcements-dismissed", dismissed);
    } catch {
      // Silently fail if localStorage is unavailable
    }

    setCookie("announcements-dismissed", dismissed);
  }

  // Calculate announcement height based on visibility AND page context
  // 40px (h-10) when visible and on home page, 0px otherwise
  const announcementHeight = isVisible && isOnHomePage ? 40 : 0;

  const value: AnnouncementContextType = {
    isVisible,
    setIsVisible,
    announcementHeight,
    isOnHomePage,
    setIsOnHomePage,
  };

  return (
    <AnnouncementContext.Provider value={value}>
      {children}
    </AnnouncementContext.Provider>
  );
}

// Custom hook to use the announcement context
export function useAnnouncement() {
  const context = useContext(AnnouncementContext);

  if (context === undefined) {
    throw new Error(
      "useAnnouncement must be used within an AnnouncementProvider",
    );
  }

  return context;
}
