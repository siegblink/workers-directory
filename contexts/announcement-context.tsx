"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";

interface AnnouncementContextType {
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  announcementHeight: number;
}

const AnnouncementContext = createContext<AnnouncementContextType | undefined>(
  undefined,
);

export function AnnouncementProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Optimistic initial state (show by default)
  // This prevents layout shift on initial render
  const [isVisible, setIsVisibleState] = useState(true);

  // Sync with localStorage on mount
  useEffect(() => {
    try {
      const dismissed = localStorage.getItem("announcements-dismissed");
      if (dismissed === "true") {
        setIsVisibleState(false);
      }
    } catch {
      // Silently fail if localStorage is unavailable (e.g., private browsing)
      // Component will show by default
    }
  }, []);

  // Wrapper function that updates both state and localStorage
  function setIsVisible(visible: boolean) {
    setIsVisibleState(visible);
    try {
      localStorage.setItem(
        "announcements-dismissed",
        visible ? "false" : "true",
      );
    } catch {
      // Silently fail if localStorage is unavailable
    }
  }

  // Calculate announcement height based on visibility
  // 40px (h-10) when visible, 0px when hidden
  const announcementHeight = isVisible ? 40 : 0;

  const value: AnnouncementContextType = {
    isVisible,
    setIsVisible,
    announcementHeight,
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
