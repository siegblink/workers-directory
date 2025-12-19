import { type NextRequest, NextResponse } from "next/server";
import {
  createGalleryItem,
  getWorkerGallery,
  searchGallery,
} from "@/lib/database";

/**
 * GET /api/gallery
 * Fetch gallery items (all or filtered by worker_id)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const workerId = searchParams.get("worker_id");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    // If worker_id is provided, get gallery for that worker
    if (workerId) {
      const result = await getWorkerGallery(parseInt(workerId));

      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 500 },
        );
      }

      return NextResponse.json({
        success: true,
        data: result.data,
        count: result.data?.length || 0,
      });
    }

    // Otherwise, use paginated search
    const result = await searchGallery({
      search: search || undefined,
      page,
      limit,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
      pagination: result.pagination,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery items" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/gallery
 * Create a new gallery item
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { worker_id, title, description, media_url } = body;

    // Validate required fields
    if (!worker_id || !title) {
      return NextResponse.json(
        { error: "worker_id and title are required" },
        { status: 400 },
      );
    }

    const result = await createGalleryItem({
      worker_id: parseInt(worker_id),
      title,
      description: description || null,
      media_url: media_url || null,
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: result.data,
        message: "Gallery item created successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create gallery item" },
      { status: 500 },
    );
  }
}
