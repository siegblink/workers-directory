"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { ProfileAbout } from "@/components/profile/profile-about";
import { ProfileAvailability } from "@/components/profile/profile-availability";
import { DirectorySelectionDialog } from "@/components/profile/directory-selection-dialog";
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
import { ProfileSubProfileSettings } from "@/components/profile/profile-sub-profile-settings";
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
import { deleteSubProfile, updateSubProfile } from "@/lib/database/queries/sub-profiles";
import type { SubProfile } from "@/lib/database/types";
import type {
  ProfileAboutFormValues,
  ProfileAvailabilityFormValues,
  ProfileHeaderFormValues,
} from "@/lib/schemas/profile";
import { createClient } from "@/lib/supabase/client";

const BOOKING_STATUS_LABEL: Record<string, string> = {
  pending: "Pending",
  accepted: "Upcoming",
  completed: "Completed",
  canceled: "Cancelled",
};

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
  avatar: "",
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

  const sectionSlug = params.section?.[0];
  const activeSection: ProfileSection =
    sectionSlug && validSections.includes(sectionSlug as ProfileSection)
      ? (sectionSlug as ProfileSection)
      : "profile";

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

  // Real data for panels
  const [chatPreviews, setChatPreviews] = useState<
    { id: number | string; name: string; profession: string; avatar: string; lastMessage: string; timestamp: string; unread: number }[]
  >([]);
  const [bookingPreviews, setBookingPreviews] = useState<
    { id: number | string; worker: string; service: string; date: string; status: string }[]
  >([]);

  // Sub-profile dialog
  const [directoryDialogOpen, setDirectoryDialogOpen] = useState(false);

  // Sub-profile context
  const {
    subProfiles,
    activeSubProfileId,
    setActiveSubProfileId,
    refreshSubProfiles,
  } = useSubProfile();

  // Whether the user has a worker profile (determines empty vs full UI)
  const hasMainProfile = workerId !== null;

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
      avatar: ud?.profile_pic_url ?? "",
      statusEmoji: ud?.status_emoji ?? "",
      statusText: ud?.status_text ?? "",
      profession: wd?.profession ?? "",
      isOnline: vd?.is_online ?? false,
      verified: wd?.is_verified ?? false,
      rating: vd ? Math.round(parseFloat(String(vd.average_rating)) * 10) / 10 || 0 : 0,
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
        image: p.media_url ?? null,
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
            avatar: cu?.profile_pic_url ?? "",
          };
        }),
      );
    }

    // Refresh sub-profiles from DB (handles return from /become-worker)
    await refreshSubProfiles();

    // Load chat previews for the messages panel
    type ChatUserRow = { id: string; firstname: string; lastname: string; profile_pic_url: string | null };
    type MsgRow = { id: number; message_text: string | null; created_at: string; sender_id: string; receiver_id: string; status: string };
    type ChatRow = {
      id: number;
      customer_id: string;
      worker_id: string;
      customer: ChatUserRow | null;
      worker: ChatUserRow | null;
      messages: MsgRow[];
    };

    const { data: chatsData } = await supabase
      .from("chats")
      .select(`
        id,
        customer_id,
        worker_id,
        customer:users!chats_customer_id_fkey(id, firstname, lastname, profile_pic_url),
        worker:users!chats_worker_id_fkey(id, firstname, lastname, profile_pic_url),
        messages(id, message_text, created_at, sender_id, receiver_id, status)
      `)
      .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (chatsData) {
      const chats = chatsData as unknown as ChatRow[];
      setChatPreviews(
        chats.map((chat) => {
          const otherUser =
            chat.customer_id === user.id ? chat.worker : chat.customer;
          const name = otherUser
            ? `${otherUser.firstname} ${otherUser.lastname}`
            : "Unknown";
          const avatar = otherUser?.profile_pic_url ?? "";
          const msgs = chat.messages ?? [];
          const lastMsg = msgs.sort(
            (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
          )[0];
          const unread = msgs.filter(
            (m) => m.receiver_id === user.id && m.status !== "read",
          ).length;
          return {
            id: chat.id,
            name,
            profession: "",
            avatar,
            lastMessage: lastMsg?.message_text ?? "",
            timestamp: lastMsg ? timeAgo(lastMsg.created_at) : "",
            unread,
          };
        }),
      );
    }

    // Load booking previews for the bookings panel
    type BookingRow = {
      id: number;
      status: string;
      requested_at: string | null;
      worker: { user: { firstname: string; lastname: string } | null } | null;
      category: { name: string | null } | null;
    };

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select(`
        id,
        status,
        requested_at,
        worker:workers!bookings_worker_id_fkey(
          user:users!workers_user_id_fkey(firstname, lastname)
        ),
        category:categories!bookings_category_id_fkey(name)
      `)
      .eq("customer_id", user.id)
      .order("requested_at", { ascending: false })
      .limit(5);

    if (bookingsData) {
      const bookings = bookingsData as unknown as BookingRow[];
      setBookingPreviews(
        bookings.map((b) => ({
          id: b.id,
          worker: b.worker?.user
            ? `${b.worker.user.firstname} ${b.worker.user.lastname}`
            : "Unknown Worker",
          service: b.category?.name ?? "Service",
          date: b.requested_at
            ? new Date(b.requested_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : "",
          status: BOOKING_STATUS_LABEL[b.status] ?? b.status,
        })),
      );
    }

    setLoading(false);
  }, [refreshSubProfiles]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Notification counts for sidebar badges
  const unreadMessagesCount = chatPreviews.reduce((sum, c) => sum + c.unread, 0);
  const newReviewsCount = 0; // real reviews don't carry an isNew flag

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

    await supabase
      .from("users")
      .update({ firstname, lastname, city, state, status_emoji: data.statusEmoji ?? "", status_text: data.statusText ?? "" })
      .eq("id", userId);

    if (workerId) {
      await supabase
        .from("workers")
        .update({ profession: data.profession, hourly_rate_min: data.hourlyRate })
        .eq("id", workerId);
    } else if (data.profession) {
      const { data: newWorker } = await supabase
        .from("workers")
        .insert({ user_id: userId, profession: data.profession, hourly_rate_min: data.hourlyRate, status: "available" })
        .select("id")
        .single();
      if (newWorker) setWorkerId((newWorker as { id: string }).id);
    }

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

    setBio(data.bio);
    setSkills(data.skills);
  }

  async function handleAvailabilitySave(data: ProfileAvailabilityFormValues) {
    // No DB table for availability — local state only
    setAvailability(data);
  }

  async function handleSubProfileSave(id: string, updates: Partial<SubProfile>) {
    await updateSubProfile(id, updates);
    await refreshSubProfiles();
  }

  async function handleSubProfileDelete(id: string) {
    await deleteSubProfile(id);
    setActiveSubProfileId(null);
    await refreshSubProfiles();
  }

  function renderDetailPanel() {
    switch (activeSection) {
      case "profile":
        return (
          <>
            <ProfileAbout
              bio={bio}
              skills={skills}
              profileLabel="Main Profile"
              onSave={handleAboutSave}
            />
            <ProfileAvailability
              availability={availability}
              onSave={handleAvailabilitySave}
            />
          </>
        );
      case "messages":
        return <ProfileMessagesPanel conversations={chatPreviews} />;
      case "bookings":
        return (
          <ProfileBookingsPanel
            bookings={bookingPreviews}
            bookmarkedWorkers={[]}
          />
        );
      case "gallery":
        return <ProfileGallery portfolio={portfolio} />;
      case "reviews":
        return (
          <ProfileTestimonials
            rating={profile.rating}
            reviewCount={profile.reviews}
            reviews={reviews}
          />
        );
      case "invoices":
        return <ProfileInvoices invoices={[] as Invoice[]} />;
      case "settings":
        return (
          <ProfileSubProfileSettings
            activeSubProfileId={activeSubProfileId}
            subProfiles={subProfiles}
            onSave={handleSubProfileSave}
            onDelete={handleSubProfileDelete}
          />
        );
    }
  }

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
              profile={profile}
              onSave={handleHeaderSave}
              onAvatarChange={handleAvatarChange}
              hasMainProfile={hasMainProfile}
            />

            {hasMainProfile ? (
              <>
                {/* Sub-profile switcher bar */}
                <SubProfileBar
                  hasMainProfile={hasMainProfile}
                  onCreateClick={() => setDirectoryDialogOpen(true)}
                />

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
              /* Empty state for non-worker accounts */
              <Empty className="mt-6">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <User />
                  </EmptyMedia>
                  <EmptyTitle>No Worker Profile Yet</EmptyTitle>
                  <EmptyDescription>
                    Register as a service worker to manage your profile, track
                    bookings, and grow your business.
                  </EmptyDescription>
                </EmptyHeader>
                <Button asChild>
                  <Link href="/become-worker">Become a Worker</Link>
                </Button>
              </Empty>
            )}
          </>
        )}
      </div>

      {/* Directory selection dialog — opened by SubProfileBar "Create" button */}
      <DirectorySelectionDialog
        open={directoryDialogOpen}
        onOpenChange={setDirectoryDialogOpen}
        profileType="sub"
      />
    </div>
  );
}
