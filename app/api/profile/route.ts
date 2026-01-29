import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { geocodeLocation } from "@/lib/utils/distance";

// GET /api/profile - Fetch current user's profile
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    // Fetch user data
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("*")
      .eq("id", user.id)
      .single();

    if (userError) {
      console.error("Error fetching user:", userError);
      return NextResponse.json(
        { error: "Failed to fetch user data" },
        { status: 500 },
      );
    }

    // Check if user is a worker and fetch worker data
    let workerData = null;
    let ratingStats = null;
    if (userData.role === 2) { // role 2 = worker
      const { data, error: workerError } = await supabase
        .from("workers")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (workerError) {
        console.error("Error fetching worker data:", workerError);
      } else {
        workerData = data;

        // Fetch rating statistics for this worker
        if (data) {
          const { data: ratings, error: ratingsError } = await supabase
            .from("ratings")
            .select("rating_value")
            .eq("worker_id", data.id);

          if (!ratingsError && ratings && ratings.length > 0) {
            const avgRating = ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length;
            ratingStats = {
              averageRating: Math.round(avgRating * 10) / 10,
              totalReviews: ratings.length,
            };
          } else {
            ratingStats = {
              averageRating: 0,
              totalReviews: 0,
            };
          }
        }
      }
    }

    return NextResponse.json({
      user: userData,
      worker: workerData,
      ratings: ratingStats,
    });
  } catch (error) {
    console.error("Profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    const body = await request.json();
    const {
      name,
      statusEmoji,
      statusText,
      profession,
      location,
      hourlyRate,
      bio,
      skills,
    } = body;

    // Split name into firstname and lastname
    const nameParts = name?.trim().split(" ") || [];
    const firstname = nameParts[0] || "";
    const lastname = nameParts.slice(1).join(" ") || "";

    // Geocode location if provided
    let latitude = null;
    let longitude = null;
    let city = null;
    let state = null;

    if (location) {
      const coords = await geocodeLocation(location);
      if (coords) {
        latitude = coords.lat;
        longitude = coords.lon;

        // Parse location string to extract city and state
        const locationParts = location.split(",").map((part: string) => part.trim());
        if (locationParts.length >= 2) {
          city = locationParts[locationParts.length - 2];
          state = locationParts[locationParts.length - 1];
        } else {
          city = locationParts[0];
        }
      }
    }

    // Update users table
    const userUpdate: Record<string, any> = {};
    if (firstname) userUpdate.firstname = firstname;
    if (lastname) userUpdate.lastname = lastname;
    if (bio !== undefined) userUpdate.bio = bio;
    if (statusText !== undefined) userUpdate.status = statusText;
    if (city !== null) userUpdate.city = city;
    if (state !== null) userUpdate.state = state;
    if (latitude !== null) userUpdate.latitude = latitude;
    if (longitude !== null) userUpdate.longitude = longitude;

    const { error: userError } = await supabase
      .from("users")
      .update(userUpdate)
      .eq("id", user.id);

    if (userError) {
      console.error("Error updating user:", userError);
      return NextResponse.json(
        { error: "Failed to update user data" },
        { status: 500 },
      );
    }

    // Check if user is a worker and update worker table
    const { data: userData } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (userData?.role === 2) { // role 2 = worker
      const workerUpdate: Record<string, any> = {};
      if (profession !== undefined) workerUpdate.profession = profession;
      if (skills !== undefined) workerUpdate.skills = skills;
      if (hourlyRate !== undefined) {
        workerUpdate.hourly_rate_min = hourlyRate;
        workerUpdate.hourly_rate_max = hourlyRate;
      }

      const { error: workerError } = await supabase
        .from("workers")
        .update(workerUpdate)
        .eq("user_id", user.id);

      if (workerError) {
        console.error("Error updating worker:", workerError);
        return NextResponse.json(
          { error: "Failed to update worker data" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
