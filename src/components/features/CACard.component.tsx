"use client";

import { MapPin, Star, Check, Trophy } from "@phosphor-icons/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CAData } from "@/types/ca.type";

interface CACardProps {
  ca: CAData;
}

export function CACard({ ca }: CACardProps) {
  // Calculate initials for avatar
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Separate city and state from location string
  const [city, state] = ca.location.split(", ");

  return (
    <div className="group relative overflow-hidden rounded-lg border border-gray-200 bg-white transition-all duration-300 hover:shadow-xl hover:shadow-blue-100/40 hover:-translate-y-1">
      {/* Top colored border with gradient */}
      <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent"></div>

      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 h-24 w-24 rounded-bl-full bg-gradient-to-br from-blue-50 to-blue-100/30 opacity-50"></div>
      <div className="absolute bottom-0 left-0 h-16 w-16 rounded-tr-full bg-gradient-to-tr from-green-50 to-blue-50/30 opacity-40"></div>

      <div className="p-5">
        <div className="flex items-start">
          {/* Avatar with gradient background */}
          <div className="relative">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xl font-bold text-white shadow-md transition-transform duration-300 group-hover:rotate-6">
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
              <div className="absolute -right-1 -bottom-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent p-0.5 text-white shadow-md">
                <Check weight="bold" size={14} />
              </div>
            )}
          </div>

          {/* CA details */}
          <div className="ml-4 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-900">{ca.name}</h3>

              {/* Rating */}
              <div className="flex items-center rounded-full bg-yellow-50 px-2 py-1 text-sm">
                <Star className="mr-1 h-4 w-4 text-yellow-400" weight="fill" />
                <span className="font-medium text-gray-900">{ca.rating}</span>
                <span className="ml-1 text-gray-500">({ca.reviews})</span>
              </div>
            </div>

            {/* Location */}
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <MapPin className="mr-1 h-4 w-4" weight="fill" />
              <span>
                {city}, {state}
              </span>
            </div>

            {/* Experience */}
            <div className="mt-1 flex items-center text-sm text-gray-500">
              <Trophy className="mr-1 h-4 w-4" weight="fill" />
              <span>{ca.experience} years experience</span>
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div className="mt-5 flex flex-wrap gap-2">
          {ca.specialization.map(spec => (
            <span
              key={spec}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700 transition-colors hover:bg-blue-100"
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
            className="flex-1 border-gray-200 bg-white transition-colors hover:border-primary hover:bg-blue-50 hover:text-primary"
          >
            <Link href={`/ca/${ca.id}`}>View Profile</Link>
          </Button>
          <Button
            asChild
            className="flex-1 bg-gradient-to-r from-primary to-blue-600 text-white transition-all hover:shadow-md"
          >
            <Link href={`/contact/${ca.id}`}>Contact</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
