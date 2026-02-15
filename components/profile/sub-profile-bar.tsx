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
import { useSubProfile } from "@/contexts/sub-profile-context";

type SubProfileBarProps = {
  onCreateClick: () => void;
  hasMainProfile?: boolean;
};

export function SubProfileBar({
  onCreateClick,
  hasMainProfile = true,
}: SubProfileBarProps) {
  const {
    subProfiles,
    activeSubProfileId,
    setActiveSubProfileId,
    renameSubProfile,
  } = useSubProfile();

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
        <nav className="flex items-center gap-2 pb-2 min-w-max">
          {hasMainProfile && (
            <>
              {/* Main Profile tab */}
              <Button
                variant={activeSubProfileId === null ? "secondary" : "outline"}
                size="sm"
                onClick={() => setActiveSubProfileId(null)}
              >
                Main Profile
              </Button>

              {/* Sub-profile tabs */}
              {subProfiles.map((sp) => (
                <div key={sp.id} className="flex items-center">
                  <Button
                    variant={
                      activeSubProfileId === sp.id ? "secondary" : "outline"
                    }
                    size="sm"
                    className="rounded-r-none"
                    onClick={() => setActiveSubProfileId(sp.id)}
                  >
                    {sp.directoryLabel}
                  </Button>
                  <Button
                    variant={
                      activeSubProfileId === sp.id ? "secondary" : "outline"
                    }
                    size="icon-sm"
                    className="rounded-l-none border-l-0"
                    aria-label={`Rename ${sp.directoryLabel} sub-profile`}
                    onClick={() => openRenameDialog(sp.id, sp.directoryLabel)}
                  >
                    <Pencil />
                  </Button>
                </div>
              ))}
            </>
          )}

          {/* Create button */}
          <Button variant="outline" size="sm" onClick={onCreateClick}>
            <Plus />
            {hasMainProfile ? "Create Sub-Profile" : "Create Profile"}
          </Button>
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
