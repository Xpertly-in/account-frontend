// SocialLinksStep Component - Step 4: Social Links & Professional Presence
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { Button } from "@/ui/Button.ui";
import {
  LinkedinLogoIcon,
  GlobeIcon,
  InstagramLogoIcon,
  FacebookLogoIcon,
  TwitterLogoIcon,
  YoutubeLogo,
  LinkIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import type { CAProfile, SocialProfile } from "@/types/profile.type";

interface SocialLinksStepProps {
  profile: CAProfile;
  formData: Partial<CAProfile>;
  onFormDataChange: (data: Partial<CAProfile>) => void;
}

interface SocialPlatform {
  key: keyof SocialProfile;
  label: string;
  icon: React.ComponentType<any>;
  color: string;
  placeholder: string;
}

const SOCIAL_PLATFORMS: SocialPlatform[] = [
  {
    key: "professional_website",
    label: "Professional Website",
    icon: GlobeIcon,
    color: "text-gray-600 dark:text-gray-400",
    placeholder: "https://your-website.com",
  },
  {
    key: "linkedin_profile",
    label: "LinkedIn Profile",
    icon: LinkedinLogoIcon,
    color: "text-blue-600 dark:text-blue-400",
    placeholder: "https://linkedin.com/in/your-profile",
  },
  {
    key: "instagram_profile",
    label: "Instagram",
    icon: InstagramLogoIcon,
    color: "text-pink-600 dark:text-pink-400",
    placeholder: "https://instagram.com/your-profile",
  },
  {
    key: "facebook_profile",
    label: "Facebook",
    icon: FacebookLogoIcon,
    color: "text-blue-700 dark:text-blue-300",
    placeholder: "https://facebook.com/your-profile",
  },
  {
    key: "twitter_profile",
    label: "Twitter",
    icon: TwitterLogoIcon,
    color: "text-blue-500 dark:text-blue-400",
    placeholder: "https://twitter.com/your-profile",
  },
  {
    key: "youtube_profile",
    label: "YouTube Channel",
    icon: YoutubeLogo,
    color: "text-red-600 dark:text-red-400",
    placeholder: "https://youtube.com/your-channel",
  },
];

export default function SocialLinksStep({
  profile,
  formData,
  onFormDataChange,
}: SocialLinksStepProps) {
  const [localData, setLocalData] = useState({
    social_profile: formData.social_profile || {
      linkedin_profile: "",
      professional_website: "",
      instagram_profile: "",
      facebook_profile: "",
      twitter_profile: "",
      youtube_profile: "",
    },
  });

  useEffect(() => {
    onFormDataChange(localData);
  }, [localData]);

  const handleSocialLinkChange = (key: keyof SocialProfile, value: string) => {
    setLocalData(prev => ({
      ...prev,
      social_profile: {
        ...prev.social_profile,
        [key]: value,
      },
    }));
  };

  const getActiveSocialLinks = () => {
    if (!localData.social_profile) return [];

    return SOCIAL_PLATFORMS.filter(platform => {
      const value = localData.social_profile[platform.key];
      return value && typeof value === "string" && value.trim() !== "";
    });
  };

  const activeSocialLinks = getActiveSocialLinks();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Social Links & Professional Presence
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Connect your professional social media profiles and website to build your online presence
        </p>
      </div>

      {/* Progress Summary */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white">
            <LinkIcon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900 dark:text-white">
              {activeSocialLinks.length} of {SOCIAL_PLATFORMS.length} platforms connected
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Add your professional social media links to increase your visibility
            </p>
          </div>
        </div>
      </div>

      {/* Social Links Form */}
      <div className="space-y-4">
        {SOCIAL_PLATFORMS.map(platform => {
          const IconComponent = platform.icon;
          const value = (localData.social_profile[platform.key] as string) || "";
          const isConnected = value.trim() !== "";

          return (
            <div key={platform.key} className="space-y-2">
              <label className="flex items-center gap-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                <div
                  className={cn(
                    "flex items-center gap-2",
                    isConnected && "text-green-600 dark:text-green-400"
                  )}
                >
                  <IconComponent
                    className={cn(
                      "h-5 w-5",
                      isConnected ? "text-green-600 dark:text-green-400" : platform.color
                    )}
                  />
                  {platform.label}
                </div>
                {isConnected && (
                  <span className="text-xs text-green-600 dark:text-green-400 font-normal">
                    Connected
                  </span>
                )}
              </label>
              <div className="relative">
                <Input
                  type="url"
                  value={value}
                  onChange={e => handleSocialLinkChange(platform.key, e.target.value)}
                  placeholder={platform.placeholder}
                  className={cn(
                    "w-full",
                    isConnected &&
                      "border-green-300 dark:border-green-600 bg-green-50 dark:bg-green-900/10"
                  )}
                />
                {isConnected && value && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-blue-600 hover:text-blue-800"
                    onClick={() => window.open(value, "_blank", "noopener,noreferrer")}
                  >
                    Visit
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Tips Section */}
      <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          Tips for Professional Online Presence
        </h4>
        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
          <li>• Keep your LinkedIn profile updated with latest experience</li>
          <li>• Use a professional website to showcase your services</li>
          <li>• Share valuable content related to accounting and finance</li>
          <li>• Maintain consistency across all your social platforms</li>
          <li>• Include relevant keywords in your profiles for better visibility</li>
        </ul>
      </div>

      {/* Summary */}
      {activeSocialLinks.length > 0 && (
        <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-3">Connected Platforms</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeSocialLinks.map(platform => {
              const IconComponent = platform.icon;
              const value = localData.social_profile[platform.key] as string;

              return (
                <div
                  key={platform.key}
                  className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                >
                  <IconComponent className={cn("h-5 w-5", platform.color)} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {platform.label}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
