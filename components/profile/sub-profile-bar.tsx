"use client";

import { Pencil, Plus } from "lucide-react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { MAX_PROFILES, useSubProfile } from "@/contexts/sub-profile-context";

type SubProfileBarProps = {
  onCreateClick: () => void;
  hasMainProfile?: boolean;
  notifications?: Record<string, boolean>;
};

export function SubProfileBar({
  onCreateClick,
  hasMainProfile = true,
  notifications = {},
}: SubProfileBarProps) {
  const {
    subProfiles,
    activeSubProfileId,
    setActiveSubProfileId,
    renameSubProfile,
  } = useSubProfile();

  const totalProfiles = (hasMainProfile ? 1 : 0) + subProfiles.length;
  const atProfileLimit = totalProfiles >= MAX_PROFILES;

  const [renamingProfile, setRenamingProfile] = useState<{
    id: string;
    label: string;
  } | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  function openRenameDialog(id: string, currentLabel: string) {
    setRenamingProfile({ id, label: currentLabel });
    setRenameValue(currentLabel);
  }

  function handleRename() {
    if (!renamingProfile || !renameValue.trim()) return;
    renameSubProfile(renamingProfile.id, renameValue.trim());
    setRenamingProfile(null);
  }

  return (
    <>
      <div className="mt-6 overflow-x-auto -mx-4 px-4">
        <nav className="flex items-center gap-2 py-1 min-w-max">
          {hasMainProfile && (
            <>
              {/* Main Profile tab */}
              <span className="relative">
                <Button
                  variant={
                    activeSubProfileId === null ? "secondary" : "outline"
                  }
                  size="default"
                  className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => setActiveSubProfileId(null)}
                >
                  Main Profile
                </Button>
                {notifications.main && (
                  <span className="absolute top-2 right-2 size-2.5 rounded-full bg-primary" />
                )}
              </span>

              {/* Sub-profile tabs */}
              {subProfiles.map((sp) => (
                <div key={sp.id} className="relative">
                  <div className="flex items-center rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                    <Button
                      variant={
                        activeSubProfileId === sp.id ? "secondary" : "outline"
                      }
                      size="default"
                      className="rounded-r-none focus-visible:ring-0"
                      onClick={() => setActiveSubProfileId(sp.id)}
                    >
                      {sp.directoryLabel.length > 20 ? (
                        <span className="max-w-[20ch] overflow-hidden whitespace-nowrap block mask-[linear-gradient(to_right,black_80%,transparent)]">
                          {sp.directoryLabel}
                        </span>
                      ) : (
                        sp.directoryLabel
                      )}
                    </Button>
                    <Button
                      variant={
                        activeSubProfileId === sp.id ? "secondary" : "outline"
                      }
                      size="icon"
                      className="rounded-l-none border-l-0 focus-visible:ring-0"
                      aria-label={`Rename ${sp.directoryLabel} sub-profile`}
                      onClick={() => openRenameDialog(sp.id, sp.directoryLabel)}
                    >
                      <Pencil />
                    </Button>
                  </div>
                  {notifications[sp.id] && (
                    <span className="absolute top-2 right-12 size-2.5 rounded-full bg-primary" />
                  )}
                </div>
              ))}
            </>
          )}

          {/* Create button */}
          {!atProfileLimit && (
            <Button
              variant="outline"
              size="default"
              className="focus:ring-2 focus:ring-ring focus:ring-offset-2"
              onClick={onCreateClick}
            >
              <Plus />
              {hasMainProfile ? "Create Sub-Profile" : "Create Profile"}
            </Button>
          )}
        </nav>
      </div>

      {/* Rename dialog — rendered outside scrollable nav to avoid clipping */}
      <Dialog
        open={renamingProfile !== null}
        onOpenChange={(open) => {
          if (!open) setRenamingProfile(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Sub-Profile</DialogTitle>
            <DialogDescription>
              Enter a new name for the &ldquo;{renamingProfile?.label}&rdquo;
              sub-profile.
            </DialogDescription>
          </DialogHeader>
          <InputGroup>
            <InputGroupInput
              ref={inputRef}
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename();
              }}
              placeholder="Sub-profile name"
              autoFocus
            />
          </InputGroup>
          <p className="text-sm text-muted-foreground">
            Only the first 20 characters will be shown on the profile tab.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenamingProfile(null)}>
              Cancel
            </Button>
            <Button onClick={handleRename} disabled={!renameValue.trim()}>
              Rename
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
