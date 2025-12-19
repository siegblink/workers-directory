import { type NextRequest, NextResponse } from "next/server";
import { getLocationSuggestions } from "@/lib/utils/distance";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get("q") || "";

    const suggestions = await getLocationSuggestions(query);

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Location API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
