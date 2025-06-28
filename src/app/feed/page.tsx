"use client";

import React, { Suspense } from "react";
import { Feed } from "@/components/features/feed/Feed.component";

// Loading fallback component
const FeedLoading = () => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
      <p className="text-gray-600 dark:text-gray-400">Loading feed...</p>
    </div>
  </div>
);

// Error boundary component
const FeedError = ({ error }: { error: Error }) => (
  <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
    <div className="text-center max-w-md mx-auto p-6">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-2">
        Something went wrong
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        We're having trouble loading the feed. Please try refreshing the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
      >
        Refresh Page
      </button>
    </div>
  </div>
);

export default function ForumPage() {
  return (
    <Suspense fallback={<FeedLoading />}>
      <Feed />
    </Suspense>
  );
}