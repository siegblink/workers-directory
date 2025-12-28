"use client";

import { Briefcase, MapPin, Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { CompactFilterPanel } from "@/components/compact-filter-panel";
import { LocationAutocomplete } from "@/components/location-autocomplete";
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
import { type Worker, WorkerCard } from "@/components/worker/worker-card";
import { reverseGeocode } from "@/lib/utils/distance";

// Professions list for filters
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

export default function SearchPage() {
  const router = useRouter();
  const [displayedWorkers, setDisplayedWorkers] = useState<Worker[]>([]);
  const [totalWorkers, setTotalWorkers] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Search fields
  const [serviceSearch, setServiceSearch] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [workerLocation, setWorkerLocation] = useState("");
  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedCoords, setDetectedCoords] = useState<{
    lat: number;
    lon: number;
  } | null>(null);
  const [manualLocationOverride, setManualLocationOverride] = useState(false);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  // Filters
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

  // Use a ref to track if a fetch is in progress to prevent race conditions
  const isFetchingRef = useRef(false);

  // Track if observer should be active
  const shouldObserveRef = useRef(true);

  // Track if user is actively typing to prevent multiple search triggers
  const isTypingRef = useRef(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const [searchTrigger, setSearchTrigger] = useState(0);

  // Fetch workers from API
  const fetchWorkers = useCallback(
    async (page: number) => {
      if (isLoading || isFetchingRef.current) return;

      isFetchingRef.current = true;
      setIsLoading(true);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          limit: "10",
        });

        // Add search parameters
        if (serviceSearch) params.append("service", serviceSearch);
        if (workerLocation) params.append("location", workerLocation);
        if (userLocation) params.append("userLocation", userLocation);

        // Add filters
        if (verifiedOnly) params.append("verifiedOnly", "true");
        if (onlineOnly) params.append("onlineOnly", "true");
        if (priceRange[0] > 0)
          params.append("minRate", priceRange[0].toString());
        if (priceRange[1] < 1000)
          params.append("maxRate", priceRange[1].toString());

        // Add distance range filter - API will filter strictly by min/max distance
        params.append("minDistance", distanceRange[0].toString());
        params.append("maxDistance", distanceRange[1].toString());
        // Fetch extra workers from DB to account for filtering (add 1 to radius for decimals)
        if (distanceRange[1] < 50)
          params.append("radius", (distanceRange[1] + 1).toString());

        const response = await fetch(`/api/workers?${params.toString()}`);
        if (!response.ok) throw new Error("Failed to fetch workers");

        const data = await response.json();

        // Workers are already filtered by the API, no need for client-side filtering
        if (page === 1) {
          setDisplayedWorkers(data.workers);
        } else {
          // Filter out duplicates before adding new workers
          setDisplayedWorkers((prev) => {
            const existingIds = new Set(prev.map((w) => w.id));
            const newWorkers = data.workers.filter(
              (w: Worker) => !existingIds.has(w.id),
            );
            return [...prev, ...newWorkers];
          });
        }

        setTotalWorkers(data.pagination.total);
        setHasMore(data.pagination.hasMore);
        setCurrentPage(page);
      } catch (error) {
        console.error("Error fetching workers:", error);
      } finally {
        setIsLoading(false);
        isFetchingRef.current = false;
      }
    },
    [
      verifiedOnly,
      onlineOnly,
      priceRange,
      distanceRange,
      serviceSearch,
      workerLocation,
      userLocation,
    ],
  );

  // Handle search button click
  const handleSearch = () => {
    setCurrentPage(1);
    setDisplayedWorkers([]);
    fetchWorkers(1);
  };

  // Detect user location on mount
  useEffect(() => {
    const detectLocation = async () => {
      if (!navigator.geolocation) {
        console.log("Geolocation is not supported by this browser");
        return;
      }

      setIsDetectingLocation(true);

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Store detected coordinates
          const coords = { lat: latitude, lon: longitude };
          setDetectedCoords(coords);

          // Reverse geocode to get human-readable address
          const address = await reverseGeocode(latitude, longitude);

          // Only use detected location if not manually overridden
          if (!manualLocationOverride) {
            // Use readable address if available, otherwise fallback to coordinates
            const locationString =
              address || `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
            setUserLocation(locationString);
            setIsAutoDetected(true);
          }

          setIsDetectingLocation(false);
        },
        (error) => {
          console.log("Location detection error:", error.message);
          setIsDetectingLocation(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // Cache for 5 minutes
        },
      );
    };

    detectLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Initial load - wait for location detection to complete
  useEffect(() => {
    // If location is being detected, wait for it
    if (isDetectingLocation) {
      return;
    }

    // Trigger search automatically after location is detected
    if (isAutoDetected && userLocation) {
      fetchWorkers(1);
      setIsAutoDetected(false); // Reset flag after triggering search
    } else if (!isDetectingLocation && !userLocation) {
      // If no location detected (permission denied or error), fetch default results
      fetchWorkers(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDetectingLocation, isAutoDetected, userLocation]);

  // Auto-trigger search when filters change
  useEffect(() => {
    // Skip if this is the initial load or location is being detected
    if (isDetectingLocation || displayedWorkers.length === 0) {
      return;
    }

    // Skip if user is actively typing in custom inputs
    if (isTypingRef.current) {
      return;
    }

    // Debounce filter changes to avoid too many API calls
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
      setDisplayedWorkers([]);
      fetchWorkers(1);
    }, 300);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [distanceRange, priceRange, verifiedOnly, onlineOnly, searchTrigger]);

  // Infinite scroll logic with proper trigger management
  const loadMore = useCallback(() => {
    // Extra check to prevent multiple simultaneous requests
    if (isLoading || !hasMore || isFetchingRef.current || !shouldObserveRef.current) return;

    // Disable observer until this load completes
    shouldObserveRef.current = false;

    fetchWorkers(currentPage + 1);
  }, [currentPage, isLoading, hasMore, fetchWorkers]);

  // Re-enable observer when new data is loaded
  useEffect(() => {
    if (!isLoading && hasMore) {
      shouldObserveRef.current = true;
    }
  }, [isLoading, hasMore, displayedWorkers.length]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && shouldObserveRef.current && !isLoading && hasMore) {
          loadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px' // Start loading slightly before reaching the bottom
      },
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
  }, [loadMore, isLoading, hasMore]);

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

  const clearSearch = () => {
    setServiceSearch("");
    setUserLocation("");
    setWorkerLocation("");
    setCurrentPage(1);
    setDisplayedWorkers([]);
    // Trigger a fresh search with no filters
    setTimeout(() => fetchWorkers(1), 0);
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
              <InputGroupInput
                placeholder="Search services (e.g., plumber, electrician)"
                value={serviceSearch}
                onChange={(e) => setServiceSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              />
            </InputGroup>
            <LocationAutocomplete
              value={userLocation}
              onChange={(value) => {
                setUserLocation(value);
                // Mark as manual override when user types
                if (value && value !== userLocation) {
                  setManualLocationOverride(true);
                  setIsAutoDetected(false);
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={
                isDetectingLocation
                  ? "Detecting your location..."
                  : detectedCoords && !manualLocationOverride
                    ? "Your location (auto-detected)"
                    : "Your location"
              }
              disabled={isLoading || isDetectingLocation}
              skipAutocomplete={!manualLocationOverride && !!detectedCoords}
            />
            <LocationAutocomplete
              value={workerLocation}
              onChange={setWorkerLocation}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder="Worker/Service location"
              disabled={isLoading}
            />
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
            {(serviceSearch || userLocation || workerLocation) && (
              <Button
                variant="outline"
                size="sm"
                onClick={clearSearch}
                disabled={isLoading}
              >
                <X />
                Clear
              </Button>
            )}
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
                    onTypingStart={() => {
                      isTypingRef.current = true;
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                    }}
                    onTypingEnd={() => {
                      // Reset typing flag and trigger search
                      typingTimeoutRef.current = setTimeout(() => {
                        isTypingRef.current = false;
                        // Trigger search by updating searchTrigger state
                        setSearchTrigger((prev) => prev + 1);
                      }, 100);
                    }}
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
                {serviceSearch || workerLocation || userLocation
                  ? "Search Results"
                  : "Results Near You"}
              </h1>
              <p className="text-muted-foreground text-sm">
                Found {displayedWorkers.length} workers
                {serviceSearch && ` for "${serviceSearch}"`}
                {workerLocation && ` in ${workerLocation}`}
                {userLocation
                  ? ` • Sorted by distance from ${userLocation}`
                  : ` • Sorted by distance from city center`}
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
                    onTypingStart={() => {
                      isTypingRef.current = true;
                      if (typingTimeoutRef.current) {
                        clearTimeout(typingTimeoutRef.current);
                      }
                    }}
                    onTypingEnd={() => {
                      // Reset typing flag and trigger search
                      typingTimeoutRef.current = setTimeout(() => {
                        isTypingRef.current = false;
                        // Trigger search by updating searchTrigger state
                        setSearchTrigger((prev) => prev + 1);
                      }, 100);
                    }}
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
