import { supabase } from "@/lib/supabase";

/**
 * Convert a storage path to a full Supabase storage URL
 * @param bucket - The storage bucket name
 * @param path - The file path within the bucket
 * @returns Full public URL for the file
 */
export function getStorageUrl(bucket: string, path: string): string {
  if (!path) {
    console.log("getStorageUrl: No path provided", { bucket, path });
    return "";
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  console.log("getStorageUrl: Generated URL", {
    bucket,
    path,
    publicUrl: data.publicUrl,
  });

  return data.publicUrl;
}

/**
 * Get the public URL for a profile picture
 * @param profilePicturePath - The storage path of the profile picture
 * @returns Full public URL for the profile picture
 */
export function getProfilePictureUrl(profilePicturePath?: string | null): string {
  if (!profilePicturePath) {
    console.log("getProfilePictureUrl: No path provided", { profilePicturePath });
    return "";
  }

  const url = getStorageUrl("profile-pictures", profilePicturePath);
  console.log("getProfilePictureUrl: Converting path to URL", {
    path: profilePicturePath,
    url,
  });

  return url;
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
 * @returns Full URL
 */
export function ensureFullUrl(bucket: string, pathOrUrl?: string | null): string {
  if (!pathOrUrl) return "";

  if (isFullUrl(pathOrUrl)) {
    return pathOrUrl;
  }

  return getStorageUrl(bucket, pathOrUrl);
}
