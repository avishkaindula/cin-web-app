import { createClient } from "./server";

/**
 * Generate a signed URL for a private storage file (server-side)
 * @param bucket - Storage bucket name
 * @param path - File path in storage
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error
 */
export async function getSignedUrlServer(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  try {
    const supabase = await createClient();
    
    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Exception creating signed URL:", error);
    return null;
  }
}

/**
 * Generate signed URLs for mission thumbnails (server-side)
 * @param thumbnailPath - Thumbnail file path from database
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error/no path
 */
export async function getMissionThumbnailUrlServer(
  thumbnailPath: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!thumbnailPath) return null;
  
  return getSignedUrlServer("mission-content", thumbnailPath, expiresIn);
}

/**
 * Generate signed URLs for mission submission evidence (server-side)
 * @param evidencePath - Evidence file path from database
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error/no path
 */
export async function getMissionSubmissionUrlServer(
  evidencePath: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!evidencePath) return null;
  
  return getSignedUrlServer("mission-submissions", evidencePath, expiresIn);
}
