"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ImagePlus, Pencil, Plus, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import {
  type GalleryItemFormValues,
  galleryItemSchema,
} from "@/lib/schemas/profile";

export interface GalleryAddFormProps {
  onItemAdd: (
    data: GalleryItemFormValues,
    imagePreview: string,
  ) => Promise<void>;
  disabled?: boolean;
  disabledMessage?: string;
}

export function GalleryAddForm({
  onItemAdd,
  disabled = false,
  disabledMessage = "Form is disabled",
}: GalleryAddFormProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
    },
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      setImagePreview(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleCancel = () => {
    setImagePreview(null);
    form.reset({ title: "", description: "", price: undefined });
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = form.handleSubmit(async (values) => {
    if (imagePreview) {
      await onItemAdd(values, imagePreview);
      setImagePreview(null);
      form.reset({ title: "", description: "", price: undefined });
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  });

  return (
    <Card className="border bg-muted/30">
      <CardContent>
        {/* Form Header */}
        <div className="flex items-center mb-4 pb-2 border-b">
          <h2 className="text-lg font-semibold">Add New Item</h2>
        </div>

        {disabled ? (
          // Disabled state when editing
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Pencil className="h-6 w-6" />
              </EmptyMedia>
              <EmptyTitle>Editing in Progress</EmptyTitle>
              <EmptyDescription>{disabledMessage}</EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          // Add New Form
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              {!imagePreview ? (
                <>
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <ImagePlus className="h-6 w-6" />
                      </EmptyMedia>
                      <EmptyTitle>Add Gallery Image</EmptyTitle>
                      <EmptyDescription>
                        Select an image to showcase your work. JPG, PNG or GIF.
                        Max 5MB.
                      </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                      <Button
                        size="sm"
                        type="button"
                        variant="outline"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Plus />
                        Choose Image
                      </Button>
                    </EmptyContent>
                  </Empty>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </>
              ) : (
                <>
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-7 w-7"
                      onClick={() => setImagePreview(null)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="new-title">Title</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="new-title"
                            placeholder="Project title"
                            {...field}
                            disabled={form.formState.isSubmitting}
                            aria-invalid={!!fieldState.error}
                          />
                        </InputGroup>
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="new-description">
                          Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            id="new-description"
                            rows={3}
                            placeholder="Describe this project..."
                            {...field}
                            disabled={form.formState.isSubmitting}
                            aria-invalid={!!fieldState.error}
                          />
                        </InputGroup>
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  <Controller
                    control={form.control}
                    name="price"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="new-price">
                          Price (optional)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id="new-price"
                            type="number"
                            min={0}
                            placeholder="0"
                            value={field.value ?? ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              field.onChange(
                                val === "" ? undefined : Number(val),
                              );
                            }}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            disabled={form.formState.isSubmitting}
                            aria-invalid={!!fieldState.error}
                          />
                        </InputGroup>
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  <div className="flex gap-2 pt-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleCancel}
                      disabled={form.formState.isSubmitting}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      disabled={form.formState.isSubmitting}
                    >
                      Add Item
                    </Button>
                  </div>
                </>
              )}
            </FieldGroup>
          </form>
        )}
      </CardContent>
    </Card>
  );
}
