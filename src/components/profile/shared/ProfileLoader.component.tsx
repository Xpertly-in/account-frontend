"use client";

import React from "react";
import { Skeleton } from "@/ui/Skeleton.ui";
import { Card } from "@/ui/Card.ui";
import { cn } from "@/helper/tw.helper";

interface ProfileLoaderProps {
  variant?: "hero" | "card" | "section" | "list" | "form";
  itemCount?: number;
  showAvatar?: boolean;
  className?: string;
}

export default function ProfileLoader({
  variant = "card",
  itemCount = 3,
  showAvatar = true,
  className,
}: ProfileLoaderProps) {
  switch (variant) {
    case "hero":
      return (
        <div className={cn("space-y-6", className)}>
          {/* Hero Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {showAvatar && <Skeleton className="h-32 w-32 md:h-40 md:w-40 rounded-full" />}
            <div className="flex-1 space-y-4 text-center md:text-left">
              <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
              <Skeleton className="h-6 w-32 mx-auto md:mx-0" />
              <Skeleton className="h-4 w-64 mx-auto md:mx-0" />
              <div className="flex justify-center md:justify-start gap-2">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-18" />
              </div>
            </div>
          </div>

          {/* Hero Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-4 text-center">
                <Skeleton className="h-8 w-12 mx-auto mb-2" />
                <Skeleton className="h-4 w-16 mx-auto" />
              </Card>
            ))}
          </div>
        </div>
      );

    case "card":
      return (
        <Card className={cn("p-6", className)}>
          <div className="space-y-4">
            {/* Card Header */}
            <div className="flex items-center gap-4">
              {showAvatar && <Skeleton className="h-12 w-12 rounded-full" />}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-4 w-48" />
              </div>
            </div>

            {/* Card Content */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          </div>
        </Card>
      );

    case "section":
      return (
        <div className={cn("space-y-6", className)}>
          {/* Section Header */}
          <div className="space-y-2">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-64" />
          </div>

          {/* Section Content */}
          <div className="space-y-4">
            {Array.from({ length: itemCount }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      );

    case "list":
      return (
        <div className={cn("space-y-3", className)}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700"
            >
              {showAvatar && <Skeleton className="h-8 w-8 rounded-full" />}
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
              </div>
              <Skeleton className="h-6 w-16" />
            </div>
          ))}
        </div>
      );

    case "form":
      return (
        <Card className={cn("p-6", className)}>
          <div className="space-y-6">
            {/* Form Header */}
            <div className="space-y-2">
              <Skeleton className="h-6 w-40" />
              <Skeleton className="h-4 w-64" />
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {Array.from({ length: itemCount }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full rounded-md" />
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Skeleton className="h-10 w-20" />
              <Skeleton className="h-10 w-28" />
            </div>
          </div>
        </Card>
      );

    default:
      return (
        <div className={cn("space-y-4", className)}>
          {Array.from({ length: itemCount }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      );
  }
}

// Preset loader components for specific sections
export const ProfileHeroLoader = () => <ProfileLoader variant="hero" showAvatar={true} />;

export const ProfileCardLoader = () => <ProfileLoader variant="card" showAvatar={true} />;

export const ProfileSectionLoader = ({ itemCount = 3 }: { itemCount?: number }) => (
  <ProfileLoader variant="section" itemCount={itemCount} />
);

export const ProfileListLoader = ({ itemCount = 5 }: { itemCount?: number }) => (
  <ProfileLoader variant="list" itemCount={itemCount} showAvatar={true} />
);

export const ProfileFormLoader = ({ fieldCount = 4 }: { fieldCount?: number }) => (
  <ProfileLoader variant="form" itemCount={fieldCount} />
);
