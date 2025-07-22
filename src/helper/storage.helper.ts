import { supabase } from "@/lib/supabase";

// Cache for signed URLs to prevent re-generation
const urlCache = new Map<string, { url: string; expires: number }>();

/**
 * Convert a storage path to a signed Supabase storage URL
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @param expiresIn - Expiration time in seconds (default: 1 hour)
 * @returns Signed URL for the file
 */
export async function getStorageUrl(
  bucket: string,
  path: string,
  expiresIn = 3600
): Promise<string> {
  if (!path) {
    return "";
  }

  // Check cache first
  const cacheKey = `${bucket}:${path}`;
  const cached = urlCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expires > now) {
    return cached.url;
  }

  try {
    const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Failed to create signed URL:", error);
      return "";
    }

    // Cache the URL (expires 5 minutes before actual expiry for safety)
    const cacheExpiry = now + (expiresIn - 300) * 1000;
    urlCache.set(cacheKey, { url: data.signedUrl, expires: cacheExpiry });

    return data.signedUrl;
  } catch (error) {
    console.error("Error creating signed URL:", error);
    return "";
  }
}

/**
 * Get the signed URL for a profile picture (synchronous version for render methods)
 * @param profilePicturePath - The storage path of the profile picture
 * @returns Cached signed URL or empty string if not available
 */
export function getProfilePictureUrl(profilePicturePath?: string | null): string {
  if (!profilePicturePath) {
    return "";
  }

  // Check if it's already a full URL
  if (profilePicturePath.startsWith("http://") || profilePicturePath.startsWith("https://")) {
    return profilePicturePath;
  }

  // Return cached URL if available
  const cacheKey = `profile-pictures:${profilePicturePath}`;
  const cached = urlCache.get(cacheKey);
  const now = Date.now();

  if (cached && cached.expires > now) {
    return cached.url;
  }

  // Return empty string if not cached (async version should be used to populate cache)
  return "";
}

/**
 * Async version to get profile picture URL and populate cache
 * @param profilePicturePath - The storage path of the profile picture
 * @returns Promise with signed URL
 */
export async function getProfilePictureUrlAsync(
  profilePicturePath?: string | null
): Promise<string> {
  if (!profilePicturePath) {
    return "";
  }

  // Check if it's already a full URL
  if (profilePicturePath.startsWith("http://") || profilePicturePath.startsWith("https://")) {
    return profilePicturePath;
  }

  return getStorageUrl("profile-pictures", profilePicturePath);
}

/**
 * Check if a URL is already a full URL (starts with http)
 * @param url - The URL to check
 * @returns True if it's already a full URL
 */
export function isFullUrl(url: string): boolean {
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Convert a storage path to a full URL if it's not already a full URL
 * @param bucket - The storage bucket name
 * @param pathOrUrl - Either a storage path or a full URL
 * @returns Promise with full URL
 */
export async function ensureFullUrl(bucket: string, pathOrUrl?: string | null): Promise<string> {
  if (!pathOrUrl) return "";

  if (isFullUrl(pathOrUrl)) {
    return pathOrUrl;
  }

  return getStorageUrl(bucket, pathOrUrl);
}

/**
 * Clear URL cache (useful when user updates profile picture)
 * @param bucket - Optional bucket to clear specific cache
 * @param path - Optional path to clear specific cache
 */
export function clearUrlCache(bucket?: string, path?: string): void {
  if (bucket && path) {
    const cacheKey = `${bucket}:${path}`;
    urlCache.delete(cacheKey);
  } else if (bucket) {
    // Clear all entries for a bucket
    for (const key of urlCache.keys()) {
      if (key.startsWith(`${bucket}:`)) {
        urlCache.delete(key);
      }
    }
  } else {
    // Clear entire cache
    urlCache.clear();
  }
}
