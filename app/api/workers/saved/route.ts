import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * GET /api/workers/saved
 * Get all saved workers for the authenticated user
 */
export async function GET() {
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

    // Get favorited worker IDs
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
