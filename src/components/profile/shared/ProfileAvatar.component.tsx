"use client";

import React, { useRef, useState } from "react";
import { Avatar } from "@/ui/Avatar.ui";
import { CameraIcon, CheckCircleIcon, UploadIcon } from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import { cn } from "@/helper/tw.helper";
import { useAtom } from "jotai";
import { profileUploadProgressAtom } from "@/store/jotai/profile.store";

interface ProfileAvatarProps {
  src?: string;
  name?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  isEditable?: boolean;
  showUploadProgress?: boolean;
  showCompletionBadge?: boolean;
  isCompleted?: boolean;
  onImageUpload?: (file: File) => Promise<void>;
  className?: string;
  disabled?: boolean;
}

export default function ProfileAvatar({
  src,
  name = "User",
  size = "xl",
  isEditable = false,
  showUploadProgress = false,
  showCompletionBadge = false,
  isCompleted = false,
  onImageUpload,
  className,
  disabled = false,
}: ProfileAvatarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [uploadProgress] = useAtom(profileUploadProgressAtom);
  const [isHovered, setIsHovered] = useState(false);

  // Handle file selection
  const handleFileSelect = async (file: File) => {
    if (!onImageUpload || disabled) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB");
      return;
    }

    try {
      await onImageUpload(file);
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  // Handle file input change
  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(false);

    const file = event.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => {
    setDragOver(false);
  };

  // Size configurations for edit overlay
  const sizeConfig = {
    xs: { overlay: "h-6 w-6", icon: 12 },
    sm: { overlay: "h-8 w-8", icon: 14 },
    md: { overlay: "h-10 w-10", icon: 16 },
    lg: { overlay: "h-12 w-12", icon: 18 },
    xl: { overlay: "h-16 w-16", icon: 20 },
    "2xl": { overlay: "h-20 w-20", icon: 24 },
  };

  const config = sizeConfig[size];
  const isUploading = uploadProgress !== null;

  return (
    <div className={cn("relative group", className)}>
      {/* Main Avatar */}
      <div
        className={cn(
          "relative transition-all duration-300",
          isEditable && !disabled && "cursor-pointer",
          dragOver && "scale-105 ring-4 ring-blue-500/50",
          isHovered && isEditable && "scale-105"
        )}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onDrop={isEditable ? handleDrop : undefined}
        onDragOver={isEditable ? handleDragOver : undefined}
        onDragLeave={isEditable ? handleDragLeave : undefined}
        onClick={isEditable && !disabled ? () => fileInputRef.current?.click() : undefined}
      >
        <Avatar
          src={src}
          name={name}
          size={size}
          className={cn(
            "transition-all duration-300",
            isEditable && !disabled && "hover:opacity-80",
            isUploading && "opacity-50"
          )}
        />

        {/* Upload Progress Overlay */}
        {isUploading && showUploadProgress && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/50 rounded-full backdrop-blur-sm"
            )}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-3 border-white border-t-transparent rounded-full animate-spin" />
              <span className="text-white text-xs font-medium">{uploadProgress}%</span>
            </div>
          </div>
        )}

        {/* Edit Overlay */}
        {isEditable && !disabled && !isUploading && isHovered && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-black/60 rounded-full backdrop-blur-sm",
              "transition-all duration-300 opacity-0 group-hover:opacity-100"
            )}
          >
            <CameraIcon size={config.icon} weight="bold" className="text-white drop-shadow-lg" />
          </div>
        )}

        {/* Drag Overlay */}
        {dragOver && isEditable && !disabled && (
          <div
            className={cn(
              "absolute inset-0 flex items-center justify-center",
              "bg-blue-500/80 rounded-full backdrop-blur-sm",
              "border-2 border-dashed border-white"
            )}
          >
            <UploadIcon size={config.icon} weight="bold" className="text-white drop-shadow-lg" />
          </div>
        )}
      </div>

      {/* Completion Badge */}
      {showCompletionBadge && isCompleted && (
        <div className="absolute -bottom-1 -right-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full p-1.5 border-2 border-white shadow-lg dark:border-gray-800">
          <CheckCircleIcon size={14} weight="fill" className="text-white" />
        </div>
      )}

      {/* Edit Button (Alternative to hover overlay) */}
      {isEditable && !disabled && size === "2xl" && (
        <Button
          variant="outline"
          size="sm"
          className={cn(
            "absolute bottom-2 right-2 rounded-full w-10 h-10 p-0",
            "bg-white/90 hover:bg-white border-2 border-white shadow-lg",
            "dark:bg-gray-800/90 dark:hover:bg-gray-800 dark:border-gray-700",
            "transition-all duration-300",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-95"
          )}
          onClick={e => {
            e.stopPropagation();
            fileInputRef.current?.click();
          }}
          disabled={isUploading}
        >
          {isUploading ? (
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          ) : (
            <CameraIcon size={16} weight="bold" className="text-primary" />
          )}
        </Button>
      )}

      {/* Hidden File Input */}
      {isEditable && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
          disabled={disabled || isUploading}
        />
      )}
    </div>
  );
}
