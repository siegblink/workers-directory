"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AnnouncementStrip } from "@/components/announcement-strip";
import { HeroSection } from "@/components/home/hero-section";
import { SuggestionBoxSection } from "@/components/home/suggestion-box-section";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { Card, CardContent } from "@/components/ui/card";
import { useAnnouncement } from "@/contexts/announcement-context";
import { directories } from "@/lib/constants/directories";
import { cn } from "@/lib/utils";

function ComingSoonRibbon() {
  return (
    <div className="absolute -top-6 right-0 z-10 pointer-events-none overflow-hidden w-28 h-28">
      {/* Main ribbon band */}
      <div className="absolute top-3.5 -right-10.5 w-35 bg-destructive text-destructive-foreground py-1.5 text-center text-xs font-semibold shadow-lg transform rotate-45">
        Coming Soon
      </div>
    </div>
  );
}

export default function HomePage() {
  const { announcementHeight, setIsOnHomePage } = useAnnouncement();

  // Register this page as having the announcement strip
  useEffect(() => {
    setIsOnHomePage(true);
    return () => setIsOnHomePage(false);
  }, [setIsOnHomePage]);

  return (
    <>
      <AnnouncementStrip />
      <div className="min-h-screen flex flex-col">
        {/* Hero */}
        <HeroSection announcementHeight={announcementHeight} />

        {/* Directories */}
        <section className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-2xl text-foreground mb-10">
            Featured Directories
          </h2>

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
                      // Base styles - theme-aware for better light mode visibility
                      "bg-white dark:bg-white/5 backdrop-blur-md",
                      "border border-neutral-200 dark:border-white/10",
                      "shadow-md shadow-neutral-200/50 dark:shadow-lg dark:shadow-black/5",
                      // Hover enhancements
                      "transition-all duration-300",
                      directory.isComingSoon
                        ? "opacity-80"
                        : "hover:bg-neutral-50 dark:hover:bg-white/10 hover:border-neutral-300 dark:hover:border-white/20 hover:shadow-lg hover:shadow-neutral-300/60 dark:hover:shadow-xl dark:hover:shadow-primary/10",
                    )}
                  >
                    <CardContent className="p-6 text-center flex flex-col items-center justify-center min-h-45 relative">
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

        {/* Testimonials */}
        <TestimonialsSection />

        {/* Suggestion Box */}
        <SuggestionBoxSection />
      </div>
    </>
  );
}
