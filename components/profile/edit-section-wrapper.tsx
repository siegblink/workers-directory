"use client";

import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";

type EditSectionWrapperProps = {
  title: string;
  label?: string;
  isEditing: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  isSaving: boolean;
  children: React.ReactNode;
};

export function EditSectionWrapper({
  title,
  label,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  isSaving,
  children,
}: EditSectionWrapperProps) {
  return (
    <Card className="mb-6">
      <CardContent>
        <div className="flex items-start justify-between mb-4">
          <div className="flex flex-col gap-6">
            {label && (
              <p className="leading-relaxed text-muted-foreground">{label}</p>
            )}
            <h3 className="text-xl font-semibold text-foreground">{title}</h3>
          </div>
          {isEditing ? (
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={onCancel}
                disabled={isSaving}
              >
                Cancel
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={onSave}
                disabled={isSaving}
              >
                {isSaving ? (
                  <>
                    <Spinner className="mr-2" />
                    Saving...
                  </>
                ) : (
                  "Save"
                )}
              </Button>
            </div>
          ) : (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Pencil />
              Edit
            </Button>
          )}
        </div>
        {children}
      </CardContent>
    </Card>
  );
}
