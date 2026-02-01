"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAnnouncement } from "@/contexts/announcement-context";

export function AnnouncementStrip() {
  const { isVisible, setIsVisible } = useAnnouncement();

  const handleDismiss = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const announcements = [
    "Plumber needed in Cebu City",
    "Electrician needed in Mandaue",
    "House cleaner needed in Lapu-Lapu",
    "Carpenter needed in IT Park",
    "Driver needed in Banilad",
    "Gardener needed in Talisay",
    "Aircon technician needed in Lahug",
    "Painter needed in Mactan",
    "Mason needed in Talamban",
    "Welder needed in Minglanilla",
    "Housekeeper needed in Mabolo",
    "Handyman needed in Consolacion",
    "Laundry helper needed in SRP",
    "Cook needed in Ayala Center",
    "Security guard needed in Cordova",
  ];

  const renderAnnouncements = () => (
    <>
      {announcements.map((text, index) => (
        <span key={text}>
          <span className="text-muted-foreground">{text}</span>
          {index < announcements.length - 1 && (
            <span className="text-primary">
              &nbsp;&nbsp;&nbsp;&nbsp;•&nbsp;&nbsp;&nbsp;&nbsp;
            </span>
          )}
        </span>
      ))}
    </>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-60 h-10 bg-muted border-b overflow-hidden">
      <div className="relative h-full z-0">
        {/* Marquee content wrapper */}
        <div className="flex h-full items-center animate-marquee">
          {/* Duplicate content for seamless loop */}
          <div className="flex gap-0 whitespace-nowrap px-8 text-sm">
            {renderAnnouncements()}
            <span aria-hidden="true">{renderAnnouncements()}</span>
          </div>
        </div>

        {/* Fade overlay for text masking */}
        <div
          className="absolute right-0 top-0 h-full w-14 bg-linear-to-r from-transparent via-muted/60 to-muted backdrop-blur-sm pointer-events-none z-10"
          style={{
            maskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
            WebkitMaskImage:
              "linear-gradient(to right, transparent 0%, black 15%, black 100%)",
          }}
          aria-hidden="true"
        />

        {/* Close button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 z-20"
          onClick={handleDismiss}
          aria-label="Dismiss announcements"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
