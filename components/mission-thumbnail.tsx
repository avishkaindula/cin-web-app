import React, { useState, useEffect } from 'react';
import { getMissionThumbnailUrl } from '@/lib/supabase/storage';

interface MissionThumbnailProps {
  thumbnailPath: string | null;
  alt: string;
  className?: string;
  fallbackSrc?: string;
}

/**
 * Component to display mission thumbnails using signed URLs for private storage
 * This automatically handles generating signed URLs for private storage files
 */
export function MissionThumbnail({ 
  thumbnailPath, 
  alt, 
  className = "",
  fallbackSrc = "/placeholder.svg" 
}: MissionThumbnailProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    async function loadImage() {
      if (!thumbnailPath) {
        setImageUrl(fallbackSrc);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setHasError(false);
        
        const signedUrl = await getMissionThumbnailUrl(thumbnailPath);
        
        if (signedUrl) {
          setImageUrl(signedUrl);
        } else {
          setImageUrl(fallbackSrc);
          setHasError(true);
        }
      } catch (error) {
        console.error('Error loading mission thumbnail:', error);
        setImageUrl(fallbackSrc);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }

    loadImage();
  }, [thumbnailPath, fallbackSrc]);

  if (isLoading) {
    return (
      <div className={`bg-gray-200 animate-pulse ${className}`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-sm text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageUrl || fallbackSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (imageUrl !== fallbackSrc) {
          setImageUrl(fallbackSrc);
          setHasError(true);
        }
      }}
    />
  );
}

export default MissionThumbnail;
