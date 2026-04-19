"use client";

import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Circle,
  Clock,
  MessageSquare,
  Star,
} from "lucide-react";
import Link from "next/link";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { getSupabaseClient } from "@/lib/database/base-query";
import { fireNotificationEmail } from "@/lib/notify";

type BookingDetail = {
  id: string;
  status: string;
  description: string | null;
  customer_id: string;
  requested_at: string | null;
  accepted_at: string | null;
  started_at: string | null;
  completed_at: string | null;
  canceled_at: string | null;
  worker: {
    id: string;
    userId: string | null;
    name: string;
    profession: string;
    avatar: string | null | undefined;
  };
  category: string | null;
};

type TimelineStep = {
  label: string;
  timestamp: string | null;
  completed: boolean;
};

function buildTimeline(booking: BookingDetail): TimelineStep[] {
  const steps: TimelineStep[] = [
    {
      label: "Booking Requested",
      timestamp: booking.requested_at,
      completed: true,
    },
  ];

  if (booking.canceled_at) {
    steps.push({
      label: "Booking Cancelled",
      timestamp: booking.canceled_at,
      completed: true,
    });
    return steps;
  }

  steps.push({
    label: "Booking Accepted",
    timestamp: booking.accepted_at,
    completed: !!booking.accepted_at,
  });

  steps.push({
    label: "Job In Progress",
    timestamp: booking.started_at,
    completed: !!booking.started_at,
  });

  steps.push({
    label: "Service Completed",
    timestamp: booking.completed_at,
    completed: !!booking.completed_at,
  });

  return steps;
}

function formatTimestamp(ts: string | null): string {
  if (!ts) return "Pending";
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function getStatusColor(status: string): string {
  switch (status) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "accepted":
      return "bg-blue-100 text-blue-700";
    case "in_progress":
      return "bg-purple-100 text-purple-700";
    case "completed":
      return "bg-green-100 text-green-700";
    case "canceled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-secondary text-foreground";
  }
}

function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":
      return "Pending";
    case "accepted":
      return "Upcoming";
    case "in_progress":
      return "In Progress";
    case "completed":
      return "Completed";
    case "canceled":
      return "Cancelled";
    default:
      return status.charAt(0).toUpperCase() + status.slice(1);
  }
}

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [cancelConfirmOpen, setCancelConfirmOpen] = useState(false);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function load() {
      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) setCurrentUserId(user.id);

      const { data: bookingData, error } = await supabase
        .from("bookings")
        .select(
          "id, status, description, customer_id, requested_at, accepted_at, started_at, completed_at, canceled_at, worker_id, category_id",
        )
        .eq("id", id)
        .maybeSingle();

      if (error || !bookingData) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const { data: workerData } = await supabase
        .from("workers")
        .select("id, profession, user_id")
        .eq("id", String(bookingData.worker_id))
        .maybeSingle();

      let workerUser = null;
      if (workerData?.user_id) {
        const { data } = await supabase
          .from("users")
          .select("firstname, lastname, profile_pic_url")
          .eq("id", workerData.user_id)
          .maybeSingle();
        workerUser = data;
      }

      let categoryName: string | null = null;
      if (bookingData.category_id) {
        const { data: catData } = await supabase
          .from("categories")
          .select("name")
          .eq("id", bookingData.category_id)
          .maybeSingle();
        categoryName = catData?.name ?? null;
      }

      setBooking({
        id: String(bookingData.id),
        status: bookingData.status,
        description: bookingData.description,
        customer_id: bookingData.customer_id,
        requested_at: bookingData.requested_at,
        accepted_at: bookingData.accepted_at,
        started_at: bookingData.started_at,
        completed_at: bookingData.completed_at,
        canceled_at: bookingData.canceled_at,
        worker: {
          id: workerData?.id ?? "",
          userId: workerData?.user_id ?? null,
          name: workerUser
            ? `${workerUser.firstname} ${workerUser.lastname}`
            : "Unknown Worker",
          profession: workerData?.profession ?? "Service Provider",
          avatar: workerUser?.profile_pic_url,
        },
        category: categoryName,
      });

      setLoading(false);
    }

    load();
  }, [id]);

  async function handleCancel() {
    if (!booking || !currentUserId) return;
    setCanceling(true);

    const supabase = getSupabaseClient();
    await supabase
      .from("bookings")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        canceled_by: currentUserId,
      })
      .eq("id", booking.id)
      .eq("customer_id", currentUserId);

    // Notify the worker that the customer cancelled
    if (booking.worker.userId) {
      const { data: customerProfile } = await supabase
        .from("users")
        .select("firstname, lastname")
        .eq("id", currentUserId)
        .maybeSingle();
      const actorName = customerProfile
        ? `${customerProfile.firstname} ${customerProfile.lastname}`
        : "The customer";
      fireNotificationEmail({
        type: "booking_canceled",
        recipientId: booking.worker.userId,
        actorName,
        bookingId: booking.id,
      });
    }

    setBooking((prev) =>
      prev
        ? { ...prev, status: "canceled", canceled_at: new Date().toISOString() }
        : prev,
    );
    setCanceling(false);
    setCancelConfirmOpen(false);
  }

  const handleSubmitReview = () => {
    setReviewModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Spinner className="size-8" />
      </div>
    );
  }

  if (notFound || !booking) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">Booking not found</h1>
        <p className="text-muted-foreground">
          This booking doesn&apos;t exist or you don&apos;t have access to it.
        </p>
        <Button onClick={() => router.push("/bookings")}>
          Back to Bookings
        </Button>
      </div>
    );
  }

  const timeline = buildTimeline(booking);
  const isCustomer = currentUserId === booking.customer_id;
  const cancelableStatuses = new Set(["pending", "accepted"]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link
          href="/bookings"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Bookings
        </Link>

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              Booking Details
            </h1>
            <p className="text-muted-foreground">Booking ID: #{booking.id}</p>
          </div>
          <Badge className={getStatusColor(booking.status)}>
            {getStatusLabel(booking.status)}
          </Badge>
        </div>

        <div className="grid gap-6">
          {/* Worker Info */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={booking.worker.avatar ?? undefined}
                      alt={booking.worker.name}
                    />
                    <AvatarFallback>
                      {booking.worker.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">
                      {booking.worker.name}
                    </h3>
                    <p className="text-muted-foreground">
                      {booking.worker.profession}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  {booking.worker.id && (
                    <Button variant="outline" asChild>
                      <Link href={`/worker/${booking.worker.id}`}>
                        View Profile
                      </Link>
                    </Button>
                  )}
                  <Button
                    onClick={() =>
                      router.push(`/messages?workerId=${booking.worker.id}`)
                    }
                  >
                    <MessageSquare />
                    Message
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Information */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="font-medium text-foreground">Requested</p>
                  <p className="text-muted-foreground">
                    {formatTimestamp(booking.requested_at)}
                  </p>
                </div>
              </div>

              {booking.category && (
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Category</p>
                    <p className="text-muted-foreground">{booking.category}</p>
                  </div>
                </div>
              )}

              {booking.description && (
                <>
                  <Separator />
                  <div>
                    <p className="font-medium text-foreground mb-2">
                      Job Description
                    </p>
                    <p className="text-muted-foreground leading-relaxed">
                      {booking.description}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Status Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Status Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {timeline.map((step, index) => (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      {step.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-green-600" />
                      ) : (
                        <Circle className="w-6 h-6 text-muted-foreground" />
                      )}
                      {index < timeline.length - 1 && (
                        <div
                          className={`w-0.5 h-12 ${step.completed ? "bg-green-600" : "bg-border"}`}
                        />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <p
                        className={`font-medium ${step.completed ? "text-foreground" : "text-muted-foreground"}`}
                      >
                        {step.label}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatTimestamp(step.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Customer Actions */}
          {isCustomer && cancelableStatuses.has(booking.status) && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">
                      Need to cancel?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Please cancel as early as possible so the worker is notified.
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="text-red-600 dark:text-red-400 hover:text-red-700"
                    onClick={() => setCancelConfirmOpen(true)}
                  >
                    Cancel Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Leave Review */}
          {booking.status === "completed" && (
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold mb-1 text-foreground">
                      How was your experience?
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Leave a review to help other customers
                    </p>
                  </div>
                  <Button onClick={() => setReviewModalOpen(true)}>
                    Leave Review
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Cancel Confirmation */}
      <AlertDialog open={cancelConfirmOpen} onOpenChange={setCancelConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The worker will be notified. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={canceling}>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700 !text-white"
            >
              {canceling ? (
                <>
                  <Spinner className="mr-2" />
                  Cancelling...
                </>
              ) : (
                "Yes, Cancel"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Review Modal */}
      <Dialog open={reviewModalOpen} onOpenChange={setReviewModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Leave a Review</DialogTitle>
            <DialogDescription>
              Share your experience with {booking.worker.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="space-y-2">
              <Label>Rating</Label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`w-8 h-8 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="review">Your Review</Label>
              <Textarea
                id="review"
                placeholder="Tell us about your experience..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={4}
              />
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setReviewModalOpen(false)}
                className="flex-1 bg-transparent"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                className="flex-1"
                disabled={rating === 0 || !reviewText.trim()}
              >
                Submit Review
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
