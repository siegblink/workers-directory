"use client";

import { Briefcase, MapPin, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompactFilterPanel } from "@/components/compact-filter-panel";
import { MarketingStats } from "@/components/marketing-stats";
import { MoreFiltersDialog } from "@/components/more-filters-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Worker as WorkerCardWorker } from "@/components/worker/worker-card";
import { WorkerCard } from "@/components/worker/worker-card";
import { searchWorkers } from "@/lib/database/queries/workers";
import type { WorkerWithDetails } from "@/lib/database/types";

const professions = [
  "Plumber",
  "Electrician",
  "Cleaner",
  "Painter",
  "Carpenter",
  "HVAC Technician",
  "Landscaper",
  "Handyman",
  "Roofer",
  "Locksmith",
];

function toWorkerCardShape(w: WorkerWithDetails): WorkerCardWorker {
  return {
    id: w.id,
    name: w.user ? `${w.user.firstname} ${w.user.lastname}` : "Worker",
    profession: w.profession ?? w.categories?.[0]?.name ?? "Worker",
    rating: Math.round((w.average_rating ?? 0) * 10) / 10,
    reviews: w.review_count ?? 0,
    hourlyRateMin: w.hourly_rate_min ?? 0,
    hourlyRateMax: w.hourly_rate_max ?? 0,
    location: w.location ?? "",
    distance: "",
    avatar: w.user?.profile_pic_url ?? "",
    isOnline: w.is_online ?? false,
    verified: w.is_verified ?? false,
    yearsExperience: w.years_experience ?? 0,
    jobsCompleted: w.jobs_completed ?? 0,
    responseTime: w.response_time_minutes ?? 0,
  };
}

type ActiveFilters = {
  search: string;
  location: string;
  priceRange: number[];
  onlineOnly: boolean;
  selectedRatings: number[];
};

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") ?? "");
  const [locationQuery, setLocationQuery] = useState(
    searchParams.get("location") ?? "",
  );
  const [workers, setWorkers] = useState<WorkerCardWorker[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [distanceRange, setDistanceRange] = useState([0, 50]);
  const [minResponseTime, setMinResponseTime] = useState(180);
  const [minJobsCompleted, setMinJobsCompleted] = useState(0);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);

  async function doFetch(
    page: number,
    append: boolean,
    filters: ActiveFilters,
  ) {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    setIsLoading(true);

    const result = await searchWorkers({
      search: filters.search || undefined,
      location: filters.location || undefined,
      min_hourly_rate:
        filters.priceRange[0] > 0 ? filters.priceRange[0] : undefined,
      max_hourly_rate:
        filters.priceRange[1] < 1000 ? filters.priceRange[1] : undefined,
      is_available: filters.onlineOnly ? true : undefined,
      min_rating:
        filters.selectedRatings.length > 0
          ? Math.min(...filters.selectedRatings)
          : undefined,
      page,
      limit: 10,
    });

    if (!result.error) {
      const mapped = result.data.map(toWorkerCardShape);
      setWorkers((prev) => (append ? [...prev, ...mapped] : mapped));
      setTotalCount(result.pagination.total);
      setHasMore(page < result.pagination.total_pages);
      setCurrentPage(page);
    }

    setIsLoading(false);
    fetchingRef.current = false;
  }

  useEffect(() => {
    doFetch(1, false, {
      search: searchParams.get("q") ?? "",
      location: searchParams.get("location") ?? "",
      priceRange: [0, 1000],
      onlineOnly: false,
      selectedRatings: [],
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;
    doFetch(currentPage + 1, true, {
      search: searchQuery,
      location: locationQuery,
      priceRange,
      onlineOnly,
      selectedRatings,
    });
  }, [
    isLoading,
    hasMore,
    currentPage,
    searchQuery,
    locationQuery,
    priceRange,
    onlineOnly,
    selectedRatings,
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 },
    );

    const currentTarget = observerTarget.current;
    if (currentTarget) {
      observer.observe(currentTarget);
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget);
      }
    };
  }, [loadMore]);

  function handleSearch() {
    doFetch(1, false, {
      search: searchQuery,
      location: locationQuery,
      priceRange,
      onlineOnly,
      selectedRatings,
    });
  }

  function clearAllFilters() {
    setPriceRange([0, 1000]);
    setSelectedServices([]);
    setSelectedRatings([]);
    setOnlineOnly(false);
    setVerifiedOnly(false);
    setDistanceRange([0, 50]);
    setMinResponseTime(180);
    setMinJobsCompleted(0);
    doFetch(1, false, {
      search: searchQuery,
      location: locationQuery,
      priceRange: [0, 1000],
      onlineOnly: false,
      selectedRatings: [],
    });
  }

  function handleApplyMoreFilters(filters: {
    selectedServices: string[];
    selectedRatings: number[];
    onlineOnly: boolean;
    verifiedOnly: boolean;
    distanceRange: number[];
    priceRange: number[];
    minResponseTime: number;
    minJobsCompleted: number;
  }) {
    setSelectedServices(filters.selectedServices);
    setSelectedRatings(filters.selectedRatings);
    setOnlineOnly(filters.onlineOnly);
    setVerifiedOnly(filters.verifiedOnly);
    setDistanceRange(filters.distanceRange);
    setPriceRange(filters.priceRange);
    setMinResponseTime(filters.minResponseTime);
    setMinJobsCompleted(filters.minJobsCompleted);
    doFetch(1, false, {
      search: searchQuery,
      location: locationQuery,
      priceRange: filters.priceRange,
      onlineOnly: filters.onlineOnly,
      selectedRatings: filters.selectedRatings,
    });
  }

  function getActiveFiltersCount() {
    let count = 0;
    if (selectedServices.length > 0) count += selectedServices.length;
    if (selectedRatings.length > 0) count += selectedRatings.length;
    if (onlineOnly) count++;
    if (verifiedOnly) count++;
    if (distanceRange[1] < 50) count++;
    if (minResponseTime < 180) count++;
    if (minJobsCompleted > 0) count++;
    return count;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Search Header - Sticky */}
      <div className="bg-background border-b sticky top-16 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
            <InputGroup>
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search services (e.g., plumber, electrician)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Filter by worker location"
                value={locationQuery}
                onChange={(e) => setLocationQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput placeholder="Your location (coming soon)" disabled />
            </InputGroup>
          </div>
          <div className="flex gap-2">
            <Button
              className="flex-1 md:flex-none"
              size="sm"
              onClick={handleSearch}
              disabled={isLoading}
            >
              <Search />
              Search
            </Button>
            {/* Mobile Filter Toggle */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden" size="sm">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-full sm:max-w-md overflow-y-auto"
              >
                <SheetHeader>
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <CompactFilterPanel
                    distanceRange={distanceRange}
                    onDistanceRangeChange={setDistanceRange}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    onOpenMoreFilters={() => setMoreFiltersOpen(true)}
                    activeFiltersCount={getActiveFiltersCount()}
                    onClearAllFilters={clearAllFilters}
                  />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* More Filters Dialog */}
      <MoreFiltersDialog
        open={moreFiltersOpen}
        onOpenChange={setMoreFiltersOpen}
        selectedServices={selectedServices}
        selectedRatings={selectedRatings}
        onlineOnly={onlineOnly}
        verifiedOnly={verifiedOnly}
        distanceRange={distanceRange}
        priceRange={priceRange}
        minResponseTime={minResponseTime}
        minJobsCompleted={minJobsCompleted}
        onApplyFilters={handleApplyMoreFilters}
        professions={professions}
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex gap-6">
          {/* Results Section - Left (70%) */}
          <div className="flex-1 w-full lg:w-[70%]">
            {/* Marketing Stats Pills */}
            <MarketingStats />

            {/* Results Header */}
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-foreground mb-1">
                Results Near You
              </h1>
              <p className="text-muted-foreground text-sm">
                Found {totalCount} workers in your area
              </p>
            </div>

            {/* Worker Cards - Single Column */}
            <div className="space-y-6">
              {workers.map((worker) => (
                <WorkerCard key={worker.id} worker={worker} />
              ))}
            </div>

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex justify-center items-center py-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm">Loading more workers...</span>
                </div>
              </div>
            )}

            {/* Intersection Observer Target */}
            {hasMore && <div ref={observerTarget} className="h-8" />}

            {/* End of Results */}
            {!hasMore && workers.length > 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  You&apos;ve reached the end of the results
                </p>
              </div>
            )}

            {/* No Results */}
            {!isLoading && workers.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Briefcase className="h-12 w-12 text-primary" />
                  </EmptyMedia>
                  <EmptyTitle>Turn Your Skills Into Income</EmptyTitle>
                  <EmptyDescription>
                    We couldn&apos;t find workers matching your search. Be the
                    first! Join our platform and connect with customers looking
                    for professionals like you.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button
                    size="sm"
                    className="w-full sm:w-auto"
                    onClick={() => router.push("/become-worker")}
                  >
                    <Briefcase />
                    Become a Worker
                  </Button>
                </EmptyContent>
              </Empty>
            )}
          </div>

          {/* Filter Panel - Right (30%) - Desktop Only */}
          <aside className="hidden lg:block w-[30%] shrink-0">
            <div className="sticky top-[206px] max-h-[calc(100vh-250px)] overflow-y-auto space-y-6">
              <Button asChild variant="outline" className="w-full">
                <Link href="/become-worker">
                  <Briefcase />
                  Become a Worker
                </Link>
              </Button>

              <Card className="border-border">
                <CardContent>
                  <CompactFilterPanel
                    distanceRange={distanceRange}
                    onDistanceRangeChange={setDistanceRange}
                    priceRange={priceRange}
                    onPriceRangeChange={setPriceRange}
                    onOpenMoreFilters={() => setMoreFiltersOpen(true)}
                    activeFiltersCount={getActiveFiltersCount()}
                    onClearAllFilters={clearAllFilters}
                  />
                </CardContent>
              </Card>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
