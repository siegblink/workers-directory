import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET /api/profile/availability - Fetch worker's availability
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

    // Get worker profile
    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: "Worker profile not found" },
        { status: 404 },
      );
    }

    // Get availability
    const { data: availabilityRecord, error: availabilityError } = await supabase
      .from("worker_availability")
      .select("schedule")
      .eq("worker_id", worker.id)
      .single();

    if (availabilityError) {
      console.error("Error fetching availability:", availabilityError);
      // Return default availability if none exists
      return NextResponse.json({
        availability: {
          monday: "Closed",
          tuesday: "Closed",
          wednesday: "Closed",
          thursday: "Closed",
          friday: "Closed",
          saturday: "Closed",
          sunday: "Closed",
        },
      });
    }

    return NextResponse.json({ availability: availabilityRecord?.schedule || {} });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// PATCH /api/profile/availability - Update worker's availability
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

    // Get worker profile
    const { data: worker, error: workerError } = await supabase
      .from("workers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (workerError || !worker) {
      return NextResponse.json(
        { error: "Worker profile not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const schedule = body; // The entire body is the schedule object

    // Check if availability record exists
    const { data: existingAvailability } = await supabase
      .from("worker_availability")
      .select("id")
      .eq("worker_id", worker.id)
      .single();

    if (existingAvailability) {
      // Update existing record
      const { error: updateError } = await supabase
        .from("worker_availability")
        .update({
          schedule: schedule,
          updated_at: new Date().toISOString(),
        })
        .eq("worker_id", worker.id);

      if (updateError) {
        console.error("Error updating availability:", updateError);
        return NextResponse.json(
          { error: "Failed to update availability" },
          { status: 500 },
        );
      }
    } else {
      // Insert new record
      const { error: insertError } = await supabase
        .from("worker_availability")
        .insert({
          worker_id: worker.id,
          schedule: schedule,
        });

      if (insertError) {
        console.error("Error inserting availability:", insertError);
        return NextResponse.json(
          { error: "Failed to create availability" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Availability updated successfully",
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
