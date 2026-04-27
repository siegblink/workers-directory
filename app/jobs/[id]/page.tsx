"use client";

import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  CheckCircle2,
  MapPin,
  Send,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  applyToJob,
  closeJobPost,
  getJobApplicants,
  getJobById,
  hasAppliedToJob,
  type JobApplicant,
  type JobPost,
} from "@/lib/database/queries/jobs";

function formatBudget(min: number | null, max: number | null): string {
  if (!min && !max) return "Budget open";
  if (min && max)
    return `₱${min.toLocaleString()} – ₱${max.toLocaleString()}`;
  if (min) return `From ₱${min.toLocaleString()}`;
  return `Up to ₱${max!.toLocaleString()}`;
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();

  const [job, setJob] = useState<JobPost | null>(null);
  const [applicants, setApplicants] = useState<JobApplicant[]>([]);
  const [isWorker, setIsWorker] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [alreadyApplied, setAlreadyApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [coverNote, setCoverNote] = useState("");
  const [applying, setApplying] = useState(false);
  const [applyError, setApplyError] = useState<string | null>(null);
  const [closing, setClosing] = useState(false);
  const [closeConfirmOpen, setCloseConfirmOpen] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const supabase = createClient();

      const [
        {
          data: { user },
        },
        jobData,
      ] = await Promise.all([supabase.auth.getUser(), getJobById(id)]);

      if (!jobData) {
        setLoading(false);
        return;
      }

      setJob(jobData);

      if (user) {
        setIsLoggedIn(true);
        const isOwnerUser = user.id === jobData.customerId;
        setIsOwner(isOwnerUser);

        if (isOwnerUser) {
          const apps = await getJobApplicants(id);
          setApplicants(apps);
        } else {
          const { data: worker } = await supabase
            .from("workers")
            .select("id")
            .eq("user_id", user.id)
            .is("deleted_at", null)
            .maybeSingle();

          if (worker) {
            setIsWorker(true);
            const applied = await hasAppliedToJob(id);
            setAlreadyApplied(applied);
          }
        }
      }

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleApply() {
    setApplyError(null);
    setApplying(true);

    const success = await applyToJob(id, coverNote || null);

    if (!success) {
      setApplyError("Failed to submit application. Please try again.");
    } else {
      setAlreadyApplied(true);
      setJob((prev) =>
        prev ? { ...prev, applicantCount: prev.applicantCount + 1 } : null,
      );
    }

    setApplying(false);
  }

  async function handleClose() {
    setClosing(true);
    const success = await closeJobPost(id);
    if (success) {
      setJob((prev) => (prev ? { ...prev, status: "closed" } : null));
      toast.success("Job closed — workers can no longer apply.");
    } else {
      toast.error("Failed to close the job. Please try again.");
    }
    setClosing(false);
    setCloseConfirmOpen(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4 text-foreground">
            Job Not Found
          </h1>
          <Button asChild>
            <Link href="/jobs">Browse Jobs</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6">
        {/* Back */}
        <Button variant="ghost" size="sm" className="mb-6 -ml-2" asChild>
          <Link href="/jobs">
            <ArrowLeft />
            Back to Jobs
          </Link>
        </Button>

        {/* Job header */}
        <div className="mb-6">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <h1 className="text-3xl font-bold text-foreground flex-1">
              {job.title}
            </h1>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${
                job.status === "open"
                  ? "bg-green-100 text-green-800 border-green-300 dark:bg-green-900/40 dark:text-green-300 dark:border-green-700"
                  : "bg-secondary text-muted-foreground border-border"
              }`}
            >
              {job.status === "open" && (
                <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-400 animate-pulse" />
              )}
              {job.status === "open" ? "Open" : "Closed"}
            </span>
          </div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            {job.categoryName && (
              <Badge variant="secondary">{job.categoryName}</Badge>
            )}
            {job.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                {job.location}
              </span>
            )}
            <span>Posted {formatDate(job.createdAt)}</span>
            <span className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              {job.applicantCount} applicant
              {job.applicantCount !== 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Job description */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Job Description</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-foreground whitespace-pre-wrap">
              {job.description}
            </p>
            <div className="pt-4 border-t">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Budget
              </p>
              <p className="font-semibold text-foreground text-lg">
                {formatBudget(job.budgetMin, job.budgetMax)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Job poster — applicants list */}
        {isOwner && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Applicants ({applicants.length})</span>
                {job.status === "open" && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCloseConfirmOpen(true)}
                    disabled={closing}
                  >
                    <XCircle />
                    Close Job
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {applicants.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  No applications yet. Share this job to attract workers.
                </p>
              ) : (
                <div className="space-y-4">
                  {applicants.map((app) => (
                    <div
                      key={app.id}
                      className="flex items-start gap-4 pb-4 border-b last:border-0 last:pb-0"
                    >
                      <Avatar className="w-12 h-12 shrink-0">
                        <AvatarImage
                          src={app.workerAvatar ?? undefined}
                          alt={app.workerName}
                        />
                        <AvatarFallback>
                          {app.workerName
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <h4 className="font-semibold text-foreground">
                            {app.workerName}
                          </h4>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatDate(app.appliedAt)}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {app.workerProfession}
                        </p>
                        {app.coverNote && (
                          <p className="text-sm text-foreground mt-1 italic">
                            &ldquo;{app.coverNote}&rdquo;
                          </p>
                        )}
                        <Button
                          variant="outline"
                          size="sm"
                          className="mt-2"
                          asChild
                        >
                          <Link href={`/worker/${app.workerId}`}>
                            View Profile
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Worker — apply section */}
        {isWorker && job.status === "open" && (
          <Card>
            <CardHeader>
              <CardTitle>Apply for This Job</CardTitle>
            </CardHeader>
            <CardContent>
              {alreadyApplied ? (
                <div className="flex items-start gap-3 py-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 shrink-0" />
                  <div>
                    <p className="font-semibold text-foreground">
                      Application Submitted
                    </p>
                    <p className="text-sm text-muted-foreground">
                      The customer will review your profile and reach out if
                      interested.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label
                      htmlFor="coverNote"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      Cover Note (Optional)
                    </label>
                    <Textarea
                      id="coverNote"
                      placeholder="Briefly describe your experience and why you're a great fit..."
                      value={coverNote}
                      onChange={(e) => setCoverNote(e.target.value)}
                      disabled={applying}
                      className="min-h-24"
                    />
                  </div>
                  {applyError && (
                    <Alert variant="destructive">
                      <AlertCircle />
                      <AlertDescription>{applyError}</AlertDescription>
                    </Alert>
                  )}
                  <Button
                    onClick={handleApply}
                    disabled={applying}
                    className="w-full"
                  >
                    {applying ? (
                      <>
                        <Spinner />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Send />
                        Submit Application
                      </>
                    )}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Visitor — prompt to join */}
        {!isWorker && !isOwner && job.status === "open" && (
          <Card>
            <CardContent className="text-center py-8">
              <Briefcase className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">
                Want to apply?
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                {isLoggedIn
                  ? "Create a worker profile to start applying for jobs."
                  : "Log in or create a worker profile to apply."}
              </p>
              <div className="flex gap-2 justify-center">
                <Button asChild>
                  <Link href="/become-worker">Become a Worker</Link>
                </Button>
                {!isLoggedIn && (
                  <Button variant="outline" asChild>
                    <Link href="/login">Log In</Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Close job confirmation */}
      <AlertDialog open={closeConfirmOpen} onOpenChange={setCloseConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Close this job?</AlertDialogTitle>
            <AlertDialogDescription>
              Workers will no longer be able to apply. You can still see existing
              applicants and contact them directly. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={closing}>Keep Open</AlertDialogCancel>
            <AlertDialogAction onClick={handleClose} disabled={closing}>
              {closing ? (
                <>
                  <Spinner />
                  Closing...
                </>
              ) : (
                "Yes, Close Job"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
