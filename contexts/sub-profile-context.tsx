"use client";

import type React from "react";
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { toast } from "sonner";
import {
  deleteSubProfile,
  getMySubProfiles,
  updateSubProfile,
} from "@/lib/database/queries/sub-profiles";
import type { SubProfile } from "@/lib/database/types";
import type { DirectoryId } from "@/lib/types/sub-profile";

type PendingDirectory = {
  id: DirectoryId;
  label: string;
} | null;

type PendingProfileType = "main" | "sub";

type SubProfileContextType = {
  subProfiles: SubProfile[];
  activeSubProfileId: string | null;
  setActiveSubProfileId: (id: string | null) => void;
  renameSubProfile: (id: string, newLabel: string) => Promise<void>;
  removeSubProfile: (id: string) => Promise<void>;
  refreshSubProfiles: () => Promise<void>;
  pendingDirectory: PendingDirectory;
  setPendingDirectory: (dir: PendingDirectory) => void;
  pendingProfileType: PendingProfileType;
  setPendingProfileType: (type: PendingProfileType) => void;
};

const SubProfileContext = createContext<SubProfileContextType | undefined>(
  undefined,
);

export const MAX_PROFILES = 20;

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
  const [pendingProfileType, setPendingProfileType] =
    useState<PendingProfileType>("sub");

  const refreshSubProfiles = useCallback(async () => {
    const result = await getMySubProfiles();
    setSubProfiles(result.data ?? []);
  }, []);

  useEffect(() => {
    refreshSubProfiles();
  }, [refreshSubProfiles]);

  function setActiveSubProfileId(id: string | null) {
    setActiveSubProfileIdState(id);
    if (id) {
      const profile = subProfiles.find((p) => p.id === id);
      if (profile) {
        const label =
          profile.label.length > 20
            ? `${profile.label.slice(0, 20)}…`
            : profile.label;
        toast(`Switched to ${label} sub-profile`);
      }
    } else {
      toast("Switched to Main Profile");
    }
  }

  async function renameSubProfile(id: string, newLabel: string) {
    const result = await updateSubProfile(id, { label: newLabel });
    if (!result.error) {
      setSubProfiles((prev) =>
        prev.map((p) => (p.id === id ? { ...p, label: newLabel } : p)),
      );
    }
  }

  async function removeSubProfile(id: string) {
    const result = await deleteSubProfile(id);
    if (!result.error) {
      setSubProfiles((prev) => prev.filter((p) => p.id !== id));
      if (activeSubProfileId === id) {
        setActiveSubProfileIdState(null);
      }
    }
  }

  const value: SubProfileContextType = {
    subProfiles,
    activeSubProfileId,
    setActiveSubProfileId,
    renameSubProfile,
    removeSubProfile,
    refreshSubProfiles,
    pendingDirectory,
    setPendingDirectory,
    pendingProfileType,
    setPendingProfileType,
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
