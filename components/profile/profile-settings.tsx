"use client";

import { AlertTriangle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { useSubProfile } from "@/contexts/sub-profile-context";
import type { SubProfile } from "@/lib/types/sub-profile";

type ProfileSettingsProps = {
  subProfile: SubProfile;
};

export function ProfileSettings({ subProfile }: ProfileSettingsProps) {
  const { renameSubProfile, removeSubProfile } = useSubProfile();
  const router = useRouter();

  const [label, setLabel] = useState(subProfile.directoryLabel);
  const [isSaving, setIsSaving] = useState(false);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteStep, setDeleteStep] = useState<1 | 2>(1);
  const [confirmText, setConfirmText] = useState("");

  const isLabelChanged =
    label.trim() !== "" && label.trim() !== subProfile.directoryLabel;

  async function handleSaveLabel() {
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 300));
    renameSubProfile(subProfile.id, label.trim());
    setIsSaving(false);
    toast.success("Sub-profile label updated");
  }

  function openDeleteDialog() {
    setDeleteStep(1);
    setConfirmText("");
    setDeleteDialogOpen(true);
  }

  function handleConfirmDelete() {
    removeSubProfile(subProfile.id);
    setDeleteDialogOpen(false);
    router.push("/profile");
    toast.success(
      `Sub-profile "${subProfile.directoryLabel}" has been deleted`,
    );
  }

  return (
    <div className="space-y-6">
      {/* Rename Section */}
      <Card>
        <CardHeader>
          <CardTitle>Sub-Profile Label</CardTitle>
          <CardDescription>
            This label identifies the sub-profile in your profile tabs. Only the
            first 20 characters are shown on the tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-3">
            <Field className="flex-1">
              <FieldLabel htmlFor="sub-profile-label">Label</FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="sub-profile-label"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Sub-profile name"
                  disabled={isSaving}
                />
              </InputGroup>
            </Field>
            <Button
              onClick={handleSaveLabel}
              disabled={!isLabelChanged || isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">Delete this sub-profile</p>
              <p className="text-sm text-muted-foreground">
                Once deleted, this sub-profile and all its data cannot be
                recovered.
              </p>
            </div>
            <Button variant="destructive" onClick={openDeleteDialog}>
              Delete sub-profile
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          {deleteStep === 1 ? (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-destructive" />
                  Delete sub-profile
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3 pt-2">
                    <p>
                      This will permanently delete the{" "}
                      <strong>{subProfile.directoryLabel}</strong> sub-profile.
                    </p>
                    <p>
                      All associated data (bio, skills, availability, portfolio,
                      reviews, bookings, messages, invoices) will be lost.
                    </p>
                    <p className="font-medium text-destructive">
                      This action cannot be undone.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button variant="destructive" onClick={() => setDeleteStep(2)}>
                  I want to delete this sub-profile
                </Button>
              </DialogFooter>
            </>
          ) : (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <AlertTriangle className="size-5 text-destructive" />
                  Confirm deletion
                </DialogTitle>
                <DialogDescription asChild>
                  <div className="space-y-3 pt-2">
                    <p>
                      To confirm, type{" "}
                      <strong>{subProfile.directoryLabel}</strong> in the box
                      below.
                    </p>
                  </div>
                </DialogDescription>
              </DialogHeader>
              <InputGroup>
                <InputGroupInput
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder={subProfile.directoryLabel}
                  autoFocus
                />
              </InputGroup>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setDeleteDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  disabled={confirmText !== subProfile.directoryLabel}
                  onClick={handleConfirmDelete}
                >
                  Confirm delete
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
