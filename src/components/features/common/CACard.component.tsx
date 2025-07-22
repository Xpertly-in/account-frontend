"use client";

import { MapPin, Star, Check, Trophy } from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import Link from "next/link";
import { CA } from "@/types/ca.type";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useCallback } from "react";

interface CACardProps {
  ca: CA;
}

export default function CACard({ ca }: CACardProps) {
  const { trackProfileView, trackUserInteraction } = useAnalytics();

  // Calculate initials for avatar
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Separate city and state from location string
  const [city, state] = ca.location.split(", ");

  // Track profile view
  const handleProfileClick = useCallback(() => {
    trackProfileView(ca.id.toString(), "ca_profile");
    trackUserInteraction({
      action: "click",
      label: "view_profile",
      params: {
        ca_id: ca.id.toString(),
        ca_name: ca.name,
        ca_location: ca.location,
      },
      timestamp: Date.now(),
    });
  }, [ca, trackProfileView, trackUserInteraction]);

  // Track contact click
  const handleContactClick = useCallback(() => {
    trackUserInteraction({
      action: "click",
      label: "contact_ca",
      params: {
        ca_id: ca.id.toString(),
        ca_name: ca.name,
        ca_location: ca.location,
      },
      timestamp: Date.now(),
    });
  }, [ca, trackUserInteraction]);

  return (
    <div className="group relative overflow-hidden rounded-lg border border-border/50 bg-card shadow-md transition-all duration-300 hover:shadow-xl hover:shadow-primary/10 dark:border-blue-800/30 dark:bg-gray-900/95 dark:hover:shadow-blue-600/10 hover:-translate-y-1">
      {/* Top colored border with gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent dark:from-blue-500 dark:via-blue-400 dark:to-blue-300"></div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-blue-50/50 to-blue-100/30 opacity-50 dark:from-blue-500/20 dark:to-blue-400/10"></div>
      <div className="absolute bottom-0 left-0 h-16 w-16 rounded-tr-full bg-gradient-to-tr from-green-50/50 to-blue-50/30 opacity-40 dark:from-blue-400/20 dark:to-teal-300/10"></div>

      <div className="relative p-5">
        <div className="flex items-start">
          {/* Avatar with gradient background */}
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white shadow-md transition-transform duration-300 group-hover:rotate-6 dark:from-blue-500 dark:to-blue-400">
              {ca.imageUrl ? (
                <img
                  src={ca.imageUrl}
                  alt={ca.name}
                  className="h-16 w-16 rounded-full object-cover"
                />
              ) : (
                <span>{initials}</span>
              )}
            </div>

            {/* Verification badge */}
            {ca.verified && (
              <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent p-0.5 text-white shadow-md dark:bg-teal-400">
                <Check weight="bold" size={14} />
              </div>
            )}
          </div>

          {/* CA details */}
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-foreground dark:text-white">{ca.name}</h3>

              {/* Rating */}
              <div className="flex items-center rounded-full bg-yellow-50 dark:bg-yellow-500/20 px-2.5 py-1 text-sm">
                <Star className="mr-1 h-4 w-4 text-yellow-500 dark:text-yellow-400" weight="fill" />
                <span className="font-medium text-foreground dark:text-white">{ca.rating}</span>
                <span className="ml-1 text-muted-foreground dark:text-blue-100/70">
                  ({ca.reviews})
                </span>
              </div>
            </div>

            {/* Location */}
            <div className="mt-1.5 flex items-center text-sm text-muted-foreground dark:text-blue-100/70">
              <MapPin className="mr-1 h-4 w-4 dark:text-blue-300" weight="fill" />
              <span>
                {city}, {state}
              </span>
            </div>

            {/* Experience */}
            <div className="mt-1.5 flex items-center text-sm text-muted-foreground dark:text-blue-100/70">
              <Trophy className="mr-1 h-4 w-4 dark:text-blue-300" weight="fill" />
              <span>{ca.experience} years experience</span>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="mt-5 flex flex-wrap gap-2">
          {ca.specialization.map(spec => (
            <span
              key={spec}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-200 dark:hover:bg-blue-500/30"
            >
              {spec}
            </span>
          ))}
        </div>

        {/* Action buttons */}
        <div className="mt-5 flex gap-2">
          <Button
            asChild
            variant="outline"
            className="flex-1 border-border bg-card transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-blue-700/50 dark:bg-gray-800/50 dark:text-blue-200 dark:hover:border-blue-500 dark:hover:bg-blue-900/50 dark:hover:text-blue-300"
            onClick={handleProfileClick}
          >
            <Link href={`/xpert/${ca.id}`}>View Profile</Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-primary to-secondary text-primary-foreground transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600 dark:text-white dark:shadow-none dark:hover:shadow-blue-500/20 dark:hover:from-blue-400 dark:hover:to-blue-500"
            onClick={handleContactClick}
          >
            <Link href={`/contact/${ca.id}`}>Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
