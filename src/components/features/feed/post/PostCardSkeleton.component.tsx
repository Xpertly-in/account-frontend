// src/components/features/feed/post/PostCardSkeleton.component.tsx

import React from "react";
import { Card } from "@/ui/Card.ui";
import { Skeleton } from "@/ui/Skeleton.ui";

/**
 * Skeleton placeholder for a PostCard
 */
export const PostCardSkeleton: React.FC = () => (
  <Card className="overflow-hidden rounded-2xl shadow-xl transition animate-pulse py-2">
    {/* Header */}
    <div className="flex items-center p-4 space-x-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/4" />
      </div>
    </div>
    {/* Body */}
    <div className="p-4 space-y-2">
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-5/6" />
      <Skeleton className="h-3 w-4/6" />
    </div>
    {/* Image */}
    <Skeleton className="h-56 w-full bg-gray-300 dark:bg-gray-700" />
    {/* Actions */}
    <div className="flex items-center p-4 space-x-4">
      {[...Array(3)].map((_, i) => (
        <Skeleton key={i} className="h-8 w-8 rounded-full" />
      ))}
    </div>
  </Card>
);
