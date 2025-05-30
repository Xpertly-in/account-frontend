export function getPostLink(postId: number | string): string {
    // SSR-friendly: if window isn’t available, return just the path
    if (typeof window === "undefined") {
      return `/feed/${postId}`;
    }
    return `${window.location.origin}/feed/${postId}`;
  }