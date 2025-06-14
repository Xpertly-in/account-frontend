// src/hooks/useShareLink.hook.ts
"use client";

import React from "react";
import { toast } from "sonner";
import { getPostLink } from "@/utils/shareLink.utils";

/**
 * Returns an onClick handler that
 * • uses native share on mobile
 * • otherwise copies to clipboard + toasts
 */
export function useShareLink(postId: number | string, title?: string) {
  return async function handleShare(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation();
    const postUrl = getPostLink(postId);
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (navigator.share && isMobile) {
      try {
        await navigator.share({ title: title ?? "", url: postUrl });
      } catch {
        // user cancelled or share failed
      }
    } else {
      try {
        await navigator.clipboard.writeText(postUrl);
        toast.success("Link copied to clipboard!");
      } catch {
        toast.error("Failed to copy link");
      }
    }
  };
}