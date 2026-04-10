"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FileText,
  Images,
  MessageSquare,
  Settings2,
  Star,
  User,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type SidebarItem = {
  key: string;
  label: string;
  icon: LucideIcon;
  href: string;
};

const sidebarItems: SidebarItem[] = [
  { key: "profile", label: "Profile", icon: User, href: "/profile" },
  {
    key: "messages",
    label: "Messages",
    icon: MessageSquare,
    href: "/profile/messages",
  },
  {
    key: "bookings",
    label: "Bookings",
    icon: CalendarDays,
    href: "/profile/bookings",
  },
  { key: "gallery", label: "Gallery", icon: Images, href: "/profile/gallery" },
  { key: "reviews", label: "Reviews", icon: Star, href: "/profile/reviews" },
  {
    key: "invoices",
    label: "Invoices",
    icon: FileText,
    href: "/profile/invoices",
  },
  {
    key: "settings",
    label: "Settings",
    icon: Settings2,
    href: "/profile/settings",
  },
];

export type ProfileSection =
  | "profile"
  | "messages"
  | "bookings"
  | "gallery"
  | "reviews"
  | "invoices"
  | "settings";

export const validSections: ProfileSection[] = [
  "profile",
  "messages",
  "bookings",
  "gallery",
  "reviews",
  "invoices",
  "settings",
];

type ProfileSidebarProps = {
  activeSection: ProfileSection;
  onSectionChange: (section: ProfileSection) => void;
  unreadMessagesCount?: number;
  newReviewsCount?: number;
};

export function ProfileSidebar({
  activeSection,
  onSectionChange,
  unreadMessagesCount = 0,
  newReviewsCount = 0,
}: ProfileSidebarProps) {
  const badgeCounts: Record<string, number> = {
    messages: unreadMessagesCount,
    reviews: newReviewsCount,
  };

  return (
    <>
      {/* Desktop sidebar */}
      <Card className="hidden md:block w-56 shrink-0 sticky top-20 self-start">
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => {
              const count = badgeCounts[item.key] ?? 0;
              return (
                <Button
                  key={item.key}
                  variant={activeSection === item.key ? "secondary" : "ghost"}
                  className="justify-start"
                  onClick={() => onSectionChange(item.key as ProfileSection)}
                >
                  <item.icon />
                  {item.label}
                  {count > 0 && (
                    <Badge className="size-5 rounded-full p-0 text-[10px]">
                      {count}
                    </Badge>
                  )}
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Mobile horizontal nav */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <nav className="flex gap-2 pb-2 min-w-max">
          {sidebarItems.map((item) => {
            const count = badgeCounts[item.key] ?? 0;
            return (
              <Button
                key={item.key}
                variant={activeSection === item.key ? "secondary" : "outline"}
                size="sm"
                onClick={() => onSectionChange(item.key as ProfileSection)}
              >
                <item.icon />
                {item.label}
                {count > 0 && (
                  <Badge className="size-5 rounded-full p-0 text-[10px]">
                    {count}
                  </Badge>
                )}
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
