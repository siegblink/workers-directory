"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Camera, CreditCard, Info } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Logo } from "@/components/logo";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { PhotoUploadField } from "@/components/verify/photo-upload-field";
import {
  type VerificationFormValues,
  verificationSchema,
} from "@/lib/schemas/verification";
import { createClient } from "@/lib/supabase/client";
import { uploadVerificationPhoto } from "@/lib/supabase/storage";

export default function VerifyPage() {
  const [error, setError] = useState<string | null>(null);
  const [showSkipDialog, setShowSkipDialog] = useState(false);
  const router = useRouter();

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      idType: undefined,
      idFront: undefined,
      idBack: undefined,
      selfiePhoto: undefined,
      termsAgreement: false,
    },
  });

  const handleSkip = () => {
    setShowSkipDialog(true);
  };

  const confirmSkip = () => {
    router.push("/dashboard");
  };

  const onSubmit = async (values: VerificationFormValues) => {
    const supabase = createClient();
    setError(null);

    try {
      // 1. Get authenticated user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("You must be logged in to submit verification");
      }

      // 2. Validate files are present (should be guaranteed by schema, but check for type safety)
      if (!values.idFront || !values.idBack || !values.selfiePhoto) {
        throw new Error("All photos are required");
      }

      // 3. Upload photos in parallel to Supabase Storage
      const [idFrontResult, idBackResult, selfieResult] = await Promise.all([
        uploadVerificationPhoto(user.id, "id_front", values.idFront),
        uploadVerificationPhoto(user.id, "id_back", values.idBack),
        uploadVerificationPhoto(user.id, "selfie", values.selfiePhoto),
      ]);

      // 4. Check for upload errors
      if (
        "error" in idFrontResult ||
        "error" in idBackResult ||
        "error" in selfieResult
      ) {
        const errorMsg =
          ("error" in idFrontResult && idFrontResult.error) ||
          ("error" in idBackResult && idBackResult.error) ||
          ("error" in selfieResult && selfieResult.error) ||
          "Failed to upload photos";
        throw new Error(errorMsg);
      }

      // 5. Insert verification record into database
      const { error: dbError } = await supabase.from("verifications").insert({
        user_id: user.id,
        id_type: values.idType,
        id_front_url: idFrontResult.url,
        id_back_url: idBackResult.url,
        selfie_url: selfieResult.url,
        status: "pending",
      });

      if (dbError) throw dbError;

      // 6. Success - redirect to pending page
      router.push("/verification-pending");
      router.refresh();
    } catch (error: unknown) {
      console.error("Verification error:", error);
      setError(
        error instanceof Error
          ? error.message
          : "Failed to submit verification. Please try again.",
      );
    }
  };

  return (
    <div className="min-h-screen">
      {/* Fixed Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo on left */}
          <Logo size="small" />

          {/* Centered title - use absolute positioning for perfect centering */}
          <h1 className="absolute left-1/2 -translate-x-1/2 text-xl sm:text-2xl font-bold">
            Verify Your Identity
          </h1>

          {/* Skip button on right */}
          <Button variant="outline" onClick={handleSkip}>
            <span className="hidden sm:inline">Skip for now</span>
            <span className="sm:hidden">Skip</span>
          </Button>
        </div>
      </header>

      {/* Scrollable Content Area */}
      <div className="min-h-screen pt-16 bg-muted/30">
        <div className="max-w-2xl mx-auto px-4 py-8">
          {/* Benefits panel */}
          <Alert className="mb-6">
            <Info className="h-4 w-4" />
            <AlertDescription>
              Verified workers get higher visibility and more bookings. Takes
              2-3 minutes, reviewed in 24-48 hours.
            </AlertDescription>
          </Alert>

          {/* Form Card */}
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-3xl font-bold">
                Identity Verification
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                We accept government IDs, school IDs, and company IDs
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldGroup>
                  {/* ID Type Select */}
                  <Controller
                    control={form.control}
                    name="idType"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="idType">ID Type</FieldLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                          disabled={form.formState.isSubmitting}
                        >
                          <SelectTrigger
                            id="idType"
                            aria-invalid={!!fieldState.error}
                          >
                            <SelectValue placeholder="Select ID type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="drivers_license">
                              Driver&apos;s License
                            </SelectItem>
                            <SelectItem value="passport">Passport</SelectItem>
                            <SelectItem value="national_id">
                              National ID
                            </SelectItem>
                            <SelectItem value="school_id">School ID</SelectItem>
                            <SelectItem value="company_id">
                              Company/Employee ID
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  {/* ID Front Photo */}
                  <Controller
                    control={form.control}
                    name="idFront"
                    render={({ field, fieldState }) => (
                      <PhotoUploadField
                        id="idFront"
                        label="ID Front Photo"
                        description="Upload a clear photo of the front of your ID"
                        icon={<CreditCard className="h-6 w-6" />}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={form.formState.isSubmitting}
                        maxSize={5}
                      />
                    )}
                  />

                  {/* ID Back Photo */}
                  <Controller
                    control={form.control}
                    name="idBack"
                    render={({ field, fieldState }) => (
                      <PhotoUploadField
                        id="idBack"
                        label="ID Back Photo"
                        description="Upload a clear photo of the back of your ID"
                        icon={<CreditCard className="h-6 w-6" />}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={form.formState.isSubmitting}
                        maxSize={5}
                      />
                    )}
                  />

                  {/* Selfie Photo */}
                  <Controller
                    control={form.control}
                    name="selfiePhoto"
                    render={({ field, fieldState }) => (
                      <PhotoUploadField
                        id="selfiePhoto"
                        label="Selfie Photo"
                        description="Take a clear photo of your face for verification"
                        icon={<Camera className="h-6 w-6" />}
                        value={field.value}
                        onChange={field.onChange}
                        error={fieldState.error?.message}
                        disabled={form.formState.isSubmitting}
                        maxSize={5}
                      />
                    )}
                  />

                  {/* Terms Agreement */}
                  <Controller
                    control={form.control}
                    name="termsAgreement"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <Field orientation="horizontal">
                          <Checkbox
                            id="termsAgreement"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={form.formState.isSubmitting}
                          />
                          <FieldLabel htmlFor="termsAgreement">
                            I confirm that all documents are authentic and
                            belong to me
                          </FieldLabel>
                        </Field>
                        <FieldError>{fieldState.error?.message}</FieldError>
                      </Field>
                    )}
                  />

                  {/* Error Alert */}
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Spinner className="mr-2" />
                        Uploading verification...
                      </>
                    ) : (
                      "Submit Verification"
                    )}
                  </Button>
                </FieldGroup>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Skip Confirmation Dialog */}
      <Dialog open={showSkipDialog} onOpenChange={setShowSkipDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Skip Verification?</DialogTitle>
            <DialogDescription>
              You can use the app now and complete verification later from your
              profile. Verified workers get more visibility and bookings.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowSkipDialog(false)}>
              Cancel
            </Button>
            <Button onClick={confirmSkip}>Continue to Dashboard</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
