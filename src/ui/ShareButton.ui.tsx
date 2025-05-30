"use client";

import React from "react";
import { ShareNetwork } from "@phosphor-icons/react";
import { useShareLink } from "@/hooks/useShareLink.hook";

export interface ShareButtonProps {
  postId: number | string;
  title?: string;
  className?: string;
}

export const ShareButton: React.FC<ShareButtonProps> = ({
  postId,
  title,
  className = "",
}) => {
  const handleShare = useShareLink(postId, title);

  return (
    <button
      type="button"
      onClick={handleShare}
      className={`flex items-center gap-1 hover:text-primary mr-2 ${className}`}
    >
      <ShareNetwork size={18} />
      <span className="text-sm">Share</span>
    </button>
  );
};