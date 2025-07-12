// PersonalInfoStep Component - Step 1: Personal Information
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Select } from "@/ui/Select.ui";
import { CheckboxGroup } from "@/ui/CheckboxGroup.ui";
import type { CAProfile } from "@/types/profile.type";

interface PersonalInfoStepProps {
  profile: CAProfile;
  formData: Partial<CAProfile>;
  onFormDataChange: (data: Partial<CAProfile>) => void;
}

// Curated list of common CA specializations
const COMMON_SPECIALIZATIONS = [
  "Tax Planning & Filing",
  "GST Registration & Filing",
  "Company Registration",
  "Statutory Audit",
  "Financial Audit",
  "Accounting & Bookkeeping",
  "Compliance Management",
  "Business Advisory",
  "Investment Planning",
  "Startup Services",
  "Payroll Management",
  "TDS Filing",
  "LLP Registration",
  "Internal Audit",
  "Financial Planning",
  "Business Setup",
];

const COMMON_LANGUAGES = [
  "English",
  "Hindi",
  "Gujarati",
  "Marathi",
  "Tamil",
  "Telugu",
  "Kannada",
  "Malayalam",
  "Bengali",
  "Punjabi",
  "Urdu",
  "Odia",
  "Assamese",
];

export default function PersonalInfoStep({
  profile,
  formData,
  onFormDataChange,
}: PersonalInfoStepProps) {
  const [localData, setLocalData] = useState({
    first_name: formData.first_name || "",
    middle_name: formData.middle_name || "",
    last_name: formData.last_name || "",
    username: formData.username || "",
    phone: formData.phone || "",
    gender: formData.gender || "",
    city: formData.city || "",
    state: formData.state || "",
    country: formData.country || "India",
    bio: formData.bio || "",
    languages: formData.languages || [],
    specialization: formData.specialization || [],
  });

  useEffect(() => {
    onFormDataChange(localData);
  }, [localData, onFormDataChange]);

  const handleInputChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Personal Information
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Tell us about yourself and your professional background
        </p>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            First Name *
          </label>
          <Input
            value={localData.first_name}
            onChange={e => handleInputChange("first_name", e.target.value)}
            placeholder="Enter your first name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Middle Name
          </label>
          <Input
            value={localData.middle_name}
            onChange={e => handleInputChange("middle_name", e.target.value)}
            placeholder="Enter your middle name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Last Name *
          </label>
          <Input
            value={localData.last_name}
            onChange={e => handleInputChange("last_name", e.target.value)}
            placeholder="Enter your last name"
            required
          />
        </div>
      </div>

      {/* Username and Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Username *
          </label>
          <Input
            value={localData.username}
            onChange={e => handleInputChange("username", e.target.value)}
            placeholder="Choose a unique username"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Phone Number
          </label>
          <Input
            type="tel"
            value={localData.phone}
            onChange={e => handleInputChange("phone", e.target.value)}
            placeholder="+91 98765 43210"
          />
        </div>
      </div>

      {/* Gender and Location */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Gender
          </label>
          <Select
            value={localData.gender}
            onChange={e => handleInputChange("gender", e.target.value)}
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            City
          </label>
          <Input
            value={localData.city}
            onChange={e => handleInputChange("city", e.target.value)}
            placeholder="Enter your city"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            State
          </label>
          <Input
            value={localData.state}
            onChange={e => handleInputChange("state", e.target.value)}
            placeholder="Enter your state"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Professional Bio
        </label>
        <Textarea
          value={localData.bio}
          onChange={e => handleInputChange("bio", e.target.value)}
          placeholder="Tell us about your professional background, expertise, and what makes you unique as a chartered accountant..."
          rows={4}
        />
      </div>

      {/* Languages */}
      <CheckboxGroup
        id="languages"
        label="Languages"
        options={COMMON_LANGUAGES.map(lang => ({ value: lang, label: lang }))}
        value={localData.languages}
        onChange={languages => setLocalData(prev => ({ ...prev, languages }))}
        description="Select the languages you speak fluently"
      />

      {/* Specializations */}
      <CheckboxGroup
        id="specializations"
        label="Areas of Specialization"
        options={COMMON_SPECIALIZATIONS.map(spec => ({ value: spec, label: spec }))}
        value={localData.specialization}
        onChange={specialization => setLocalData(prev => ({ ...prev, specialization }))}
        description="Select your areas of expertise"
      />
    </div>
  );
}
