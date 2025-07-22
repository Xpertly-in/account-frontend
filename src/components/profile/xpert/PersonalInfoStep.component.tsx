// PersonalInfoStep Component - Step 1: Personal Information
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Select } from "@/ui/Select.ui";
import { CheckboxGroup } from "@/ui/CheckboxGroup.ui";
import { toast } from "sonner";
import { ProfileAvatar } from "@/components/profile/shared/Avatar.component";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/lib/supabase";
import { useDebounce } from "@/hooks/useDebounce";
import {
  useUploadProfilePicture,
  useDeleteProfilePicture,
  useUsernameUniqueness,
} from "@/services/profile.service";
import { CAProfile } from "@/types/profile.type";
import { useDistrictsByState, useStates } from "@/services/location.service";
import { useLanguageMap } from "@/services/language.service";
import {
  useSpecializationsWithCategories,
  groupSpecializationsByCategory,
} from "@/services/specialization.service";

// Common options - now fetched from database

// Type for local form data (updated for new schema)
type PersonalInfoData = Pick<
  CAProfile,
  | "first_name"
  | "middle_name"
  | "last_name"
  | "username"
  | "phone"
  | "gender"
  | "state_id"
  | "district_id"
  | "country"
  | "bio"
  | "language_ids"
  | "specialization_ids"
  | "profile_picture_url"
  | "whatsapp_available"
>;

interface PersonalInfoStepProps {
  profile: CAProfile;
  formData: Partial<CAProfile>;
  onFormDataChange: (data: Partial<CAProfile>) => void;
}

export default function PersonalInfoStep({
  profile,
  formData,
  onFormDataChange,
}: PersonalInfoStepProps) {
  const { auth } = useAuth();

  // Add ref to track if component is initialized
  const isInitialized = useRef(false);

  const [localData, setLocalData] = useState<PersonalInfoData>({
    first_name: "",
    middle_name: "",
    last_name: "",
    username: "",
    phone: "",
    gender: "",
    state_id: 0,
    district_id: 0,
    country: "India",
    bio: "",
    language_ids: [],
    specialization_ids: [],
    profile_picture_url: "",
    whatsapp_available: false,
  });

  const [isUploadingPicture, setIsUploadingPicture] = useState(false);
  const [isDeletingPicture, setIsDeletingPicture] = useState(false);

  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: districts = [], isLoading: districtsLoading } = useDistrictsByState(
    localData.state_id || undefined
  );
  const { languages, isLoading: languagesLoading } = useLanguageMap();
  const { data: specializationsWithCategories = [], isLoading: specializationsLoading } =
    useSpecializationsWithCategories();

  const uploadMutation = useUploadProfilePicture(profile.id || "", auth.user?.id || "");
  const deleteMutation = useDeleteProfilePicture(profile.id || "", auth.user?.id || "");

  // Debounce username for uniqueness check
  const debouncedUsername = useDebounce(localData.username || "", 500);

  // Check username uniqueness only if we have all required data
  const {
    data: usernameCheck,
    isLoading: isCheckingUsername,
    error: usernameError,
  } = useUsernameUniqueness(
    debouncedUsername,
    localData.state_id || 0,
    localData.district_id || 0,
    profile.id || ""
  ) as {
    data: { isUnique: boolean; suggestedUsername?: string } | undefined;
    isLoading: boolean;
    error: any;
  };

  // Memoize the form data change handler to prevent excessive re-renders
  const handleFormDataChange = useCallback(
    (data: Partial<CAProfile>) => {
      onFormDataChange(data);
    },
    [onFormDataChange]
  );

  // Initialize localData with profile data only once when profile is first loaded
  useEffect(() => {
    if (profile && !isInitialized.current) {
      setLocalData({
        first_name: profile.first_name || "",
        middle_name: profile.middle_name || "",
        last_name: profile.last_name || "",
        username: profile.username || "",
        phone: profile.phone || "",
        gender: profile.gender || "",
        state_id: profile.state_id || 0,
        district_id: profile.district_id || 0,
        country: profile.country || "India",
        bio: profile.bio || "",
        language_ids: profile.language_ids || [],
        specialization_ids: profile.specialization_ids || [],
        profile_picture_url: profile.profile_picture_url || "",
        whatsapp_available: profile.whatsapp_available || false,
      });

      isInitialized.current = true;
    }
  }, [profile]);

  // Sync profile picture URL when it changes (e.g., after upload)
  useEffect(() => {
    if (
      profile?.profile_picture_url &&
      isInitialized.current &&
      profile.profile_picture_url !== localData.profile_picture_url
    ) {
      setLocalData(prev => ({
        ...prev,
        profile_picture_url: profile.profile_picture_url || "",
      }));
    }
  }, [profile?.profile_picture_url]);

  // Handle input changes and update form data immediately (no debounce in effect)
  const handleInputChange = (field: string, value: string) => {
    const newLocalData = { ...localData, [field]: value };
    setLocalData(newLocalData);

    // Update form data immediately when user makes changes
    if (isInitialized.current) {
      handleFormDataChange(newLocalData);
    }
  };

  const handlePhoneChange = (value: string) => {
    // If the input is empty or just "+91", clear it completely
    if (!value || value === "+91" || value === "+91 ") {
      setLocalData(prev => ({ ...prev, phone: "" }));
      return;
    }

    // Remove all non-digits for processing
    let cleanValue = value.replace(/\D/g, "");

    // Handle the case where user is backspacing from "+91 X" format
    // If the clean value starts with "91" and has more digits, remove the "91" prefix
    if (cleanValue.startsWith("91") && cleanValue.length > 2) {
      cleanValue = cleanValue.substring(2);
    } else if (cleanValue.startsWith("91") && cleanValue.length === 2) {
      // If only "91" remains, clear the input completely
      setLocalData(prev => ({ ...prev, phone: "" }));
      return;
    }

    // Limit to 10 digits (Indian mobile number)
    cleanValue = cleanValue.substring(0, 10);

    // Only format if we have actual digits
    if (cleanValue.length === 0) {
      setLocalData(prev => ({ ...prev, phone: "" }));
      return;
    }

    // Format as +91 XXXXX XXXXX
    let formattedValue = "+91 ";
    if (cleanValue.length <= 5) {
      formattedValue += cleanValue;
    } else {
      formattedValue += cleanValue.substring(0, 5) + " " + cleanValue.substring(5);
    }

    setLocalData(prev => ({ ...prev, phone: formattedValue }));
  };

  const handleProfilePictureUpload = async (file: File) => {
    if (!auth.user?.id) {
      toast.error("You must be logged in to upload a profile picture");
      return;
    }

    // Check if user is authenticated with Supabase
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      toast.error("Authentication error. Please try logging in again.");
      return;
    }

    setIsUploadingPicture(true);
    try {
      // Optimistic preview
      const previewUrl = URL.createObjectURL(file);
      setLocalData(prev => ({ ...prev, profile_picture_url: previewUrl }));

      // Upload to Supabase
      const storagePath = await uploadMutation.mutateAsync(file);

      toast.success("Profile picture updated!");

      // Clean up the preview URL
      URL.revokeObjectURL(previewUrl);

      // Don't update local state with storage path - let the profile refetch handle it
      // The refetchQueries in the mutation will trigger profile data sync
    } catch (error) {
      console.error("Upload error details:", {
        error,
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Check if it's a specific Supabase error
      if (error && typeof error === "object" && "message" in error) {
        console.error("Supabase error message:", error.message);
      }

      toast.error(
        `Failed to upload profile picture: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
      // Rollback preview
      setLocalData(prev => ({ ...prev, profile_picture_url: formData.profile_picture_url || "" }));
    } finally {
      setIsUploadingPicture(false);
    }
  };

  const handleProfilePictureDelete = async () => {
    if (!auth.user?.id) {
      toast.error("You must be logged in to delete your profile picture");
      return;
    }

    setIsDeletingPicture(true);
    try {
      await deleteMutation.mutateAsync();
      setLocalData(prev => ({ ...prev, profile_picture_url: "" }));
      toast.success("Profile picture removed");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete profile picture");
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
                    {usernameCheck?.suggestedUsername && (
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
            value={localData.bio || ""}
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
          {languagesLoading ? (
            <div className="text-sm text-gray-500">Loading languages...</div>
          ) : (
            <CheckboxGroup
              id="languages"
              label=""
              options={languages.map(lang => ({ value: lang.id.toString(), label: lang.name }))}
              value={(localData.language_ids || []).map(id => id.toString())}
              onChange={(selectedIds: string[]) => {
                const languageIds = selectedIds.map(id => parseInt(id));
                setLocalData(prev => ({ ...prev, language_ids: languageIds }));
              }}
            />
          )}
        </div>

        {/* Specializations */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Areas of Specialization
          </label>
          {specializationsLoading ? (
            <div className="text-sm text-gray-500">Loading specializations...</div>
          ) : (
            <CheckboxGroup
              id="specializations"
              label=""
              options={specializationsWithCategories.map(spec => ({
                value: spec.id.toString(),
                label: spec.name,
              }))}
              value={(localData.specialization_ids || []).map(id => id.toString())}
              onChange={(selectedIds: string[]) => {
                const specializationIds = selectedIds.map(id => parseInt(id));
                setLocalData(prev => ({ ...prev, specialization_ids: specializationIds }));
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
