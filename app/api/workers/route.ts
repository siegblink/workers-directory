import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { calculateDistance, geocodeLocation } from "@/lib/utils/distance";

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
    const location = searchParams.get("location");
    const userLocation = searchParams.get("userLocation");

    // Get filter parameters
    const profession = searchParams.get("profession");
    const minRate = searchParams.get("minRate");
    const maxRate = searchParams.get("maxRate");
    const verifiedOnly = searchParams.get("verifiedOnly") === "true";
    const onlineOnly = searchParams.get("onlineOnly") === "true";
    const radiusKm = parseInt(searchParams.get("radius") || "50"); // Default 50km radius

    // Geocode both locations in parallel for better performance
    const [userCoords, locationCoords] = await Promise.all([
      // User location for distance calculation
      userLocation
        ? geocodeLocation(userLocation)
        : Promise.resolve({ lat: 10.3157, lon: 123.8854 }), // Default: Capitol Site, Cebu City
      // Worker location filter
      location ? geocodeLocation(location) : Promise.resolve(null),
    ]);

    // Use PostGIS function for efficient spatial queries
    const { data: workers, error } = await supabase.rpc(
      "search_workers_by_location",
      {
        user_lat: userCoords?.lat || 10.3157,
        user_lon: userCoords?.lon || 123.8854,
        filter_lat: locationCoords?.lat || null,
        filter_lon: locationCoords?.lon || null,
        radius_meters: radiusKm * 1000, // Convert km to meters
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

    // Transform to WorkerCard interface
    // Note: Ratings are now included in the PostGIS query (optimized - no N+1 queries!)
    const transformedWorkers = (workers || []).map((worker: any) => {
      // Format distance display
      const distance = worker.distance_km || 0;
      let distanceDisplay = "N/A";
      if (distance > 0) {
        if (distance < 1) {
          const meters = Math.round(distance * 1000);
          distanceDisplay = `${meters} m`;
        } else {
          distanceDisplay = `${distance.toFixed(1)} km`;
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
        location: `${worker.city || "Unknown"}, ${worker.state || "Unknown"}`,
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
    });

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
