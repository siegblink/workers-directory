"use client";

import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSubProfile } from "@/contexts/sub-profile-context";
import { directories } from "@/lib/constants/directories";
import type { DirectoryId } from "@/lib/types/sub-profile";

type DirectorySelectionDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  profileType?: "main" | "sub";
};

export function DirectorySelectionDialog({
  open,
  onOpenChange,
  profileType = "sub",
}: DirectorySelectionDialogProps) {
  const { setPendingDirectory, setPendingProfileType } = useSubProfile();
  const router = useRouter();

  function handleSelect(directoryId: string, directoryLabel: string) {
    setPendingDirectory({
      id: directoryId as DirectoryId,
      label: directoryLabel,
    });
    setPendingProfileType(profileType);
    onOpenChange(false);
    const from = profileType === "main" ? "main-profile" : "sub-profile";
    router.push(`/become-worker?from=${from}&directory=${directoryId}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Choose a Directory</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          {directories.map((dir) => (
            <Button
              key={dir.id}
              variant="outline"
              className={`h-auto flex flex-col items-center gap-2 p-4 text-center ${dir.isComingSoon ? "opacity-50 cursor-not-allowed" : ""}`}
              onClick={() => handleSelect(dir.id, dir.label)}
              disabled={dir.isComingSoon}
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center ${dir.bgColor}`}
              >
                <dir.icon className={`size-5 ${dir.iconColor}`} />
              </div>
              <span className="font-medium text-sm">{dir.label}</span>
              {dir.isComingSoon ? (
                <Badge variant="secondary" className="text-xs">
                  Coming Soon
                </Badge>
              ) : (
                dir.description && (
                  <span className="text-xs text-muted-foreground truncate w-full">
                    {dir.description}
                  </span>
                )
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
