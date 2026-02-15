import type { PortfolioItem } from "@/components/profile/profile-gallery";
import type { ProfileData } from "@/components/profile/profile-header";
import type { Invoice } from "@/components/profile/profile-invoices";
import type { Review } from "@/components/profile/profile-testimonials";

export type DirectoryId =
  | "workers"
  | "business"
  | "jobs"
  | "food"
  | "flights"
  | "hotels"
  | "buy-and-sell"
  | "dealerships"
  | "lost-and-found"
  | "events";

export type SubProfile = {
  id: string;
  directoryId: DirectoryId;
  directoryLabel: string;
  createdAt: string;
  profileData: ProfileData;
  bio: string;
  skills: string[];
  availability: Record<string, string>;
  portfolio: PortfolioItem[];
  reviews: Review[];
  bookings: {
    id: number;
    worker: string;
    service: string;
    date: string;
    status: string;
    amount: number;
  }[];
  bookmarkedWorkers: {
    id: number;
    name: string;
    profession: string;
    rating: number;
    hourlyRate: number;
    avatar: string;
  }[];
  conversations: {
    id: number;
    name: string;
    profession: string;
    avatar: string;
    lastMessage: string;
    timestamp: string;
    unread: number;
  }[];
  invoices: Invoice[];
};
