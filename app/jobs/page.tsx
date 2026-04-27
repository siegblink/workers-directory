"use client";

import { Briefcase, MapPin, PlusCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { createClient } from "@/lib/supabase/client";
import {
  getAppliedJobIds,
  getOpenJobs,
  type JobPost,
} from "@/lib/database/queries/jobs";

type Category = { id: string; name: string };

function formatBudget(min: number | null, max: number | null): string {
  if (!min && !max) return "Budget open";
  if (min && max)
    return `₱${min.toLocaleString()} – ₱${max.toLocaleString()}`;
  if (min) return `From ₱${min.toLocaleString()}`;
  return `Up to ₱${max!.toLocaleString()}`;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<JobPost[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [isWorker, setIsWorker] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState("all");

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      const [
        {
          data: { user },
        },
        catsResult,
      ] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("categories").select("id, name").order("name"),
      ]);

      setCategories(catsResult.data ?? []);

      let isWorkerUser = false;
      if (user) {
        const { data: worker } = await supabase
          .from("workers")
          .select("id")
          .eq("user_id", user.id)
          .is("deleted_at", null)
          .maybeSingle();
        isWorkerUser = !!worker;
        setIsWorker(isWorkerUser);
      }

      const [jobsList, applied] = await Promise.all([
        getOpenJobs(),
        isWorkerUser ? getAppliedJobIds() : Promise.resolve([]),
      ]);

      setJobs(jobsList);
      setAppliedIds(new Set(applied));
      setLoading(false);
    }

    load();
  }, []);

  const filteredJobs =
    categoryFilter === "all"
      ? jobs
      : jobs.filter((j) => String(j.categoryId) === categoryFilter);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Job Board
            </h1>
            <p className="text-muted-foreground">
              Open jobs posted by customers looking for skilled workers.
            </p>
          </div>
          <Button asChild>
            <Link href="/post-job">
              <PlusCircle />
              Post a Job
            </Link>
          </Button>
        </div>

        {/* Category filter */}
        <div className="flex items-center gap-3 mb-6">
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-56">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {filteredJobs.length > 0 && (
            <p className="text-sm text-muted-foreground">
              {filteredJobs.length} open job
              {filteredJobs.length !== 1 ? "s" : ""}
            </p>
          )}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : filteredJobs.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Briefcase />
              </EmptyMedia>
              <EmptyTitle>No Open Jobs</EmptyTitle>
              <EmptyDescription>
                There are no open jobs matching your filter. Be the first to
                post one!
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <Button asChild>
                <Link href="/post-job">
                  <PlusCircle />
                  Post a Job
                </Link>
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-4">
            {filteredJobs.map((job) => (
              <Card
                key={job.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg text-foreground leading-tight">
                          {job.title}
                        </h3>
                        {appliedIds.has(job.id) && (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 shrink-0">
                            Applied
                          </Badge>
                        )}
                      </div>
                      {job.categoryName && (
                        <Badge variant="secondary" className="mb-2">
                          {job.categoryName}
                        </Badge>
                      )}
                      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                        {job.description}
                      </p>
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
                        <span className="font-medium text-foreground">
                          {formatBudget(job.budgetMin, job.budgetMax)}
                        </span>
                        {job.location && (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <MapPin className="w-3 h-3" />
                            {job.location}
                          </span>
                        )}
                        <span className="text-muted-foreground">
                          {job.applicantCount} applicant
                          {job.applicantCount !== 1 ? "s" : ""}
                        </span>
                        <span className="text-muted-foreground">
                          {timeAgo(job.createdAt)}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-center gap-2 shrink-0">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/jobs/${job.id}`}>View Details</Link>
                      </Button>
                      {isWorker && !appliedIds.has(job.id) && (
                        <Button size="sm" asChild>
                          <Link href={`/jobs/${job.id}`}>Apply</Link>
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
