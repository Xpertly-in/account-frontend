// ProfileLoader Component - Skeleton loading states for profile sections
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { cn } from "@/lib/utils";

interface ProfileLoaderProps {
  /** Loading variant for different profile sections */
  variant?: "header" | "content" | "experience" | "education" | "social" | "full";
  /** Number of skeleton items to show */
  count?: number;
  /** Additional CSS classes */
  className?: string;
}

// Skeleton base component
const Skeleton = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("animate-pulse rounded-md bg-gray-200 dark:bg-gray-700", className)}
    {...props}
  />
);

// Header skeleton (avatar + basic info)
const HeaderSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
    {/* Avatar skeleton */}
    <div className="relative">
      <Skeleton className="h-24 w-24 sm:h-32 sm:w-32 rounded-full" />
      <Skeleton className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full" />
    </div>

    {/* Info skeleton */}
    <div className="flex-1 space-y-3 text-center sm:text-left">
      <Skeleton className="h-6 w-48 mx-auto sm:mx-0" />
      <Skeleton className="h-4 w-32 mx-auto sm:mx-0" />
      <div className="flex justify-center sm:justify-start gap-2">
        <Skeleton className="h-6 w-16 rounded-full" />
        <Skeleton className="h-6 w-20 rounded-full" />
      </div>
      <Skeleton className="h-4 w-64 mx-auto sm:mx-0" />
    </div>
  </div>
);

// Content skeleton (sections with text)
const ContentSkeleton = ({ count = 1 }: { count?: number }) => (
  <div className="space-y-6">
    {Array.from({ length: count }).map((_, index) => (
      <div key={index} className="space-y-4">
        <Skeleton className="h-6 w-32" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    ))}
  </div>
);

// Experience skeleton (timeline items)
const ExperienceSkeleton = ({ count = 3 }: { count?: number }) => (
  <div className="space-y-6">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <div className="flex flex-col items-center">
            <Skeleton className="h-3 w-3 rounded-full" />
            {index < count - 1 && <Skeleton className="h-16 w-0.5 mt-2" />}
          </div>
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-48" />
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-4 w-24" />
            <div className="space-y-1">
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Education skeleton (list items)
const EducationSkeleton = ({ count = 2 }: { count?: number }) => (
  <div className="space-y-6">
    <Skeleton className="h-6 w-32" />
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="flex gap-4">
          <Skeleton className="h-12 w-12 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-24" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Social skeleton (icon links)
const SocialSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-6 w-32" />
    <div className="flex flex-wrap gap-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-10 w-10 rounded-lg" />
      ))}
    </div>
  </div>
);

// Full profile skeleton (all sections)
const FullProfileSkeleton = () => (
  <div className="space-y-8">
    <HeaderSkeleton />
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <ContentSkeleton count={2} />
    </div>
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <ExperienceSkeleton count={2} />
    </div>
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <EducationSkeleton count={2} />
    </div>
    <div className="border-t border-gray-200 dark:border-gray-700 pt-8">
      <SocialSkeleton />
    </div>
  </div>
);

export function ProfileLoader({ variant = "full", count = 1, className }: ProfileLoaderProps) {
  const renderSkeleton = () => {
    switch (variant) {
      case "header":
        return <HeaderSkeleton />;
      case "content":
        return <ContentSkeleton count={count} />;
      case "experience":
        return <ExperienceSkeleton count={count} />;
      case "education":
        return <EducationSkeleton count={count} />;
      case "social":
        return <SocialSkeleton />;
      case "full":
      default:
        return <FullProfileSkeleton />;
    }
  };

  return (
    <div className={cn("w-full", className)} role="status" aria-label="Loading profile">
      {renderSkeleton()}
    </div>
  );
}

// Export individual skeleton components for specific use cases
export {
  HeaderSkeleton,
  ContentSkeleton,
  ExperienceSkeleton,
  EducationSkeleton,
  SocialSkeleton,
  FullProfileSkeleton,
};
