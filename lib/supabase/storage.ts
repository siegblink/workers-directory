import { createClient } from "./client";

/**
 * Photo type for verification uploads
 */
type PhotoType = "id_front" | "id_back" | "selfie";

/**
 * Uploads a verification photo to Supabase Storage
 *
 * @param userId - The authenticated user's ID
 * @param photoType - Type of photo being uploaded
 * @param file - The file to upload
 * @returns Object with url and path on success, or error message on failure
 */
export async function uploadVerificationPhoto(
  userId: string,
  photoType: PhotoType,
  file: File,
): Promise<{ url: string; path: string } | { error: string }> {
  try {
    const supabase = createClient();

    // Generate unique filename: userId/photoType_timestamp.ext
    const timestamp = Date.now();
    const fileExt = file.name.split(".").pop() || "jpg";
    const filePath = `${userId}/${photoType}_${timestamp}.${fileExt}`;

    // Upload to 'verifications' bucket
    const { data, error } = await supabase.storage
      .from("verifications")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false, // Don't overwrite existing files
      });

    if (error) {
      console.error("Storage upload error:", error);
      return { error: `Failed to upload ${photoType}: ${error.message}` };
    }

    if (!data) {
      return { error: `Failed to upload ${photoType}: No data returned` };
    }

    // Get public URL (or use createSignedUrl for private bucket)
    const { data: urlData } = supabase.storage
      .from("verifications")
      .getPublicUrl(data.path);

    return {
      url: urlData.publicUrl,
      path: data.path,
    };
  } catch (err) {
    console.error("Unexpected error uploading photo:", err);
    return {
      error:
        err instanceof Error ? err.message : "An unexpected error occurred",
    };
  }
}
