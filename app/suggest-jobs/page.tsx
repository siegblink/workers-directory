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
import { useCallback, useEffect, useRef, useState } from "react";
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
import {
  autocompleteJobTitles,
  createJobSuggestion,
  getAllJobSuggestions,
} from "@/lib/database";
import type { JobSuggestionWithUser } from "@/lib/database/types";

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

  const [suggestions, setSuggestions] = useState<JobSuggestionWithUser[]>([]);
  const [listLoading, setListLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observerTarget = useRef<HTMLDivElement>(null);

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

  // Fetch autocomplete results with debounce
  useEffect(() => {
    const fetchAutocomplete = async () => {
      if (!jobTitleValue || jobTitleValue.length < 2) {
        setAutocompleteResults([]);
        return;
      }

      setAutocompleteLoading(true);
      const { data } = await autocompleteJobTitles(jobTitleValue, 8);
      setAutocompleteResults(data || []);
      setAutocompleteLoading(false);
    };

    const timer = setTimeout(fetchAutocomplete, 300);
    return () => clearTimeout(timer);
  }, [jobTitleValue]);

  // Fetch initial suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setListLoading(true);
      const { data } = await getAllJobSuggestions({ page: 1, limit: 10 });
      setSuggestions(data || []);
      setHasMore((data?.length || 0) === 10);
      setListLoading(false);
    };

    fetchSuggestions();
  }, []);

  // Load more suggestions (infinite scroll)
  const loadMore = useCallback(async () => {
    if (listLoading || !hasMore) return;

    setListLoading(true);
    const nextPage = page + 1;
    const { data } = await getAllJobSuggestions({ page: nextPage, limit: 10 });

    if (data && data.length > 0) {
      setSuggestions((prev) => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === 10);
    } else {
      setHasMore(false);
    }
    setListLoading(false);
  }, [page, listLoading, hasMore]);

  // Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !listLoading) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore, hasMore, listLoading]);

  const onSubmit = async (values: SuggestionFormValues) => {
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      const { data, error } = await createJobSuggestion(
        values.jobTitle,
        values.description,
      );

      if (error) throw error;

      if (data) {
        setSuggestions((prev) => [{ ...data, user: null }, ...prev]);
      }

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
                        className="min-h-[100px]"
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

          {listLoading && suggestions.length === 0 ? (
            <div className="flex justify-center py-12">
              <Spinner className="w-8 h-8" />
            </div>
          ) : suggestions.length === 0 ? (
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

              {/* Infinite scroll target */}
              {hasMore && <div ref={observerTarget} className="h-8" />}

              {/* Loading more indicator */}
              {listLoading && suggestions.length > 0 && (
                <div className="flex justify-center py-4">
                  <Spinner />
                </div>
              )}

              {/* End of list */}
              {!hasMore && suggestions.length > 0 && (
                <p className="text-center text-muted-foreground text-sm py-4">
                  You've reached the end of suggestions
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
