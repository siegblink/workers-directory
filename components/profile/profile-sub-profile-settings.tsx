"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Trash2 } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import type { SubProfile } from "@/lib/database/types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";

// Use string fields for number inputs — coercion happens in the save handler
const schema = z.object({
  label: z.string().min(1, "Label is required"),
  profession: z.string().min(1, "Profession is required"),
  hourly_rate_min: z.string().optional(),
  hourly_rate_max: z.string().optional(),
  years_experience: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type ProfileSubProfileSettingsProps = {
  activeSubProfileId: string | null;
  subProfiles: SubProfile[];
  onSave: (id: string, updates: Partial<SubProfile>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
};

export function ProfileSubProfileSettings({
  activeSubProfileId,
  subProfiles,
  onSave,
  onDelete,
}: ProfileSubProfileSettingsProps) {
  const activeProfile = activeSubProfileId
    ? (subProfiles.find((p) => p.id === activeSubProfileId) ?? null)
    : null;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      label: "",
      profession: "",
      hourly_rate_min: "",
      hourly_rate_max: "",
      years_experience: "",
    },
  });

  useEffect(() => {
    if (activeProfile) {
      form.reset({
        label: activeProfile.label,
        profession: activeProfile.profession,
        hourly_rate_min: activeProfile.hourly_rate_min?.toString() ?? "",
        hourly_rate_max: activeProfile.hourly_rate_max?.toString() ?? "",
        years_experience: activeProfile.years_experience?.toString() ?? "",
      });
    }
  }, [activeProfile, form]);

  if (!activeProfile) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Sub-Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              You&apos;re viewing your main profile. Select a sub-profile above
              to manage its settings, or visit{" "}
              <Link href="/settings" className="underline underline-offset-2">
                Settings
              </Link>{" "}
              to update your main profile.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  async function handleSave(data: FormValues) {
    if (!activeSubProfileId) return;
    await onSave(activeSubProfileId, {
      label: data.label,
      profession: data.profession,
      hourly_rate_min: data.hourly_rate_min ? parseFloat(data.hourly_rate_min) : null,
      hourly_rate_max: data.hourly_rate_max ? parseFloat(data.hourly_rate_max) : null,
      years_experience: data.years_experience ? parseInt(data.years_experience, 10) : null,
    });
  }

  async function handleDelete() {
    if (!activeSubProfileId || !activeProfile) return;
    if (
      !window.confirm(
        `Delete the "${activeProfile.label}" sub-profile? This cannot be undone.`,
      )
    ) {
      return;
    }
    await onDelete(activeSubProfileId);
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Sub-Profile Settings</CardTitle>
          <Button
            variant="destructive"
            size="sm"
            onClick={handleDelete}
            disabled={form.formState.isSubmitting}
          >
            <Trash2 />
            Delete Sub-Profile
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
          <FieldGroup>
            <Controller
              control={form.control}
              name="label"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="sp-label">Profile Label</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="sp-label"
                      placeholder="e.g. Electrician"
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
              name="profession"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="sp-profession">Profession</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="sp-profession"
                      placeholder="e.g. Electrician"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      aria-invalid={!!fieldState.error}
                    />
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <Controller
                control={form.control}
                name="hourly_rate_min"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="sp-rate-min">Min Rate (₱/hr)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="sp-rate-min"
                        type="number"
                        min={0}
                        placeholder="0"
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
                name="hourly_rate_max"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="sp-rate-max">Max Rate (₱/hr)</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="sp-rate-max"
                        type="number"
                        min={0}
                        placeholder="0"
                        {...field}
                        disabled={form.formState.isSubmitting}
                        aria-invalid={!!fieldState.error}
                      />
                    </InputGroup>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />
            </div>

            <Controller
              control={form.control}
              name="years_experience"
              render={({ field, fieldState }) => (
                <Field data-invalid={!!fieldState.error}>
                  <FieldLabel htmlFor="sp-experience">Years of Experience</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      id="sp-experience"
                      type="number"
                      min={0}
                      placeholder="e.g. 5"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      aria-invalid={!!fieldState.error}
                    />
                  </InputGroup>
                  <FieldError>{fieldState.error?.message}</FieldError>
                </Field>
              )}
            />
          </FieldGroup>

          <Button
            type="submit"
            disabled={form.formState.isSubmitting}
            className="w-full"
          >
            {form.formState.isSubmitting ? (
              <>
                <Spinner className="mr-2" />
                Saving…
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
