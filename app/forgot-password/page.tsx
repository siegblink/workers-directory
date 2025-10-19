"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, ArrowLeft, Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AuthLayout } from "@/components/auth-layout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Form, FormField } from "@/components/ui/form";
import { InputGroup, InputGroupInput } from "@/components/ui/input-group";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [emailSent, setEmailSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: ForgotPasswordFormValues) => {
    const supabase = createClient();
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        values.email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        },
      );
      if (error) throw error;
      setEmailSent(true);
    } catch (error: unknown) {
      setError(
        error instanceof Error
          ? error.message
          : "An error occurred while sending the reset link",
      );
    }
  };

  return (
    <AuthLayout
      title="Reset Your Password"
      description="No worries! Enter your email and we'll send you instructions to reset your password."
    >
      <Card className="w-full max-w-md">
        {!emailSent ? (
          <>
            <CardHeader className="space-y-1">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-2 w-fit"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel>Email Address</FieldLabel>
                        <InputGroup>
                          <InputGroupInput
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

                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
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
                        Sending...
                      </>
                    ) : (
                      "Send Reset Link"
                    )}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </>
        ) : (
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="text-muted-foreground mb-6 text-pretty">
                We've sent password reset instructions to your email address.
              </p>
              <Button asChild variant="outline" className="w-full" size="lg">
                <Link href="/login">Back to Login</Link>
              </Button>
            </div>
          </CardContent>
        )}
      </Card>
    </AuthLayout>
  );
}
