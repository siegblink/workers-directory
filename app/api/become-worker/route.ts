import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get the authenticated user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get form data
    const body = await request.json();
    const { profession, experience, hourlyRate, bio, skills } = body;

    // Validate required fields
    if (!profession || !experience || !hourlyRate || !bio) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Parse hourly rate - assume it's a single value for now, use it as both min and max
    const rateValue = parseInt(hourlyRate);
    if (isNaN(rateValue) || rateValue <= 0) {
      return NextResponse.json(
        { error: "Invalid hourly rate" },
        { status: 400 },
      );
    }

    // Check if user already has a worker profile
    const { data: existingWorker } = await supabase
      .from("workers")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (existingWorker) {
      return NextResponse.json(
        { error: "You already have a worker profile" },
        { status: 400 },
      );
    }

    // Start a transaction-like operation
    // 1. Update the user's role to 2 (worker) and add bio
    const { error: updateUserError } = await supabase
      .from("users")
      .update({
        role: 2, // Worker role
        bio: bio,
      })
      .eq("id", user.id);

    if (updateUserError) {
      console.error("Error updating user:", updateUserError);
      return NextResponse.json(
        { error: "Failed to update user profile" },
        { status: 500 },
      );
    }

    // 2. Create worker profile
    const { data: workerData, error: workerError } = await supabase
      .from("workers")
      .insert({
        user_id: user.id,
        profession: profession,
        hourly_rate_min: rateValue,
        hourly_rate_max: rateValue, // Use same rate for both min/max initially
        years_experience: parseInt(experience),
        skills: skills || [],
        status: "available",
        is_verified: false, // Needs verification
        jobs_completed: 0,
        response_time_minutes: 60, // Default 1 hour response time
      })
      .select()
      .single();

    if (workerError) {
      console.error("Error creating worker profile:", workerError);
      // Rollback: revert user role back to 3 (user)
      await supabase.from("users").update({ role: 3 }).eq("id", user.id);

      return NextResponse.json(
        {
          error: "Failed to create worker profile",
          details: workerError.message,
          code: workerError.code
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Worker profile created successfully",
      worker: workerData,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
