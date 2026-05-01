"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Check, Lightbulb, MapPin, Send } from "lucide-react";
import { toast } from "sonner";
import { useOptimistic, useRef, useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { CommunitySuggestionsFeed } from "@/components/suggest-jobs/community-suggestions-feed";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  autocompleteJobTitles,
  createJobSuggestion,
  upvoteJobSuggestion,
} from "@/lib/database/queries/job-suggestions";
import type { JobSuggestionWithUser } from "@/lib/database/types";

const suggestionSchema = z.object({
  jobTitle: z
    .string()
    .min(3, { message: "Job title must be at least 3 characters" })
    .max(100, { message: "Job title must be less than 100 characters" }),
  location: z
    .string()
    .max(100, { message: "Location must be less than 100 characters" })
    .optional(),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

type UserProfile = {
  firstname: string;
  lastname: string;
  profile_pic_url: string | null;
};

type Props = {
  initialSuggestions: JobSuggestionWithUser[];
  currentUser: UserProfile | null;
};

export function SuggestJobsClient({ initialSuggestions, currentUser }: Props) {
  const [suggestions, setSuggestions] = useState(initialSuggestions);

  // Optimistic upvote overlay — transitions collapse back to `suggestions`
  // once the async action ends, by which point setSuggestions has already
  // updated the base state with the confirmed count.
  const [optimisticSuggestions, addOptimisticUpvote] = useOptimistic(
    suggestions,
    (state: JobSuggestionWithUser[], id: string) =>
      state.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)),
  );

  const [, startUpvoteTransition] = useTransition();

  // Autocomplete — fired directly from onChange, no useEffect needed.
  // The ref counter prevents stale results from a slower earlier query
  // overwriting results from a faster later one.
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [autocompletePending, startAutocompleteTransition] = useTransition();
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const autocompleteQueryRef = useRef(0);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      jobTitle: "",
      location: "",
      description: "",
    },
  });

  function handleJobTitleChange(
    value: string,
    fieldOnChange: (v: string) => void,
  ) {
    fieldOnChange(value);
    setShowAutocomplete(true);

    if (value.length >= 2) {
      const queryId = ++autocompleteQueryRef.current;
      startAutocompleteTransition(async () => {
        const result = await autocompleteJobTitles(value);
        if (queryId === autocompleteQueryRef.current) {
          setAutocompleteResults(result.data ?? []);
        }
      });
    } else {
      setAutocompleteResults([]);
    }
  }

  async function onSubmit(values: SuggestionFormValues) {
    setSubmitError(null);
    setSubmitSuccess(false);

    const { data, error } = await createJobSuggestion(
      values.jobTitle,
      values.description,
      values.location,
    );

    if (error || !data) {
      setSubmitError(
        error?.message ?? "Failed to submit suggestion. Please try again.",
      );
      return;
    }

    setSuggestions((prev) => [{ ...data, user: currentUser ?? null }, ...prev]);
    setSubmitSuccess(true);
    form.reset();
    setTimeout(() => setSubmitSuccess(false), 3000);
  }

  function handleUpvote(id: string) {
    if (!currentUser) {
      toast.error("Sign in to upvote suggestions");
      return;
    }
    startUpvoteTransition(async () => {
      addOptimisticUpvote(id);
      const { error } = await upvoteJobSuggestion(id);
      if (!error) {
        setSuggestions((prev) =>
          prev.map((s) => (s.id === id ? { ...s, upvotes: s.upvotes + 1 } : s)),
        );
      }
    });
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Suggest a Job Category
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Help us grow our platform by suggesting new job categories. Your
            suggestions help connect more workers with customers who need their
            services.
          </p>
        </div>

        {/* Suggestion Form */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Submit a Suggestion</CardTitle>
            <CardDescription>
              No login required. Your suggestion will be reviewed by our team.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                {/* Job Title with Autocomplete */}
                <Controller
                  control={form.control}
                  name="jobTitle"
                  render={({ field, fieldState }) => {
                    const showError =
                      form.formState.isSubmitted && !!fieldState.error;
                    const showDropdown =
                      showAutocomplete &&
                      field.value.length >= 2 &&
                      (autocompletePending || autocompleteResults.length > 0);
                    return (
                      <Field data-invalid={showError}>
                        <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                        <div className="relative">
                          <InputGroup>
                            <InputGroupInput
                              id="jobTitle"
                              placeholder="e.g., Personal Chef, Pet Groomer, Solar Panel Installer..."
                              value={field.value}
                              onChange={(e) =>
                                handleJobTitleChange(
                                  e.target.value,
                                  field.onChange,
                                )
                              }
                              onFocus={() => setShowAutocomplete(true)}
                              onBlur={() =>
                                setTimeout(
                                  () => setShowAutocomplete(false),
                                  200,
                                )
                              }
                              disabled={form.formState.isSubmitting}
                              aria-invalid={showError}
                              autoComplete="off"
                            />
                          </InputGroup>
                          {showDropdown && (
                            <div className="absolute top-full left-0 right-0 z-50 mt-1 bg-popover border rounded-md shadow-md overflow-hidden">
                              {autocompletePending ? (
                                <div className="flex items-center justify-center p-3">
                                  <Spinner />
                                </div>
                              ) : (
                                <ul className="py-1 max-h-48 overflow-y-auto">
                                  {autocompleteResults.map((title) => (
                                    <li key={title}>
                                      <button
                                        type="button"
                                        className="w-full text-left px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                                        onMouseDown={(e) => {
                                          // preventDefault stops onBlur from
                                          // collapsing the dropdown before the
                                          // click registers.
                                          e.preventDefault();
                                          field.onChange(title);
                                          setShowAutocomplete(false);
                                        }}
                                      >
                                        {title}
                                      </button>
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          )}
                        </div>
                        <FieldError>
                          {showError ? fieldState.error?.message : undefined}
                        </FieldError>
                      </Field>
                    );
                  }}
                />

                {/* Location (Optional) */}
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
                          <MapPin className="h-4 w-4" />
                        </InputGroupAddon>
                        <InputGroupInput
                          id="location"
                          placeholder="e.g., Manila, Cebu, Davao..."
                          {...field}
                          disabled={form.formState.isSubmitting}
                          aria-invalid={!!fieldState.error}
                        />
                      </InputGroup>
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Description (Optional) */}
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="description">
                        Description (Optional)
                      </FieldLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe what this job involves and why it should be added..."
                        {...field}
                        disabled={form.formState.isSubmitting}
                        aria-invalid={!!fieldState.error}
                        className="min-h-25"
                      />
                      <FieldError>{fieldState.error?.message}</FieldError>
                    </Field>
                  )}
                />

                {/* Error Alert */}
                {submitError && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{submitError}</AlertDescription>
                  </Alert>
                )}

                {/* Success Alert */}
                {submitSuccess && (
                  <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
                    <Check className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-600">
                      Your suggestion has been submitted successfully!
                    </AlertDescription>
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
                      <Spinner />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send />
                      Submit Suggestion
                    </>
                  )}
                </Button>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>

        {/* Suggestions Feed */}
        <CommunitySuggestionsFeed
          suggestions={optimisticSuggestions}
          onUpvote={handleUpvote}
        />
      </div>
    </div>
  );
}
