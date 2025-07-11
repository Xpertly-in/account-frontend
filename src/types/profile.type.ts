// Profile type definitions matching supabase.sql schema
// Supports both CA and Customer profiles with role-based differentiation

export interface Profile {
  id: string;
  auth_user_id: string;
  username?: string;
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  profile_picture_url?: string;
  bio?: string;
  gender?: string;
  role: UserRole;
  city?: string;
  state?: string;
  country: string;
  languages?: string[];
  specialization?: string[];
  email: string;
  phone?: string;
  whatsapp_available: boolean;
  is_active: boolean;
  // Profile completion tracking fields (to be added via migration)
  profile_completion_percentage?: number;
  last_completed_section?: string;
  completion_updated_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  profile_id: string;
  title?: string;
  company_name?: string;
  location?: string;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface Education {
  id: string;
  profile_id: string;
  institute_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
  created_at: string;
  updated_at: string;
}

export interface SocialProfile {
  id: string;
  profile_id: string;
  linkedin_profile?: string;
  professional_website?: string;
  instagram_profile?: string;
  facebook_profile?: string;
  twitter_profile?: string;
  youtube_profile?: string;
  created_at: string;
  updated_at: string;
}

export interface CAVerification {
  profile_id: string;
  membership_number?: string;
  membership_certificate_url?: string;
  verified_at?: string;
  verified_by?: string;
}

// Enums for type safety
export enum UserRole {
  CA = 'CA',
  CUSTOMER = 'CUSTOMER'
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say'
}

export enum ProfileSection {
  BASIC_INFO = 'basic_info',
  PROFESSIONAL_DETAILS = 'professional_details',
  EXPERIENCE = 'experience',
  EDUCATION = 'education',
  SOCIAL_CONTACT = 'social_contact'
}

// Extended interfaces for CA-specific data
export interface CAProfile extends Profile {
  role: UserRole.CA;
  experiences?: Experience[];
  educations?: Education[];
  social_profile?: SocialProfile;
  verification?: CAVerification;
  // CA-specific computed fields
  years_of_experience?: number;
  total_clients?: number;
  average_rating?: number;
  response_rate?: number;
}

// Extended interfaces for Customer-specific data
export interface CustomerProfile extends Profile {
  role: UserRole.CUSTOMER;
  preferred_services?: string[];
  urgency_preference?: string;
  budget_range?: string;
  communication_preference?: string[];
}

// Profile completion calculation interface
export interface ProfileCompletion {
  percentage: number;
  sections: {
    [key in ProfileSection]: {
      completed: boolean;
      weight: number;
      fields: string[];
    };
  };
  next_steps: string[];
}

// Profile update interfaces
export interface ProfileUpdate {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  bio?: string;
  city?: string;
  state?: string;
  languages?: string[];
  specialization?: string[];
  phone?: string;
  whatsapp_available?: boolean;
}

export interface ExperienceCreate {
  title: string;
  company_name: string;
  location?: string;
  is_current: boolean;
  start_date: string;
  end_date?: string;
  description?: string;
}

export interface EducationCreate {
  institute_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
}

export interface SocialProfileUpdate {
  linkedin_profile?: string;
  professional_website?: string;
  instagram_profile?: string;
  facebook_profile?: string;
  twitter_profile?: string;
  youtube_profile?: string;
}

// Form state interfaces for profile editing
export interface ProfileFormState {
  profile: Partial<ProfileUpdate>;
  experiences: Experience[];
  educations: Education[];
  social_profile: Partial<SocialProfileUpdate>;
  isDirty: boolean;
  isSubmitting: boolean;
  errors: Record<string, string>;
}

// Helper types for component props
export type ProfileDisplay = Pick<Profile, 'first_name' | 'middle_name' | 'last_name' | 'profile_picture_url' | 'bio' | 'city' | 'state' | 'role'>;
export type ContactInfo = Pick<Profile, 'email' | 'phone' | 'whatsapp_available'>;
export type ProfessionalInfo = Pick<Profile, 'specialization' | 'languages' | 'bio'>; 