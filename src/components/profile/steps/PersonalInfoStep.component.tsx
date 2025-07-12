// PersonalInfoStep Component - Step 1: Personal Information
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Select } from "@/ui/Select.ui";
import { CheckboxGroup } from "@/ui/CheckboxGroup.ui";
import { ProfileAvatar } from "@/components/profile/shared/Avatar.component";
import { useStates, useDistrictsByState } from "@/services/location.service";
import { useUsernameUniqueness } from "@/services/profile.service";
import { useDebounce } from "@/hooks/useDebounce";
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
    state_id: formData.state_id || 0,
    district_id: formData.district_id || 0,
    country: formData.country || "India",
    bio: formData.bio || "",
    languages: formData.languages || [],
    specialization: formData.specialization || [],
    profile_picture_url: formData.profile_picture_url || "",
    whatsapp_available: formData.whatsapp_available || false,
  });

  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(false);

  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: districts = [], isLoading: districtsLoading } = useDistrictsByState(
    localData.state_id
  );

  // Debounce username for uniqueness check
  const debouncedUsername = useDebounce(localData.username, 500);

  // Check username uniqueness
  const {
    data: usernameCheck,
    isLoading: isCheckingUsername,
    error: usernameError,
  } = useUsernameUniqueness(
    debouncedUsername,
    localData.state_id,
    localData.district_id,
    profile.id
  );

  useEffect(() => {
    onFormDataChange(localData);
  }, [localData, onFormDataChange]);

  const handleInputChange = (field: string, value: string) => {
    setLocalData(prev => ({ ...prev, [field]: value }));
  };

  const handlePhoneChange = (value: string) => {
    // Remove all non-digits
    let cleanValue = value.replace(/\D/g, "");

    // Handle +91 prefix
    if (cleanValue.startsWith("91") && cleanValue.length > 2) {
      cleanValue = cleanValue.substring(2);
    }

    // Limit to 10 digits
    cleanValue = cleanValue.substring(0, 10);

    // Format as +91 XXXXX XXXXX
    let formattedValue = "";
    if (cleanValue.length > 0) {
      formattedValue = "+91 ";
      if (cleanValue.length <= 5) {
        formattedValue += cleanValue;
      } else {
        formattedValue += cleanValue.substring(0, 5) + " " + cleanValue.substring(5);
      }
    }

    setLocalData(prev => ({ ...prev, phone: formattedValue }));
  };

  const handleProfilePictureUpload = async (file: File) => {
    setIsUploadingPicture(true);

    try {
      // TODO: Implement actual upload to Supabase storage
      // For now, create a local URL for preview
      const imageUrl = URL.createObjectURL(file);

      // Simulate upload delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setLocalData(prev => ({ ...prev, profile_picture_url: imageUrl }));

      // In a real implementation, this would upload to Supabase storage
      // and update the profile_picture_url with the permanent URL
      console.log("Profile picture upload:", file.name, file.size);
    } catch (error) {
      console.error("Upload failed:", error);
      throw error; // Let ProfileAvatar handle the error
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleProfilePictureDelete = async () => {
    setIsDeletingPicture(true);

    try {
      // Simulate delete delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Clear the profile picture URL
      setLocalData(prev => ({ ...prev, profile_picture_url: "" }));

      // TODO: In a real implementation, this would delete from Supabase storage
      console.log("Profile picture deleted");
    } catch (error) {
      console.error("Delete failed:", error);
      throw error; // Let ProfileAvatar handle the error
    } finally {
      setIsDeletingPicture(false);
    }
  };

  const handleLocationChange = (
    stateId: number,
    stateName: string,
    districtId: number,
    districtName: string
  ) => {
    setLocalData(prev => ({
      ...prev,
      state_id: stateId,
      state: stateName,
      district_id: districtId,
      city: districtName, // Use district as city for now
    }));
  };

  return (
    <div className="space-y-6">
      {/* Header with Profile Picture */}
      <div className="flex items-start justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Personal Information
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Tell us about yourself and your professional background
          </p>
        </div>

        {/* Profile Picture - Beside Header */}
        <div className="flex-shrink-0">
          <ProfileAvatar
            imageUrl={localData.profile_picture_url}
            name={`${localData.first_name} ${localData.last_name}`.trim() || "User"}
            size="lg"
            editable={true}
            onUpload={handleProfilePictureUpload}
            onDelete={handleProfilePictureDelete}
            isUploading={isUploadingPicture}
            isDeleting={isDeletingPicture}
          />
        </div>
      </div>

      {/* All Form Fields - Full Width */}
      <div className="space-y-4">
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

        {/* Gender, State, and District - Required for username validation */}
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
              State *
            </label>
            <Select
              value={localData.state_id?.toString() || ""}
              onChange={e => {
                const stateId = e.target.value ? parseInt(e.target.value) : undefined;
                setLocalData(prev => ({
                  ...prev,
                  state_id: stateId,
                  district_id: undefined,
                }));
              }}
              disabled={statesLoading}
              className="w-full"
            >
              <option value="">{statesLoading ? "Loading states..." : "Select state"}</option>
              {states.map(state => (
                <option key={state.id} value={state.id.toString()}>
                  {state.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              District *
            </label>
            <Select
              value={localData.district_id?.toString() || ""}
              onChange={e => {
                const districtId = e.target.value ? parseInt(e.target.value) : undefined;
                setLocalData(prev => ({
                  ...prev,
                  district_id: districtId,
                }));
              }}
              disabled={!localData.state_id || districtsLoading}
              className="w-full"
            >
              <option value="">
                {!localData.state_id
                  ? "Select state first"
                  : districtsLoading
                  ? "Loading districts..."
                  : "Select district"}
              </option>
              {districts.map(district => (
                <option key={district.id} value={district.id.toString()}>
                  {district.name}
                </option>
              ))}
            </Select>
          </div>
        </div>

        {/* Username and Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Username *
            </label>
            <div className="relative">
              <Input
                value={localData.username}
                onChange={e => handleInputChange("username", e.target.value)}
                placeholder="Choose a unique username"
                required
                className={`${
                  localData.username && localData.state_id && localData.district_id
                    ? usernameCheck?.isUnique === false
                      ? "border-red-500 focus:border-red-500"
                      : usernameCheck?.isUnique === true
                      ? "border-green-500 focus:border-green-500"
                      : ""
                    : ""
                }`}
              />
              {isCheckingUsername && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full"></div>
                </div>
              )}
            </div>

            {/* Username validation feedback */}
            {localData.username && localData.state_id && localData.district_id && (
              <div className="mt-1 text-sm">
                {isCheckingUsername ? (
                  <span className="text-gray-500">Checking availability...</span>
                ) : usernameCheck?.isUnique === false ? (
                  <div className="text-red-600">
                    <p>Username not available in your location</p>
                    {usernameCheck.suggestedUsername && (
                      <p className="mt-1">
                        Suggestion:
                        <button
                          type="button"
                          onClick={() =>
                            handleInputChange("username", usernameCheck.suggestedUsername!)
                          }
                          className="ml-1 text-blue-600 hover:text-blue-800 underline"
                        >
                          {usernameCheck.suggestedUsername}
                        </button>
                      </p>
                    )}
                  </div>
                ) : usernameCheck?.isUnique === true ? (
                  <span className="text-green-600">✓ Username available</span>
                ) : usernameError ? (
                  <span className="text-red-600">Error checking username</span>
                ) : null}
              </div>
            )}

            {/* Location requirement message */}
            {localData.username && (!localData.state_id || !localData.district_id) && (
              <p className="mt-1 text-sm text-amber-600">
                Please select state and district to check username availability
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Phone Number
            </label>
            <Input
              type="tel"
              value={localData.phone}
              onChange={e => handlePhoneChange(e.target.value)}
              placeholder="+91 98765 43210"
              maxLength={17}
            />

            {/* WhatsApp Available Checkbox */}
            {localData.phone && (
              <div className="mt-2">
                <label className="flex items-center space-x-2 text-sm">
                  <input
                    type="checkbox"
                    checked={localData.whatsapp_available}
                    onChange={e =>
                      setLocalData(prev => ({ ...prev, whatsapp_available: e.target.checked }))
                    }
                    className="rounded border-gray-300 text-green-600 focus:ring-green-500"
                  />
                  <span className="text-gray-700 dark:text-gray-300">Available on WhatsApp</span>
                </label>
              </div>
            )}
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
            placeholder="Tell us about your professional background and expertise..."
            rows={4}
          />
        </div>

        {/* Languages */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Languages Spoken
          </label>
          <CheckboxGroup
            options={COMMON_LANGUAGES.map(lang => ({ value: lang, label: lang }))}
            value={localData.languages}
            onChange={languages => setLocalData(prev => ({ ...prev, languages }))}
            className="grid grid-cols-2 md:grid-cols-3 gap-2"
          />
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Areas of Specialization
          </label>
          <CheckboxGroup
            options={COMMON_SPECIALIZATIONS.map(spec => ({ value: spec, label: spec }))}
            value={localData.specialization}
            onChange={specialization => setLocalData(prev => ({ ...prev, specialization }))}
            className="grid grid-cols-1 md:grid-cols-2 gap-2"
          />
        </div>
      </div>
    </div>
  );
}
