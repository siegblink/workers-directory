"use client";

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  Star,
  TrendingUp,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";

type DashboardStats = {
  totalBookings: number;
  thisMonthBookings: number;
  pendingBookings: number;
  completedJobs: number;
  averageRating: number;
  totalReviews: number;
  completionRate: number;
};

type DashboardBooking = {
  id: number;
  customer: { name: string; avatar: string | null | undefined };
  category: string | null;
  description: string | null;
  requestedAt: string | null;
  status: string;
};

type DashboardReview = {
  id: number;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

function formatBookingDate(dateString: string | null): string {
  if (!dateString) return "Date TBD";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatBookingTime(dateString: string | null): string {
  if (!dateString) return "";
  return new Date(dateString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function WorkerDashboardPage() {
  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "verified" | "pending" | "not_verified"
  >("loading");
  const [loading, setLoading] = useState(true);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingBookings, setPendingBookings] = useState<DashboardBooking[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<DashboardBooking[]>([]);
  const [recentReviews, setRecentReviews] = useState<DashboardReview[]>([]);

  const loadDashboard = useCallback(async () => {
    setLoading(true);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setVerificationStatus("not_verified");
      setLoading(false);
      return;
    }

    // Parallel: find worker record + check verification status
    const [workerResult, verificationResult] = await Promise.all([
      supabase
        .from("workers")
        .select("id")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .limit(1)
        .maybeSingle(),
      supabase
        .from("verifications")
        .select("status")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

    // Set verification banner state
    const verification = verificationResult.data;
    if (!verification) {
      setVerificationStatus("not_verified");
    } else if (verification.status === "approved") {
      setVerificationStatus("verified");
    } else {
      setVerificationStatus("pending");
    }

    // No worker profile — stop here
    if (!workerResult.data) {
      setLoading(false);
      return;
    }

    const wid = workerResult.data.id as string;
    setWorkerId(wid);

    // Parallel: all bookings for stats, view data, pending, upcoming, reviews
    const [
      allBookingsResult,
      viewResult,
      pendingResult,
      upcomingResult,
      reviewsResult,
    ] = await Promise.all([
      supabase
        .from("bookings")
        .select("id, status, requested_at")
        .eq("worker_id", wid),
      supabase
        .from("workers_with_details")
        .select("average_rating, review_count")
        .eq("id", wid)
        .maybeSingle(),
      supabase
        .from("bookings")
        .select("id, status, description, requested_at, customer_id, category_id")
        .eq("worker_id", wid)
        .eq("status", "pending")
        .order("requested_at", { ascending: false }),
      supabase
        .from("bookings")
        .select("id, status, description, requested_at, customer_id, category_id")
        .eq("worker_id", wid)
        .eq("status", "accepted")
        .order("requested_at", { ascending: true }),
      supabase
        .from("ratings")
        .select("id, customer_id, rating_value, review_comment, created_at")
        .eq("worker_id", wid)
        .order("created_at", { ascending: false })
        .limit(5),
    ]);

    // Compute stats
    const allBookings = allBookingsResult.data ?? [];
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

    const pending = allBookings.filter((b) => b.status === "pending").length;
    const completed = allBookings.filter((b) => b.status === "completed").length;
    const canceled = allBookings.filter((b) => b.status === "canceled").length;
    const thisMonth = allBookings.filter(
      (b) => b.requested_at && b.requested_at >= monthStart,
    ).length;
    const nonPending = completed + canceled;
    const completionRate = nonPending > 0 ? Math.round((completed / nonPending) * 100) : 0;

    const viewData = viewResult.data;
    setStats({
      totalBookings: allBookings.length,
      thisMonthBookings: thisMonth,
      pendingBookings: pending,
      completedJobs: completed,
      averageRating: viewData ? Math.round((parseFloat(String(viewData.average_rating)) || 0) * 10) / 10 : 0,
      totalReviews: viewData ? parseInt(String(viewData.review_count), 10) || 0 : 0,
      completionRate,
    });

    // Batch-resolve names for bookings + reviews
    const pendingData = pendingResult.data ?? [];
    const upcomingData = upcomingResult.data ?? [];
    const reviewsData = reviewsResult.data ?? [];

    const bookingCustomerIds = [
      ...new Set([
        ...pendingData.map((b) => b.customer_id),
        ...upcomingData.map((b) => b.customer_id),
      ].filter(Boolean)),
    ];
    const reviewCustomerIds = [
      ...new Set(reviewsData.map((r) => r.customer_id).filter(Boolean)),
    ];
    const allCustomerIds = [...new Set([...bookingCustomerIds, ...reviewCustomerIds])];

    const categoryIds = [
      ...new Set([
        ...pendingData.map((b) => b.category_id),
        ...upcomingData.map((b) => b.category_id),
      ].filter(Boolean)),
    ];

    const [usersResult, categoriesResult] = await Promise.all([
      allCustomerIds.length
        ? supabase
            .from("users")
            .select("id, firstname, lastname, profile_pic_url")
            .in("id", allCustomerIds)
        : Promise.resolve({ data: [] }),
      categoryIds.length
        ? supabase.from("categories").select("id, name").in("id", categoryIds)
        : Promise.resolve({ data: [] }),
    ]);

    const userMap = new Map(
      (usersResult.data ?? []).map((u) => [u.id, u]),
    );
    const categoryMap = new Map(
      (categoriesResult.data ?? []).map((c) => [c.id, c]),
    );

    function toBookingItem(b: {
      id: number;
      customer_id: string;
      category_id: number | null;
      description: string | null;
      requested_at: string | null;
      status: string;
    }): DashboardBooking {
      const cu = userMap.get(b.customer_id);
      const cat = b.category_id ? categoryMap.get(b.category_id) : null;
      return {
        id: b.id,
        customer: {
          name: cu ? `${cu.firstname} ${cu.lastname}` : "Unknown Customer",
          avatar: cu?.profile_pic_url,
        },
        category: cat?.name ?? null,
        description: b.description,
        requestedAt: b.requested_at,
        status: b.status,
      };
    }

    setPendingBookings(pendingData.map(toBookingItem));
    setUpcomingBookings(upcomingData.map(toBookingItem));

    setRecentReviews(
      reviewsData.map((r) => {
        const cu = userMap.get(r.customer_id);
        return {
          id: r.id,
          customerName: cu ? `${cu.firstname} ${cu.lastname}` : "Anonymous",
          rating: r.rating_value ?? 0,
          comment: r.review_comment,
          createdAt: r.created_at,
        };
      }),
    );

    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  async function handleAccept(bookingId: number) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", bookingId);
    loadDashboard();
  }

  async function handleDecline(bookingId: number) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("id", bookingId);
    loadDashboard();
  }

  async function handleCancel(bookingId: number) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("id", bookingId);
    loadDashboard();
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your bookings and track your performance
          </p>
        </div>

        {/* Verification Reminder Banner */}
        {verificationStatus === "not_verified" && (
          <Alert className="mb-6 border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <AlertTitle className="text-blue-900 dark:text-blue-100">
              Complete Your Verification
            </AlertTitle>
            <AlertDescription className="text-blue-800 dark:text-blue-200">
              Get verified to increase your visibility and receive more
              bookings.{" "}
              <Link href="/verify" className="underline hover:no-underline">
                Verify now
              </Link>
            </AlertDescription>
          </Alert>
        )}

        {verificationStatus === "pending" && (
          <Alert className="mb-6 border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20">
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <AlertTitle className="text-yellow-900 dark:text-yellow-100">
              Verification In Progress
            </AlertTitle>
            <AlertDescription className="text-yellow-800 dark:text-yellow-200">
              Your verification is being reviewed. This usually takes 24-48
              hours.
            </AlertDescription>
          </Alert>
        )}

        {/* Promotion Banner */}
        <Card className="mb-6 bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 border-yellow-200 dark:border-yellow-800">
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-yellow-400 dark:bg-yellow-600 rounded-full flex items-center justify-center">
                  <Crown className="w-6 h-6 text-yellow-900 dark:text-yellow-100" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1 text-foreground">
                    Boost Your Profile
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Get featured at the top of search results and get 3x more
                    bookings
                  </p>
                </div>
              </div>
              <Button
                className="bg-yellow-600 hover:bg-yellow-700 dark:bg-yellow-700 dark:hover:bg-yellow-800"
                asChild
              >
                <Link href="/dashboard/promote">Get Prioritized Now</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {(stats?.totalBookings ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-green-600 dark:text-green-400 flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3 h-3" />+
                    {stats?.thisMonthBookings ?? 0} this month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Pending Requests
                  </CardTitle>
                  <AlertCircle className="w-4 h-4 text-orange-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats?.pendingBookings ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Awaiting your response
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Completed Jobs
                  </CardTitle>
                  <CheckCircle2 className="w-4 h-4 text-green-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats?.completedJobs ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.completionRate ?? 0}% completion rate
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Average Rating
                  </CardTitle>
                  <Star className="w-4 h-4 text-yellow-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {stats?.averageRating
                      ? stats.averageRating.toFixed(1)
                      : "—"}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stats?.totalReviews ?? 0} reviews
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="pending" className="space-y-6">
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Requests
                  {pendingBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming">Upcoming Jobs</TabsTrigger>
                <TabsTrigger value="performance">Performance</TabsTrigger>
              </TabsList>

              {/* Pending Requests Tab */}
              <TabsContent value="pending">
                <div className="space-y-4">
                  {pendingBookings.map((request) => (
                    <Card key={request.id}>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={
                                  request.customer.avatar || undefined
                                }
                                alt={request.customer.name}
                              />
                              <AvatarFallback>
                                {request.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">
                                {request.customer.name}
                              </h3>
                              {request.category && (
                                <p className="text-sm text-muted-foreground">
                                  {request.category}
                                </p>
                              )}
                              {request.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {request.description}
                                </p>
                              )}
                              <Badge variant="secondary" className="mt-2">
                                New Request
                              </Badge>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {formatBookingDate(request.requestedAt)}
                                {request.requestedAt && (
                                  <>
                                    {" "}
                                    at {formatBookingTime(request.requestedAt)}
                                  </>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-center gap-2">
                            <Button
                              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                              onClick={() => handleAccept(request.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="outline"
                              className="bg-transparent w-full md:w-auto"
                              onClick={() => handleDecline(request.id)}
                            >
                              <XCircle />
                              Decline
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {pendingBookings.length === 0 && (
                    <Card>
                      <CardContent className="text-center">
                        <AlertCircle className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Pending Requests
                        </h3>
                        <p className="text-muted-foreground">
                          You&apos;re all caught up! New booking requests will
                          appear here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Upcoming Jobs Tab */}
              <TabsContent value="upcoming">
                <div className="space-y-4">
                  {upcomingBookings.map((job) => (
                    <Card key={job.id}>
                      <CardContent>
                        <div className="flex flex-col md:flex-row gap-6">
                          <div className="flex items-start gap-4 flex-1">
                            <Avatar className="w-16 h-16">
                              <AvatarImage
                                src={job.customer.avatar || undefined}
                                alt={job.customer.name}
                              />
                              <AvatarFallback>
                                {job.customer.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <h3 className="font-semibold text-lg text-foreground">
                                {job.customer.name}
                              </h3>
                              {job.category && (
                                <p className="text-sm text-muted-foreground">
                                  {job.category}
                                </p>
                              )}
                              {job.description && (
                                <p className="text-sm text-muted-foreground mt-1">
                                  {job.description}
                                </p>
                              )}
                              <Badge className="mt-2 bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                Confirmed
                              </Badge>
                            </div>
                          </div>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center gap-2 text-sm">
                              <Calendar className="w-4 h-4 text-muted-foreground" />
                              <span>
                                {formatBookingDate(job.requestedAt)}
                                {job.requestedAt && (
                                  <> at {formatBookingTime(job.requestedAt)}</>
                                )}
                              </span>
                            </div>
                          </div>

                          <div className="flex flex-col items-end justify-center gap-2">
                            <Button variant="outline" asChild>
                              <Link href={`/bookings/${job.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              className="text-red-600 hover:text-red-700 bg-transparent"
                              onClick={() => handleCancel(job.id)}
                            >
                              Cancel Job
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {upcomingBookings.length === 0 && (
                    <Card>
                      <CardContent className="text-center">
                        <CheckCircle2 className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Upcoming Jobs
                        </h3>
                        <p className="text-muted-foreground">
                          Accepted bookings will appear here.
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </TabsContent>

              {/* Performance Tab */}
              <TabsContent value="performance">
                <div className="grid gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Performance Metrics</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Completion Rate
                            </span>
                            <span className="text-sm font-bold">
                              {stats?.completionRate ?? 0}%
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-blue-600 dark:bg-blue-700 h-2 rounded-full"
                              style={{
                                width: `${stats?.completionRate ?? 0}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            Based on completed vs canceled jobs
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">
                              Average Rating
                            </span>
                            <span className="text-sm font-bold">
                              {stats?.averageRating
                                ? `${stats.averageRating.toFixed(1)} / 5`
                                : "No ratings yet"}
                            </span>
                          </div>
                          <div className="w-full bg-secondary rounded-full h-2">
                            <div
                              className="bg-yellow-500 dark:bg-yellow-600 h-2 rounded-full"
                              style={{
                                width: `${((stats?.averageRating ?? 0) / 5) * 100}%`,
                              }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground mt-1">
                            {stats?.totalReviews ?? 0} total reviews
                          </p>
                        </div>
                      </div>

                      <div className="pt-6 border-t">
                        <h4 className="font-semibold mb-4 text-foreground">
                          Recent Reviews
                        </h4>
                        {recentReviews.length > 0 ? (
                          <div className="space-y-4">
                            {recentReviews.map((review) => (
                              <div key={review.id} className="flex gap-3">
                                <Avatar>
                                  <AvatarFallback>
                                    {review.customerName[0]}
                                  </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-medium text-sm text-foreground">
                                      {review.customerName}
                                    </span>
                                    <div className="flex">
                                      {Array.from({
                                        length: review.rating,
                                      }).map((_, i) => (
                                        <Star
                                          key={`${review.id}-star-${i}`}
                                          className="w-3 h-3 fill-yellow-400 text-yellow-400"
                                        />
                                      ))}
                                    </div>
                                  </div>
                                  {review.comment && (
                                    <p className="text-sm text-muted-foreground">
                                      {review.comment}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-sm text-muted-foreground">
                            No reviews yet. Complete jobs to start receiving
                            feedback.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}
