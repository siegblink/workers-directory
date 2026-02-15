"use client";

import {
  CalendarDays,
  FileText,
  Images,
  MessageSquare,
  Star,
  User,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const sidebarItems = [
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
] as const;

export const validSections = sidebarItems.map((item) => item.key);

export type ProfileSection = (typeof sidebarItems)[number]["key"];

type ProfileSidebarProps = {
  activeSection: ProfileSection;
};

export function ProfileSidebar({ activeSection }: ProfileSidebarProps) {
  return (
    <>
      {/* Desktop sidebar */}
      <Card className="hidden md:block w-56 shrink-0 sticky top-20 self-start">
        <CardContent className="p-2">
          <nav className="flex flex-col gap-1">
            {sidebarItems.map((item) => (
              <Button
                key={item.key}
                variant={activeSection === item.key ? "secondary" : "ghost"}
                className="justify-start"
                asChild
              >
                <Link href={item.href}>
                  <item.icon />
                  {item.label}
                </Link>
              </Button>
            ))}
          </nav>
        </CardContent>
      </Card>

      {/* Mobile horizontal nav */}
      <div className="md:hidden overflow-x-auto -mx-4 px-4">
        <nav className="flex gap-2 pb-2 min-w-max">
          {sidebarItems.map((item) => (
            <Button
              key={item.key}
              variant={activeSection === item.key ? "secondary" : "outline"}
              size="sm"
              asChild
            >
              <Link href={item.href}>
                <item.icon />
                {item.label}
              </Link>
            </Button>
          ))}
        </nav>
      </div>
    </>
  );
}
