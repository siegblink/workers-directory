"use client";

import { Briefcase, MapPin, Search, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
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
import { WorkerCard } from "@/components/worker/worker-card";

// Mock data generator
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

const locations = [
  { city: "Capitol Site", state: "Cebu City" },
  { city: "Lahug", state: "Cebu City" },
  { city: "Mabolo", state: "Cebu City" },
  { city: "Banilad", state: "Cebu City" },
  { city: "Talamban", state: "Cebu City" },
  { city: "IT Park", state: "Cebu City" },
  { city: "Guadalupe", state: "Cebu City" },
  { city: "Kasambagan", state: "Cebu City" },
  { city: "Busay", state: "Cebu City" },
  { city: "Cebu Business Park", state: "Cebu City" },
];

const firstNames = [
  "John",
  "Sarah",
  "Michael",
  "Emily",
  "David",
  "Jessica",
  "Robert",
  "Amanda",
  "James",
  "Lisa",
  "William",
  "Jennifer",
  "Daniel",
  "Maria",
  "Thomas",
  "Karen",
  "Christopher",
  "Nancy",
  "Matthew",
  "Linda",
];

const lastNames = [
  "Smith",
  "Johnson",
  "Williams",
  "Brown",
  "Jones",
  "Garcia",
  "Miller",
  "Davis",
  "Rodriguez",
  "Martinez",
  "Anderson",
  "Taylor",
  "Thomas",
  "Moore",
  "Jackson",
  "Martin",
  "Lee",
  "Thompson",
  "White",
  "Harris",
];

// Seeded random number generator for deterministic results
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

function generateMockWorkers(count: number) {
  return Array.from({ length: count }, (_, i) => {
    // Use index as seed for deterministic random values
    const seed = i * 7; // Multiply by prime for better distribution
    const profession =
      professions[Math.floor(seededRandom(seed) * professions.length)];
    const location =
      locations[Math.floor(seededRandom(seed + 1) * locations.length)];
    const firstName =
      firstNames[Math.floor(seededRandom(seed + 2) * firstNames.length)];
    const lastName =
      lastNames[Math.floor(seededRandom(seed + 3) * lastNames.length)];
    const rating = Number((3.5 + seededRandom(seed + 4) * 1.5).toFixed(1));
    const reviews = Math.floor(seededRandom(seed + 5) * 300) + 10;
    const hourlyRateMin = Math.floor(seededRandom(seed + 6) * 100) + 50;
    const hourlyRateMax =
      hourlyRateMin + Math.floor(seededRandom(seed + 13) * 50) + 20;
    const yearsExperience = Math.floor(seededRandom(seed + 7) * 20) + 1;
    const jobsCompleted = Math.floor(seededRandom(seed + 8) * 500) + 10;
    const distance = (seededRandom(seed + 9) * 15 + 0.5).toFixed(1);
    const isOnline = seededRandom(seed + 10) > 0.5;
    const verified = seededRandom(seed + 11) > 0.3;

    return {
      id: i + 1,
      name: `${firstName} ${lastName}`,
      profession,
      rating,
      reviews,
      hourlyRateMin,
      hourlyRateMax,
      location: `${location.city}, ${location.state}`,
      distance: `${distance} km`,
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}${lastName}`,
      isOnline,
      verified,
      yearsExperience,
      jobsCompleted,
      responseTime: Math.floor(seededRandom(seed + 12) * 120) + 10, // minutes
    };
  });
}

// Generate 30 mock workers with deterministic seed
const allMockWorkers = generateMockWorkers(30);

export default function SearchPage() {
  const router = useRouter();
  const [displayedWorkers, setDisplayedWorkers] = useState(
    allMockWorkers.slice(0, 10),
  );
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [distanceRange, setDistanceRange] = useState([0, 50]);
  const [minResponseTime, setMinResponseTime] = useState(180); // minutes
  const [minJobsCompleted, setMinJobsCompleted] = useState(0);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);

  const observerTarget = useRef<HTMLDivElement>(null);

  // Infinite scroll logic
  const loadMore = useCallback(() => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Simulate loading delay
    setTimeout(() => {
      const currentLength = displayedWorkers.length;
      const nextWorkers = allMockWorkers.slice(
        currentLength,
        currentLength + 10,
      );

      if (nextWorkers.length === 0) {
        setHasMore(false);
      } else {
        setDisplayedWorkers((prev) => [...prev, ...nextWorkers]);
      }

      setIsLoading(false);
    }, 800);
  }, [displayedWorkers.length, isLoading, hasMore]);

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

  const _handleRatingToggle = (rating: number) => {
    setSelectedRatings((prev) =>
      prev.includes(rating)
        ? prev.filter((r) => r !== rating)
        : [...prev, rating],
    );
  };

  const clearAllFilters = () => {
    setPriceRange([0, 1000]);
    setSelectedServices([]);
    setSelectedRatings([]);
    setOnlineOnly(false);
    setVerifiedOnly(false);
    setDistanceRange([0, 50]);
    setMinResponseTime(180);
    setMinJobsCompleted(0);
  };

  const handleApplyMoreFilters = (filters: {
    selectedServices: string[];
    selectedRatings: number[];
    onlineOnly: boolean;
    verifiedOnly: boolean;
    distanceRange: number[];
    priceRange: number[];
    minResponseTime: number;
    minJobsCompleted: number;
  }) => {
    setSelectedServices(filters.selectedServices);
    setSelectedRatings(filters.selectedRatings);
    setOnlineOnly(filters.onlineOnly);
    setVerifiedOnly(filters.verifiedOnly);
    setDistanceRange(filters.distanceRange);
    setPriceRange(filters.priceRange);
    setMinResponseTime(filters.minResponseTime);
    setMinJobsCompleted(filters.minJobsCompleted);
  };

  // Count active advanced filters
  const getActiveFiltersCount = () => {
    let count = 0;
    if (selectedServices.length > 0) count += selectedServices.length;
    if (selectedRatings.length > 0) count += selectedRatings.length; // All ratings are in More Filters now
    if (onlineOnly) count++;
    if (verifiedOnly) count++;
    if (distanceRange[1] < 50) count++;
    if (minResponseTime < 180) count++;
    if (minJobsCompleted > 0) count++;
    return count;
  };

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
              <InputGroupInput placeholder="Search services (e.g., plumber, electrician)" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput placeholder="Your location" />
            </InputGroup>
            <InputGroup>
              <InputGroupAddon>
                <MapPin />
              </InputGroupAddon>
              <InputGroupInput placeholder="Worker/Service location" />
            </InputGroup>
          </div>
          <div className="flex gap-2">
            <Button className="flex-1 md:flex-none" size="sm">
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
                Found {allMockWorkers.length} workers in your area
              </p>
            </div>

            {/* Worker Cards - Single Column */}
            <div className="space-y-6">
              {displayedWorkers.map((worker) => (
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
            {!hasMore && displayedWorkers.length > 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-muted-foreground">
                  You've reached the end of the results
                </p>
              </div>
            )}

            {/* No Results */}
            {displayedWorkers.length === 0 && (
              <Empty>
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <Briefcase className="h-12 w-12 text-primary" />
                  </EmptyMedia>
                  <EmptyTitle>Turn Your Skills Into Income</EmptyTitle>
                  <EmptyDescription>
                    We couldn't find workers matching your search. Be the first!
                    Join our platform and connect with customers looking for
                    professionals like you.
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
          <aside className="hidden lg:block w-[30%] flex-shrink-0">
            <div className="sticky top-[210px] max-h-[calc(100vh-250px)] overflow-y-auto">
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
