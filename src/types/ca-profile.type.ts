/**
 * Comprehensive CA Profile type definition
 * Used in onboarding, profile displays, and API interactions
 */
export interface CAProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  qualification?: string;
  experience?: number;
  specializations?: string[];
  about?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  services?: string[];
  fees?: {
    consultationFee?: number;
    hourlyRate?: number;
  };
  availability?: {
    days?: string[];
    hours?: {
      start?: string;
      end?: string;
    };
  };
  documents?: {
    id: string;
    name: string;
    url: string;
    verified: boolean;
  }[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}
