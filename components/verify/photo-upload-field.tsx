"use client";

import { Upload, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface PhotoUploadFieldProps {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  value: File | null | undefined;
  onChange: (file: File | null | undefined) => void;
  error?: string;
  disabled?: boolean;
  maxSize?: number; // in MB, default 5MB
}

/**
 * PhotoUploadField Component
 * Reusable file upload component with image preview functionality
 * Based on the pattern from gallery-add-form.tsx
 */
export function PhotoUploadField({
  id,
  label,
  description,
  icon,
  value,
  onChange,
  error,
  disabled = false,
  maxSize = 5,
}: PhotoUploadFieldProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Create preview when value changes
  useEffect(() => {
    if (!value) {
      setPreview(null);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setPreview(event.target?.result as string);
    };
    reader.readAsDataURL(value);
  }, [value]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      // Validation will be handled by Zod schema
      onChange(file);
      return;
    }

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      // Validation will be handled by Zod schema
      onChange(file);
      return;
    }

    // Update form value
    onChange(file);
  };

  const handleClear = () => {
    setPreview(null);
    onChange(undefined);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    if (!disabled) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full">
      {!preview && (
        <button
          type="button"
          aria-label={label}
          className={cn(
            "relative w-full rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors",
            !disabled &&
              "cursor-pointer hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            disabled && "opacity-50 cursor-not-allowed",
            error && "border-destructive/50",
          )}
          onClick={handleClick}
          disabled={disabled}
        >
          <div className="flex flex-col items-center gap-2">
            <div className="text-muted-foreground">{icon}</div>
            <p className="text-sm font-medium">{label}</p>
            <p className="text-xs text-muted-foreground">{description}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2"
              disabled={disabled}
              onClick={(e) => {
                e.stopPropagation();
                handleClick();
              }}
            >
              <Upload className="h-4 w-4 mr-2" />
              Choose File
            </Button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
            id={id}
          />
        </button>
      )}

      {preview && (
        <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-primary">
          <Image
            src={preview}
            alt={label}
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-center h-full gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={handleClick}
                disabled={disabled}
              >
                <Upload className="h-4 w-4 mr-2" />
                Change
              </Button>
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
              >
                <X className="h-4 w-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
            disabled={disabled}
            id={id}
          />
        </div>
      )}

      {error && <p className="text-sm text-destructive mt-2">{error}</p>}
    </div>
  );
}
