import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * API endpoint to mark stale users as offline
 * Can be called periodically by a cron job or client-side
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Call the database function to mark stale users as offline
    const { data, error } = await supabase.rpc('mark_stale_users_offline');

    if (error) {
      console.error("Error marking stale users offline:", error);
      return NextResponse.json(
        { error: "Failed to cleanup presence" },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      usersMarkedOffline: data || 0,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * Allow GET requests for easier cron job integration
 */
export async function GET(request: NextRequest) {
  return POST(request);
}
