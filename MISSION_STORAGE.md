# Mission Storage System Updates

## Overview

The mission system has been updated to use private storage buckets instead of public URLs. This ensures that mission content and submission evidence are only accessible to authenticated users.

## Key Changes

### Database Schema
- `missions.thumbnail_url` → `missions.thumbnail_path`
- Storage paths are now stored instead of public URLs
- Private storage policies implemented

### Storage Buckets
- `mission-content` - For mission thumbnails and media (private)
- `mission-submissions` - For agent evidence submissions (private)

### Security
- Only authenticated users can access stored files
- Signed URLs are generated on-demand with expiration times
- No public access to mission content or submissions

## Usage

### Displaying Mission Thumbnails

#### Client Component (React State)
```tsx
import { MissionThumbnail } from '@/components/mission-thumbnail';

<MissionThumbnail 
  thumbnailPath={mission.thumbnail_path}
  alt={mission.title}
  className="w-full h-48 object-cover"
/>
```

#### Server Component (Better Performance)
```tsx
import { ServerMissionThumbnail } from '@/components/server-mission-thumbnail';

<ServerMissionThumbnail 
  thumbnailPath={mission.thumbnail_path}
  alt={mission.title}
  className="w-full h-48 object-cover"
/>
```

### Generating Signed URLs Manually

#### Client-side
```tsx
import { getMissionThumbnailUrl } from '@/lib/supabase/storage';

const signedUrl = await getMissionThumbnailUrl(mission.thumbnail_path);
```

#### Server-side
```tsx
import { getMissionThumbnailUrlServer } from '@/lib/supabase/storage-server';

const signedUrl = await getMissionThumbnailUrlServer(mission.thumbnail_path);
```

### For Mission Submissions
```tsx
import { getMissionSubmissionUrl } from '@/lib/supabase/storage';

const evidenceUrl = await getMissionSubmissionUrl(evidence.file_path);
```

## Storage Utilities

### Client-side utilities (`/lib/supabase/storage.ts`):

- `getSignedUrl(bucket, path, expiresIn)` - Generate signed URL (client)
- `getMissionThumbnailUrl(thumbnailPath, expiresIn)` - Mission thumbnail URL (client)
- `getMissionSubmissionUrl(evidencePath, expiresIn)` - Evidence file URL (client)

### Server-side utilities (`/lib/supabase/storage-server.ts`):

- `getSignedUrlServer(bucket, path, expiresIn)` - Generate signed URL (server)
- `getMissionThumbnailUrlServer(thumbnailPath, expiresIn)` - Mission thumbnail URL (server)
- `getMissionSubmissionUrlServer(evidencePath, expiresIn)` - Evidence file URL (server)

## Migration Notes

- Existing missions will need to have their `thumbnail_url` data migrated to `thumbnail_path`
- Run the migration: `20250809000000_create_missions_system.sql`
- The storage buckets are automatically created with proper security policies

## Security Benefits

1. **Private Access**: Only authenticated users can access mission content
2. **Expiring URLs**: Signed URLs expire after 1 hour by default
3. **User-specific Access**: Submission files are organized by user ID
4. **No Direct Access**: Files cannot be accessed without proper authentication

## File Organization

### Mission Content Bucket (`mission-content`)
```
thumbnails/
  ├── 1641234567-abc123.jpg
  ├── 1641234568-def456.png
  └── ...
```

### Mission Submissions Bucket (`mission-submissions`)
```
user-id-1/
  ├── mission-id-1/
  │   ├── step-1-evidence.jpg
  │   └── step-2-evidence.txt
  └── mission-id-2/
      └── evidence.mp4
user-id-2/
  └── ...
```
