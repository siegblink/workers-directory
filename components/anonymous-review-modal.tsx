"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Star } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";

const anonymousReviewSchema = z.object({
  rating: z.number().min(1, { message: "Please select a rating" }),
  comment: z
    .string()
    .min(10, { message: "Review must be at least 10 characters" })
    .max(500, { message: "Review must be less than 500 characters" }),
  isAnonymous: z.boolean(),
});

type AnonymousReviewFormValues = z.infer<typeof anonymousReviewSchema>;

interface AnonymousReviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workerId: number;
  workerName: string;
}

export function AnonymousReviewModal({
  open,
  onOpenChange,
  workerId,
  workerName,
}: AnonymousReviewModalProps) {
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const form = useForm<AnonymousReviewFormValues>({
    resolver: zodResolver(anonymousReviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
      isAnonymous: true,
    },
  });

  const commentValue = form.watch("comment");
  const characterCount = commentValue.length;

  const onSubmit = async (values: AnonymousReviewFormValues) => {
    setError(null);

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500));

      // TODO: Replace with actual API call
      console.log("Review submitted:", {
        workerId,
        ...values,
      });

      // Show success message
      setShowSuccess(true);

      // Auto-close modal after 2 seconds
      setTimeout(() => {
        setShowSuccess(false);
        onOpenChange(false);
        form.reset();
      }, 2000);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while submitting your review",
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Share Your Feedback</DialogTitle>
          <DialogDescription>
            Help others by sharing your experience with {workerName}
          </DialogDescription>
        </DialogHeader>

        {showSuccess ? (
          <div className="py-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="rounded-full bg-green-100 p-3">
                <Star className="h-8 w-8 fill-green-600 text-green-600" />
              </div>
            </div>
            <h3 className="text-lg font-semibold text-foreground">
              Thank you for your feedback!
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Your review has been submitted successfully.
            </p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="mt-4">
            <FieldGroup>
              <Controller
                control={form.control}
                name="rating"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Rating</FieldLabel>
                    <RadioGroup
                      value={field.value.toString()}
                      onValueChange={(value) => field.onChange(Number(value))}
                      disabled={form.formState.isSubmitting}
                      className="flex gap-4"
                    >
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <div key={rating} className="flex items-center gap-2">
                          <RadioGroupItem
                            value={rating.toString()}
                            id={`rating-${rating}`}
                          />
                          <label
                            htmlFor={`rating-${rating}`}
                            className="flex cursor-pointer items-center gap-1"
                          >
                            {Array.from({ length: rating }).map((_, i) => (
                              <Star
                                key={`star-${rating}-${i + 1}`}
                                className="h-4 w-4 fill-yellow-400 text-yellow-400"
                              />
                            ))}
                          </label>
                        </div>
                      ))}
                    </RadioGroup>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="comment"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="comment">Your Review</FieldLabel>
                    <Textarea
                      id="comment"
                      placeholder="Share your experience..."
                      rows={4}
                      {...field}
                      disabled={form.formState.isSubmitting}
                      aria-invalid={!!fieldState.error}
                      maxLength={500}
                    />
                    <div className="flex items-center justify-between">
                      <FieldError>{fieldState.error?.message}</FieldError>
                      <span className="text-xs text-muted-foreground">
                        {characterCount}/500 characters
                      </span>
                    </div>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <Field orientation="horizontal" className="w-fit">
                    <Checkbox
                      id="isAnonymous"
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={form.formState.isSubmitting}
                    />
                    <FieldLabel htmlFor="isAnonymous">
                      Review anonymously
                    </FieldLabel>
                  </Field>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  onClick={() => onOpenChange(false)}
                  disabled={form.formState.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    "Submit Review"
                  )}
                </Button>
              </div>
            </FieldGroup>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
