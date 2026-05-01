"use client";

import { Calendar, Filter, Lightbulb, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getSupabaseClient } from "@/lib/database/base-query";
import { formatBookingDate, formatBookingTime } from "@/lib/formatters";
import { fireNotificationEmail } from "@/lib/notify";
import { getStatusColor, getStatusLabel } from "@/lib/status-utils";

type BookingItem = {
  id: string;
  worker: {
    id: string;
    userId: string | null;
    name: string;
    profession: string;
    avatar: string | null | undefined;
  };
  requestedAt: string | null;
  status: string;
  description: string | null;
  category: string | null;
};

export default function BookingsPage() {
  const router = useRouter();
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("date-desc");
  const [loading, setLoading] = useState(true);
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [cancelConfirmId, setCancelConfirmId] = useState<string | null>(null);
  const [canceling, setCanceling] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);

      const supabase = getSupabaseClient();

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      setUserId(user.id);

      let query = supabase
        .from("bookings")
        .select("id, status, description, requested_at, worker_id, category_id")
        .eq("customer_id", user.id);

      if (filterStatus === "upcoming") {
        query = query.in("status", ["pending", "accepted", "in_progress"]);
      } else if (filterStatus === "completed") {
        query = query.eq("status", "completed");
      } else if (filterStatus === "cancelled") {
        query = query.eq("status", "canceled");
      }

      query = query.order("requested_at", { ascending: sortBy === "date-asc" });

      const { data: bookingsData } = await query;
      if (!bookingsData || bookingsData.length === 0) {
        setBookings([]);
        setLoading(false);
        return;
      }

      const workerIds = [
        ...new Set(bookingsData.map((b) => b.worker_id).filter(Boolean)),
      ];
      const categoryIds = [
        ...new Set(bookingsData.map((b) => b.category_id).filter(Boolean)),
      ];

      const [workersResult, categoriesResult] = await Promise.all([
        supabase
          .from("workers")
          .select("id, profession, user_id")
          .in("id", workerIds),
        supabase.from("categories").select("id, name").in("id", categoryIds),
      ]);

      const userIds = [
        ...new Set(
          (workersResult.data ?? []).map((w) => w.user_id).filter(Boolean),
        ),
      ];
      const { data: usersData } = userIds.length
        ? await supabase
            .from("users")
            .select("id, firstname, lastname, profile_pic_url")
            .in("id", userIds)
        : { data: [] };

      const userMap = new Map((usersData ?? []).map((u) => [u.id, u]));
      const workerMap = new Map(
        (workersResult.data ?? []).map((w) => [w.id, w]),
      );
      const categoryMap = new Map(
        (categoriesResult.data ?? []).map((c) => [String(c.id), c]),
      );

      setBookings(
        bookingsData.map((b) => {
          const worker = workerMap.get(b.worker_id);
          const workerUser = worker ? userMap.get(worker.user_id) : null;
          const category = categoryMap.get(String(b.category_id));
          return {
            id: String(b.id),
            worker: {
              id: worker?.id ?? "",
              userId: worker?.user_id ?? null,
              name: workerUser
                ? `${workerUser.firstname} ${workerUser.lastname}`
                : "Unknown Worker",
              profession: worker?.profession ?? "Service Provider",
              avatar: workerUser?.profile_pic_url,
            },
            requestedAt: b.requested_at,
            status: b.status,
            description: b.description,
            category: category?.name ?? null,
          };
        }),
      );

      setLoading(false);
    }

    load();
  }, [filterStatus, sortBy]);

  async function handleCancelConfirm() {
    if (!cancelConfirmId || !userId) return;
    setCanceling(true);

    const supabase = getSupabaseClient();
    await supabase
      .from("bookings")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        canceled_by: userId,
      })
      .eq("id", cancelConfirmId)
      .eq("customer_id", userId);

    // Notify the worker
    const booking = bookings.find((b) => b.id === cancelConfirmId);
    if (booking?.worker.userId) {
      const { data: customerProfile } = await supabase
        .from("users")
        .select("firstname, lastname")
        .eq("id", userId)
        .maybeSingle();
      const actorName = customerProfile
        ? `${customerProfile.firstname} ${customerProfile.lastname}`
        : "The customer";
      fireNotificationEmail({
        type: "booking_canceled",
        recipientId: booking.worker.userId,
        actorName,
        bookingId: cancelConfirmId,
      });
    }

    setBookings((prev) =>
      prev.map((b) =>
        b.id === cancelConfirmId ? { ...b, status: "canceled" } : b,
      ),
    );

    setCanceling(false);
    setCancelConfirmId(null);
  }

  const cancelableStatuses = new Set(["pending", "accepted"]);

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8 flex flex-col min-h-screen">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            My Bookings
          </h1>
          <p className="text-muted-foreground">
            Manage your service bookings and view history
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
          <Tabs
            value={filterStatus}
            onValueChange={setFilterStatus}
            className="w-full md:w-auto"
          >
            <TabsList className="w-full md:w-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
            </TabsList>
          </Tabs>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[45]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-desc">Newest First</SelectItem>
              <SelectItem value="date-asc">Oldest First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-1 items-center justify-center">
            <Spinner className="size-8" />
          </div>
        ) : bookings.length === 0 ? (
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Calendar />
              </EmptyMedia>
              <EmptyTitle>No Bookings Yet</EmptyTitle>
              <EmptyDescription>
                You haven&apos;t made any bookings. Browse our directory to find
                service workers, or suggest new job categories you&apos;d like
                to see.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="flex flex-col sm:flex-row gap-2 justify-center">
              <Button
                size="sm"
                className="w-full sm:w-auto"
                onClick={() => router.push("/search")}
              >
                <Search />
                Browse Workers
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full sm:w-auto"
                onClick={() => router.push("/suggest-jobs")}
              >
                <Lightbulb />
                Suggest Jobs
              </Button>
            </EmptyContent>
          </Empty>
        ) : (
          <div className="space-y-4 flex flex-col">
            {bookings.map((booking) => (
              <Card
                key={booking.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col md:flex-row gap-6">
                    {/* Worker Info */}
                    <div className="flex items-start gap-4 flex-1">
                      <Avatar className="w-16 h-16">
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
                        <h3 className="font-semibold text-lg text-foreground">
                          {booking.worker.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {booking.worker.profession}
                        </p>
                        <Badge
                          className={`mt-2 ${getStatusColor(booking.status)}`}
                        >
                          {getStatusLabel(booking.status)}
                        </Badge>
                      </div>
                    </div>

                    {/* Booking Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-muted-foreground mt-0.5" />
                        <div className="flex gap-4">
                          <p className="font-medium text-foreground">
                            {formatBookingDate(booking.requestedAt)}
                          </p>
                          <p className="text-muted-foreground">
                            {formatBookingTime(booking.requestedAt)}
                          </p>
                        </div>
                      </div>

                      {booking.category && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {booking.category}
                        </p>
                      )}

                      {booking.description && (
                        <p className="text-sm text-muted-foreground pl-6">
                          {booking.description}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col items-end justify-center gap-2">
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/bookings/${booking.id}`}>
                          View Details
                        </Link>
                      </Button>
                      {cancelableStatuses.has(booking.status) && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                          onClick={() => setCancelConfirmId(booking.id)}
                        >
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === "completed" && (
                        <Button size="sm" asChild>
                          <Link href={`/bookings/${booking.id}`}>
                            Leave Review
                          </Link>
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

      {/* Cancel Confirmation */}
      <AlertDialog
        open={cancelConfirmId !== null}
        onOpenChange={(open) => !open && setCancelConfirmId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this booking?</AlertDialogTitle>
            <AlertDialogDescription>
              The worker will be notified. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={canceling}>
              Keep Booking
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              disabled={canceling}
              className="bg-red-600 hover:bg-red-700 text-white!"
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
    </div>
  );
}
