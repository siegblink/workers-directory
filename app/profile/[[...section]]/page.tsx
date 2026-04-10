"use client";

import { User } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
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
  monday: "9:00 AM - 5:00 PM",
  tuesday: "9:00 AM - 5:00 PM",
  wednesday: "9:00 AM - 5:00 PM",
  thursday: "9:00 AM - 5:00 PM",
  friday: "9:00 AM - 5:00 PM",
  saturday: "Closed",
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

  // Derive initial section from URL, then track in state.
  // Tab clicks update state + sync the URL via pushState (no Next.js navigation,
  // so the component never remounts and loadProfile never re-runs).
  const [activeSection, setActiveSection] = useState<ProfileSection>(() => {
    const slug = params.section?.[0];
    return slug && validSections.includes(slug as ProfileSection)
      ? (slug as ProfileSection)
      : "profile";
  });

  function handleSectionChange(section: ProfileSection) {
    setActiveSection(section);
    const url = section === "profile" ? "/profile" : `/profile/${section}`;
    window.history.pushState(null, "", url);
  }

  // Keep activeSection in sync with browser back/forward buttons.
  useEffect(() => {
    function onPopState() {
      const slug = window.location.pathname.split("/profile/")[1] ?? "";
      const section = validSections.includes(slug as ProfileSection)
        ? (slug as ProfileSection)
        : "profile";
      setActiveSection(section);
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

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
  const [reviews, setReviews] = useState<(Review & { categoryName: string })[]>([]);

  // Real data for panels
  const [chatPreviews, setChatPreviews] = useState<
    { id: number | string; name: string; profession: string; avatar: string; lastMessage: string; timestamp: string; unread: number; categoryName: string }[]
  >([]);
  const [bookingPreviews, setBookingPreviews] = useState<
    { id: number | string; worker: string; service: string; date: string; status: string }[]
  >([]);
  // Bookings where the user is the service provider (for sub-profile tabs)
  const [workerBookingPreviews, setWorkerBookingPreviews] = useState<
    { id: number | string; worker: string; service: string; date: string; status: string; categoryName: string }[]
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
            .select("id, customer_id, rating_value, review_comment, created_at, booking_id")
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

    // Reviews from ratings — batch-resolve customer names + booking category names
    type RatingRow = { id: number; customer_id: string; rating_value: number | null; review_comment: string | null; created_at: string; booking_id: number | null };
    const ratingsData = (ratingsResult.data ?? []) as RatingRow[];

    if (ratingsData.length > 0) {
      const customerIds = [
        ...new Set(ratingsData.map((r) => r.customer_id).filter(Boolean)),
      ];
      const ratingBookingIds = [
        ...new Set(ratingsData.map((r) => r.booking_id).filter((id): id is number => id !== null)),
      ];

      const [customersResult, ratingBookingsResult] = await Promise.all([
        supabase
          .from("users")
          .select("id, firstname, lastname, profile_pic_url")
          .in("id", customerIds),
        ratingBookingIds.length > 0
          ? supabase.from("bookings").select("id, category_id").in("id", ratingBookingIds)
          : Promise.resolve({ data: [] }),
      ]);

      type RatingBookingRow = { id: number; category_id: number | null };
      const ratingBookingRows = (ratingBookingsResult.data ?? []) as RatingBookingRow[];
      const ratingCatIds = [
        ...new Set(ratingBookingRows.map((b) => b.category_id).filter((id): id is number => id !== null)),
      ];

      let ratingCategoryNameMap = new Map<number, string>();
      if (ratingCatIds.length > 0) {
        type RatingCategory = { id: number; name: string };
        const { data: ratingCatsData } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", ratingCatIds);
        ratingCategoryNameMap = new Map(
          ((ratingCatsData ?? []) as RatingCategory[]).map((c) => [c.id, c.name]),
        );
      }

      const ratingBookingToCatName = new Map<number, string>(
        ratingBookingRows.map((b) => [
          b.id,
          b.category_id !== null ? (ratingCategoryNameMap.get(b.category_id) ?? "") : "",
        ]),
      );

      type CustomerRow = { id: string; firstname: string; lastname: string; profile_pic_url: string | null };
      const customerMap = new Map(
        ((customersResult.data ?? []) as CustomerRow[]).map((c) => [c.id, c]),
      );

      setReviews(
        ratingsData.map((r) => {
          const cu = customerMap.get(r.customer_id);
          const categoryName = r.booking_id !== null ? (ratingBookingToCatName.get(r.booking_id) ?? "") : "";
          return {
            id: r.id,
            author: cu ? `${cu.firstname} ${cu.lastname}` : "Anonymous",
            rating: r.rating_value ?? 0,
            date: timeAgo(r.created_at),
            comment: r.review_comment ?? "",
            avatar: cu?.profile_pic_url ?? "",
            categoryName,
          };
        }),
      );
    }

    // Refresh sub-profiles from DB (handles return from /become-worker)
    await refreshSubProfiles();

    // Load chat previews for the messages panel
    // Avoid FK hint joins — query chats, users, and messages separately
    type RawChat = { id: number; customer_id: string; worker_id: string; booking_id: number | null };
    type RawUser = { id: string; firstname: string; lastname: string; profile_pic_url: string | null };
    type RawMsg = { chat_id: number; message_text: string | null; created_at: string; receiver_id: string; status: string };

    const { data: chatsRaw } = await supabase
      .from("chats")
      .select("id, customer_id, worker_id, booking_id")
      .or(`customer_id.eq.${user.id},worker_id.eq.${user.id}`)
      .order("created_at", { ascending: false })
      .limit(5);

    if (chatsRaw && chatsRaw.length > 0) {
      const chats = chatsRaw as RawChat[];
      const chatIds = chats.map((c) => c.id);

      // Batch-fetch other users, messages, and booking categories in parallel
      const otherUserIds = [
        ...new Set(
          chats.map((c) =>
            c.customer_id === user.id ? c.worker_id : c.customer_id,
          ),
        ),
      ];
      const chatBookingIds = [
        ...new Set(chats.map((c) => c.booking_id).filter((id): id is number => id !== null)),
      ];

      const [usersResult, msgsResult, chatBookingsResult] = await Promise.all([
        supabase
          .from("users")
          .select("id, firstname, lastname, profile_pic_url")
          .in("id", otherUserIds),
        supabase
          .from("messages")
          .select("chat_id, message_text, created_at, receiver_id, status")
          .in("chat_id", chatIds)
          .order("created_at", { ascending: false }),
        chatBookingIds.length > 0
          ? supabase.from("bookings").select("id, category_id").in("id", chatBookingIds)
          : Promise.resolve({ data: [] }),
      ]);

      // Resolve category names for chat bookings
      type RawChatBooking = { id: number; category_id: number | null };
      type RawChatCategory = { id: number; name: string };
      const chatBookingRows = (chatBookingsResult.data ?? []) as RawChatBooking[];
      const chatCatIds = [
        ...new Set(chatBookingRows.map((b) => b.category_id).filter((id): id is number => id !== null)),
      ];

      let chatCategoryNameMap = new Map<number, string>();
      if (chatCatIds.length > 0) {
        const { data: chatCatsData } = await supabase
          .from("categories")
          .select("id, name")
          .in("id", chatCatIds);
        chatCategoryNameMap = new Map(
          ((chatCatsData ?? []) as RawChatCategory[]).map((c) => [c.id, c.name]),
        );
      }

      const bookingToCatName = new Map<number, string>(
        chatBookingRows.map((b) => [
          b.id,
          b.category_id !== null ? (chatCategoryNameMap.get(b.category_id) ?? "") : "",
        ]),
      );

      const userMap = new Map(
        ((usersResult.data ?? []) as RawUser[]).map((u) => [u.id, u]),
      );
      const msgs = (msgsResult.data ?? []) as RawMsg[];

      setChatPreviews(
        chats.map((chat) => {
          const otherId =
            chat.customer_id === user.id ? chat.worker_id : chat.customer_id;
          const otherUser = userMap.get(otherId) ?? null;
          const chatMsgs = msgs.filter((m) => m.chat_id === chat.id);
          const lastMsg = chatMsgs[0] ?? null;
          const unread = chatMsgs.filter(
            (m) => m.receiver_id === user.id && m.status !== "read",
          ).length;
          const categoryName = chat.booking_id !== null ? (bookingToCatName.get(chat.booking_id) ?? "") : "";
          return {
            id: chat.id,
            name: otherUser
              ? `${otherUser.firstname} ${otherUser.lastname}`
              : "Unknown",
            profession: "",
            avatar: otherUser?.profile_pic_url ?? "",
            lastMessage: lastMsg?.message_text ?? "",
            timestamp: lastMsg ? timeAgo(lastMsg.created_at) : "",
            unread,
            categoryName,
          };
        }),
      );
    }

    // Load booking previews — avoid FK hints; use plain queries merged in memory
    type RawBooking = { id: number; status: string; requested_at: string | null; worker_id: string | null; category_id: number | null };
    type RawWorkerRow = { id: string; user_id: string };
    type RawWorkerUser = { id: string; firstname: string; lastname: string };
    type RawCategory = { id: number; name: string };

    const { data: rawBookings } = await supabase
      .from("bookings")
      .select("id, status, requested_at, worker_id, category_id")
      .eq("customer_id", user.id)
      .order("requested_at", { ascending: false })
      .limit(5);

    if (rawBookings && rawBookings.length > 0) {
      const bookings = rawBookings as RawBooking[];
      const bookingWorkerIds = [...new Set(bookings.map((b) => b.worker_id).filter((id): id is string => !!id))];
      const bookingCategoryIds = [...new Set(bookings.map((b) => b.category_id).filter((id): id is number => id !== null))];

      const [workersResult, categoriesResult] = await Promise.all([
        bookingWorkerIds.length > 0
          ? supabase.from("workers").select("id, user_id").in("id", bookingWorkerIds)
          : Promise.resolve({ data: [] }),
        bookingCategoryIds.length > 0
          ? supabase.from("categories").select("id, name").in("id", bookingCategoryIds)
          : Promise.resolve({ data: [] }),
      ]);

      const workerRows = (workersResult.data ?? []) as RawWorkerRow[];
      const workerUserIds = [...new Set(workerRows.map((w) => w.user_id).filter(Boolean))];

      const { data: workerUsersData } = workerUserIds.length > 0
        ? await supabase.from("users").select("id, firstname, lastname").in("id", workerUserIds)
        : { data: [] };

      const workerToUserIdMap = new Map(workerRows.map((w) => [w.id, w.user_id]));
      const workerUserMap = new Map(((workerUsersData ?? []) as RawWorkerUser[]).map((u) => [u.id, u]));
      const categoryMap = new Map(((categoriesResult.data ?? []) as RawCategory[]).map((c) => [c.id, c.name]));

      setBookingPreviews(
        bookings.map((b) => {
          const workerUserId = b.worker_id ? workerToUserIdMap.get(b.worker_id) : null;
          const workerUser = workerUserId ? workerUserMap.get(workerUserId) : null;
          return {
            id: b.id,
            worker: workerUser ? `${workerUser.firstname} ${workerUser.lastname}` : "Unknown Worker",
            service: b.category_id !== null ? (categoryMap.get(b.category_id) ?? "Service") : "Service",
            date: b.requested_at
              ? new Date(b.requested_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })
              : "",
            status: BOOKING_STATUS_LABEL[b.status] ?? b.status,
          };
        }),
      );
    }

    // Load worker-side bookings (for sub-profile tabs)
    // These are bookings where the user is the service provider
    if (wid) {
      type RawWorkerBooking = { id: number; status: string; requested_at: string | null; customer_id: string; category_id: number | null };
      type RawWBCustomer = { id: string; firstname: string; lastname: string };
      type RawWBCategory = { id: number; name: string };

      const { data: rawWB } = await supabase
        .from("bookings")
        .select("id, status, requested_at, customer_id, category_id")
        .eq("worker_id", wid)
        .order("requested_at", { ascending: false })
        .limit(50);

      if (rawWB && rawWB.length > 0) {
        const wb = rawWB as RawWorkerBooking[];
        const wbCustomerIds = [...new Set(wb.map((b) => b.customer_id).filter(Boolean))];
        const wbCategoryIds = [...new Set(wb.map((b) => b.category_id).filter((id): id is number => id !== null))];

        const [wbCustomersResult, wbCategoriesResult] = await Promise.all([
          wbCustomerIds.length > 0
            ? supabase.from("users").select("id, firstname, lastname").in("id", wbCustomerIds)
            : Promise.resolve({ data: [] }),
          wbCategoryIds.length > 0
            ? supabase.from("categories").select("id, name").in("id", wbCategoryIds)
            : Promise.resolve({ data: [] }),
        ]);

        const wbCustomerMap = new Map(((wbCustomersResult.data ?? []) as RawWBCustomer[]).map((u) => [u.id, u]));
        const wbCategoryMap = new Map(((wbCategoriesResult.data ?? []) as RawWBCategory[]).map((c) => [c.id, c.name]));

        setWorkerBookingPreviews(
          wb.map((b) => {
            const customer = wbCustomerMap.get(b.customer_id);
            const categoryName = b.category_id !== null ? (wbCategoryMap.get(b.category_id) ?? "") : "";
            return {
              id: b.id,
              worker: customer ? `${customer.firstname} ${customer.lastname}` : "Unknown Customer",
              service: categoryName || "Service",
              date: b.requested_at
                ? new Date(b.requested_at).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })
                : "",
              status: BOOKING_STATUS_LABEL[b.status] ?? b.status,
              categoryName,
            };
          }),
        );
      }
    }

    setLoading(false);
  }, [refreshSubProfiles]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  // Notification counts for sidebar badges — scoped to active sub-profile if one is selected
  const activeChatPreviews = (() => {
    if (!activeSubProfileId) return chatPreviews;
    const sp = subProfiles.find((s) => s.id === activeSubProfileId);
    if (!sp) return chatPreviews;
    const profession = sp.profession.toLowerCase();
    return chatPreviews.filter((c) => {
      const cat = c.categoryName.toLowerCase();
      return cat.includes(profession) || profession.includes(cat);
    });
  })();
  const unreadMessagesCount = activeChatPreviews.reduce((sum, c) => sum + c.unread, 0);
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
    if (activeSubProfileId) {
      await handleSubProfileSave(activeSubProfileId, { availability: data });
    } else {
      setAvailability(data);
    }
    toast.success("Availability saved");
  }

  async function handleSubProfileSave(id: string, updates: Partial<SubProfile>) {
    await updateSubProfile(id, updates);
    await refreshSubProfiles();
  }

  async function handleAboutSaveForActiveProfile(data: ProfileAboutFormValues) {
    if (activeSubProfileId) {
      // Both bio and skills are per sub-profile
      await handleSubProfileSave(activeSubProfileId, { bio: data.bio, skills: data.skills });
    } else {
      await handleAboutSave(data);
    }
    toast.success("About Me saved");
  }

  async function handleSubProfileDelete(id: string) {
    await deleteSubProfile(id);
    setActiveSubProfileId(null);
    await refreshSubProfiles();
  }

  function renderDetailPanel() {
    switch (activeSection) {
      case "profile": {
        const activeSubProfile = activeSubProfileId
          ? (subProfiles.find((sp) => sp.id === activeSubProfileId) ?? null)
          : null;
        const displayedAvailability = activeSubProfile
          ? activeSubProfile.availability
          : availability;
        return (
          <>
            <ProfileAbout
              bio={activeSubProfile ? (activeSubProfile.bio ?? "") : bio}
              skills={activeSubProfile ? activeSubProfile.skills : skills}
              profileLabel={activeSubProfile ? activeSubProfile.label : "Main Profile"}
              onSave={handleAboutSaveForActiveProfile}
            />
            <ProfileAvailability
              availability={displayedAvailability}
              onSave={handleAvailabilitySave}
            />
          </>
        );
      }
      case "messages":
        return <ProfileMessagesPanel conversations={activeChatPreviews} />;
      case "bookings": {
        let displayedBookings;
        if (activeSubProfileId) {
          const activeSubProfile = subProfiles.find((sp) => sp.id === activeSubProfileId);
          if (activeSubProfile) {
            const profession = activeSubProfile.profession.toLowerCase();
            displayedBookings = workerBookingPreviews.filter((b) => {
              const cat = b.categoryName.toLowerCase();
              return cat.includes(profession) || profession.includes(cat);
            });
          } else {
            displayedBookings = workerBookingPreviews;
          }
        } else {
          displayedBookings = bookingPreviews;
        }
        return (
          <ProfileBookingsPanel
            bookings={displayedBookings}
            bookmarkedWorkers={[]}
          />
        );
      }
      case "gallery":
        return <ProfileGallery portfolio={activeSubProfileId ? [] : portfolio} />;
      case "reviews": {
        let displayedReviews = reviews;
        if (activeSubProfileId) {
          const activeSubProfile = subProfiles.find((sp) => sp.id === activeSubProfileId);
          if (activeSubProfile) {
            const profession = activeSubProfile.profession.toLowerCase();
            displayedReviews = reviews.filter((r) => {
              const cat = r.categoryName.toLowerCase();
              return cat.includes(profession) || profession.includes(cat);
            });
          }
        }
        const displayedRating =
          displayedReviews.length > 0
            ? Math.round((displayedReviews.reduce((sum, r) => sum + r.rating, 0) / displayedReviews.length) * 10) / 10
            : 0;
        return (
          <ProfileTestimonials
            rating={activeSubProfileId ? displayedRating : profile.rating}
            reviewCount={activeSubProfileId ? displayedReviews.length : profile.reviews}
            reviews={displayedReviews}
          />
        );
      }
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
                    onSectionChange={handleSectionChange}
                    unreadMessagesCount={unreadMessagesCount}
                    newReviewsCount={newReviewsCount}
                  />
                </div>

                {/* Sidebar + Detail Panel */}
                <div className="flex gap-6 mt-6">
                  {/* Desktop sidebar */}
                  <ProfileSidebar
                    activeSection={activeSection}
                    onSectionChange={handleSectionChange}
                    unreadMessagesCount={unreadMessagesCount}
                    newReviewsCount={newReviewsCount}
                  />

                  {/* Detail panel */}
                  <div
                    key={activeSubProfileId ?? "main"}
                    className="flex-1 min-w-0 space-y-6"
                  >
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
