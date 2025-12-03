"use client";

import {
  Briefcase,
  Calendar,
  Car,
  Hotel,
  Plane,
  SearchX,
  ShoppingBag,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface Directory {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  isComingSoon: boolean;
  description?: string;
  iconColor: string;
  bgColor: string;
}

const directories: Directory[] = [
  {
    id: "workers",
    label: "Workers",
    icon: Wrench,
    href: "/search",
    isComingSoon: false,
    description: "Find verified service professionals",
    iconColor: "text-orange-500",
    bgColor: "bg-orange-500/15",
  },
  {
    id: "jobs",
    label: "Jobs",
    icon: Briefcase,
    href: "#",
    isComingSoon: true,
    description: "Browse job opportunities",
    iconColor: "text-blue-500",
    bgColor: "bg-blue-500/15",
  },
  {
    id: "food",
    label: "Food",
    icon: UtensilsCrossed,
    href: "#",
    isComingSoon: true,
    description: "Discover local restaurants",
    iconColor: "text-red-500",
    bgColor: "bg-red-500/15",
  },
  {
    id: "flights",
    label: "Flights",
    icon: Plane,
    href: "#",
    isComingSoon: true,
    description: "Book your next flight",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-500/15",
  },
  {
    id: "hotels",
    label: "Hotels",
    icon: Hotel,
    href: "#",
    isComingSoon: true,
    description: "Find accommodation",
    iconColor: "text-purple-500",
    bgColor: "bg-purple-500/15",
  },
  {
    id: "buy-and-sell",
    label: "Buy and Sell",
    icon: ShoppingBag,
    href: "#",
    isComingSoon: true,
    description: "Marketplace for goods",
    iconColor: "text-emerald-500",
    bgColor: "bg-emerald-500/15",
  },
  {
    id: "dealerships",
    label: "Dealerships",
    icon: Car,
    href: "#",
    isComingSoon: true,
    description: "Browse vehicles for sale",
    iconColor: "text-rose-500",
    bgColor: "bg-rose-500/15",
  },
  {
    id: "lost-and-found",
    label: "Lost and Found",
    icon: SearchX,
    href: "#",
    isComingSoon: true,
    description: "Report or find lost items",
    iconColor: "text-amber-500",
    bgColor: "bg-amber-500/15",
  },
  {
    id: "events",
    label: "Events",
    icon: Calendar,
    href: "#",
    isComingSoon: true,
    description: "Upcoming local events",
    iconColor: "text-violet-500",
    bgColor: "bg-violet-500/15",
  },
];

function ComingSoonRibbon() {
  return (
    <div className="absolute top-[-24px] right-0 z-10 pointer-events-none overflow-hidden w-28 h-28">
      {/* Main ribbon band */}
      <div className="absolute top-[14px] right-[-38px] w-[140px] bg-destructive text-destructive-foreground py-1.5 text-center text-xs font-semibold shadow-lg transform rotate-45">
        Coming Soon
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Directories */}
      <section className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-foreground mb-8">Directories</h2>

        {/* Directories Grid */}
        <nav aria-label="Directory navigation">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {directories.map((directory) => (
              <Link
                key={directory.id}
                href={directory.href}
                className={cn(
                  "group relative block transition-all duration-300",
                  directory.isComingSoon
                    ? "cursor-not-allowed"
                    : "hover:scale-[1.03] hover:-translate-y-1 cursor-pointer",
                )}
                onClick={(e) => directory.isComingSoon && e.preventDefault()}
                aria-disabled={directory.isComingSoon}
                aria-label={`${directory.label}${directory.isComingSoon ? " - Coming soon" : ""}`}
              >
                <Card
                  className={cn(
                    "h-full overflow-hidden",
                    // Glassmorphism base styles
                    "bg-white/5 dark:bg-white/5 backdrop-blur-md",
                    "border border-white/10 dark:border-white/10",
                    "shadow-lg shadow-black/5",
                    // Hover enhancements
                    "transition-all duration-300",
                    directory.isComingSoon
                      ? "opacity-80"
                      : "hover:bg-white/10 dark:hover:bg-white/10 hover:border-white/20 hover:shadow-xl hover:shadow-primary/10",
                  )}
                >
                  <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-[180px] relative">
                    {directory.isComingSoon && <ComingSoonRibbon />}

                    {/* Icon Container */}
                    <div
                      className={cn(
                        "w-16 h-16 rounded-full flex items-center justify-center mb-4",
                        directory.bgColor,
                        "shadow-lg shadow-black/10",
                        "ring-1 ring-white/10",
                        "transition-all duration-300",
                        !directory.isComingSoon &&
                          "group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-black/20 group-hover:ring-white/20",
                      )}
                    >
                      <directory.icon
                        className={cn(
                          "w-8 h-8 transition-transform duration-300 group-hover:scale-105",
                          directory.iconColor,
                        )}
                      />
                    </div>

                    {/* Label */}
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {directory.label}
                    </h3>

                    {/* Description - reveals on hover */}
                    {directory.description && (
                      <p
                        className={cn(
                          "text-sm text-muted-foreground",
                          "opacity-0 translate-y-2 max-h-0",
                          "transition-all duration-300 ease-out",
                          !directory.isComingSoon &&
                            "group-hover:opacity-100 group-hover:translate-y-0 group-hover:max-h-10",
                        )}
                      >
                        {directory.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </nav>
      </section>
    </div>
  );
}
