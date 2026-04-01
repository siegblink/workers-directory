"use client";

import { User } from "lucide-react";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { DirectorySelectionDialog } from "@/components/profile/directory-selection-dialog";
import { ProfileAbout } from "@/components/profile/profile-about";
import { ProfileAvailability } from "@/components/profile/profile-availability";
import { ProfileBookingsPanel } from "@/components/profile/profile-bookings-panel";
import {
  type PortfolioItem,
  ProfileGallery,
} from "@/components/profile/profile-gallery";
import {
  type ProfileData,
  ProfileHeader,
} from "@/components/profile/profile-header";
import {
  type Invoice,
  ProfileInvoices,
} from "@/components/profile/profile-invoices";
import { ProfileMessagesPanel } from "@/components/profile/profile-messages-panel";
import { ProfileSettings } from "@/components/profile/profile-settings";
import {
  type ProfileSection,
  ProfileSidebar,
  validSections,
} from "@/components/profile/profile-sidebar";
import {
  ProfileTestimonials,
  type Review,
} from "@/components/profile/profile-testimonials";
import { SubProfileBar } from "@/components/profile/sub-profile-bar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import { useSubProfile } from "@/contexts/sub-profile-context";
import type {
  ProfileAboutFormValues,
  ProfileAvailabilityFormValues,
  ProfileHeaderFormValues,
} from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/client";

// ─── Deferred mock data (no DB backing — Phase 5) ────────────────────────────

const mockBookings = [
  { id: 1, worker: "John Smith", service: "Plumbing", date: "Dec 15, 2024", status: "Completed", amount: 180 },
  { id: 2, worker: "Sarah Johnson", service: "Electrical", date: "Dec 20, 2024", status: "Upcoming", amount: 220 },
  { id: 3, worker: "Mike Davis", service: "Deep Cleaning", date: "Jan 5, 2025", status: "Completed", amount: 150 },
  { id: 4, worker: "Emily Chen", service: "Interior Painting", date: "Jan 12, 2025", status: "Cancelled", amount: 400 },
  { id: 5, worker: "David Wilson", service: "Home Organization", date: "Jan 25, 2025", status: "Upcoming", amount: 200 },
];

const mockBookmarked = [
  { id: 1, name: "Mike Davis", profession: "Cleaner", rating: 4.7, hourlyRate: 350, avatar: "/placeholder.svg?height=60&width=60" },
  { id: 2, name: "Lisa Brown", profession: "Painter", rating: 4.9, hourlyRate: 500, avatar: "/placeholder.svg?height=60&width=60" },
];

const mockConversations = [
  { id: 1, name: "John Smith", profession: "Plumber", avatar: "/placeholder.svg?height=60&width=60", lastMessage: "I can come by tomorrow at 2 PM", timestamp: "2m ago", unread: 2 },
  { id: 2, name: "Sarah Johnson", profession: "Electrician", avatar: "/placeholder.svg?height=60&width=60", lastMessage: "The job is complete. Let me know if you have any questions!", timestamp: "1h ago", unread: 0 },
  { id: 3, name: "Mike Davis", profession: "Cleaner", avatar: "/placeholder.svg?height=60&width=60", lastMessage: "Thanks for the booking!", timestamp: "3h ago", unread: 1 },
  { id: 4, name: "Emily Chen", profession: "Painter", avatar: "/placeholder.svg?height=60&width=60", lastMessage: "I'll bring all the supplies needed", timestamp: "1d ago", unread: 0 },
  { id: 5, name: "David Wilson", profession: "Handyman", avatar: "/placeholder.svg?height=60&width=60", lastMessage: "See you next week!", timestamp: "2d ago", unread: 0 },
];

const mockInvoices: Invoice[] = [
  { id: 1, invoiceNumber: "INV-001", client: "John Smith", service: "Plumbing Repair", date: "Dec 15, 2024", amount: 180, status: "Paid" },
  { id: 2, invoiceNumber: "INV-002", client: "Sarah Johnson", service: "Electrical Wiring", date: "Dec 20, 2024", amount: 220, status: "Pending" },
  { id: 3, invoiceNumber: "INV-003", client: "Mike Davis", service: "Deep Cleaning", date: "Nov 28, 2024", amount: 150, status: "Paid" },
  { id: 4, invoiceNumber: "INV-004", client: "Emily Chen", service: "Interior Painting", date: "Nov 10, 2024", amount: 400, status: "Overdue" },
  { id: 5, invoiceNumber: "INV-005", client: "David Wilson", service: "Home Organization", date: "Oct 25, 2024", amount: 200, status: "Paid" },
];

// ─── Defaults & helpers ───────────────────────────────────────────────────────

const defaultAvailability: ProfileAvailabilityFormValues = {
  monday: "9:00 AM - 6:00 PM",
  tuesday: "9:00 AM - 6:00 PM",
  wednesday: "9:00 AM - 6:00 PM",
  thursday: "9:00 AM - 6:00 PM",
  friday: "9:00 AM - 5:00 PM",
  saturday: "10:00 AM - 3:00 PM",
  sunday: "Closed",
};

const emptyProfile: ProfileData = {
  name: "",
  username: "",
  avatar: "/placeholder.svg",
  statusEmoji: "",
  statusText: "",
  profession: "",
  isOnline: false,
  verified: false,
  rating: 0,
  reviews: 0,
  location: "",
  joinedDate: "",
  hourlyRate: 0,
  completedJobs: 0,
  responseTime: "",
};

function formatJoinedDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
}

function formatResponseTime(minutes: number | null): string {
  if (!minutes) return "";
  if (minutes < 60) return `Within ${minutes} minutes`;
  const hours = Math.round(minutes / 60);
  return `Within ${hours} hour${hours > 1 ? "s" : ""}`;
}

function timeAgo(dateString: string): string {
  const diff = Date.now() - new Date(dateString).getTime();
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days === 0) return "Today";
  if (days === 1) return "1 day ago";
  if (days < 7) return `${days} days ago`;
  const weeks = Math.floor(days / 7);
  if (weeks === 1) return "1 week ago";
  if (weeks < 4) return `${weeks} weeks ago`;
  const months = Math.floor(days / 30);
  if (months === 1) return "1 month ago";
  return `${months} months ago`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ProfilePage() {
  const params = useParams<{ section?: string[] }>();
  const context = useSubProfile();

  // Gate context values behind useLayoutEffect to prevent hydration mismatch.
  // The SubProfileProvider persists in the root layout, so on back-navigation
  // its state (isHydrated=true) is already populated from localStorage. But
  // the cached RSC payload was rendered with server defaults (all false/empty).
  // Starting with server-safe defaults and syncing before paint ensures the
  // first render matches the server exactly, with no visible flash.
  const [synced, setSynced] = useState(false);
  useLayoutEffect(() => setSynced(true), []);

  const hasMainProfile = synced ? context.hasMainProfile : false;
  const subProfiles = synced ? context.subProfiles : [];
  const activeSubProfileId = synced ? context.activeSubProfileId : null;

  const sectionSlug = params.section?.[0];
  const resolvedSection: ProfileSection =
    sectionSlug && validSections.includes(sectionSlug as ProfileSection)
      ? (sectionSlug as ProfileSection)
      : "profile";
  // Settings is only valid when a sub-profile is active
  const activeSection: ProfileSection =
    resolvedSection === "settings" && !activeSubProfileId
      ? "profile"
      : resolvedSection;

  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // IDs needed by save handlers
  const [userId, setUserId] = useState<string | null>(null);
  const [workerId, setWorkerId] = useState<string | null>(null);

  // Main profile editable state
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [availability, setAvailability] =
    useState<ProfileAvailabilityFormValues>(defaultAvailability);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);

  const loadProfile = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setLoading(false);
      return;
    }
    setUserId(user.id);

    // Parallel: user record + worker record
    const [userResult, workerResult] = await Promise.all([
      supabase
        .from("users")
        .select("id, firstname, lastname, profile_pic_url, bio, city, state, created_at, status_emoji, status_text")
        .eq("id", user.id)
        .maybeSingle(),
      supabase
        .from("workers")
        .select("id, profession, skills, hourly_rate_min, is_verified, jobs_completed, response_time_minutes")
        .eq("user_id", user.id)
        .is("deleted_at", null)
        .maybeSingle(),
    ]);

    const ud = userResult.data as {
      firstname: string;
      lastname: string;
      profile_pic_url: string | null;
      bio: string | null;
      city: string | null;
      state: string | null;
      created_at: string;
      status_emoji: string | null;
      status_text: string | null;
    } | null;

    const wd = workerResult.data as {
      id: string;
      profession: string | null;
      skills: string[] | null;
      hourly_rate_min: number | null;
      is_verified: boolean | null;
      jobs_completed: number | null;
      response_time_minutes: number | null;
    } | null;

    const wid = wd?.id ?? null;
    if (wid) setWorkerId(wid);

    // Parallel: view data + portfolio + reviews (worker-only)
    const [viewResult, postsResult, ratingsResult] = await Promise.all([
      wid
        ? supabase
            .from("workers_with_details")
            .select("average_rating, review_count, is_online")
            .eq("id", wid)
            .maybeSingle()
        : Promise.resolve({ data: null }),
      wid
        ? supabase
            .from("workers_posts")
            .select("id, title, content, media_url")
            .eq("worker_id", wid)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
      wid
        ? supabase
            .from("ratings")
            .select("id, customer_id, rating_value, review_comment, created_at")
            .eq("worker_id", wid)
            .order("created_at", { ascending: false })
        : Promise.resolve({ data: [] }),
    ]);

    const vd = viewResult.data as {
      average_rating: string | number;
      review_count: string | number;
      is_online: boolean;
    } | null;

    // Build ProfileData from DB rows
    const locationParts = [ud?.city, ud?.state].filter(Boolean).join(", ");
    setProfile({
      name: ud ? `${ud.firstname} ${ud.lastname}` : "",
      username: "",
      avatar: ud?.profile_pic_url ?? "/placeholder.svg",
      statusEmoji: ud?.status_emoji ?? "",
      statusText: ud?.status_text ?? "",
      profession: wd?.profession ?? "",
      isOnline: vd?.is_online ?? false,
      verified: wd?.is_verified ?? false,
      rating: vd ? parseFloat(String(vd.average_rating)) || 0 : 0,
      reviews: vd ? parseInt(String(vd.review_count), 10) || 0 : 0,
      location: locationParts,
      joinedDate: ud?.created_at ? formatJoinedDate(ud.created_at) : "",
      hourlyRate: wd?.hourly_rate_min ?? 0,
      completedJobs: wd?.jobs_completed ?? 0,
      responseTime: formatResponseTime(wd?.response_time_minutes ?? null),
    });

    setBio(ud?.bio ?? "");
    setSkills(wd?.skills ?? []);

    // Portfolio from workers_posts
    type PostRow = { id: number; title: string | null; content: string | null; media_url: string | null };
    const posts = (postsResult.data ?? []) as PostRow[];
    setPortfolio(
      posts.map((p) => ({
        id: p.id,
        image: p.media_url ?? "/placeholder.svg",
        title: p.title ?? "",
        description: p.content ?? "",
        price: 0,
      })),
    );

    // Reviews from ratings — batch-resolve customer names
    type RatingRow = { id: number; customer_id: string; rating_value: number | null; review_comment: string | null; created_at: string };
    const ratingsData = (ratingsResult.data ?? []) as RatingRow[];

    if (ratingsData.length > 0) {
      const customerIds = [
        ...new Set(ratingsData.map((r) => r.customer_id).filter(Boolean)),
      ];
      const { data: customersData } = await supabase
        .from("users")
        .select("id, firstname, lastname, profile_pic_url")
        .in("id", customerIds);

      type CustomerRow = { id: string; firstname: string; lastname: string; profile_pic_url: string | null };
      const customerMap = new Map(
        ((customersData ?? []) as CustomerRow[]).map((c) => [c.id, c]),
      );

      setReviews(
        ratingsData.map((r) => {
          const cu = customerMap.get(r.customer_id);
          return {
            id: r.id,
            author: cu ? `${cu.firstname} ${cu.lastname}` : "Anonymous",
            rating: r.rating_value ?? 0,
            date: timeAgo(r.created_at),
            comment: r.review_comment ?? "",
            avatar: cu?.profile_pic_url ?? "/placeholder.svg",
          };
        }),
      );
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Determine data source (main profile vs active sub-profile)
  const activeSubProfile = activeSubProfileId
    ? subProfiles.find((sp) => sp.id === activeSubProfileId)
    : null;

  const currentProfile = activeSubProfile ? activeSubProfile.profileData : profile;
  const currentBio = activeSubProfile ? activeSubProfile.bio : bio;
  const currentSkills = activeSubProfile ? activeSubProfile.skills : skills;
  const currentAvailability = activeSubProfile
    ? activeSubProfile.availability
    : availability;
  const currentPortfolio = activeSubProfile ? activeSubProfile.portfolio : portfolio;
  const currentReviews = activeSubProfile ? activeSubProfile.reviews : reviews;
  const currentBookings = activeSubProfile
    ? activeSubProfile.bookings
    : mockBookings;
  const currentBookmarked = activeSubProfile
    ? activeSubProfile.bookmarkedWorkers
    : mockBookmarked;
  const currentConversations = activeSubProfile
    ? activeSubProfile.conversations
    : mockConversations;
  const currentInvoices = activeSubProfile
    ? activeSubProfile.invoices
    : mockInvoices;

  // Notification counts for the active profile
  const unreadMessagesCount = currentConversations.reduce(
    (sum, c) => sum + c.unread,
    0,
  );
  const newReviewsCount = currentReviews.filter((r) => r.isNew).length;

  // Per-profile notification indicators for the SubProfileBar dots
  function hasNewItems(
    conversations: typeof mockConversations,
    reviewList: Review[],
  ) {
    return (
      conversations.some((c) => c.unread > 0) ||
      reviewList.some((r) => r.isNew)
    );
  }

  const notifications: Record<string, boolean> = {};
  if (hasMainProfile) {
    notifications.main = hasNewItems(mockConversations, reviews);
  }
  for (const sp of subProfiles) {
    notifications[sp.id] = hasNewItems(sp.conversations, sp.reviews);
  }

  async function handleHeaderSave(data: ProfileHeaderFormValues) {
    if (!userId) return;
    const supabase = createClient();

    // Split "First Last" into firstname / lastname
    const nameParts = data.name.trim().split(/\s+/);
    const firstname = nameParts[0];
    const lastname = nameParts.slice(1).join(" ") || nameParts[0];

    // Split "City, State" into city / state
    const lastComma = data.location.lastIndexOf(",");
    const city =
      lastComma >= 0
        ? data.location.slice(0, lastComma).trim()
        : data.location.trim();
    const state =
      lastComma >= 0 ? data.location.slice(lastComma + 1).trim() : null;

    await Promise.all([
      supabase
        .from("users")
        .update({ firstname, lastname, city, state, status_emoji: data.statusEmoji ?? "", status_text: data.statusText ?? "" })
        .eq("id", userId),
      workerId
        ? supabase
            .from("workers")
            .update({
              profession: data.profession,
              hourly_rate_min: data.hourlyRate,
            })
            .eq("id", workerId)
        : Promise.resolve(),
    ]);

    if (!activeSubProfile) {
      setProfile((prev) => ({
        ...prev,
        name: data.name,
        statusEmoji: data.statusEmoji ?? prev.statusEmoji,
        statusText: data.statusText ?? prev.statusText,
        profession: data.profession,
        location: data.location,
        hourlyRate: data.hourlyRate,
      }));
    }
  }

  async function handleAvatarChange(_file: File) {
    // Avatar upload requires Supabase Storage — deferred to Phase 5
  }

  async function handleAboutSave(data: ProfileAboutFormValues) {
    if (!userId) return;
    const supabase = createClient();

    await Promise.all([
      supabase.from("users").update({ bio: data.bio }).eq("id", userId),
      workerId
        ? supabase
            .from("workers")
            .update({ skills: data.skills })
            .eq("id", workerId)
        : Promise.resolve(),
    ]);

    if (!activeSubProfile) {
      setBio(data.bio);
      setSkills(data.skills);
    }
  }

  async function handleAvailabilitySave(data: ProfileAvailabilityFormValues) {
    // No DB table for availability — local state only
    if (!activeSubProfile) {
      setAvailability(data);
    }
  }

  function renderDetailPanel() {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <ProfileAbout
              bio={currentBio}
              skills={currentSkills}
              profileLabel={
                activeSubProfile
                  ? activeSubProfile.directoryLabel
                  : "Main Profile"
              }
              onSave={handleAboutSave}
            />
            <ProfileAvailability
              availability={currentAvailability}
              onSave={handleAvailabilitySave}
            />
          </>
        );
      case "messages":
        return <ProfileMessagesPanel conversations={currentConversations} />;
      case "bookings":
        return (
          <ProfileBookingsPanel
            bookings={currentBookings}
            bookmarkedWorkers={currentBookmarked}
          />
        );
      case "gallery":
        return <ProfileGallery portfolio={currentPortfolio} />;
      case "reviews":
        return (
          <ProfileTestimonials
            rating={currentProfile.rating}
            reviewCount={currentProfile.reviews}
            reviews={currentReviews}
          />
        );
      case "invoices":
        return <ProfileInvoices invoices={currentInvoices} />;
      case "settings":
        return activeSubProfile ? (
          <ProfileSettings
            key={activeSubProfile.id}
            subProfile={activeSubProfile}
          />
        ) : null;
    }
  }

  const dialogProfileType = hasMainProfile ? "sub" : "main";

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Spinner className="size-8" />
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <ProfileHeader
              profile={currentProfile}
              onSave={handleHeaderSave}
              onAvatarChange={handleAvatarChange}
              hasMainProfile={hasMainProfile}
            />

            {/* Sub-profile bar */}
            <SubProfileBar
              onCreateClick={() => setDialogOpen(true)}
              hasMainProfile={hasMainProfile}
              notifications={notifications}
            />

            {/* Directory selection dialog */}
            <DirectorySelectionDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              profileType={dialogProfileType}
            />

            {hasMainProfile ? (
              <>
                {/* Mobile sidebar nav */}
                <div className="md:hidden mt-6">
                  <ProfileSidebar
                    activeSection={activeSection}
                    unreadMessagesCount={unreadMessagesCount}
                    newReviewsCount={newReviewsCount}
                  />
                </div>

                {/* Sidebar + Detail Panel */}
                <div className="flex gap-6 mt-6">
                  {/* Desktop sidebar */}
                  <ProfileSidebar
                    activeSection={activeSection}
                    unreadMessagesCount={unreadMessagesCount}
                    newReviewsCount={newReviewsCount}
                  />

                  {/* Detail panel */}
                  <div className="flex-1 min-w-0 space-y-6">
                    {renderDetailPanel()}
                  </div>
                </div>
              </>
            ) : (
              /* Empty state for new accounts */
              <Empty className="mt-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <User />
                  </EmptyMedia>
                  <EmptyTitle>No Profile Yet</EmptyTitle>
                  <EmptyDescription>
                    Create your profile to get started.
                  </EmptyDescription>
                </EmptyHeader>
                <Button onClick={() => setDialogOpen(true)}>
                  Create Profile
                </Button>
              </Empty>
            )}
          </>
        )}
      </div>
    </div>
  );
}
