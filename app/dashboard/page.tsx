"use client";

import {
  AlertCircle,
  Bookmark,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock,
  Crown,
  MapPin,
  Play,
  PlusCircle,
  Star,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createClient } from "@/lib/supabase/client";
import { fireNotificationEmail } from "@/lib/notify";
import {
  getSavedWorkersWithDetails,
  toggleSavedWorker,
} from "@/lib/database/queries/saved-workers";
import {
  closeJobPost,
  getMyJobPosts,
  type JobPost,
} from "@/lib/database/queries/jobs";

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
  id: string;
  customerId: string;
  customer: { name: string; avatar: string | null | undefined };
  category: string | null;
  description: string | null;
  requestedAt: string | null;
  status: string;
};

type DashboardReview = {
  id: string;
  customerName: string;
  rating: number;
  comment: string | null;
  createdAt: string;
};

type CustomerDashboardStats = {
  totalBookings: number;
  activeBookings: number;
  savedWorkersCount: number;
};

type CustomerDashboardBooking = {
  id: string;
  worker: { id: string; name: string; profession: string; avatar: string | null };
  requestedAt: string | null;
  status: string;
  category: string | null;
};

type CustomerSavedWorker = {
  id: string;
  name: string;
  profession: string;
  rating: number;
  hourlyRate: number;
  avatar: string;
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

function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pending: "Pending",
    accepted: "Upcoming",
    in_progress: "In Progress",
    completed: "Completed",
    canceled: "Cancelled",
  };
  return labels[status] ?? status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
    accepted:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
    in_progress:
      "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    completed:
      "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    canceled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  };
  return colors[status] ?? "bg-secondary text-foreground";
}

const VALID_TABS = ["pending", "upcoming", "active", "performance"] as const;
type TabValue = (typeof VALID_TABS)[number];

export default function WorkerDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (
    VALID_TABS.includes(searchParams.get("tab") as TabValue)
      ? searchParams.get("tab")
      : "pending"
  ) as TabValue;

  const [verificationStatus, setVerificationStatus] = useState<
    "loading" | "verified" | "pending" | "not_verified"
  >("loading");
  const [loading, setLoading] = useState(true);
  const [isWorker, setIsWorker] = useState<boolean | null>(null);

  useEffect(() => {
    if (isWorker === null) return; // still loading — don't touch the URL yet
    if (isWorker === false) {
      // Customers don't use URL-synced tabs; strip any worker tab param
      if (searchParams.get("tab")) router.replace("/dashboard");
      return;
    }
    // Worker: enforce a valid tab in the URL
    if (!VALID_TABS.includes(searchParams.get("tab") as TabValue)) {
      router.replace("/dashboard?tab=pending");
    }
  }, [isWorker, router, searchParams]);

  function handleTabChange(tab: string) {
    router.replace(`/dashboard?tab=${tab}`);
  }
  const currentUserRef = useRef<SupabaseUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [pendingBookings, setPendingBookings] = useState<DashboardBooking[]>(
    [],
  );
  const [upcomingBookings, setUpcomingBookings] = useState<DashboardBooking[]>(
    [],
  );
  const [activeBookings, setActiveBookings] = useState<DashboardBooking[]>([]);
  const [recentReviews, setRecentReviews] = useState<DashboardReview[]>([]);

  const [customerStats, setCustomerStats] =
    useState<CustomerDashboardStats | null>(null);
  const [customerRecentBookings, setCustomerRecentBookings] = useState<
    CustomerDashboardBooking[]
  >([]);
  const [customerSavedWorkers, setCustomerSavedWorkers] = useState<
    CustomerSavedWorker[]
  >([]);
  const [customerJobPosts, setCustomerJobPosts] = useState<JobPost[]>([]);
  const [customerTab, setCustomerTab] = useState<"bookings" | "saved" | "jobs">(
    "bookings",
  );

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
    currentUserRef.current = user;

    // Find worker record (is_verified drives the verification banner)
    const workerResult = await supabase
      .from("workers")
      .select("id, is_verified")
      .eq("user_id", user.id)
      .is("deleted_at", null)
      .limit(1)
      .maybeSingle();

    setVerificationStatus(
      workerResult.data?.is_verified ? "verified" : "not_verified",
    );

    // No worker profile — load customer dashboard data
    if (!workerResult.data) {
      setIsWorker(false);

      const [allCustResult, recentCustResult, savedWorkers, jobPosts] =
        await Promise.all([
          supabase
            .from("bookings")
            .select("id, status")
            .eq("customer_id", user.id),
          supabase
            .from("bookings")
            .select(
              "id, status, description, requested_at, worker_id, category_id",
            )
            .eq("customer_id", user.id)
            .order("requested_at", { ascending: false })
            .limit(5),
          getSavedWorkersWithDetails(),
          getMyJobPosts(),
        ]);

      const allCustBookings = allCustResult.data ?? [];
      const activeStatuses = new Set(["pending", "accepted", "in_progress"]);
      setCustomerStats({
        totalBookings: allCustBookings.length,
        activeBookings: allCustBookings.filter((b) =>
          activeStatuses.has(b.status),
        ).length,
        savedWorkersCount: savedWorkers.length,
      });
      setCustomerSavedWorkers(savedWorkers.slice(0, 5) as CustomerSavedWorker[]);
      setCustomerJobPosts(jobPosts);

      const recentData = recentCustResult.data ?? [];
      if (recentData.length > 0) {
        const workerIds = [
          ...new Set(recentData.map((b) => b.worker_id).filter(Boolean)),
        ];
        const categoryIds = [
          ...new Set(recentData.map((b) => b.category_id).filter(Boolean)),
        ];

        const [workersResult, catsResult] = await Promise.all([
          workerIds.length
            ? supabase
                .from("workers")
                .select("id, profession, user_id")
                .in("id", workerIds)
            : Promise.resolve({ data: [] as { id: string; profession: string | null; user_id: string }[] }),
          categoryIds.length
            ? supabase
                .from("categories")
                .select("id, name")
                .in("id", categoryIds)
            : Promise.resolve({ data: [] as { id: number; name: string }[] }),
        ]);

        const workerUserIds = [
          ...new Set(
            (workersResult.data ?? []).map((w) => w.user_id).filter(Boolean),
          ),
        ];
        const { data: workerUsersData } = workerUserIds.length
          ? await supabase
              .from("users")
              .select("id, firstname, lastname, profile_pic_url")
              .in("id", workerUserIds)
          : { data: [] as { id: string; firstname: string; lastname: string; profile_pic_url: string | null }[] };

        const workerMap = new Map(
          (workersResult.data ?? []).map((w) => [w.id, w]),
        );
        const workerUserMap = new Map(
          (workerUsersData ?? []).map((u) => [u.id, u]),
        );
        const catMap = new Map(
          (catsResult.data ?? []).map((c) => [String(c.id), c]),
        );

        setCustomerRecentBookings(
          recentData.map((b) => {
            const w = workerMap.get(b.worker_id);
            const wu = w ? workerUserMap.get(w.user_id) : null;
            const cat = catMap.get(String(b.category_id));
            return {
              id: String(b.id),
              worker: {
                id: w?.id ?? "",
                name: wu
                  ? `${wu.firstname} ${wu.lastname}`
                  : "Unknown Worker",
                profession: w?.profession ?? "Service Provider",
                avatar: wu?.profile_pic_url ?? null,
              },
              requestedAt: b.requested_at,
              status: b.status,
              category: cat?.name ?? null,
            };
          }),
        );
      }

      setLoading(false);
      return;
    }

    setIsWorker(true);
    // wid = workers table PK — bookings.worker_id REFERENCES workers(id)
    const wid = workerResult.data.id as string;

    // Parallel: all bookings for stats, view data, pending, upcoming, active, reviews
    const [
      allBookingsResult,
      viewResult,
      pendingResult,
      upcomingResult,
      activeResult,
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
        .select(
          "id, status, description, requested_at, customer_id, category_id",
        )
        .eq("worker_id", wid)
        .eq("status", "pending")
        .order("requested_at", { ascending: false }),
      supabase
        .from("bookings")
        .select(
          "id, status, description, requested_at, customer_id, category_id",
        )
        .eq("worker_id", wid)
        .eq("status", "accepted")
        .order("requested_at", { ascending: true }),
      supabase
        .from("bookings")
        .select(
          "id, status, description, requested_at, customer_id, category_id",
        )
        .eq("worker_id", wid)
        .eq("status", "in_progress")
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
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    const pending = allBookings.filter((b) => b.status === "pending").length;
    const completed = allBookings.filter(
      (b) => b.status === "completed",
    ).length;
    const canceled = allBookings.filter((b) => b.status === "canceled").length;
    const thisMonth = allBookings.filter(
      (b) => b.requested_at && b.requested_at >= monthStart,
    ).length;
    const nonPending = completed + canceled;
    const completionRate =
      nonPending > 0 ? Math.round((completed / nonPending) * 100) : 0;

    const viewData = viewResult.data;
    setStats({
      totalBookings: allBookings.length,
      thisMonthBookings: thisMonth,
      pendingBookings: pending,
      completedJobs: completed,
      averageRating: viewData
        ? Math.round((parseFloat(String(viewData.average_rating)) || 0) * 10) /
          10
        : 0,
      totalReviews: viewData
        ? parseInt(String(viewData.review_count), 10) || 0
        : 0,
      completionRate,
    });

    // Batch-resolve names for bookings + reviews
    const pendingData = pendingResult.data ?? [];
    const upcomingData = upcomingResult.data ?? [];
    const activeData = activeResult.data ?? [];
    const reviewsData = reviewsResult.data ?? [];

    const bookingCustomerIds = [
      ...new Set(
        [
          ...pendingData.map((b) => b.customer_id),
          ...upcomingData.map((b) => b.customer_id),
          ...activeData.map((b) => b.customer_id),
        ].filter(Boolean),
      ),
    ];
    const reviewCustomerIds = [
      ...new Set(reviewsData.map((r) => r.customer_id).filter(Boolean)),
    ];
    const allCustomerIds = [
      ...new Set([...bookingCustomerIds, ...reviewCustomerIds]),
    ];

    const categoryIds = [
      ...new Set(
        [
          ...pendingData.map((b) => b.category_id),
          ...upcomingData.map((b) => b.category_id),
          ...activeData.map((b) => b.category_id),
        ].filter(Boolean),
      ),
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

    const userMap = new Map((usersResult.data ?? []).map((u) => [u.id, u]));
    const categoryMap = new Map(
      (categoriesResult.data ?? []).map((c) => [c.id, c]),
    );

    function toBookingItem(b: {
      id: string | number;
      customer_id: string;
      category_id: number | null;
      description: string | null;
      requested_at: string | null;
      status: string;
    }): DashboardBooking {
      const cu = userMap.get(b.customer_id);
      const cat = b.category_id ? categoryMap.get(b.category_id) : null;
      return {
        id: String(b.id),
        customerId: b.customer_id,
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
    setActiveBookings(activeData.map(toBookingItem));

    setRecentReviews(
      reviewsData.map((r) => {
        const cu = userMap.get(r.customer_id);
        return {
          id: String(r.id),
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

  function getWorkerActorName() {
    const u = currentUserRef.current;
    if (!u) return "Your worker";
    return (
      [u.user_metadata?.first_name, u.user_metadata?.last_name]
        .filter(Boolean)
        .join(" ") ||
      u.email?.split("@")[0] ||
      "Your worker"
    );
  }

  function findBooking(bookingId: string) {
    return (
      pendingBookings.find((b) => b.id === bookingId) ??
      upcomingBookings.find((b) => b.id === bookingId) ??
      activeBookings.find((b) => b.id === bookingId)
    );
  }

  async function handleAccept(bookingId: string) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "accepted", accepted_at: new Date().toISOString() })
      .eq("id", bookingId);
    const booking = findBooking(bookingId);
    if (booking) {
      fireNotificationEmail({
        type: "booking_accepted",
        recipientId: booking.customerId,
        actorName: getWorkerActorName(),
        bookingId,
      });
    }
    loadDashboard();
  }

  async function handleDecline(bookingId: string) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        canceled_by: currentUserRef.current?.id ?? null,
      })
      .eq("id", bookingId);
    const booking = findBooking(bookingId);
    if (booking) {
      fireNotificationEmail({
        type: "booking_canceled",
        recipientId: booking.customerId,
        actorName: getWorkerActorName(),
        bookingId,
      });
    }
    loadDashboard();
  }

  async function handleCancel(bookingId: string) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "canceled", canceled_at: new Date().toISOString() })
      .eq("id", bookingId);
    loadDashboard();
  }

  async function handleStart(bookingId: string) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "in_progress", started_at: new Date().toISOString() })
      .eq("id", bookingId);
    loadDashboard();
  }

  async function handleComplete(bookingId: string) {
    const supabase = createClient();
    await supabase
      .from("bookings")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", bookingId);
    const booking = findBooking(bookingId);
    if (booking) {
      fireNotificationEmail({
        type: "booking_completed",
        recipientId: booking.customerId,
        actorName: getWorkerActorName(),
        bookingId,
      });
    }
    loadDashboard();
  }

  async function handleCloseJob(jobId: string) {
    const success = await closeJobPost(jobId);
    if (success) {
      setCustomerJobPosts((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: "closed" } : j)),
      );
    }
  }

  async function handleCustomerUnsave(workerId: string) {
    await toggleSavedWorker(workerId);
    setCustomerSavedWorkers((prev) => prev.filter((w) => w.id !== workerId));
    setCustomerStats((prev) =>
      prev
        ? { ...prev, savedWorkersCount: Math.max(0, prev.savedWorkersCount - 1) }
        : null,
    );
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

        {/* Verification Reminder Banner — workers only */}
        {isWorker && verificationStatus === "not_verified" && (
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

        {isWorker && verificationStatus === "pending" && (
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

        {/* Promotion Banner — workers only */}
        {isWorker && (
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
        )}

        {/* Job Board Banner — workers only */}
        {isWorker && (
          <Card className="mb-6 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-400 dark:bg-blue-600 rounded-full flex items-center justify-center">
                    <Briefcase className="w-6 h-6 text-blue-900 dark:text-blue-100" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">
                      Browse Open Jobs
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Customers are posting jobs — apply directly and grow your
                      bookings
                    </p>
                  </div>
                </div>
                <Button variant="outline" asChild>
                  <Link href="/jobs">View Jobs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : isWorker === false ? (
          <>
            {/* Customer Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Total Bookings
                  </CardTitle>
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {(customerStats?.totalBookings ?? 0).toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    All-time bookings
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Active Bookings
                  </CardTitle>
                  <Clock className="w-4 h-4 text-blue-400" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {customerStats?.activeBookings ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Pending, upcoming &amp; in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    Saved Workers
                  </CardTitle>
                  <Bookmark className="w-4 h-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-foreground">
                    {customerStats?.savedWorkersCount ?? 0}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Workers you&apos;ve bookmarked
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Customer Tabs */}
            <Tabs
              value={customerTab}
              onValueChange={(v) =>
                setCustomerTab(v as "bookings" | "saved" | "jobs")
              }
              className="space-y-6"
            >
              <TabsList>
                <TabsTrigger value="bookings">My Bookings</TabsTrigger>
                <TabsTrigger value="saved">Saved Workers</TabsTrigger>
                <TabsTrigger value="jobs">
                  My Job Posts
                  {customerJobPosts.filter((j) => j.status === "open").length >
                    0 && (
                    <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                      {customerJobPosts.filter((j) => j.status === "open").length}
                    </Badge>
                  )}
                </TabsTrigger>
              </TabsList>

              {/* My Bookings Tab */}
              <TabsContent value="bookings">
                <div className="space-y-4">
                  {customerRecentBookings.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Calendar className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Bookings Yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Browse the directory to find and book a service worker.
                        </p>
                        <Button asChild>
                          <Link href="/search">Browse Workers</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {customerRecentBookings.map((booking) => (
                        <Card key={booking.id}>
                          <CardContent>
                            <div className="flex flex-col md:flex-row gap-6">
                              <div className="flex items-start gap-4 flex-1">
                                <Avatar className="w-14 h-14">
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
                                  <h3 className="font-semibold text-foreground">
                                    {booking.worker.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {booking.worker.profession}
                                  </p>
                                  {booking.category && (
                                    <p className="text-sm text-muted-foreground">
                                      {booking.category}
                                    </p>
                                  )}
                                  <Badge
                                    className={`mt-2 ${getStatusColor(booking.status)}`}
                                  >
                                    {getStatusLabel(booking.status)}
                                  </Badge>
                                </div>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {formatBookingDate(booking.requestedAt)}
                                  {booking.requestedAt && (
                                    <>
                                      {" "}
                                      at{" "}
                                      {formatBookingTime(booking.requestedAt)}
                                    </>
                                  )}
                                </span>
                              </div>
                              <div className="flex flex-col items-end justify-center gap-2">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/bookings/${booking.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="flex justify-center pt-2">
                        <Button variant="outline" asChild>
                          <Link href="/bookings">View all bookings</Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* Saved Workers Tab */}
              <TabsContent value="saved">
                <div className="space-y-4">
                  {customerSavedWorkers.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Bookmark className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Saved Workers
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Save workers you&apos;d like to book again for quick
                          access.
                        </p>
                        <Button asChild>
                          <Link href="/search">Find Workers</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {customerSavedWorkers.map((worker) => (
                        <Card key={worker.id}>
                          <CardContent>
                            <div className="flex items-center justify-between gap-4">
                              <div className="flex items-center gap-4">
                                <Avatar className="w-14 h-14">
                                  <AvatarImage
                                    src={worker.avatar || undefined}
                                    alt={worker.name}
                                  />
                                  <AvatarFallback>
                                    {worker.name
                                      .split(" ")
                                      .map((n) => n[0])
                                      .join("")}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <h3 className="font-semibold text-foreground">
                                    {worker.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">
                                    {worker.profession}
                                  </p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium text-foreground">
                                      {worker.rating || "—"}
                                    </span>
                                    {worker.hourlyRate > 0 && (
                                      <span className="text-sm text-muted-foreground">
                                        &middot; ₱{worker.hourlyRate}/hr
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="icon-sm"
                                  onClick={() =>
                                    handleCustomerUnsave(worker.id)
                                  }
                                >
                                  <Bookmark className="fill-current" />
                                </Button>
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/worker/${worker.id}`}>
                                    View Profile
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="flex justify-center pt-2">
                        <Button variant="outline" asChild>
                          <Link href="/saved-workers">
                            View all saved workers
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>

              {/* My Job Posts Tab */}
              <TabsContent value="jobs">
                <div className="space-y-4">
                  {customerJobPosts.length === 0 ? (
                    <Card>
                      <CardContent className="text-center py-12">
                        <Briefcase className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Job Posts Yet
                        </h3>
                        <p className="text-muted-foreground mb-4">
                          Post a job and let skilled workers apply to you.
                        </p>
                        <Button asChild>
                          <Link href="/post-job">
                            <PlusCircle />
                            Post a Job
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ) : (
                    <>
                      {customerJobPosts.map((job) => (
                        <Card key={job.id}>
                          <CardContent>
                            <div className="flex flex-col md:flex-row gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex flex-wrap items-center gap-2 mb-1">
                                  <h3 className="font-semibold text-foreground">
                                    {job.title}
                                  </h3>
                                  <Badge
                                    className={
                                      job.status === "open"
                                        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                        : "bg-secondary text-muted-foreground"
                                    }
                                  >
                                    {job.status === "open" ? "Open" : "Closed"}
                                  </Badge>
                                </div>
                                {job.categoryName && (
                                  <p className="text-sm text-muted-foreground">
                                    {job.categoryName}
                                  </p>
                                )}
                                <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                                  {job.location && (
                                    <span className="flex items-center gap-1">
                                      <MapPin className="w-3 h-3" />
                                      {job.location}
                                    </span>
                                  )}
                                  <span className="flex items-center gap-1">
                                    <Users className="w-3 h-3" />
                                    {job.applicantCount} applicant
                                    {job.applicantCount !== 1 ? "s" : ""}
                                  </span>
                                </div>
                              </div>
                              <div className="flex flex-col items-end justify-center gap-2 shrink-0">
                                <Button variant="outline" size="sm" asChild>
                                  <Link href={`/jobs/${job.id}`}>
                                    View Details
                                  </Link>
                                </Button>
                                {job.status === "open" && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="text-muted-foreground"
                                    onClick={() => handleCloseJob(job.id)}
                                  >
                                    Close Job
                                  </Button>
                                )}
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                      <div className="flex justify-center pt-2">
                        <Button asChild>
                          <Link href="/post-job">
                            <PlusCircle />
                            Post Another Job
                          </Link>
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
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
            <Tabs
              value={activeTab}
              onValueChange={handleTabChange}
              className="space-y-6"
            >
              <TabsList>
                <TabsTrigger value="pending">
                  Pending Requests
                  {pendingBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full">
                      {pendingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="upcoming">
                  Upcoming Jobs
                  {upcomingBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-blue-600 text-white">
                      {upcomingBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="active">
                  Active Jobs
                  {activeBookings.length > 0 && (
                    <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center rounded-full bg-purple-600 text-white">
                      {activeBookings.length}
                    </Badge>
                  )}
                </TabsTrigger>
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
                                src={request.customer.avatar || undefined}
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
                            <Button
                              className="bg-purple-600 hover:bg-purple-700 text-white w-full md:w-auto"
                              onClick={() => handleStart(job.id)}
                            >
                              <Play />
                              Mark In Progress
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/bookings/${job.id}`}>
                                View Details
                              </Link>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
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

              {/* Active Jobs Tab */}
              <TabsContent value="active">
                <div className="space-y-4">
                  {activeBookings.map((job) => (
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
                              <Badge className="mt-2 bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400">
                                In Progress
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
                            <Button
                              className="bg-green-600 hover:bg-green-700 w-full md:w-auto"
                              onClick={() => handleComplete(job.id)}
                            >
                              <CheckCircle2 />
                              Mark Complete
                            </Button>
                            <Button variant="outline" size="sm" asChild>
                              <Link href={`/bookings/${job.id}`}>
                                View Details
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {activeBookings.length === 0 && (
                    <Card>
                      <CardContent className="text-center">
                        <Play className="text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-semibold mb-2 text-foreground">
                          No Active Jobs
                        </h3>
                        <p className="text-muted-foreground">
                          Jobs you&apos;ve started will appear here. Mark an
                          upcoming job as &quot;In Progress&quot; when you
                          arrive on-site.
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
