// ProfileAvatar Component - Reusable avatar with upload functionality
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useRef } from "react";
import {
  CameraIcon,
  CheckCircleIcon,
  UploadIcon,
  PencilIcon,
  TrashIcon,
  XIcon,
} from "@phosphor-icons/react";
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
  /** Delete callback function */
  onDelete?: () => Promise<void>;
  /** Loading state during upload */
  isUploading?: boolean;
  /** Loading state during delete */
  isDeleting?: boolean;
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

const iconSizes = {
  sm: "h-3 w-3",
  md: "h-4 w-4",
  lg: "h-5 w-5",
  xl: "h-6 w-6",
};

export function ProfileAvatar({
  imageUrl,
  name,
  size = "lg",
  editable = false,
  onUpload,
  onDelete,
  isUploading = false,
  isDeleting = false,
  className,
  isVerified = false,
}: ProfileAvatarProps) {
  const [dragOver, setDragOver] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const [hoveringAvatar, setHoveringAvatar] = useState(false);
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

  const handleDelete = async () => {
    if (!onDelete) return;

    try {
      await onDelete();
      toast.success("Profile picture removed successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to remove profile picture");
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

  const hasImage = imageUrl && imageUrl !== "";

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
        onMouseEnter={() => {
          if (editable) {
            setShowActions(true);
            setHoveringAvatar(true);
          }
        }}
        onMouseLeave={() => {
          setShowActions(false);
          setHoveringAvatar(false);
        }}
      >
        {/* Avatar */}
        <Avatar
          src={imageUrl || undefined}
          alt={`${name}'s profile picture`}
          name={name}
          className={cn(
            sizeClasses[size],
            "transition-all duration-200",
            editable && hoveringAvatar && "brightness-90"
          )}
          onClick={editable ? openFileDialog : undefined}
        />

        {/* Edit Indicator - Always visible pencil icon */}
        {editable && !isUploading && !isDeleting && (
          <div
            className="absolute top-0 right-0 transform translate-x-1 -translate-y-1 z-10"
            onMouseEnter={() => setHoveringAvatar(false)}
            onMouseLeave={() => setHoveringAvatar(false)}
          >
            <div
              className={cn(
                "rounded-full p-1.5",
                "bg-blue-600 hover:bg-blue-700",
                "border-2 border-white dark:border-gray-800",
                "shadow-lg hover:shadow-xl",
                "cursor-pointer transition-all duration-200",
                "hover:scale-110 active:scale-95"
              )}
              onClick={e => {
                e.stopPropagation();
                openFileDialog();
              }}
            >
              <PencilIcon className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}

        {/* Delete Button - Only show if image exists */}
        {editable && hasImage && onDelete && !isUploading && !isDeleting && showActions && (
          <div
            className="absolute top-0 left-0 transform -translate-x-1 -translate-y-1 z-10"
            onMouseEnter={() => setHoveringAvatar(false)}
            onMouseLeave={() => setHoveringAvatar(false)}
          >
            <div
              className={cn(
                "rounded-full p-1.5",
                "bg-red-600 hover:bg-red-700",
                "border-2 border-white dark:border-gray-800",
                "shadow-lg hover:shadow-xl",
                "cursor-pointer transition-all duration-200",
                "hover:scale-110 active:scale-95",
                "animate-in fade-in-0 zoom-in-95 duration-200"
              )}
              onClick={e => {
                e.stopPropagation();
                handleDelete();
              }}
            >
              <TrashIcon className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
        )}

        {/* Upload/Delete Overlay */}
        {editable && (isUploading || isDeleting) && (
          <div
            className={cn(
              "absolute inset-0 bg-black/60 rounded-full",
              "flex items-center justify-center",
              "backdrop-blur-sm z-20"
            )}
          >
            {isUploading ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                  <UploadIcon className="absolute inset-0 h-4 w-4 text-white m-auto" />
                </div>
                <span className="text-white text-sm font-medium">Uploading...</span>
              </div>
            ) : isDeleting ? (
              <div className="flex flex-col items-center space-y-2">
                <div className="relative">
                  <div className="animate-spin rounded-full h-8 w-8 border-3 border-white border-t-transparent"></div>
                  <TrashIcon className="absolute inset-0 h-4 w-4 text-white m-auto" />
                </div>
                <span className="text-white text-sm font-medium">Removing...</span>
              </div>
            ) : null}
          </div>
        )}

        {/* Hover Overlay - Only show when hovering avatar area (not buttons) and no image */}
        {editable && !isUploading && !isDeleting && hoveringAvatar && !hasImage && !showActions && (
          <div
            className={cn(
              "absolute inset-0 bg-gradient-to-t from-black/40 to-transparent rounded-full",
              "flex items-center justify-center",
              "transition-all duration-200 z-5"
            )}
            onClick={openFileDialog}
          >
            <div className="flex flex-col items-center space-y-1">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                <CameraIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-white text-xs font-medium px-2 py-0.5 bg-black/30 rounded-full backdrop-blur-sm">
                Add Photo
              </span>
            </div>
          </div>
        )}

        {/* Verification Badge */}
        {isVerified && (
          <div className="absolute -bottom-1 -right-1 z-10">
            <div
              className={cn(
                "rounded-full p-1.5",
                "bg-emerald-500 hover:bg-emerald-600",
                "border-2 border-white dark:border-gray-800",
                "shadow-lg",
                "transition-all duration-200"
              )}
            >
              <CheckCircleIcon className="h-4 w-4 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Mobile Action Buttons */}
      {editable && (size === "lg" || size === "xl") && (
        <div className="mt-4 flex gap-3 sm:hidden">
          <Button
            variant="outline"
            size="sm"
            onClick={openFileDialog}
            disabled={isUploading || isDeleting}
            className={cn(
              "flex-1 border-2 font-medium",
              "hover:bg-blue-50 hover:border-blue-300",
              "dark:hover:bg-blue-950 dark:hover:border-blue-700",
              "transition-all duration-200"
            )}
          >
            <CameraIcon className="h-4 w-4 mr-2" />
            {isUploading ? "Uploading..." : hasImage ? "Change Photo" : "Add Photo"}
          </Button>

          {hasImage && onDelete && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleDelete}
              disabled={isUploading || isDeleting}
              className={cn(
                "border-2 font-medium",
                "text-red-600 hover:text-red-700 border-red-300 hover:border-red-400",
                "hover:bg-red-50 dark:hover:bg-red-950",
                "transition-all duration-200"
              )}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
          )}
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
