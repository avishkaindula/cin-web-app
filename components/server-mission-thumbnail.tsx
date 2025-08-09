import React from 'react';
import { getMissionThumbnailUrlServer } from '@/lib/supabase/storage';

interface ServerMissionThumbnailProps {
  thumbnailPath: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Server component to display mission thumbnails using signed URLs for private storage
 * This is more efficient than the client component as it generates URLs on the server
 */
export async function ServerMissionThumbnail({ 
  thumbnailPath, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder.svg" 
}: ServerMissionThumbnailProps) {
  let imageUrl = fallbackSrc;

  if (thumbnailPath) {
    try {
      const signedUrl = await getMissionThumbnailUrlServer(thumbnailPath);
      if (signedUrl) {
        imageUrl = signedUrl;
      }
    } catch (error) {
      console.error('Error generating signed URL for mission thumbnail:', error);
      // Fall back to placeholder
    }
  }

  return (
    <img
      src={imageUrl}
      alt={alt}
      className={className}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        if (target.src !== fallbackSrc) {
          target.src = fallbackSrc;
        }
      }}
    />
  );
}

export default ServerMissionThumbnail;
