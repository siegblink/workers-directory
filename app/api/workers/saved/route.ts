import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/workers/saved
 * Get all saved workers for the authenticated user
 * Query params:
 *   - details=true: Include full worker details instead of just IDs
 */
export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if full details are requested via query parameter
    const searchParams = request.nextUrl.searchParams;
    const includeDetails = searchParams.get("details") === "true";

    if (!includeDetails) {
      // Get favorited worker IDs only
      const { data: savedWorkers, error } = await supabase
        .from("favorites")
        .select("worker_id")
        .eq("customer_id", user.id);

      if (error) {
        console.error("Error fetching saved workers:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      // Return array of worker IDs
      const workerIds = savedWorkers.map((sw) => sw.worker_id);
      return NextResponse.json({ workerIds });
    }

    // Get full worker details by joining with workers and users tables
    const { data: savedWorkers, error } = await supabase
      .from("favorites")
      .select(`
        worker_id,
        workers (
          id,
          worker_id,
          profession,
          hourly_rate_min,
          hourly_rate_max
        )
      `)
      .eq("customer_id", user.id);

    if (error) {
      console.error("Error fetching saved workers:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`[Saved Workers API] Found ${savedWorkers?.length || 0} saved workers`);
    console.log("[Saved Workers API] Workers data:", JSON.stringify(savedWorkers, null, 2));

    // Get user details and ratings for each worker
    const workersWithDetails = await Promise.all(
      savedWorkers
        .filter((sw: any) => sw.workers) // Filter out any null workers
        .map(async (sw: any) => {
          const worker = sw.workers;

          // Get user details from the users table
          const { data: userData, error: userError } = await supabase
            .from("users")
            .select("firstname, lastname, profile_pic_url")
            .eq("id", worker.worker_id)
            .single();

          if (userError) {
            console.error(`Error fetching user data for worker ${worker.id}:`, userError);
          }

          // Get average rating
          const { data: ratingData } = await supabase
            .from("ratings")
            .select("rating")
            .eq("worker_id", worker.id);

          const avgRating = ratingData && ratingData.length > 0
            ? ratingData.reduce((sum, r) => sum + r.rating, 0) / ratingData.length
            : 0;

          const firstname = userData?.firstname || "";
          const lastname = userData?.lastname || "";
          const fullName = `${firstname} ${lastname}`.trim();

          console.log(`Worker ${worker.id}: firstname="${firstname}", lastname="${lastname}", fullName="${fullName}"`);

          return {
            id: worker.id,
            name: fullName || "Unknown Worker",
            profession: worker.profession || "General Worker",
            rating: Math.round(avgRating * 10) / 10,
            hourlyRate: worker.hourly_rate_min || 0,
            avatar: userData?.profile_pic_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstname}${lastname}`,
          };
        })
    );

    return NextResponse.json({ workers: workersWithDetails });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/workers/saved
 * Save a worker for the authenticated user
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get worker_id from request body
    const { workerId } = await request.json();

    if (!workerId) {
      return NextResponse.json(
        { error: "Worker ID is required" },
        { status: 400 },
      );
    }

    // Save the worker to favorites
    const { error } = await supabase.from("favorites").insert({
      customer_id: user.id,
      worker_id: workerId,
    });

    if (error) {
      // Handle duplicate error (already saved)
      if (error.code === "23505") {
        return NextResponse.json(
          { message: "Worker already saved" },
          { status: 200 },
        );
      }

      console.error("Error saving worker:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Worker saved successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/workers/saved
 * Unsave a worker for the authenticated user
 */
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get worker_id from request body
    const { workerId } = await request.json();

    if (!workerId) {
      return NextResponse.json(
        { error: "Worker ID is required" },
        { status: 400 },
      );
    }

    // Remove from favorites
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("customer_id", user.id)
      .eq("worker_id", workerId);

    if (error) {
      console.error("Error unsaving worker:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: "Worker unsaved successfully" });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
