"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Images, Pencil, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
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

export interface GalleryItem {
  id: number;
  image: string;
  title: string;
  description: string;
  price?: number;
}

export interface GalleryItemsListProps {
  items: GalleryItem[];
  onItemUpdate: (index: number, data: GalleryItemFormValues) => Promise<void>;
  onItemDelete: (index: number) => void;
  disabled?: boolean;
  onEditingChange?: (isEditing: boolean) => void;
}

export function GalleryItemsList({
  items,
  onItemUpdate,
  onItemDelete,
  disabled = false,
  onEditingChange,
}: GalleryItemsListProps) {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<GalleryItemFormValues>({
    resolver: zodResolver(galleryItemSchema),
    defaultValues: {
      title: "",
      description: "",
      price: undefined,
    },
  });

  const handleEditItem = (index: number) => {
    const item = items[index];
    setEditingIndex(index);
    form.reset({
      title: item.title,
      description: item.description,
      price: item.price,
    });
    onEditingChange?.(true);
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    form.reset({ title: "", description: "", price: undefined });
    onEditingChange?.(false);
  };

  const handleDeleteItem = (index: number) => {
    onItemDelete(index);
    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset({ title: "", description: "", price: undefined });
      onEditingChange?.(false);
    }
  };

  const handleUpdateItem = form.handleSubmit(async (values) => {
    if (editingIndex !== null) {
      await onItemUpdate(editingIndex, values);
      setEditingIndex(null);
      form.reset({ title: "", description: "", price: undefined });
      onEditingChange?.(false);
    }
  });

  return (
    <div className="space-y-6 min-h-[400px]">
      {items.map((item, index) => (
        <Card
          key={item.id}
          className={`overflow-hidden transition-all ${
            editingIndex === index
              ? "ring-2 ring-primary"
              : "hover:border-muted-foreground/30"
          }`}
        >
          <CardContent className="pr-4 pl-4">
            {editingIndex === index ? (
              // Edit mode
              <form onSubmit={handleUpdateItem}>
                <div className="flex gap-4 mb-4">
                  <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-muted-foreground mb-2">
                      Editing item
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Image cannot be changed. Delete and re-add to use a
                      different image.
                    </p>
                  </div>
                </div>

                <FieldGroup>
                  <Controller
                    control={form.control}
                    name="title"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor={`title-${index}`}>
                          Title
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`title-${index}`}
                            placeholder="Project title"
                            {...field}
                            disabled={disabled}
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
                        <FieldLabel htmlFor={`description-${index}`}>
                          Description
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupTextarea
                            id={`description-${index}`}
                            rows={3}
                            placeholder="Describe this project..."
                            {...field}
                            disabled={disabled}
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
                        <FieldLabel htmlFor={`price-${index}`}>
                          Price (optional)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupInput
                            id={`price-${index}`}
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
                            disabled={disabled}
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
                      onClick={handleCancelEdit}
                      disabled={disabled}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      variant="secondary"
                      size="sm"
                      disabled={disabled}
                    >
                      Update Item
                    </Button>
                  </div>
                </FieldGroup>
              </form>
            ) : (
              // Display mode
              <div className="flex gap-4">
                <div className="relative w-32 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                    {item.description}
                  </p>
                  {item.price && (
                    <p className="text-sm font-medium text-primary mt-2">
                      ${item.price.toLocaleString()}
                    </p>
                  )}
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8"
                    onClick={() => handleEditItem(index)}
                    disabled={disabled}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="h-8 w-8 text-destructive hover:text-destructive"
                    onClick={() => handleDeleteItem(index)}
                    disabled={disabled}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {/* Empty State */}
      {items.length === 0 && (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Images className="h-6 w-6" />
            </EmptyMedia>
            <EmptyTitle>No Gallery Items Yet</EmptyTitle>
            <EmptyDescription>
              Add your first item using the form on the right to start building
              your portfolio.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
