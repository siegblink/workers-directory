"use client";

import {
  Lightbulb,
  MapPin,
  Search,
  SlidersHorizontal,
  ThumbsUp,
  User,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group";
import type { JobSuggestionWithUser } from "@/lib/database/types";

interface CommunitySuggestionsFeedProps {
  suggestions: JobSuggestionWithUser[];
}

function formatTimeAgo(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return "just now";
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
  return date.toLocaleDateString();
}

export function CommunitySuggestionsFeed({
  suggestions,
}: CommunitySuggestionsFeedProps) {
  // Search & filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [filterJobTitle, setFilterJobTitle] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  // Dialog temporary state (apply-on-confirm pattern)
  const [filterDialogOpen, setFilterDialogOpen] = useState(false);
  const [tempFilterJobTitle, setTempFilterJobTitle] = useState("");
  const [tempFilterLocation, setTempFilterLocation] = useState("");

  const filteredSuggestions = useMemo(() => {
    return suggestions.filter((s) => {
      // Broad search across job_title, description, and location
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          s.job_title.toLowerCase().includes(term) ||
          s.description?.toLowerCase().includes(term) ||
          s.location?.toLowerCase().includes(term);
        if (!matchesSearch) return false;
      }
      // Specific job title filter from dialog
      if (filterJobTitle) {
        if (!s.job_title.toLowerCase().includes(filterJobTitle.toLowerCase()))
          return false;
      }
      // Specific location filter from dialog
      if (filterLocation) {
        if (!s.location?.toLowerCase().includes(filterLocation.toLowerCase()))
          return false;
      }
      return true;
    });
  }, [suggestions, searchTerm, filterJobTitle, filterLocation]);

  const hasActiveFilters = filterJobTitle !== "" || filterLocation !== "";

  function handleFilterDialogOpen(open: boolean) {
    if (open) {
      setTempFilterJobTitle(filterJobTitle);
      setTempFilterLocation(filterLocation);
    }
    setFilterDialogOpen(open);
  }

  function handleApplyFilters() {
    setFilterJobTitle(tempFilterJobTitle);
    setFilterLocation(tempFilterLocation);
    setFilterDialogOpen(false);
  }

  function handleClearFilters() {
    setFilterJobTitle("");
    setFilterLocation("");
    setTempFilterJobTitle("");
    setTempFilterLocation("");
    setFilterDialogOpen(false);
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl font-bold">Community Suggestions</h2>
        <div className="flex items-center gap-2">
          {searchTerm && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSearchTerm("")}
              className="text-muted-foreground"
            >
              <X />
              Clear search
            </Button>
          )}
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearFilters}
              className="text-muted-foreground"
            >
              <X />
              Clear filters
            </Button>
          )}
          <InputGroup className="max-w-64">
            <InputGroupAddon>
              <Search />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search suggestions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-sm"
                onClick={() => handleFilterDialogOpen(true)}
                className="relative"
              >
                <SlidersHorizontal />
                {hasActiveFilters && (
                  <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-primary" />
                )}
              </InputGroupButton>
            </InputGroupAddon>
          </InputGroup>
        </div>
      </div>

      {/* Active filter summary */}
      {(hasActiveFilters || searchTerm) && suggestions.length > 0 && (
        <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
          <span>
            {filteredSuggestions.length} of {suggestions.length} suggestions
          </span>
        </div>
      )}

      {/* Filter Dialog */}
      <Dialog open={filterDialogOpen} onOpenChange={handleFilterDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Filter Suggestions</DialogTitle>
            <DialogDescription>
              Narrow down community suggestions by job title or location.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleApplyFilters();
            }}
          >
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="filterJobTitle">Job Title</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="filterJobTitle"
                    placeholder="e.g., Solar, Chef, Groomer..."
                    value={tempFilterJobTitle}
                    onChange={(e) => setTempFilterJobTitle(e.target.value)}
                  />
                </InputGroup>
              </Field>
              <Field>
                <FieldLabel htmlFor="filterLocation">Location</FieldLabel>
                <InputGroup>
                  <InputGroupAddon>
                    <MapPin />
                  </InputGroupAddon>
                  <InputGroupInput
                    id="filterLocation"
                    placeholder="e.g., Manila, Cebu, Davao..."
                    value={tempFilterLocation}
                    onChange={(e) => setTempFilterLocation(e.target.value)}
                  />
                </InputGroup>
              </Field>
            </FieldGroup>
            <DialogFooter className="mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
              <Button type="submit">Apply Filters</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

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
      ) : filteredSuggestions.length === 0 ? (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <Search className="h-8 w-8 text-muted-foreground" />
            </EmptyMedia>
            <EmptyTitle>No matching suggestions</EmptyTitle>
            <EmptyDescription>
              Try adjusting your search or filters to find what you&apos;re
              looking for.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="space-y-4">
          {filteredSuggestions.map((suggestion) => (
            <Card
              key={suggestion.id}
              className="hover:shadow-md transition-shadow"
            >
              <CardContent>
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
                    </div>

                    {suggestion.location && (
                      <div className="flex items-center gap-1 text-muted-foreground text-sm mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{suggestion.location}</span>
                      </div>
                    )}

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
  );
}
