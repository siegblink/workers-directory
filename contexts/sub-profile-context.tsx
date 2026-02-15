"use client";

import type React from "react";
import { createContext, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import { generateSubProfileMockData } from "@/lib/mock-data/sub-profile-mock";
import type { DirectoryId, SubProfile } from "@/lib/types/sub-profile";

type PendingDirectory = {
  id: DirectoryId;
  label: string;
} | null;

type SubProfileContextType = {
  subProfiles: SubProfile[];
  activeSubProfileId: string | null;
  setActiveSubProfileId: (id: string | null) => void;
  addSubProfile: (
    directoryId: DirectoryId,
    directoryLabel: string,
  ) => SubProfile;
  removeSubProfile: (id: string) => void;
  renameSubProfile: (id: string, newLabel: string) => void;
  pendingDirectory: PendingDirectory;
  setPendingDirectory: (dir: PendingDirectory) => void;
};

const SubProfileContext = createContext<SubProfileContextType | undefined>(
  undefined,
);

const STORAGE_KEY = "sub-profiles";
const ACTIVE_KEY = "sub-profiles-active";

export function SubProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [subProfiles, setSubProfiles] = useState<SubProfile[]>([]);
  const [activeSubProfileId, setActiveSubProfileIdState] = useState<
    string | null
  >(null);
  const [pendingDirectory, setPendingDirectory] =
    useState<PendingDirectory>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as SubProfile[];
        setSubProfiles(parsed);
      }
      const storedActive = localStorage.getItem(ACTIVE_KEY);
      if (storedActive) {
        setActiveSubProfileIdState(storedActive);
      }
    } catch {
      // Silently fail if localStorage is unavailable
    }
    setIsHydrated(true);
  }, []);

  function persistProfiles(profiles: SubProfile[]) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
    } catch {
      // Silently fail
    }
  }

  function setActiveSubProfileId(id: string | null) {
    setActiveSubProfileIdState(id);
    try {
      if (id) {
        localStorage.setItem(ACTIVE_KEY, id);
      } else {
        localStorage.removeItem(ACTIVE_KEY);
      }
    } catch {
      // Silently fail
    }

    if (id) {
      const profile = subProfiles.find((p) => p.id === id);
      if (profile) {
        toast(`Switched to ${profile.directoryLabel} sub-profile`);
      }
    } else {
      toast("Switched to Main Profile");
    }
  }

  function addSubProfile(
    directoryId: DirectoryId,
    directoryLabel: string,
  ): SubProfile {
    const newProfile = generateSubProfileMockData(directoryId, directoryLabel);
    const updated = [...subProfiles, newProfile];
    setSubProfiles(updated);
    persistProfiles(updated);
    setActiveSubProfileId(newProfile.id);
    setPendingDirectory(null);
    return newProfile;
  }

  function removeSubProfile(id: string) {
    const updated = subProfiles.filter((p) => p.id !== id);
    setSubProfiles(updated);
    persistProfiles(updated);
    if (activeSubProfileId === id) {
      setActiveSubProfileId(null);
    }
  }

  function renameSubProfile(id: string, newLabel: string) {
    const updated = subProfiles.map((p) =>
      p.id === id ? { ...p, directoryLabel: newLabel } : p,
    );
    setSubProfiles(updated);
    persistProfiles(updated);
  }

  const value: SubProfileContextType = {
    subProfiles: isHydrated ? subProfiles : [],
    activeSubProfileId: isHydrated ? activeSubProfileId : null,
    setActiveSubProfileId,
    addSubProfile,
    removeSubProfile,
    renameSubProfile,
    pendingDirectory,
    setPendingDirectory,
  };

  return (
    <SubProfileContext.Provider value={value}>
      {children}
    </SubProfileContext.Provider>
  );
}

export function useSubProfile() {
  const context = useContext(SubProfileContext);

  if (context === undefined) {
    throw new Error("useSubProfile must be used within a SubProfileProvider");
  }

  return context;
}
