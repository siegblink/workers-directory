"use client";

import type { LucideIcon } from "lucide-react";
import {
  CalendarDays,
  FileText,
  Images,
  MessageSquare,
  Settings,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useSubProfile } from "@/contexts/sub-profile-context";

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
];

const settingsItem: SidebarItem = {
  key: "settings",
  label: "Settings",
  icon: Settings,
  href: "/profile/settings",
};

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
  unreadMessagesCount?: number;
  newReviewsCount?: number;
};

export function ProfileSidebar({
  activeSection,
  unreadMessagesCount = 0,
  newReviewsCount = 0,
}: ProfileSidebarProps) {
  const { activeSubProfileId } = useSubProfile();

  const badgeCounts: Record<string, number> = {
    messages: unreadMessagesCount,
    reviews: newReviewsCount,
  };

  const visibleItems = useMemo(
    () => (activeSubProfileId ? [...sidebarItems, settingsItem] : sidebarItems),
    [activeSubProfileId],
  );

  return (
    <>
      {/* Desktop sidebar */}
      <Card className="hidden md:block w-56 shrink-0 sticky top-20 self-start">
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {visibleItems.map((item) => {
              const count = badgeCounts[item.key] ?? 0;
              return (
                <Button
                  key={item.key}
                  variant={activeSection === item.key ? "secondary" : "ghost"}
                  className="justify-start"
                  asChild
                >
                  <Link href={item.href}>
                    <item.icon />
                    {item.label}
                    {count > 0 && (
                      <Badge className="size-5 rounded-full p-0 text-[10px]">
                        {count}
                      </Badge>
                    )}
                  </Link>
                </Button>
              );
            })}
          </nav>
        </CardContent>
      </Card>

      {/* Mobile horizontal nav */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <nav className="flex gap-2 pb-2 min-w-max">
          {visibleItems.map((item) => {
            const count = badgeCounts[item.key] ?? 0;
            return (
              <Button
                key={item.key}
                variant={activeSection === item.key ? "secondary" : "outline"}
                size="sm"
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  {item.label}
                  {count > 0 && (
                    <Badge className="size-5 rounded-full p-0 text-[10px]">
                      {count}
                    </Badge>
                  )}
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
    </>
  );
}
