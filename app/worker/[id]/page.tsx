"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BookingModal } from "@/components/booking-modal";
import { WorkerAbout } from "@/components/worker/worker-about";
import { WorkerAvailability } from "@/components/worker/worker-availability";
import { WorkerGallery } from "@/components/worker/worker-gallery";
import { WorkerProfileHeader } from "@/components/worker/worker-profile-header";
import { WorkerTestimonials } from "@/components/worker/worker-testimonials";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { getSupabaseClient } from "@/lib/database/base-query";
import { getWorkerWithDetails } from "@/lib/database/queries/workers";
import {
  isWorkerSaved,
  toggleSavedWorker,
} from "@/lib/database/queries/saved-workers";
import type { WorkerWithDetails } from "@/lib/database/types";
import {
  formatJoinedDate,
  formatRelativeDate,
  formatResponseTime,
} from "@/lib/formatters";

type PortfolioItem = {
  id: number;
  image: string | null;
  title: string;
  description: string;
  price?: number;
};

type ReviewItem = {
  id: number;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string | null | undefined;
};

export default function WorkerProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [worker, setWorker] = useState<WorkerWithDetails | null>(null);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [availability, setAvailability] = useState<{
    [day: string]: string;
  } | null>(null);

  useEffect(() => {
    async function loadData() {
      const { data: workerData, error } = await getWorkerWithDetails(id);

      if (error || !workerData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setWorker(workerData);

      const supabase = getSupabaseClient();

      const [postsResult, ratingsResult, availabilityResult] =
        await Promise.all([
          supabase
            .from("workers_posts")
            .select("id, title, content, media_url")
            .eq("worker_id", id)
            .order("created_at", { ascending: false }),
          supabase
            .from("ratings")
            .select(
              "id, rating_value, review_comment, created_at, customer:users(firstname, lastname, profile_pic_url)",
            )
            .eq("worker_id", id)
            .order("created_at", { ascending: false })
            .limit(5),
          supabase
            .from("worker_availability")
            .select("schedule")
            .eq("worker_id", id)
            .maybeSingle(),
        ]);

      if (postsResult.data) {
        setPortfolio(
          postsResult.data.map((post) => ({
            id: post.id,
            image: post.media_url ?? null,
            title: post.title ?? "Portfolio Item",
            description: post.content ?? "",
          })),
        );
      }

      if (ratingsResult.data) {
        setReviews(
          ratingsResult.data
            .filter((r) => r.rating_value != null && r.review_comment)
            .map((r) => {
              const customer = Array.isArray(r.customer)
                ? r.customer[0]
                : r.customer;
              const name = customer
                ? `${customer.firstname} ${customer.lastname[0]}.`
                : "Anonymous";
              return {
                id: r.id,
                author: name,
                rating: r.rating_value as number,
                date: formatRelativeDate(r.created_at),
                comment: r.review_comment as string,
                avatar: customer?.profile_pic_url,
              };
            }),
        );
      }

      if (availabilityResult.data?.schedule) {
        const raw = availabilityResult.data.schedule as Record<string, string>;
        // Reconstruct in Mon–Sun order so Object.entries renders correctly
        const ordered: { [day: string]: string } = {};
        for (const day of [
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
          "sunday",
        ]) {
          if (raw[day]) ordered[day] = raw[day];
        }
        setAvailability(ordered);
      }

      const saved = await isWorkerSaved(id);
      setIsBookmarked(saved);

      setLoading(false);
    }

    loadData();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (notFound || !worker) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Worker not found</h1>
        <p className="text-muted-foreground">
          This worker profile doesn&apos;t exist or may have been removed.
        </p>
        <Button onClick={() => router.push("/search")}>Browse Workers</Button>
      </div>
    );
  }

  async function handleBookmarkToggle(newValue: boolean) {
    setIsBookmarked(newValue);
    const supabase = getSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setIsBookmarked(!newValue);
      toast.error("Please log in to save workers");
      return;
    }
    await toggleSavedWorker(id);
    toast.success(newValue ? "Worker saved" : "Removed from saved");
  }

  const u = worker.user;
  const workerHeaderData = {
    id: worker.id,
    name: u ? `${u.firstname} ${u.lastname}` : "Unknown Worker",
    profession: worker.profession ?? "Service Provider",
    rating: Math.round((worker.average_rating ?? 0) * 10) / 10,
    reviews: worker.review_count ?? 0,
    hourlyRate: worker.hourly_rate_min ?? 0,
    location:
      worker.location ??
      (u
        ? [u.city, u.state].filter(Boolean).join(", ") || "Location not set"
        : "Location not set"),
    avatar: u?.profile_pic_url ?? undefined,
    isOnline: worker.is_online ?? false,
    verified: worker.is_verified ?? false,
    joinedDate: formatJoinedDate(worker.created_at),
    completedJobs: worker.jobs_completed ?? 0,
    responseTime:
      formatResponseTime(worker.response_time_minutes ?? null) ||
      "Not specified",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <WorkerProfileHeader
          worker={workerHeaderData}
          isBookmarked={isBookmarked}
          onMessage={() => router.push(`/messages?workerId=${worker.id}`)}
          onBookNow={() => setBookingModalOpen(true)}
          onBookmarkToggle={handleBookmarkToggle}
        />

        {portfolio.length > 0 && (
          <WorkerGallery
            portfolio={portfolio}
            onBookNow={() => router.push(`/messages?workerId=${worker.id}`)}
          />
        )}

        <WorkerAbout
          bio={u?.bio ?? "No bio available."}
          skills={worker.skills ?? []}
        />

        <WorkerTestimonials
          rating={Math.round((worker.average_rating ?? 0) * 10) / 10}
          reviewCount={worker.review_count ?? 0}
          reviews={reviews}
          workerId={worker.id}
          workerName={workerHeaderData.name}
        />

        {availability && <WorkerAvailability availability={availability} />}
      </div>

      <BookingModal
        open={bookingModalOpen}
        onOpenChange={setBookingModalOpen}
        workerId={worker.id}
        workerName={workerHeaderData.name}
        workerProfession={workerHeaderData.profession}
        hourlyRate={workerHeaderData.hourlyRate}
      />
    </div>
  );
}
