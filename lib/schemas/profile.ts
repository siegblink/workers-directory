import * as z from "zod";

export const profileHeaderSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  statusEmoji: z.string().max(10).optional(),
  statusText: z
    .string()
    .max(200, "Status must be less than 200 characters")
    .optional(),
  profession: z.string().min(2, "Profession is required").max(100),
  location: z.string().min(2, "Location is required").max(200),
  hourlyRate: z
    .number()
    .min(0, "Hourly rate must be positive")
    .max(10000, "Hourly rate seems too high"),
});

export type ProfileHeaderFormValues = z.infer<typeof profileHeaderSchema>;

export const profileAboutSchema = z.object({
  bio: z
    .string()
    .min(10, "Bio must be at least 10 characters")
    .max(2000, "Bio must be less than 2000 characters"),
  skills: z
    .array(z.string().min(1).max(50))
    .min(1, "Add at least one skill")
    .max(20, "Maximum 20 skills allowed"),
});

export type ProfileAboutFormValues = z.infer<typeof profileAboutSchema>;

export const profileAvailabilitySchema = z.object({
  monday: z.string(),
  tuesday: z.string(),
  wednesday: z.string(),
  thursday: z.string(),
  friday: z.string(),
  saturday: z.string(),
  sunday: z.string(),
});

export type ProfileAvailabilityFormValues = z.infer<
  typeof profileAvailabilitySchema
>;

export const galleryItemSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(500),
  price: z.number().min(0).optional(),
});

export type GalleryItemFormValues = z.infer<typeof galleryItemSchema>;
