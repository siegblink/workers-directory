"use client";

import { useRouter } from "next/navigation";
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
};

export function DirectorySelectionDialog({
  open,
  onOpenChange,
}: DirectorySelectionDialogProps) {
  const { setPendingDirectory } = useSubProfile();
  const router = useRouter();

  function handleSelect(directoryId: string, directoryLabel: string) {
    setPendingDirectory({
      id: directoryId as DirectoryId,
      label: directoryLabel,
    });
    onOpenChange(false);
    router.push(`/become-worker?from=sub-profile&directory=${directoryId}`);
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
              className="h-auto flex flex-col items-center gap-2 p-4 text-center"
              onClick={() => handleSelect(dir.id, dir.label)}
            >
              <div
                className={`size-10 rounded-lg flex items-center justify-center ${dir.bgColor}`}
              >
                <dir.icon className={`size-5 ${dir.iconColor}`} />
              </div>
              <span className="font-medium text-sm">{dir.label}</span>
              {dir.description && (
                <span className="text-xs text-muted-foreground truncate w-full">
                  {dir.description}
                </span>
              )}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
