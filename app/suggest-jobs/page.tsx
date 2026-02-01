"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  AlertCircle,
  Check,
  Lightbulb,
  Send,
  ThumbsUp,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
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
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import type { JobSuggestionWithUser } from "@/lib/database/types";

// Simple UUID generator for creating new suggestion IDs
const generateUUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

// Mock data for job suggestions
const MOCK_SUGGESTIONS: JobSuggestionWithUser[] = [
  {
    id: "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d",
    job_title: "Solar Panel Installer",
    description:
      "Growing demand for renewable energy. Many homeowners looking for solar installation services.",
    user_id: "u1",
    upvotes: 42,
    status: "approved",
    created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Sarah",
      lastname: "Chen",
      profile_pic_url: null,
    },
  },
  {
    id: "b2c3d4e5-f6a7-4b5c-9d0e-1f2a3b4c5d6e",
    job_title: "Pet Groomer",
    description: null,
    user_id: null,
    upvotes: 35,
    status: "pending",
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    user: null,
  },
  {
    id: "c3d4e5f6-a7b8-4c5d-0e1f-2a3b4c5d6e7f",
    job_title: "Personal Chef",
    description:
      "Busy professionals and families need meal prep services. This could be a popular category.",
    user_id: "u2",
    upvotes: 28,
    status: "implemented",
    created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Marcus",
      lastname: "Johnson",
      profile_pic_url: null,
    },
  },
  {
    id: "d4e5f6a7-b8c9-4d5e-1f2a-3b4c5d6e7f8a",
    job_title: "Mobile Car Detailer",
    description:
      "On-site car cleaning and detailing services. Convenient for busy car owners.",
    user_id: null,
    upvotes: 23,
    status: "pending",
    created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    user: null,
  },
  {
    id: "e5f6a7b8-c9d0-4e5f-2a3b-4c5d6e7f8a9b",
    job_title: "Home Organizer",
    description:
      "Professional organizing services for closets, garages, and entire homes.",
    user_id: "u3",
    upvotes: 19,
    status: "approved",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Emily",
      lastname: "Rodriguez",
      profile_pic_url: null,
    },
  },
  {
    id: "f6a7b8c9-d0e1-4f5a-3b4c-5d6e7f8a9b0c",
    job_title: "Drone Photographer",
    description: null,
    user_id: "u4",
    upvotes: 15,
    status: "pending",
    created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Alex",
      lastname: "Thompson",
      profile_pic_url: null,
    },
  },
  {
    id: "a7b8c9d0-e1f2-4a5b-4c5d-6e7f8a9b0c1d",
    job_title: "E-bike Repair Technician",
    description:
      "Electric bikes are becoming popular. Need specialized repair services.",
    user_id: null,
    upvotes: 12,
    status: "pending",
    created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    user: null,
  },
  {
    id: "b8c9d0e1-f2a3-4b5c-5d6e-7f8a9b0c1d2e",
    job_title: "Smart Home Installer",
    description:
      "Installation and setup of smart home devices, security systems, and automation.",
    user_id: "u5",
    upvotes: 8,
    status: "approved",
    created_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "David",
      lastname: "Kim",
      profile_pic_url: null,
    },
  },
  {
    id: "c9d0e1f2-a3b4-4c5d-6e7f-8a9b0c1d2e3f",
    job_title: "Aquarium Maintenance Specialist",
    description: null,
    user_id: null,
    upvotes: 5,
    status: "rejected",
    created_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    user: null,
  },
  {
    id: "d0e1f2a3-b4c5-4d5e-7f8a-9b0c1d2e3f4a",
    job_title: "Plant Care Consultant",
    description:
      "Professional plant care, diagnosis, and maintenance for indoor and outdoor gardens.",
    user_id: "u6",
    upvotes: 3,
    status: "pending",
    created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Jessica",
      lastname: "Martinez",
      profile_pic_url: null,
    },
  },
  {
    id: "e1f2a3b4-c5d6-4e5f-8a9b-0c1d2e3f4a5b",
    job_title: "Home Theater Installer",
    description:
      "Professional setup of home entertainment systems, projectors, and sound systems.",
    user_id: "u7",
    upvotes: 18,
    status: "approved",
    created_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      firstname: "Ryan",
      lastname: "O'Brien",
      profile_pic_url: null,
    },
  },
  {
    id: "f2a3b4c5-d6e7-4f5a-9b0c-1d2e3f4a5b6c",
    job_title: "Furniture Assembly Specialist",
    description: null,
    user_id: null,
    upvotes: 50,
    status: "implemented",
    created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    user: null,
  },
];

// Extract unique job titles for autocomplete
const MOCK_AUTOCOMPLETE_TITLES = Array.from(
  new Set(MOCK_SUGGESTIONS.map((s) => s.job_title)),
).sort();

const suggestionSchema = z.object({
  jobTitle: z
    .string()
    .min(3, { message: "Job title must be at least 3 characters" })
    .max(100, { message: "Job title must be less than 100 characters" }),
  description: z
    .string()
    .max(500, { message: "Description must be less than 500 characters" })
    .optional(),
});

type SuggestionFormValues = z.infer<typeof suggestionSchema>;

export default function SuggestJobsPage() {
  const [autocompleteResults, setAutocompleteResults] = useState<string[]>([]);
  const [autocompleteLoading, setAutocompleteLoading] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);

  const [suggestions, setSuggestions] =
    useState<JobSuggestionWithUser[]>(MOCK_SUGGESTIONS);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const form = useForm<SuggestionFormValues>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: {
      jobTitle: "",
      description: "",
    },
  });

  const jobTitleValue = form.watch("jobTitle");

  // Autocomplete with mock data (debounced)
  useEffect(() => {
    const fetchAutocomplete = () => {
      if (!jobTitleValue || jobTitleValue.length < 2) {
        setAutocompleteResults([]);
        return;
      }

      setAutocompleteLoading(true);

      // Filter mock titles based on search input
      const searchLower = jobTitleValue.toLowerCase();
      const filtered = MOCK_AUTOCOMPLETE_TITLES.filter((title) =>
        title.toLowerCase().includes(searchLower),
      ).slice(0, 8);

      setAutocompleteResults(filtered);
      setAutocompleteLoading(false);
    };

    const timer = setTimeout(fetchAutocomplete, 300);
    return () => clearTimeout(timer);
  }, [jobTitleValue]);

  const onSubmit = async (values: SuggestionFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Create new suggestion with mock data
      const newSuggestion: JobSuggestionWithUser = {
        id: generateUUID(),
        job_title: values.jobTitle,
        description: values.description || null,
        user_id: null,
        upvotes: 0,
        status: "pending",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        user: null,
      };

      // Add to the beginning of the suggestions list
      setSuggestions((prev) => [newSuggestion, ...prev]);

      setSubmitSuccess(true);
      form.reset();

      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error: unknown) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Failed to submit suggestion. Please try again.",
      );
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="default">Approved</Badge>;
      case "implemented":
        return <Badge className="bg-green-600">Implemented</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Pending</Badge>;
    }
  };

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
                  render={({ field, fieldState }) => (
                    <Field data-invalid={!!fieldState.error}>
                      <FieldLabel htmlFor="jobTitle">Job Title</FieldLabel>
                      <div className="relative">
                        <Command
                          className="rounded-lg border"
                          shouldFilter={false}
                        >
                          <CommandInput
                            id="jobTitle"
                            placeholder="e.g., Personal Chef, Pet Groomer, Solar Panel Installer..."
                            value={field.value}
                            onValueChange={(value) => {
                              field.onChange(value);
                              setShowAutocomplete(true);
                            }}
                            onFocus={() => setShowAutocomplete(true)}
                            onBlur={() => {
                              setTimeout(() => setShowAutocomplete(false), 200);
                            }}
                            disabled={form.formState.isSubmitting}
                            aria-invalid={!!fieldState.error}
                          />
                          {showAutocomplete &&
                            (field.value?.length || 0) >= 2 && (
                              <CommandList>
                                {autocompleteLoading ? (
                                  <div className="p-4 text-center">
                                    <Spinner className="mx-auto" />
                                  </div>
                                ) : autocompleteResults.length > 0 ? (
                                  <CommandGroup heading="Existing Suggestions">
                                    {autocompleteResults.map((title) => (
                                      <CommandItem
                                        key={title}
                                        value={title}
                                        onSelect={(value) => {
                                          field.onChange(value);
                                          setShowAutocomplete(false);
                                        }}
                                      >
                                        <Check
                                          className={`mr-2 h-4 w-4 ${
                                            field.value === title
                                              ? "opacity-100"
                                              : "opacity-0"
                                          }`}
                                        />
                                        {title}
                                      </CommandItem>
                                    ))}
                                  </CommandGroup>
                                ) : (
                                  <CommandEmpty>
                                    No existing suggestions found. Create a new
                                    one!
                                  </CommandEmpty>
                                )}
                              </CommandList>
                            )}
                        </Command>
                      </div>
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
        <div>
          <h2 className="text-2xl font-bold mb-4">Community Suggestions</h2>

          {suggestions.length === 0 ? (
            <Empty>
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Lightbulb className="h-8 w-8 text-primary" />
                </EmptyMedia>
                <EmptyTitle>No suggestions yet</EmptyTitle>
                <EmptyDescription>
                  Be the first to suggest a job category!
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="space-y-4">
              {suggestions.map((suggestion) => (
                <Card
                  key={suggestion.id}
                  className="hover:shadow-md transition-shadow"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-4">
                      {/* User Avatar */}
                      <Avatar className="h-10 w-10 shrink-0">
                        {suggestion.user?.profile_pic_url ? (
                          <AvatarImage
                            src={suggestion.user.profile_pic_url}
                            alt={`${suggestion.user.firstname} ${suggestion.user.lastname}`}
                          />
                        ) : null}
                        <AvatarFallback>
                          {suggestion.user ? (
                            `${suggestion.user.firstname?.[0] || ""}${suggestion.user.lastname?.[0] || ""}`
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </AvatarFallback>
                      </Avatar>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-medium text-foreground">
                            {suggestion.user
                              ? `${suggestion.user.firstname} ${suggestion.user.lastname}`
                              : "Anonymous"}
                          </span>
                          <span className="text-muted-foreground text-sm">
                            {formatTimeAgo(suggestion.created_at)}
                          </span>
                          {getStatusBadge(suggestion.status)}
                        </div>

                        <h3 className="text-lg font-semibold text-foreground mb-1">
                          {suggestion.job_title}
                        </h3>

                        {suggestion.description && (
                          <p className="text-muted-foreground text-sm line-clamp-2">
                            {suggestion.description}
                          </p>
                        )}
                      </div>

                      {/* Upvote Button */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                      >
                        <ThumbsUp />
                        {suggestion.upvotes}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
