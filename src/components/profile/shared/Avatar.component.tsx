// ProfileAvatar Component - Reusable avatar with upload functionality
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useRef } from "react";
import { CameraIcon, CheckCircleIcon, UploadIcon } from "@phosphor-icons/react";
import { Avatar } from "@/ui/Avatar.ui";
import { Button } from "@/ui/Button.ui";
import { Badge } from "@/ui/Badge.ui";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface ProfileAvatarProps {
  /** Current avatar URL */
  imageUrl?: string | null;
  /** User's display name for fallback initials */
  name: string;
  /** Avatar size variant */
  size?: "sm" | "md" | "lg" | "xl";
  /** Whether user can upload/change avatar */
  editable?: boolean;
  /** Upload callback function */
  onUpload?: (file: File) => Promise<void>;
  /** Loading state during upload */
  isUploading?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Whether to show verification badge */
  isVerified?: boolean;
}

const sizeClasses = {
  sm: "h-12 w-12",
  md: "h-16 w-16",
  lg: "h-24 w-24",
  xl: "h-32 w-32 sm:h-40 sm:w-40",
};

export function ProfileAvatar({
  imageUrl,
  name,
  size = "lg",
  editable = false,
  onUpload,
  isUploading = false,
  className,
  isVerified = false,
}: ProfileAvatarProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (file: File) => {
    if (!onUpload) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image must be less than 5MB");
      return;
    }

    try {
      await onUpload(file);
      toast.success("Profile picture updated successfully");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to update profile picture");
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);

    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={cn("relative inline-block", className)}>
      {/* Avatar Container */}
      <div
        className={cn(
          "relative group",
          sizeClasses[size],
          editable && "cursor-pointer",
          dragOver && "ring-2 ring-blue-500 ring-offset-2"
        )}
        onDrop={editable ? handleDrop : undefined}
        onDragOver={editable ? handleDragOver : undefined}
        onDragLeave={editable ? handleDragLeave : undefined}
        onClick={editable ? openFileDialog : undefined}
      >
        {/* Avatar */}
        <Avatar
          src={imageUrl || undefined}
          alt={`${name}'s profile picture`}
          name={name}
          className={cn(
            sizeClasses[size],
            "transition-all duration-200",
            editable && "group-hover:brightness-75"
          )}
        />

        {/* Upload Overlay */}
        {editable && (
          <div
            className={cn(
              "absolute inset-0 bg-black/40 rounded-full",
              "flex items-center justify-center",
              "opacity-0 group-hover:opacity-100 transition-opacity",
              isUploading && "opacity-100"
            )}
          >
            {isUploading ? (
              <UploadIcon
                className={cn("text-white animate-pulse", size === "xl" ? "h-8 w-8" : "h-6 w-6")}
              />
            ) : (
              <CameraIcon className={cn("text-white", size === "xl" ? "h-8 w-8" : "h-6 w-6")} />
            )}
          </div>
        )}

        {/* Verification Badge */}
        {isVerified && (
          <div className="absolute -bottom-1 -right-1">
            <Badge
              variant="default"
              className={cn(
                "rounded-full p-1",
                "bg-emerald-500 hover:bg-emerald-500",
                "border-2 border-white dark:border-gray-900"
              )}
            >
              <CheckCircleIcon className="h-3 w-3 text-white" />
            </Badge>
          </div>
        )}
      </div>

      {/* Upload Button (Mobile Alternative) */}
      {editable && size === "xl" && (
        <div className="mt-4 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={isUploading}
            className="w-full"
          >
            <CameraIcon className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : "Change Photo"}
          </Button>
        </div>
      )}

      {/* Hidden File Input */}
      {editable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileInputChange}
          className="hidden"
          aria-label="Upload profile picture"
        />
      )}
    </div>
  );
}
