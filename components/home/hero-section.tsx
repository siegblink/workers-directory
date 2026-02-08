"use client";

import { Briefcase, Search } from "lucide-react";
import Link from "next/link";
import { MarketingStats } from "@/components/marketing-stats";
import { Button } from "@/components/ui/button";
import { GridPattern } from "@/components/ui/grid-pattern";

interface HeroSectionProps {
  announcementHeight: number;
}

export function HeroSection({ announcementHeight }: HeroSectionProps) {
  return (
    <section
      className="relative overflow-hidden"
      style={{ paddingTop: `${announcementHeight + 64 + 48}px` }}
    >
      {/* Grid pattern background with gradient fade */}
      <div className="absolute inset-0 [mask-image:linear-gradient(to_bottom,white_30%,transparent)]">
        <GridPattern
          width={60}
          height={60}
          className="opacity-40 dark:opacity-20"
        />
      </div>

      {/* Content */}
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-20 text-center">
        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 animate-fade-in">
          Find Trusted Workers <span className="text-primary">Near You</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in [animation-delay:150ms] [animation-fill-mode:backwards]">
          Connect with verified plumbers, electricians, cleaners, and more. Book
          with confidence, every worker is background-checked and
          community-rated.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 animate-fade-in [animation-delay:300ms] [animation-fill-mode:backwards]">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link href="/search">
              <Search />
              Find Workers
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/become-worker">
              <Briefcase />
              Become a Worker
            </Link>
          </Button>
        </div>

        {/* Marketing Stats */}
        <div className="flex justify-center animate-fade-in [animation-delay:450ms] [animation-fill-mode:backwards] [&>div]:flex-wrap [&>div]:justify-center [&>div]:overflow-hidden">
          <MarketingStats />
        </div>
      </div>
    </section>
  );
}
