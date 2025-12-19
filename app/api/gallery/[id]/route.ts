import { type NextRequest, NextResponse } from "next/server";
import {
  deleteGalleryItem,
  getGalleryById,
  updateGalleryItem,
  verifyGalleryOwnership,
} from "@/lib/database";

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

/**
 * GET /api/gallery/[id]
 * Fetch a single gallery item by ID
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const result = await getGalleryById(id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 },
      );
    }

    if (!result.data) {
      return NextResponse.json(
        { error: "Gallery item not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      data: result.data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch gallery item" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/gallery/[id]
 * Update a gallery item
 */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { title, description, media_url, worker_id } = body;

    // Optional: Verify ownership if worker_id is provided
    if (worker_id) {
      const ownershipResult = await verifyGalleryOwnership(
        id,
        parseInt(worker_id),
      );

      if (!ownershipResult.data) {
        return NextResponse.json(
          { error: "You don't have permission to update this gallery item" },
          { status: 403 },
        );
      }
    }

    const result = await updateGalleryItem(id, {
      title,
      description: description !== undefined ? description : undefined,
      media_url: media_url !== undefined ? media_url : undefined,
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
      message: "Gallery item updated successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update gallery item" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/gallery/[id]
 * Delete a gallery item
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const searchParams = request.nextUrl.searchParams;
    const workerId = searchParams.get("worker_id");

    // Optional: Verify ownership if worker_id is provided
    if (workerId) {
      const ownershipResult = await verifyGalleryOwnership(
        id,
        parseInt(workerId),
      );

      if (!ownershipResult.data) {
        return NextResponse.json(
          { error: "You don't have permission to delete this gallery item" },
          { status: 403 },
        );
      }
    }

    const result = await deleteGalleryItem(id);

    if (result.error) {
      return NextResponse.json(
        { error: result.error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Gallery item deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete gallery item" },
      { status: 500 },
    );
  }
}
