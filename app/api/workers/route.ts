import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDistance, geocodeLocation } from "@/lib/utils/distance";

/**
 * Server-side reverse geocode function
 * Uses Geoapify API to convert GPS coordinates to human-readable address
 */
async function reverseGeocodeServer(
  lat: number,
  lon: number,
): Promise<{ city: string; state: string } | null> {
  const apiKey = process.env.GEOAPIFY_API_KEY;

  if (!apiKey) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.geoapify.com/v1/geocode/reverse?lat=${lat}&lon=${lon}&apiKey=${apiKey}`,
      { headers: { Accept: "application/json" } },
    );

    if (!response.ok) return null;

    const data = await response.json();

    if (data?.features?.[0]) {
      const props = data.features[0].properties;
      return {
        city: props.city || props.suburb || props.district || "Unknown",
        state: props.state || props.county || "Unknown",
      };
    }
  } catch (error) {
    console.error("Reverse geocoding error:", error);
  }

  return null;
}

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const searchParams = request.nextUrl.searchParams;

    // Get pagination parameters
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const offset = (page - 1) * limit;

    // Get search parameters
    const service = searchParams.get("service");
    const filterLocation = searchParams.get("filterLocation"); // Typed location for FILTERING
    const userLat = searchParams.get("userLat"); // GPS for distance calculation
    const userLon = searchParams.get("userLon"); // GPS for distance calculation

    // Get filter parameters
    const profession = searchParams.get("profession");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const onlineOnly = searchParams.get("onlineOnly") === "true";
    const radiusKm = parseInt(searchParams.get("radius") || "50"); // Default 50km radius
    const minDistanceKm = parseFloat(searchParams.get("minDistance") || "0"); // Minimum distance filter
    const maxDistanceKm = parseFloat(searchParams.get("maxDistance") || "50"); // Maximum distance filter

    // User coordinates for DISTANCE calculation (always use GPS if available)
    let userCoords: { lat: number; lon: number };
    if (userLat && userLon) {
      userCoords = { lat: parseFloat(userLat), lon: parseFloat(userLon) };
    } else {
      // Default: Cebu City center
      userCoords = { lat: 10.3157, lon: 123.8854 };
    }

    // Filter coordinates for CITY FILTERING (only if user typed a location)
    let filterCoords: { lat: number; lon: number } | null = null;
    if (filterLocation) {
      const geocoded = await geocodeLocation(filterLocation);
      filterCoords = geocoded;
      console.log("[API] Filter location geocoded:", {
        filterLocation,
        geocoded: filterCoords,
      });
    }

    console.log("[API] Search params:", {
      userCoords,
      filterCoords,
      filterLocation,
      service,
    });

    // Use PostGIS function for efficient spatial queries with real-time GPS
    const { data: workers, error } = await supabase.rpc(
      "search_workers_by_location",
      {
        user_lat: userCoords.lat,
        user_lon: userCoords.lon,
        // Use typed location as STRICT city filter (10km radius from typed location)
        filter_lat: filterCoords?.lat || null,
        filter_lon: filterCoords?.lon || null,
        radius_meters: radiusKm * 1000, // Not used in new logic
        search_profession: service || profession || null,
        min_rate: minRate ? parseInt(minRate) : null,
        max_rate: maxRate ? parseInt(maxRate) : null,
        verified_only: verifiedOnly,
        online_only: onlineOnly,
        result_limit: limit,
        result_offset: offset,
      },
    );

    if (error) {
      console.error("Database error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log("[API] Workers returned from DB:", workers?.length || 0);

    // Filter workers without GPS by city name if filter location is provided
    let filteredWorkers = workers || [];
    if (filterLocation && filterCoords) {
      // Extract city name from filter location (e.g., "Liloan, Cebu" -> "Liloan")
      const filterCityName = filterLocation.split(',')[0].trim().toLowerCase();

      filteredWorkers = (workers || []).filter((worker: any) => {
        // Workers with GPS are already filtered by the database
        if (worker.latitude && worker.longitude) {
          return true;
        }

        // Workers without GPS: check if registered city matches filter city
        const workerCity = (worker.city || '').toLowerCase();
        const matches = workerCity.includes(filterCityName) || filterCityName.includes(workerCity);

        console.log("[API] Filtering worker without GPS:", {
          workerName: `${worker.firstname} ${worker.lastname}`,
          workerCity: worker.city,
          filterCity: filterCityName,
          matches,
        });

        return matches;
      });

      console.log("[API] After city filtering:", filteredWorkers.length, "workers");
    }

    // Transform to WorkerCard interface
    // Note: Ratings are now included in the PostGIS query (optimized - no N+1 queries!)
    const transformedWorkers = await Promise.all(
      filteredWorkers.map(async (worker: any) => {
          // Format distance display
          const distance = worker.distance_km;
          let distanceDisplay = "N/A";

          // Only show distance if we have valid GPS coordinates and distance
          if (distance !== null && distance !== undefined && distance >= 0) {
            if (distance < 0.05) {
              // Less than 50 meters - show as "Nearby"
              distanceDisplay = "Nearby";
            } else if (distance < 1) {
              // Less than 1km - show in meters
              const meters = Math.round(distance * 1000);
              distanceDisplay = `${meters} m`;
            } else {
              // Show up to 2 decimal places, removing trailing zeros
              const formatted = distance.toFixed(2).replace(/\.?0+$/, "");
              distanceDisplay = `${formatted} km`;
            }
          }
          // If distance is null (no GPS), distanceDisplay stays "N/A"

          // Use reverse geocoding if city/state are missing but GPS coordinates are available
          let city = worker.city;
          let state = worker.state;

          if (
            (!city || !state || city === "Unknown" || state === "Unknown") &&
            worker.latitude &&
            worker.longitude
          ) {
            const geocoded = await reverseGeocodeServer(
              parseFloat(worker.latitude),
              parseFloat(worker.longitude),
            );
            if (geocoded) {
              city = city || geocoded.city;
              state = state || geocoded.state;
            }
          }

          return {
            id: worker.id,
            name: `${worker.firstname} ${worker.lastname}`,
            profession: worker.profession || "General Worker",
            rating: parseFloat(worker.average_rating) || 0,
            reviews: worker.total_ratings || 0,
            hourlyRateMin: worker.hourly_rate_min || 0,
            hourlyRateMax: worker.hourly_rate_max || 0,
            location: `${city || "Unknown"}, ${state || "Unknown"}`,
            distance: distanceDisplay,
            distanceValue: distance,
            avatar:
              worker.profile_pic_url ||
              `https://api.dicebear.com/7.x/avataaars/svg?seed=${worker.firstname || "default"}${worker.lastname || "user"}`,
            isOnline: worker.is_online || false,
            verified: worker.is_verified || false,
            yearsExperience: worker.years_experience || 0,
            jobsCompleted: worker.jobs_completed || 0,
            responseTime: worker.response_time_minutes || 60,
            userLatitude: worker.latitude || null,
            userLongitude: worker.longitude || null,
          };
        }),
    ).then((workers) =>
      // Filter by distance range (strict filtering)
      // Use < with +1 to include decimals (e.g., 3km includes 0-3.999... but not 4.0)
      workers.filter((worker: any) => {
        const distance = worker.distanceValue || 0;
        return distance >= minDistanceKm && distance < maxDistanceKm + 1;
      }),
    );

    // Get total count
    const { count } = await supabase
      .from("workers")
      .select("*", { count: "exact", head: true })
      .eq("status", "available");

    return NextResponse.json({
      workers: transformedWorkers,
      pagination: {
        page,
        limit,
        total: count || 0,
        totalPages: Math.ceil((count || 0) / limit),
        hasMore: offset + limit < (count || 0),
      },
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
