import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();

    // Get all users with role 2 (workers)
    const { data: users, error: usersError } = await supabase
      .from("users")
      .select("id, firstname, lastname, role")
      .eq("role", 2);

    if (usersError) {
      return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // Get all presence data (not filtered by role)
    const { data: allPresence, error: presenceError } = await supabase
      .from("user_presence")
      .select("*");

    if (presenceError) {
      return NextResponse.json({ error: presenceError.message }, { status: 500 });
    }

    // Get worker presence data with user info
    const { data: workerPresence, error: workerPresenceError } = await supabase
      .from("user_presence")
      .select(`
        user_id,
        latitude,
        longitude,
        is_online,
        last_seen,
        location_updated_at,
        users!inner(firstname, lastname, role)
      `)
      .eq("users.role", 2);

    if (workerPresenceError) {
      return NextResponse.json({ error: workerPresenceError.message }, { status: 500 });
    }

    return NextResponse.json({
      workers: users,
      allPresence: allPresence,
      workerPresence: workerPresence,
      summary: {
        totalWorkers: users?.length || 0,
        workersWithPresence: workerPresence?.length || 0,
        totalPresenceRecords: allPresence?.length || 0,
      },
    });
  } catch (error) {
    console.error("Debug API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
