"use client";
import { useRef } from "react";
import { Camera } from "@phosphor-icons/react";
import { Input } from "@/ui/Input.ui";
import { Select } from "@/ui/Select.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { useProfilePictureUrl } from "@/hooks/useProfilePictureUrl";

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

interface CustomerPersonalDetailsFormProps {
  formData: any;
  setFormData: (data: any) => void;
  errors: any;
  setErrors: (errors: any) => void;
  onProfileImageChange: (file: File | null) => void;
  imageUploading: boolean;
}

export default function CustomerPersonalDetailsForm({
  formData,
  setFormData,
  errors,
  setErrors,
  onProfileImageChange,
  imageUploading,
}: CustomerPersonalDetailsFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const initials = getInitials(formData.name || "User");

  // Handle both blob URLs (for preview) and storage paths
  const profilePhotoUrl = formData.profilePhoto ? URL.createObjectURL(formData.profilePhoto) : null;
  const { url: storageUrl } = useProfilePictureUrl(formData.profile_picture_url);
  const displayUrl = profilePhotoUrl || storageUrl;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-2">
        {/* Profile Image */}
        <div className="relative">
          <div className="w-28 h-28 rounded-full overflow-hidden bg-muted flex items-center justify-center text-3xl font-bold text-primary border-2 border-primary/30">
            {displayUrl ? (
              <img src={displayUrl} alt="Profile" className="object-cover w-full h-full" />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <button
            type="button"
            className="absolute bottom-0 right-0 bg-primary text-white rounded-full p-2 shadow-lg border-2 border-white hover:bg-primary/90 transition disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => fileInputRef.current?.click()}
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
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={e => onProfileImageChange(e.target.files?.[0] || null)}
            disabled={imageUploading}
          />
        </div>

        {/* Profile Info */}
        <div className="flex-1 text-center sm:text-left">
          <h3 className="text-lg font-semibold mb-2">Profile Picture</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Upload a professional photo of yourself. This will be visible to potential CAs.
          </p>
          {imageUploading && (
            <p className="text-xs text-blue-600 font-medium">Uploading image...</p>
          )}
        </div>
      </div>

      {/* Rest of the form fields would go here */}
      {/* ... existing form fields ... */}
    </div>
  );
} 