// Profile Types - TypeScript interfaces aligned with supabase.sql schema
import { UserRole } from "./auth.type";

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
  state_id?: number;
  district_id?: number;
  country: string;
  languages?: string[];
  specialization?: string[];
  email: string;
  phone?: string;
  whatsapp_available: boolean;
  is_active: boolean;
  profile_completion_percentage: number;
  last_completed_section?: string;
  completion_updated_at?: string;
  created_at: string;
  updated_at: string;
}
export interface CAProfile extends Profile {
  role: UserRole.ACCOUNTANT;
  experiences?: Experience[];
  educations?: Education[];
  social_profile?: SocialProfile;
  verification?: CAVerification;
  total_experience_years?: number;
  completion_status?: ProfileCompletionStatus;
}
export interface CustomerProfile extends Profile {
  role: UserRole.CUSTOMER;
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
export enum ProfileSection {
  BASIC_INFO = "basic_info",
  PROFESSIONAL_DETAILS = "professional_details",
  EXPERIENCE = "experience",
  EDUCATION = "education",
  SOCIAL_CONTACT = "social_contact",
  VERIFICATION = "verification",
}

export enum ProfileCompletionStatus {
  INCOMPLETE = "incomplete",
  BASIC = "basic",
  INTERMEDIATE = "intermediate",
  COMPLETE = "complete",
  EXCELLENT = "excellent",
}
export interface ProfileFormData {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  bio?: string;
  city?: string;
  state?: string;
  state_id?: number;
  district_id?: number;
  country?: string;
  languages?: string[];
  specialization?: string[];
  phone?: string;
  whatsapp_available?: boolean;
}
export interface ExperienceFormData {
  title: string;
  company_name: string;
  location?: string;
  is_current: boolean;
  start_date?: string;
  end_date?: string;
  description?: string;
}
export interface EducationFormData {
  institute_name: string;
  degree?: string;
  field_of_study?: string;
  start_date?: string;
  end_date?: string;
  grade?: string;
  description?: string;
}
export interface SocialProfileFormData {
  linkedin_profile?: string;
  professional_website?: string;
  instagram_profile?: string;
  facebook_profile?: string;
  twitter_profile?: string;
  youtube_profile?: string;
}
export interface ProfileCompletionResult {
  percentage: number;
  status: ProfileCompletionStatus;
  completed_sections: ProfileSection[];
  missing_sections: ProfileSection[];
  suggestions: string[];
}
export interface ProfileUpdateResponse {
  success: boolean;
  profile?: Profile;
  completion?: ProfileCompletionResult;
  error?: string;
}

export interface ProfileValidationErrors {
  [field: string]: string[];
}
export type ProfileUpdatePayload = Partial<ProfileFormData>;

export type ProfileCreatePayload = Required<
  Pick<Profile, "auth_user_id" | "email" | "role" | "country">
> &
  Partial<ProfileFormData>;
export interface ProfileQueryFilters {
  role?: UserRole;
  city?: string;
  state?: string;
  specialization?: string[];
  is_active?: boolean;
  completion_min?: number;
  search?: string;
}
export function isCAProfile(profile: Profile): profile is CAProfile {
  return profile.role === UserRole.ACCOUNTANT;
}

export function isCustomerProfile(profile: Profile): profile is CustomerProfile {
  return profile.role === UserRole.CUSTOMER;
}

export function hasVerification(
  profile: CAProfile
): profile is CAProfile & { verification: CAVerification } {
  return profile.verification !== undefined;
}
