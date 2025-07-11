"use client";

import React from "react";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { 
  CheckCircleIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UsersIcon, 
  StarIcon,
  ChatCenteredTextIcon,
  EnvelopeIcon,
  PhoneIcon
} from "@phosphor-icons/react";
import { cn } from "@/helper/tw.helper";
import ProfileAvatar from "../shared/ProfileAvatar.component";
import { CAProfile } from "@/types/profile.type";

interface CAProfileHeaderProps {
  profile: CAProfile;
  isOwner?: boolean;
  isEditable?: boolean;
  onContactClick?: () => void;
  onEditClick?: () => void;
  onImageUpload?: (file: File) => Promise<void>;
  className?: string;
}

export default function CAProfileHeader({
  profile,
  isOwner = false,
  isEditable = false,
  onContactClick,
  onEditClick,
  onImageUpload,
  className,
}: CAProfileHeaderProps) {
  const {
    first_name = "",
    middle_name = "",
    last_name = "",
    profile_picture_url,
    bio,
    specialization = [],
    city,
    state,
    country = "India",
    email,
    phone,
    profile_completion_percentage = 0,
    created_at,
  } = profile;

  // Construct full name
  const fullName = [first_name, middle_name, last_name]
    .filter(Boolean)
    .join(" ") || "Professional";

  // Format member since date
  const memberSince = created_at 
    ? new Date(created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })
    : "Recently";

  // Format location
  const location = [city, state, country].filter(Boolean).join(", ");

  // Calculate years of experience (mock data for now)
  const yearsOfExperience = Math.max(1, Math.floor(Math.random() * 15) + 3);
  const clientCount = Math.floor(Math.random() * 200) + 50;
  const rating = 4.2 + Math.random() * 0.8; // Random rating between 4.2-5.0

  return (
    <div className={cn("relative", className)}>
      {/* Background with gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950 dark:via-indigo-950 dark:to-purple-950 rounded-t-2xl" />
      
      <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="p-6 md:p-8">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-6 lg:gap-8">
            
            {/* Profile Avatar */}
            <div className="relative">
              <ProfileAvatar
                src={profile_picture_url}
                name={fullName}
                size="2xl"
                isEditable={isEditable}
                showUploadProgress={true}
                showCompletionBadge={true}
                isCompleted={profile_completion_percentage >= 80}
                onImageUpload={onImageUpload}
                className="ring-4 ring-white/50 shadow-2xl"
              />
              
              {/* Verification Badge */}
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full p-2 border-4 border-white shadow-lg dark:border-gray-900">
                <CheckCircleIcon size={24} weight="fill" className="text-white" />
              </div>
            </div>

            {/* Profile Information */}
            <div className="flex-1 text-center lg:text-left space-y-4">
              {/* Name and Title */}
              <div className="space-y-2">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white">
                  {fullName}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-300 font-medium">
                  Chartered Accountant
                </p>
                {bio && (
                  <p className="text-gray-600 dark:text-gray-400 max-w-2xl">
                    {bio}
                  </p>
                )}
              </div>

              {/* Specializations */}
              {specialization.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                  {specialization.slice(0, 4).map((spec, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {spec}
                    </Badge>
                  ))}
                  {specialization.length > 4 && (
                    <Badge variant="outline" className="text-xs">
                      +{specialization.length - 4} more
                    </Badge>
                  )}
                </div>
              )}

              {/* Location and Contact Info */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 text-sm text-gray-600 dark:text-gray-400">
                {location && (
                  <div className="flex items-center gap-2">
                    <MapPinIcon size={16} weight="bold" />
                    <span>{location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <CalendarIcon size={16} weight="bold" />
                  <span>Member since {memberSince}</span>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-lg mx-auto lg:mx-0">
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-primary">
                    {yearsOfExperience}+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Years Experience
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-emerald-600">
                    {clientCount}+
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Happy Clients
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-1">
                    <StarIcon size={16} weight="fill" className="text-amber-400" />
                    <span className="text-2xl font-bold text-gray-900 dark:text-white">
                      {rating.toFixed(1)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Rating
                  </div>
                </div>
                
                <div className="text-center lg:text-left">
                  <div className="text-2xl font-bold text-blue-600">
                    {profile_completion_percentage}%
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    Profile Complete
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-3 min-w-[160px]">
              {!isOwner && onContactClick && (
                <Button
                  onClick={onContactClick}
                  className="bg-gradient-to-r from-primary to-secondary text-white hover:shadow-lg transition-all duration-200"
                >
                  <ChatCenteredTextIcon size={18} weight="bold" className="mr-2" />
                  Contact CA
                </Button>
              )}
              
              {isOwner && isEditable && onEditClick && (
                <Button
                  variant="outline"
                  onClick={onEditClick}
                  className="border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200"
                >
                  Edit Profile
                </Button>
              )}

              {/* Quick Contact Options */}
              {!isOwner && (
                <div className="flex gap-2">
                  {email && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 p-2"
                      onClick={() => window.open(`mailto:${email}`, '_blank')}
                    >
                      <EnvelopeIcon size={16} weight="bold" />
                    </Button>
                  )}
                  
                  {phone && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1 p-2"
                      onClick={() => window.open(`tel:${phone}`, '_blank')}
                    >
                      <PhoneIcon size={16} weight="bold" />
                    </Button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Profile Completion Progress (Owner Only) */}
          {isOwner && (
            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Profile Completion
                </span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {profile_completion_percentage}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${profile_completion_percentage}%` }}
                />
              </div>
              {profile_completion_percentage < 100 && (
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                  Complete your profile to attract more clients on TheFinXperts
                </p>
              )}
            </div>
          )}
        </div>
      </Card>
    </div>
  );
} 