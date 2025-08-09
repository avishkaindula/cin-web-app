import { createClient } from "./client";
import { createClient as createServerClient } from "./server";

/**
 * Generate a signed URL for a private storage file
 * @param bucket - Storage bucket name
 * @param path - File path in storage
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error
 */
export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600 // 1 hour default
): Promise<string | null> {
  try {
    const supabase = createClient();
    
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
    const supabase = await createServerClient();
    
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
 * Generate signed URLs for mission thumbnails
 * @param thumbnailPath - Thumbnail file path from database
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error/no path
 */
export async function getMissionThumbnailUrl(
  thumbnailPath: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!thumbnailPath) return null;
  
  return getSignedUrl("mission-content", thumbnailPath, expiresIn);
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
 * Generate signed URLs for mission submission evidence
 * @param evidencePath - Evidence file path from database
 * @param expiresIn - URL expiration time in seconds (default: 1 hour)
 * @returns Promise<string | null> - Signed URL or null if error/no path
 */
export async function getMissionSubmissionUrl(
  evidencePath: string | null,
  expiresIn: number = 3600
): Promise<string | null> {
  if (!evidencePath) return null;
  
  return getSignedUrl("mission-submissions", evidencePath, expiresIn);
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
