import { useState, useEffect } from "react";
import { getProfilePictureUrlAsync } from "@/helper/storage.helper";

/**
 * Hook to manage profile picture URLs with async loading and caching
 * @param profilePicturePath - The storage path of the profile picture
 * @returns Object with URL, loading state, and error
 */
export function useProfilePictureUrl(profilePicturePath?: string | null) {
  const [url, setUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadUrl() {
      if (!profilePicturePath) {
        setUrl("");
        setLoading(false);
        setError(null);
        return;
      }

      // If it's already a full URL, use it directly
      if (profilePicturePath.startsWith("http://") || profilePicturePath.startsWith("https://")) {
        setUrl(profilePicturePath);
        setLoading(false);
        setError(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const signedUrl = await getProfilePictureUrlAsync(profilePicturePath);
        
        if (isMounted) {
          setUrl(signedUrl);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : "Failed to load image");
          setUrl("");
          setLoading(false);
        }
      }
    }

    loadUrl();

    return () => {
      isMounted = false;
    };
  }, [profilePicturePath]);

  return { url, loading, error };
} 