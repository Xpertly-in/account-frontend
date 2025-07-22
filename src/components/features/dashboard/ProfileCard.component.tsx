"use client";
import { useState, useEffect } from "react";
import { Card } from "@/ui/Card.ui";
import { Progress } from "@/ui/Progress.ui";
import { Camera } from "@phosphor-icons/react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/context/Auth.provider";
import type { CustomerProfile } from "@/types/customer-profile.type";
import { useProfilePictureUrl } from "@/hooks/useProfilePictureUrl";
import { clearUrlCache } from "@/helper/storage.helper";

// Helper function to get initials from a name
const getInitials = (name: string): string => {
  if (!name || name.trim() === "") return "U";

  const words = name
    .trim()
    .split(" ")
    .filter(word => word.length > 0);
  if (words.length === 0) return "U";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();

  const firstInitial = words[0].charAt(0).toUpperCase();
  const lastInitial = words[words.length - 1].charAt(0).toUpperCase();
  return `${firstInitial}${lastInitial}`;
};

export default function ProfileCard() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [imageUploading, setImageUploading] = useState(false);

  // Use the new hook for profile picture URL
  const { url: profilePictureUrl } = useProfilePictureUrl(profile?.profile_picture_url);

  useEffect(() => {
    const loadProfile = async () => {
      if (!auth.user?.id) return;

      try {
        const { data, error } = await supabase
          .from("profiles")
          .select(
            `
            id,
            auth_user_id,
            first_name,
            last_name,
            gender,
            profile_picture_url,
            phone,
            bio,
            role,
            created_at,
            updated_at,
            onboarding_completed
          `
          )
          .eq("auth_user_id", auth.user.id)
          .single();

        if (error) throw error;
        setProfile(data);
      } catch (error) {
        console.error("Error loading profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [auth.user]);

  const calculateCompletionPercentage = (profile: CustomerProfile | null) => {
    if (!profile) return 0;

    const fields = [
      { key: "first_name", weight: 2 },
      { key: "last_name", weight: 2 },
      { key: "gender", weight: 1 },
      { key: "phone", weight: 1 },
      { key: "role", weight: 1 },
      { key: "bio", weight: 1 },
      { key: "profile_picture_url", weight: 1 },
    ];

    let totalWeight = 0;
    let filledWeight = 0;

    fields.forEach(field => {
      totalWeight += field.weight;
      const value = profile[field.key as keyof CustomerProfile];

      if (value !== undefined && value !== null && value !== "") {
        filledWeight += field.weight;
      }
    });

    return Math.round((filledWeight / totalWeight) * 100);
  };

  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !auth.user?.id || !profile?.id) return;
    setImageUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${auth.user.id}/avatar.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("profile-pictures")
        .upload(fileName, file, {
          upsert: true,
          cacheControl: "3600",
        });

      if (uploadError) throw uploadError;

      // Clear the cache for this path
      clearUrlCache("profile-pictures", fileName);

      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          profile_picture_url: fileName,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id);

      if (updateError) throw updateError;

      setProfile(prev => (prev ? { ...prev, profile_picture_url: fileName } : null));
      toast.success("Profile image updated successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      toast.error("Failed to upload profile image");
    } finally {
      setImageUploading(false);
    }
  };

  if (loading) {
    return (
      <Card className="w-1/3 p-6 animate-pulse">
        <div className="flex flex-col items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-muted" />
          <div className="w-32 h-4 bg-muted rounded" />
          <div className="w-full h-2 bg-muted rounded" />
        </div>
      </Card>
    );
  }

  const completionPercentage = calculateCompletionPercentage(profile);
  const initials = getInitials(
    `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User"
  );
  const displayName = `${profile?.first_name || ""} ${profile?.last_name || ""}`.trim() || "User";

  return (
    <Card className="w-1/3 p-6">
      <div className="flex flex-col items-center gap-4">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/30">
            {profilePictureUrl ? (
              <img src={profilePictureUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => document.getElementById("profile-image-input")?.click()}
            aria-label="Upload profile photo"
            disabled={imageUploading}
          >
            {imageUploading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Camera size={20} />
            )}
          </button>
          <input
            id="profile-image-input"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => handleProfileImageChange(e.target.files?.[0] || null)}
          />
        </div>

        {/* Name */}
        <div className="text-center">
          <h3 className="text-xl font-semibold">{displayName}</h3>
          <p className="text-sm text-muted-foreground">{profile?.role || "User"}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Profile Completion</span>
            <span className="text-sm text-muted-foreground">{completionPercentage}%</span>
          </div>
          <Progress value={completionPercentage} className="w-full" />
        </div>
      </div>
    </Card>
  );
} 