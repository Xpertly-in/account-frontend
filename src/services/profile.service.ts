// Profile Service - CRUD operations and TanStack Query integration
// Following established patterns from leads.service.ts

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/store/context/Auth.provider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserRole } from "@/types/auth.type";
import {
  Profile,
  CAProfile,
  CustomerProfile,
  Experience,
  Education,
  SocialProfile,
  CAVerification,
  ProfileSection,
  ProfileCompletionStatus,
  ProfileFormData,
  ExperienceFormData,
  EducationFormData,
  SocialProfileFormData,
  ProfileUpdateResponse,
  ProfileCompletionResult,
  isCAProfile,
} from "@/types/profile.type";

// =============================================================================
// CORE SERVICE FUNCTIONS
// =============================================================================

/**
 * Fetch complete profile with related data
 */
export async function fetchProfile(userId: string): Promise<CAProfile | CustomerProfile | null> {
  try {
    // Fetch base profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return null;
    }

    if (!profile) return null;

    // For CA profiles, fetch related data
    if (profile.role === UserRole.ACCOUNTANT) {
      const [experiencesResult, educationsResult, socialResult, verificationResult] =
        await Promise.all([
          supabase
            .from("experiences")
            .select("*")
            .eq("profile_id", profile.id)
            .order("start_date", { ascending: false }),
          supabase
            .from("educations")
            .select("*")
            .eq("profile_id", profile.id)
            .order("start_date", { ascending: false }),
          supabase.from("social_profile").select("*").eq("profile_id", profile.id).single(),
          supabase.from("ca_verifications").select("*").eq("profile_id", profile.id).single(),
        ]);

      const caProfile: CAProfile = {
        ...profile,
        role: UserRole.ACCOUNTANT,
        experiences: experiencesResult.data || [],
        educations: educationsResult.data || [],
        social_profile: socialResult.data || undefined,
        verification: verificationResult.data || undefined,
        total_experience_years: calculateTotalExperience(experiencesResult.data || []),
        completion_status: getCompletionStatus(profile.profile_completion_percentage || 0),
      };

      return caProfile;
    }

    // For customer profiles, return base profile
    const customerProfile: CustomerProfile = {
      ...profile,
      role: UserRole.CUSTOMER,
    };

    return customerProfile;
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    return null;
  }
}

/**
 * Update profile basic information
 */
export async function updateProfile(
  profileId: string,
  data: ProfileFormData
): Promise<ProfileUpdateResponse> {
  try {
    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", profileId)
      .select()
      .single();

    if (error) {
      console.error("Error updating profile:", error);
      return { success: false, error: error.message };
    }

    // Calculate new completion percentage
    const completion = await calculateProfileCompletion(profileId);

    // Update completion percentage if changed
    if (completion.percentage !== updatedProfile.profile_completion_percentage) {
      await supabase
        .from("profiles")
        .update({
          profile_completion_percentage: completion.percentage,
          last_completed_section: ProfileSection.BASIC_INFO,
          completion_updated_at: new Date().toISOString(),
        })
        .eq("id", profileId);
    }

    return {
      success: true,
      profile: { ...updatedProfile, profile_completion_percentage: completion.percentage },
      completion,
    };
  } catch (error) {
    console.error("Error in updateProfile:", error);
    return { success: false, error: "Failed to update profile" };
  }
}

/**
 * Check if username is unique within state/district combination
 */
export async function checkUsernameUniqueness(
  username: string,
  stateId: number,
  districtId: number,
  excludeProfileId?: string
): Promise<{ isUnique: boolean; suggestedUsername?: string }> {
  try {
    if (!username || !stateId || !districtId) {
      return { isUnique: false };
    }

    // Check if combination already exists
    let query = supabase
      .from("profiles")
      .select("id, username")
      .eq("username", username)
      .eq("state_id", stateId)
      .eq("district_id", districtId);

    // Exclude current profile if updating
    if (excludeProfileId) {
      query = query.neq("id", excludeProfileId);
    }

    const { data: existingProfiles, error } = await query;

    if (error) {
      console.error("Error checking username uniqueness:", error);
      return { isUnique: false };
    }

    const isUnique = !existingProfiles || existingProfiles.length === 0;

    // If not unique, suggest alternative usernames
    if (!isUnique) {
      const suggestedUsername = await generateSuggestedUsername(username, stateId, districtId);
      return { isUnique: false, suggestedUsername };
    }

    return { isUnique: true };
  } catch (error) {
    console.error("Error in checkUsernameUniqueness:", error);
    return { isUnique: false };
  }
}

/**
 * Generate suggested username alternatives
 */
async function generateSuggestedUsername(
  baseUsername: string,
  stateId: number,
  districtId: number
): Promise<string> {
  try {
    // Try adding numbers 1-99
    for (let i = 1; i <= 99; i++) {
      const suggestion = `${baseUsername}${i}`;
      const { data, error } = await supabase
        .from("profiles")
        .select("id")
        .eq("username", suggestion)
        .eq("state_id", stateId)
        .eq("district_id", districtId)
        .limit(1);

      if (error) {
        console.error("Error checking suggested username:", error);
        continue;
      }

      if (!data || data.length === 0) {
        return suggestion;
      }
    }

    // Fallback: add random number
    const randomNum = Math.floor(Math.random() * 9999) + 100;
    return `${baseUsername}${randomNum}`;
  } catch (error) {
    console.error("Error generating suggested username:", error);
    return `${baseUsername}${Math.floor(Math.random() * 99) + 1}`;
  }
}

/**
 * Create new experience entry
 */
export async function createExperience(
  profileId: string,
  data: ExperienceFormData
): Promise<Experience | null> {
  try {
    const { data: experience, error } = await supabase
      .from("experiences")
      .insert({
        profile_id: profileId,
        ...data,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating experience:", error);
      return null;
    }

    // Update profile completion
    await updateProfileCompletion(profileId, ProfileSection.EXPERIENCE);

    return experience;
  } catch (error) {
    console.error("Error in createExperience:", error);
    return null;
  }
}

/**
 * Update existing experience
 */
export async function updateExperience(
  experienceId: string,
  data: Partial<ExperienceFormData>
): Promise<Experience | null> {
  try {
    const { data: experience, error } = await supabase
      .from("experiences")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", experienceId)
      .select()
      .single();

    if (error) {
      console.error("Error updating experience:", error);
      return null;
    }

    return experience;
  } catch (error) {
    console.error("Error in updateExperience:", error);
    return null;
  }
}

/**
 * Delete experience entry
 */
export async function deleteExperience(experienceId: string, profileId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("experiences").delete().eq("id", experienceId);

    if (error) {
      console.error("Error deleting experience:", error);
      return false;
    }

    // Update profile completion
    await updateProfileCompletion(profileId, ProfileSection.EXPERIENCE);

    return true;
  } catch (error) {
    console.error("Error in deleteExperience:", error);
    return false;
  }
}

/**
 * Create new education entry
 */
export async function createEducation(
  profileId: string,
  data: EducationFormData
): Promise<Education | null> {
  try {
    const { data: education, error } = await supabase
      .from("educations")
      .insert({
        profile_id: profileId,
        ...data,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating education:", error);
      return null;
    }

    // Update profile completion
    await updateProfileCompletion(profileId, ProfileSection.EDUCATION);

    return education;
  } catch (error) {
    console.error("Error in createEducation:", error);
    return null;
  }
}

/**
 * Update existing education
 */
export async function updateEducation(
  educationId: string,
  data: Partial<EducationFormData>
): Promise<Education | null> {
  try {
    const { data: education, error } = await supabase
      .from("educations")
      .update({
        ...data,
        updated_at: new Date().toISOString(),
      })
      .eq("id", educationId)
      .select()
      .single();

    if (error) {
      console.error("Error updating education:", error);
      return null;
    }

    return education;
  } catch (error) {
    console.error("Error in updateEducation:", error);
    return null;
  }
}

/**
 * Delete education entry
 */
export async function deleteEducation(educationId: string, profileId: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("educations").delete().eq("id", educationId);

    if (error) {
      console.error("Error deleting education:", error);
      return false;
    }

    // Update profile completion
    await updateProfileCompletion(profileId, ProfileSection.EDUCATION);

    return true;
  } catch (error) {
    console.error("Error in deleteEducation:", error);
    return false;
  }
}

/**
 * Update social profile
 */
export async function updateSocialProfile(
  profileId: string,
  data: SocialProfileFormData
): Promise<SocialProfile | null> {
  try {
    // Try to update existing social profile, or create new one
    const { data: existingSocial } = await supabase
      .from("social_profile")
      .select("id")
      .eq("profile_id", profileId)
      .single();

    let result;
    if (existingSocial) {
      // Update existing
      result = await supabase
        .from("social_profile")
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("profile_id", profileId)
        .select()
        .single();
    } else {
      // Create new
      result = await supabase
        .from("social_profile")
        .insert({
          profile_id: profileId,
          ...data,
        })
        .select()
        .single();
    }

    if (result.error) {
      console.error("Error updating social profile:", result.error);
      return null;
    }

    // Update profile completion
    await updateProfileCompletion(profileId, ProfileSection.SOCIAL_CONTACT);

    return result.data;
  } catch (error) {
    console.error("Error in updateSocialProfile:", error);
    return null;
  }
}

/**
 * Calculate profile completion percentage and status
 */
export async function calculateProfileCompletion(
  profileId: string
): Promise<ProfileCompletionResult> {
  try {
    const [profileResult, experiencesResult, educationsResult, socialResult] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", profileId).single(),
      supabase.from("experiences").select("id").eq("profile_id", profileId),
      supabase.from("educations").select("id").eq("profile_id", profileId),
      supabase.from("social_profile").select("*").eq("profile_id", profileId).single(),
    ]);

    const profile = profileResult.data;
    if (!profile) {
      return {
        percentage: 0,
        status: ProfileCompletionStatus.INCOMPLETE,
        completed_sections: [],
        missing_sections: Object.values(ProfileSection),
        suggestions: ["Complete basic profile information"],
      };
    }

    let completedSections: ProfileSection[] = [];
    let suggestions: string[] = [];

    // Basic Info (20%) - Name, email, phone, location
    if (profile.first_name && profile.last_name && profile.email && profile.city && profile.state) {
      completedSections.push(ProfileSection.BASIC_INFO);
    } else {
      suggestions.push("Add your full name and location details");
    }

    // Professional Details (20%) - Bio, specializations, languages
    if (profile.bio && profile.specialization?.length > 0 && profile.languages?.length > 0) {
      completedSections.push(ProfileSection.PROFESSIONAL_DETAILS);
    } else {
      suggestions.push("Add your bio, specializations, and language skills");
    }

    // Experience (20%) - At least one complete experience
    if (experiencesResult.data && experiencesResult.data.length > 0) {
      completedSections.push(ProfileSection.EXPERIENCE);
    } else {
      suggestions.push("Add your work experience");
    }

    // Education (20%) - At least one complete education
    if (educationsResult.data && educationsResult.data.length > 0) {
      completedSections.push(ProfileSection.EDUCATION);
    } else {
      suggestions.push("Add your educational qualifications");
    }

    // Social/Contact (20%) - At least one social link or professional website
    if (
      socialResult.data &&
      (socialResult.data.linkedin_profile ||
        socialResult.data.professional_website ||
        socialResult.data.instagram_profile)
    ) {
      completedSections.push(ProfileSection.SOCIAL_CONTACT);
    } else {
      suggestions.push("Add your professional social media links");
    }

    const percentage = (completedSections.length / 5) * 100;
    const status = getCompletionStatus(percentage);
    const missingSections = Object.values(ProfileSection).filter(
      section => !completedSections.includes(section)
    );

    return {
      percentage,
      status,
      completed_sections: completedSections,
      missing_sections: missingSections,
      suggestions,
    };
  } catch (error) {
    console.error("Error calculating profile completion:", error);
    return {
      percentage: 0,
      status: ProfileCompletionStatus.INCOMPLETE,
      completed_sections: [],
      missing_sections: Object.values(ProfileSection),
      suggestions: ["Error calculating completion - please try again"],
    };
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Calculate total years of experience
 */
function calculateTotalExperience(experiences: Experience[]): number {
  if (!experiences.length) return 0;

  return experiences.reduce((total, exp) => {
    if (!exp.start_date) return total;

    const startDate = new Date(exp.start_date);
    const endDate = exp.is_current
      ? new Date()
      : exp.end_date
      ? new Date(exp.end_date)
      : new Date();
    const years = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24 * 365.25);

    return total + Math.max(0, years);
  }, 0);
}

/**
 * Get completion status from percentage
 */
function getCompletionStatus(percentage: number): ProfileCompletionStatus {
  if (percentage < 25) return ProfileCompletionStatus.INCOMPLETE;
  if (percentage < 50) return ProfileCompletionStatus.BASIC;
  if (percentage < 75) return ProfileCompletionStatus.INTERMEDIATE;
  if (percentage < 90) return ProfileCompletionStatus.COMPLETE;
  return ProfileCompletionStatus.EXCELLENT;
}

/**
 * Update profile completion after section changes
 */
async function updateProfileCompletion(
  profileId: string,
  lastSection: ProfileSection
): Promise<void> {
  try {
    const completion = await calculateProfileCompletion(profileId);

    await supabase
      .from("profiles")
      .update({
        profile_completion_percentage: completion.percentage,
        last_completed_section: lastSection,
        completion_updated_at: new Date().toISOString(),
      })
      .eq("id", profileId);
  } catch (error) {
    console.error("Error updating profile completion:", error);
  }
}

// =============================================================================
// TANSTACK QUERY HOOKS
// =============================================================================

/**
 * Hook to fetch user's profile with related data
 */
export function useProfile() {
  const { auth } = useAuth();

  return useQuery({
    queryKey: ["profile", auth.user?.id],
    queryFn: () => (auth.user?.id ? fetchProfile(auth.user.id) : null),
    enabled: !!auth.user?.id,
    staleTime: 30 * 60 * 1000, // 30 minutes
    gcTime: 60 * 60 * 1000, // 1 hour
  });
}

/**
 * Hook to update profile information
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ profileId, data }: { profileId: string; data: ProfileFormData }) =>
      updateProfile(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to create new experience
 */
export function useCreateExperience() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ profileId, data }: { profileId: string; data: ExperienceFormData }) =>
      createExperience(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to update experience
 */
export function useUpdateExperience() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({
      experienceId,
      data,
    }: {
      experienceId: string;
      data: Partial<ExperienceFormData>;
    }) => updateExperience(experienceId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to delete experience
 */
export function useDeleteExperience() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ experienceId, profileId }: { experienceId: string; profileId: string }) =>
      deleteExperience(experienceId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to create new education
 */
export function useCreateEducation() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ profileId, data }: { profileId: string; data: EducationFormData }) =>
      createEducation(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to update education
 */
export function useUpdateEducation() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({
      educationId,
      data,
    }: {
      educationId: string;
      data: Partial<EducationFormData>;
    }) => updateEducation(educationId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to delete education
 */
export function useDeleteEducation() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ educationId, profileId }: { educationId: string; profileId: string }) =>
      deleteEducation(educationId, profileId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to update social profile
 */
export function useUpdateSocialProfile() {
  const queryClient = useQueryClient();
  const { auth } = useAuth();

  return useMutation({
    mutationFn: ({ profileId, data }: { profileId: string; data: SocialProfileFormData }) =>
      updateSocialProfile(profileId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile", auth.user?.id] });
    },
  });
}

/**
 * Hook to calculate profile completion
 */
export function useProfileCompletion(profileId?: string) {
  return useQuery({
    queryKey: ["profileCompletion", profileId],
    queryFn: () => (profileId ? calculateProfileCompletion(profileId) : null),
    enabled: !!profileId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook for checking username uniqueness with debouncing
 */
export function useUsernameUniqueness(
  username: string,
  stateId: number | undefined,
  districtId: number | undefined,
  excludeProfileId?: string
) {
  return useQuery({
    queryKey: ["username-uniqueness", username, stateId, districtId, excludeProfileId],
    queryFn: () => {
      if (!username || !stateId || !districtId) {
        return { isUnique: false };
      }
      return checkUsernameUniqueness(username, stateId, districtId, excludeProfileId);
    },
    enabled: !!(username && stateId && districtId && username.length >= 3),
    staleTime: 0, // Always fresh check
    retry: 1,
  });
}
