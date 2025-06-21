"use client";

import { useState } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Card } from "@/ui/Card.ui";
import { Camera } from "@phosphor-icons/react";
import { FormValues } from "@/types/onboarding.type";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { Select } from "@/ui/Select.ui";

interface BasicInfoFormProps {
  formData: FormValues;
  onFormDataChange: (data: Partial<FormValues>) => void;
  validationErrors: Record<string, string | undefined>;
  profileImageUrl: string;
  onProfileImageChange: (file: File | null) => Promise<void>;
  imageUploading: boolean;
}

export function BasicInfoForm({
  formData,
  onFormDataChange,
  validationErrors,
  profileImageUrl,
  onProfileImageChange,
  imageUploading
}: BasicInfoFormProps) {
  const handleInputChange = (id: string, value: string) => {
    onFormDataChange({ [id]: value });
  };

  return (
    <Card className="mb-8 p-6">
      

      {/* Profile Image */}
      <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
        <div className="relative">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-primary/10">
                <Camera size={48} className="text-primary" />
              </div>
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
          >
            <Camera size={20} />
          </label>
          <input
            type="file"
            id="profile-image"
            className="hidden"
            accept="image/*"
            onChange={(e) => onProfileImageChange(e.target.files?.[0] || null)}
            disabled={imageUploading}
          />
        </div>
        <div className="text-center sm:text-left">
          <h3 className="text-lg font-semibold">Profile Picture</h3>
          <p className="text-sm text-muted-foreground max-w-md">
            Upload a professional photo of yourself. This will be visible to potential clients.
          </p>
        </div>
      </div>

      {/* Name and Phone Side by Side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="name" className="text-sm font-medium text-foreground block mb-0.5">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            value={formData.name || ""}
            onChange={e => handleInputChange("name", e.target.value)}
            required
            className={validationErrors.name ? "border-red-500" : ""}
          />
          {validationErrors.name && (
            <p className="text-xs text-red-500 mt-0.5">{validationErrors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="gender" className="text-sm font-medium text-foreground block mb-0.5">
            Gender <span className="text-red-500">*</span>
          </label>
          <Select
            id="gender"
            name="gender"
            value={formData.gender as string}
            onChange={e => handleInputChange("gender", e.target.value)}
            required
            className={validationErrors.gender ? "border-red-500" : ""}
          >
            <option value="">Select your gender</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
            <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
          </Select>
          {validationErrors.gender && (
            <p className="text-xs text-red-500 mt-0.5">{validationErrors.gender}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="phone" className="text-sm font-medium text-foreground block mb-0.5">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            value={formData.phone || ""}
            onChange={e => handleInputChange("phone", e.target.value)}
            required
            className={validationErrors.phone ? "border-red-500" : ""}
          />
          {validationErrors.phone && (
            <p className="text-xs text-red-500 mt-0.5">{validationErrors.phone}</p>
          )}
        </div>
      </div>

      {/* About Section */}
      <div className="">
        <label htmlFor="about" className="text-sm font-medium text-foreground block mb-0.5">
          About <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="about"
          name="about"
          placeholder="Write a brief professional description about yourself..."
          value={formData.about || ""}
          onChange={e => handleInputChange("about", e.target.value)}
          required
          className={`w-full min-h-[80px] ${validationErrors.about ? "border-red-500" : ""}`}
        />
        {validationErrors.about && (
          <p className="text-xs text-red-500 mt-0.5">{validationErrors.about}</p>
        )}
        <p className="text-xs text-muted-foreground mt-0.5">
          Share your expertise, experience, and what makes you unique as a CA professional
        </p>
      </div>

      {/* Years of Experience */}
      <div className="mb-3">
        <label htmlFor="yearsOfExperience" className="text-sm font-medium text-foreground block mb-0.5">
          Years of Experience <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <Input
            id="yearsOfExperience"
            name="yearsOfExperience"
            type="number"
            min="0"
            max="50"
            placeholder="Enter years of experience"
            value={formData.yearsOfExperience || ""}
            onChange={e => handleInputChange("yearsOfExperience", e.target.value)}
            required
            className={`w-32 ${validationErrors.yearsOfExperience ? "border-red-500" : ""}`}
          />
          <span className="text-sm text-muted-foreground">years</span>
        </div>
        {validationErrors.yearsOfExperience && (
          <p className="text-xs text-red-500 mt-0.5">{validationErrors.yearsOfExperience}</p>
        )}
      </div>
    </Card>
  );
} 