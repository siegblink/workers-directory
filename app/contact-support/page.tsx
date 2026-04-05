"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";

const SUBJECTS = [
  { value: "general", label: "General enquiry" },
  { value: "booking", label: "Booking issue" },
  { value: "payment", label: "Payment or credits" },
  { value: "account", label: "Account problem" },
  { value: "technical", label: "Technical issue" },
  { value: "other", label: "Other" },
] as const;

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  subject: z.string().min(1, "Please choose a subject"),
  message: z.string().min(20, "Please describe your issue (at least 20 characters)"),
});

type FormValues = z.infer<typeof schema>;

export default function ContactSupportPage() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Context injected by Task-26-style callers via query params
  const prefillPage = searchParams.get("page") ?? undefined;
  const prefillIssue = searchParams.get("issue") ?? undefined;
  const prefillTimestamp = searchParams.get("timestamp") ?? undefined;

  const hasPrefilledContext = !!(prefillPage || prefillIssue);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      subject: prefillIssue ? "technical" : "",
      message: prefillIssue
        ? `Page: ${prefillPage ?? "unknown"}\nIssue: ${prefillIssue}\nTime: ${prefillTimestamp ?? new Date().toISOString()}\n\n`
        : "",
    },
  });

  // Pre-fill name + email from the authenticated user if available
  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from("users")
        .select("firstname, lastname")
        .eq("id", user.id)
        .single();

      const fullName =
        profile?.firstname && profile?.lastname
          ? `${profile.firstname} ${profile.lastname}`
          : profile?.firstname ?? "";

      if (fullName) form.setValue("name", fullName);
      if (user.email) form.setValue("email", user.email);
    }
    loadUser();
  }, [form]);

  async function onSubmit(values: FormValues) {
    setError(null);

    const context: Record<string, string> = {};
    if (prefillPage) context.page = prefillPage;
    if (prefillIssue) context.issue = prefillIssue;
    if (prefillTimestamp) context.timestamp = prefillTimestamp;

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        context: Object.keys(context).length > 0 ? context : undefined,
      }),
    });

    if (!res.ok) {
      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Something went wrong. Please try again.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-32 px-4 text-center">
        <CheckCircle2 className="size-16 text-green-500 mb-4" />
        <h1 className="text-2xl font-semibold mb-2">Message received</h1>
        <p className="text-muted-foreground max-w-md">
          Thanks for reaching out. Our support team will get back to you within
          1–2 business days.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Contact Support</h1>
        <p className="text-muted-foreground">
          Fill in the form below and we'll get back to you as soon as possible.
        </p>
      </div>

      {hasPrefilledContext && (
        <Alert className="mb-6">
          <AlertCircle />
          <AlertDescription>
            Some fields have been pre-filled based on the issue you encountered.
            Please add any additional details before submitting.
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Send us a message</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Controller
                control={form.control}
                name="name"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="name">Full name</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="name"
                        type="text"
                        placeholder="Your name"
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
                name="email"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="email">Email address</FieldLabel>
                    <InputGroup>
                      <InputGroupInput
                        id="email"
                        type="email"
                        placeholder="you@example.com"
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
                name="subject"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel>Subject</FieldLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={form.formState.isSubmitting}
                    >
                      <SelectTrigger aria-invalid={!!fieldState.error}>
                        <SelectValue placeholder="Choose a subject…" />
                      </SelectTrigger>
                      <SelectContent>
                        {SUBJECTS.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              <Controller
                control={form.control}
                name="message"
                render={({ field, fieldState }) => (
                  <Field data-invalid={!!fieldState.error}>
                    <FieldLabel htmlFor="message">Message</FieldLabel>
                    <Textarea
                      id="message"
                      placeholder="Describe your issue in detail…"
                      className="min-h-36 resize-none"
                      {...field}
                      disabled={form.formState.isSubmitting}
                      aria-invalid={!!fieldState.error}
                    />
                    <FieldError>{fieldState.error?.message}</FieldError>
                  </Field>
                )}
              />

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <>
                    <Spinner className="mr-2" />
                    Sending…
                  </>
                ) : (
                  "Send message"
                )}
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
