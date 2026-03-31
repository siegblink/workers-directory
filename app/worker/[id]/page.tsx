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
import { getSupabaseClient } from "@/lib/database/base-query";
import { getWorkerWithDetails } from "@/lib/database/queries/workers";
import type { WorkerWithDetails } from "@/lib/database/types";

type PortfolioItem = {
  id: number;
  image: string;
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
  avatar: string;
};

function formatResponseTime(minutes: number | null): string {
  if (!minutes) return "Not specified";
  if (minutes < 60) return `Within ${minutes} min`;
  const hours = Math.round(minutes / 60);
  return `Within ${hours} hour${hours > 1 ? "s" : ""}`;
}

function formatJoinedDate(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatRelativeDate(dateString: string): string {
  const diffDays = Math.floor(
    (Date.now() - new Date(dateString).getTime()) / 86_400_000,
  );
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  const weeks = Math.floor(diffDays / 7);
  if (diffDays < 30) return `${weeks} week${weeks > 1 ? "s" : ""} ago`;
  const months = Math.floor(diffDays / 30);
  if (diffDays < 365) return `${months} month${months > 1 ? "s" : ""} ago`;
  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? "s" : ""} ago`;
}

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

      const [postsResult, ratingsResult, availabilityResult] = await Promise.all(
        [
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
            .limit(10),
          supabase
            .from("worker_availability")
            .select("day_of_week, hours")
            .eq("worker_id", id)
            .order("sort_order"),
        ],
      );

      if (postsResult.data) {
        setPortfolio(
          postsResult.data.map((post) => ({
            id: post.id,
            image: post.media_url ?? "/placeholder.svg",
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
                avatar: customer?.profile_pic_url ?? "/placeholder.svg",
              };
            }),
        );
      }

      if (availabilityResult.data && availabilityResult.data.length > 0) {
        const schedule: { [day: string]: string } = {};
        for (const row of availabilityResult.data) {
          schedule[row.day_of_week] = row.hours;
        }
        setAvailability(schedule);
      }

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

  const u = worker.user;
  const workerHeaderData = {
    id: worker.id,
    name: u ? `${u.firstname} ${u.lastname}` : "Unknown Worker",
    profession: worker.profession ?? "Service Provider",
    rating: worker.average_rating ?? 0,
    reviews: worker.review_count ?? 0,
    hourlyRate: worker.hourly_rate_min ?? 0,
    location:
      worker.location ??
      (u
        ? [u.city, u.state].filter(Boolean).join(", ") || "Location not set"
        : "Location not set"),
    avatar: u?.profile_pic_url ?? "/placeholder.svg",
    isOnline: worker.is_online ?? false,
    verified: worker.is_verified ?? false,
    joinedDate: formatJoinedDate(worker.created_at),
    completedJobs: worker.jobs_completed ?? 0,
    responseTime: formatResponseTime(worker.response_time_minutes ?? null),
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <WorkerProfileHeader
          worker={workerHeaderData}
          isBookmarked={isBookmarked}
          onMessage={() => router.push(`/messages?workerId=${worker.id}`)}
          onBookNow={() => setBookingModalOpen(true)}
          onBookmarkToggle={setIsBookmarked}
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
          rating={worker.average_rating ?? 0}
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
        workerName={workerHeaderData.name}
        workerProfession={workerHeaderData.profession}
        hourlyRate={workerHeaderData.hourlyRate}
      />
    </div>
  );
}
