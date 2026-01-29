import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/workers/[id]
 * Get detailed information about a specific worker
 */
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createClient();
    const params = await context.params;
    const slug = params.id; // This will be the slug from the URL

    // Fetch worker details by slug
    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("*")
      .eq("slug", slug)
      .single();

    if (workerError || !worker) {
      console.error("Error fetching worker:", workerError);
      return NextResponse.json(
        { error: "Worker not found" },
        { status: 404 }
      );
    }

    // Fetch user details for the worker
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("firstname, lastname, bio, city, state, profile_pic_url")
      .eq("id", worker.user_id)
      .single();

    if (userError) {
      console.error("Error fetching user data:", userError);
    }

    // Calculate average rating (ratings.worker_id now references workers.id)
    const { data: ratings } = await supabase
      .from("ratings")
      .select("rating_value")
      .eq("worker_id", worker.id);

    const avgRating =
      ratings && ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating_value, 0) / ratings.length
        : 0;

    // Format response
    const workerProfile = {
      id: worker.id,
      name: user
        ? `${user.firstname} ${user.lastname}`.trim()
        : "Unknown Worker",
      profession: worker.profession || "General Worker",
      rating: Math.round(avgRating * 10) / 10,
      reviews: ratings?.length || 0,
      hourlyRateMin: worker.hourly_rate_min || 0,
      hourlyRateMax: worker.hourly_rate_max || 0,
      location:
        user?.city && user?.state
          ? `${user.city}, ${user.state}`
          : user?.city || user?.state || "Location not set",
      avatar:
        user?.profile_pic_url ||
        `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstname}${user?.lastname}`,
      verified: worker.is_verified || false,
      yearsExperience: worker.years_experience || 0,
      completedJobs: worker.jobs_completed || 0,
      responseTime: worker.response_time_minutes
        ? `Within ${worker.response_time_minutes} minutes`
        : "Within 1 hour",
      bio: user?.bio || "",
      skills: worker.skills || [],
      status: worker.status || "available",
    };

    return NextResponse.json({ worker: workerProfile });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
