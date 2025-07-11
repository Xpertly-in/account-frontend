import { supabase } from "@/helper/supabase.helper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import {
  Profile,
  CAProfile,
  CustomerProfile,
  Experience,
  Education,
  SocialProfile,
  ProfileUpdate,
  ExperienceCreate,
  EducationCreate,
  SocialProfileUpdate,
  ProfileCompletion,
  ProfileSection,
  UserRole,
} from "@/types/profile.type";

// ============================================================================
// CORE SERVICE FUNCTIONS
// ============================================================================

/**
 * Interface for profile fetch response with related data
 */
export interface ProfileResponse {
  profile: Profile | null;
  experiences: Experience[];
  educations: Education[];
  social_profile: SocialProfile | null;
  error: any;
}

/**
 * Fetches complete profile data including related entities
 */
export const fetchCompleteProfile = async (userId: string): Promise<ProfileResponse> => {
  try {
    // Fetch main profile data
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select(
        `
        id,
        auth_user_id,
        username,
        first_name,
        middle_name,
        last_name,
        profile_picture_url,
        bio,
        gender,
        role,
        city,
        state,
        country,
        languages,
        specialization,
        email,
        phone,
        whatsapp_available,
        is_active,
        profile_completion_percentage,
        last_completed_section,
        completion_updated_at,
        created_at,
        updated_at
      `
      )
      .eq("auth_user_id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return {
        profile: null,
        experiences: [],
        educations: [],
        social_profile: null,
        error: profileError,
      };
    }

    if (!profileData) {
      return {
        profile: null,
        experiences: [],
        educations: [],
        social_profile: null,
        error: new Error("Profile not found"),
      };
    }

    // Fetch related data in parallel
    const [experiencesResult, educationsResult, socialProfileResult] = await Promise.all([
      supabase
        .from("experiences")
        .select("*")
        .eq("profile_id", profileData.id)
        .order("start_date", { ascending: false }),

      supabase
        .from("educations")
        .select("*")
        .eq("profile_id", profileData.id)
        .order("start_date", { ascending: false }),

      supabase.from("social_profile").select("*").eq("profile_id", profileData.id).single(),
    ]);

    // Log any errors but don't fail the entire request
    if (experiencesResult.error)
      console.warn("Error fetching experiences:", experiencesResult.error);
    if (educationsResult.error) console.warn("Error fetching educations:", educationsResult.error);
    if (socialProfileResult.error)
      console.warn("Error fetching social profile:", socialProfileResult.error);

    return {
      profile: profileData as Profile,
      experiences: experiencesResult.data || [],
      educations: educationsResult.data || [],
      social_profile: socialProfileResult.data || null,
      error: null,
    };
  } catch (error) {
    console.error("Error in fetchCompleteProfile:", error);
    return {
      profile: null,
      experiences: [],
      educations: [],
      social_profile: null,
      error,
    };
  }
};

/**
 * Fetches basic profile data only
 */
export const fetchProfile = async (
  userId: string
): Promise<{ data: Profile | null; error: any }> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("auth_user_id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return { data: null, error };
    }

    return { data: data as Profile, error: null };
  } catch (error) {
    console.error("Error in fetchProfile:", error);
    return { data: null, error };
  }
};

/**
 * Updates profile basic information
 */
const updateProfile = async (userId: string, profileData: ProfileUpdate): Promise<Profile> => {
  const updateData = {
    ...profileData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("auth_user_id", userId)
    .select()
    .single();

  if (error) throw error;
  return data as Profile;
};

/**
 * Creates a new experience entry
 */
const createExperience = async (
  profileId: string,
  experienceData: ExperienceCreate
): Promise<Experience> => {
  const experience = {
    profile_id: profileId,
    ...experienceData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("experiences").insert(experience).select().single();

  if (error) throw error;
  return data as Experience;
};

/**
 * Updates an existing experience entry
 */
const updateExperience = async (
  experienceId: string,
  experienceData: Partial<ExperienceCreate>
): Promise<Experience> => {
  const updateData = {
    ...experienceData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("experiences")
    .update(updateData)
    .eq("id", experienceId)
    .select()
    .single();

  if (error) throw error;
  return data as Experience;
};

/**
 * Deletes an experience entry
 */
const deleteExperience = async (experienceId: string): Promise<void> => {
  const { error } = await supabase.from("experiences").delete().eq("id", experienceId);

  if (error) throw error;
};

/**
 * Creates a new education entry
 */
const createEducation = async (
  profileId: string,
  educationData: EducationCreate
): Promise<Education> => {
  const education = {
    profile_id: profileId,
    ...educationData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase.from("educations").insert(education).select().single();

  if (error) throw error;
  return data as Education;
};

/**
 * Updates an existing education entry
 */
const updateEducation = async (
  educationId: string,
  educationData: Partial<EducationCreate>
): Promise<Education> => {
  const updateData = {
    ...educationData,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("educations")
    .update(updateData)
    .eq("id", educationId)
    .select()
    .single();

  if (error) throw error;
  return data as Education;
};

/**
 * Deletes an education entry
 */
const deleteEducation = async (educationId: string): Promise<void> => {
  const { error } = await supabase.from("educations").delete().eq("id", educationId);

  if (error) throw error;
};

/**
 * Updates or creates social profile
 */
const updateSocialProfile = async (
  profileId: string,
  socialData: SocialProfileUpdate
): Promise<SocialProfile> => {
  // First, try to find existing social profile
  const { data: existingData } = await supabase
    .from("social_profile")
    .select("id")
    .eq("profile_id", profileId)
    .single();

  if (existingData) {
    // Update existing
    const { data, error } = await supabase
      .from("social_profile")
      .update({
        ...socialData,
        updated_at: new Date().toISOString(),
      })
      .eq("profile_id", profileId)
      .select()
      .single();

    if (error) throw error;
    return data as SocialProfile;
  } else {
    // Create new
    const { data, error } = await supabase
      .from("social_profile")
      .insert({
        profile_id: profileId,
        ...socialData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) throw error;
    return data as SocialProfile;
  }
};

/**
 * Calculates profile completion percentage
 */
export const calculateProfileCompletion = (
  profile: Profile,
  experiences: Experience[],
  educations: Education[],
  socialProfile: SocialProfile | null
): ProfileCompletion => {
  const sections: ProfileCompletion["sections"] = {
    [ProfileSection.BASIC_INFO]: {
      completed: false,
      weight: 20,
      fields: ["first_name", "last_name", "email", "phone", "city", "state"],
    },
    [ProfileSection.PROFESSIONAL_DETAILS]: {
      completed: false,
      weight: 20,
      fields: ["bio", "specialization", "languages"],
    },
    [ProfileSection.EXPERIENCE]: {
      completed: false,
      weight: 20,
      fields: ["experiences"],
    },
    [ProfileSection.EDUCATION]: {
      completed: false,
      weight: 20,
      fields: ["educations"],
    },
    [ProfileSection.SOCIAL_CONTACT]: {
      completed: false,
      weight: 20,
      fields: ["social_profile"],
    },
  };

  // Check basic info completion
  const basicInfoFields = [
    profile.first_name,
    profile.last_name,
    profile.email,
    profile.phone,
    profile.city,
    profile.state,
  ];
  sections[ProfileSection.BASIC_INFO].completed = basicInfoFields.every(
    field => field && field.length > 0
  );

  // Check professional details completion
  const hasBio = profile.bio && profile.bio.length > 10;
  const hasSpecialization = profile.specialization && profile.specialization.length > 0;
  const hasLanguages = profile.languages && profile.languages.length > 0;
  sections[ProfileSection.PROFESSIONAL_DETAILS].completed =
    hasBio && hasSpecialization && hasLanguages;

  // Check experience completion
  sections[ProfileSection.EXPERIENCE].completed = experiences.length > 0;

  // Check education completion
  sections[ProfileSection.EDUCATION].completed = educations.length > 0;

  // Check social/contact completion
  const hasSocialLinks =
    socialProfile &&
    (socialProfile.linkedin_profile ||
      socialProfile.professional_website ||
      socialProfile.instagram_profile ||
      socialProfile.facebook_profile ||
      socialProfile.twitter_profile ||
      socialProfile.youtube_profile);
  sections[ProfileSection.SOCIAL_CONTACT].completed = !!hasSocialLinks;

  // Calculate overall percentage
  const completedWeight = Object.values(sections)
    .filter(section => section.completed)
    .reduce((total, section) => total + section.weight, 0);

  // Generate next steps
  const nextSteps: string[] = [];
  Object.entries(sections).forEach(([key, section]) => {
    if (!section.completed) {
      switch (key) {
        case ProfileSection.BASIC_INFO:
          nextSteps.push("Complete your basic information (name, contact details, location)");
          break;
        case ProfileSection.PROFESSIONAL_DETAILS:
          nextSteps.push("Add your professional bio, specializations, and languages");
          break;
        case ProfileSection.EXPERIENCE:
          nextSteps.push("Add your work experience");
          break;
        case ProfileSection.EDUCATION:
          nextSteps.push("Add your educational qualifications");
          break;
        case ProfileSection.SOCIAL_CONTACT:
          nextSteps.push("Add your social media links or professional website");
          break;
      }
    }
  });

  return {
    percentage: completedWeight,
    sections,
    next_steps: nextSteps,
  };
};

/**
 * Updates profile completion percentage in database
 */
const updateProfileCompletion = async (
  userId: string,
  percentage: number,
  lastSection?: string
): Promise<void> => {
  const { error } = await supabase
    .from("profiles")
    .update({
      profile_completion_percentage: percentage,
      last_completed_section: lastSection,
      completion_updated_at: new Date().toISOString(),
    })
    .eq("auth_user_id", userId);

  if (error) {
    console.error("Error updating profile completion:", error);
    throw error;
  }
};

// ============================================================================
// TANSTACK QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch complete profile data with related entities
 */
export const useCompleteProfile = (userId?: string) => {
  const { auth } = useAuth();
  const targetUserId = userId || auth.user?.id;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile", "complete", targetUserId],
    queryFn: () => fetchCompleteProfile(targetUserId || ""),
    enabled: !!targetUserId,
    staleTime: 30 * 60 * 1000, // 30 minutes cache for profile data
    refetchOnWindowFocus: false,
  });

  // Calculate completion if data is available
  const completion = data?.profile
    ? calculateProfileCompletion(
        data.profile,
        data.experiences,
        data.educations,
        data.social_profile
      )
    : null;

  return {
    profile: data?.profile || null,
    experiences: data?.experiences || [],
    educations: data?.educations || [],
    socialProfile: data?.social_profile || null,
    completion,
    isLoading,
    isError,
    error: data?.error || error,
    refetch,
  };
};

/**
 * Hook to fetch basic profile data only
 */
export const useProfile = (userId?: string) => {
  const { auth } = useAuth();
  const targetUserId = userId || auth.user?.id;

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["profile", "basic", targetUserId],
    queryFn: () => fetchProfile(targetUserId || ""),
    enabled: !!targetUserId,
    staleTime: 30 * 60 * 1000, // 30 minutes cache
    refetchOnWindowFocus: false,
  });

  return {
    profile: data?.data || null,
    isLoading,
    isError,
    error: data?.error || error,
    refetch,
  };
};

/**
 * Hook to update profile information
 */
export const useUpdateProfile = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: (profileData: ProfileUpdate) => updateProfile(auth.user?.id || "", profileData),
    onSuccess: updatedProfile => {
      // Invalidate all profile-related queries
      queryClient.invalidateQueries({ queryKey: ["profile"] });

      // Optionally, update the cache directly for immediate UI updates
      queryClient.setQueryData(["profile", "basic", auth.user?.id], (oldData: any) => ({
        ...oldData,
        data: updatedProfile,
      }));
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateProfile: mutate,
  };
};

/**
 * Hook to create experience entry
 */
export const useCreateExperience = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({
      profileId,
      experienceData,
    }: {
      profileId: string;
      experienceData: ExperienceCreate;
    }) => createExperience(profileId, experienceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    createExperience: mutate,
  };
};

/**
 * Hook to update experience entry
 */
export const useUpdateExperience = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({
      experienceId,
      experienceData,
    }: {
      experienceId: string;
      experienceData: Partial<ExperienceCreate>;
    }) => updateExperience(experienceId, experienceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateExperience: mutate,
  };
};

/**
 * Hook to delete experience entry
 */
export const useDeleteExperience = () => {
  const queryClient = useQueryClient();

  const { isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: (experienceId: string) => deleteExperience(experienceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    deleteExperience: mutate,
  };
};

/**
 * Hook to create education entry
 */
export const useCreateEducation = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({
      profileId,
      educationData,
    }: {
      profileId: string;
      educationData: EducationCreate;
    }) => createEducation(profileId, educationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    createEducation: mutate,
  };
};

/**
 * Hook to update education entry
 */
export const useUpdateEducation = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({
      educationId,
      educationData,
    }: {
      educationId: string;
      educationData: Partial<EducationCreate>;
    }) => updateEducation(educationId, educationData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateEducation: mutate,
  };
};

/**
 * Hook to delete education entry
 */
export const useDeleteEducation = () => {
  const queryClient = useQueryClient();

  const { isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: (educationId: string) => deleteEducation(educationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    deleteEducation: mutate,
  };
};

/**
 * Hook to update social profile
 */
export const useUpdateSocialProfile = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({
      profileId,
      socialData,
    }: {
      profileId: string;
      socialData: SocialProfileUpdate;
    }) => updateSocialProfile(profileId, socialData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateSocialProfile: mutate,
  };
};
