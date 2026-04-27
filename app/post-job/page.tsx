"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, MapPin, PlusCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
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
import { createJobPost } from "@/lib/database/queries/jobs";

type Category = { id: string; name: string };

const schema = z
  .object({
    title: z
      .string()
      .min(5, "Title must be at least 5 characters")
      .max(100, "Title must be under 100 characters"),
    categoryId: z.string().optional(),
    description: z
      .string()
      .min(20, "Description must be at least 20 characters")
      .max(2000, "Description must be under 2000 characters"),
    budgetMin: z.string().optional(),
    budgetMax: z.string().optional(),
    location: z
      .string()
      .max(100, "Location must be under 100 characters")
      .optional(),
  })
  .refine(
    (data) => {
      if (data.budgetMin && data.budgetMax) {
        return parseInt(data.budgetMin) <= parseInt(data.budgetMax);
      }
      return true;
    },
    {
      message: "Minimum budget cannot exceed maximum budget",
      path: ["budgetMax"],
    },
  );

type FormValues = z.infer<typeof schema>;

export default function PostJobPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCategories() {
      const supabase = createClient();
      const { data } = await supabase
        .from("categories")
        .select("id, name")
        .order("name");
      setCategories(data ?? []);
    }
    loadCategories();
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: "",
      categoryId: "",
      description: "",
      budgetMin: "",
      budgetMax: "",
      location: "",
    },
  });

  async function onSubmit(values: FormValues) {
    setError(null);
    const result = await createJobPost({
      title: values.title,
      categoryId: values.categoryId || null,
      description: values.description,
      budgetMin: values.budgetMin ? parseInt(values.budgetMin) : null,
      budgetMax: values.budgetMax ? parseInt(values.budgetMax) : null,
      location: values.location || null,
    });

    if (!result) {
      setError("Failed to post the job. Please try again.");
      return;
    }

    router.push(`/jobs/${result.id}`);
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8 sm:px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Post a Job
          </h1>
          <p className="text-muted-foreground">
            Describe what you need and let qualified workers apply to you.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Be as specific as possible to attract the right workers.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Title */}
                <Controller
                  control={form.control}
                  name="title"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="title">Job Title</FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="title"
                          placeholder="e.g., Fix leaking kitchen pipe, Deep clean 3-bedroom house..."
                          {...field}
                          disabled={form.formState.isSubmitting}
                          aria-invalid={!!fieldState.error}
                        />
                      </InputGroup>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Category */}
                <Controller
                  control={form.control}
                  name="categoryId"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="categoryId">
                        Category (Optional)
                      </FieldLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        disabled={form.formState.isSubmitting}
                      >
                        <SelectTrigger id="categoryId">
                          <SelectValue placeholder="Select a category..." />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Description */}
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="description">Description</FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe the work you need done, any special requirements, preferred schedule..."
                        {...field}
                        disabled={form.formState.isSubmitting}
                        aria-invalid={!!fieldState.error}
                        className="min-h-32"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Budget range */}
                <div className="grid grid-cols-2 gap-4">
                  <Controller
                    control={form.control}
                    name="budgetMin"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="budgetMin">
                          Min Budget (Optional)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupAddon>₱</InputGroupAddon>
                          <InputGroupInput
                            id="budgetMin"
                            type="number"
                            placeholder="500"
                            min={0}
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
                    name="budgetMax"
                    render={({ field, fieldState }) => (
                      <Field data-invalid={!!fieldState.error}>
                        <FieldLabel htmlFor="budgetMax">
                          Max Budget (Optional)
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupAddon>₱</InputGroupAddon>
                          <InputGroupInput
                            id="budgetMax"
                            type="number"
                            placeholder="2000"
                            min={0}
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

                {/* Location */}
                <Controller
                  control={form.control}
                  name="location"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="location">
                        Location (Optional)
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupAddon>
                          <MapPin />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="location"
                          placeholder="e.g., Makati, Metro Manila"
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
                      <Spinner />
                      Posting...
                    </>
                  ) : (
                    <>
                      <PlusCircle />
                      Post Job
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
