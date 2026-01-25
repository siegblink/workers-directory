import { z } from "zod";

/**
 * Validation schema for image file uploads
 * Ensures files are valid images under 5MB
 */
const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "Please select a file")
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB",
  )
  .refine(
    (file) => file.type.startsWith("image/"),
    "File must be an image (JPEG, PNG, etc.)",
  );

/**
 * Validation schema for the verification form
 * Validates ID type selection, three photo uploads, and terms agreement
 */
export const verificationSchema = z.object({
  idType: z
    .enum([
      "drivers_license",
      "passport",
      "national_id",
      "school_id",
      "company_id",
    ])
    .optional()
    .refine((val) => val !== undefined, {
      message: "Please select an ID type",
    }),
  idFront: imageFileSchema.optional().refine((val) => val !== undefined, {
    message: "Please upload the front of your ID",
  }),
  idBack: imageFileSchema.optional().refine((val) => val !== undefined, {
    message: "Please upload the back of your ID",
  }),
  selfiePhoto: imageFileSchema.optional().refine((val) => val !== undefined, {
    message: "Please upload a selfie photo",
  }),
  termsAgreement: z.boolean().refine((val) => val === true, {
    message: "You must agree to the verification terms",
  }),
});

/**
 * TypeScript type inferred from the verification schema
 */
export type VerificationFormValues = z.infer<typeof verificationSchema>;
