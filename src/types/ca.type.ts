export interface CA {
  id: string;
  name: string;
  imageUrl?: string;
  location: string;
  rating: number;
  reviews: number;
  verified: boolean;
  specialization: string[];
  experience: number;
  // Additional fields from Supabase
  email?: string;
  phone?: string;
  website?: string;
  qualification?: string;
  firm_name?: string;
  member_since?: string;
  clients?: string;
  about?: string;
  services?: string[];
  language?: string[];
}

export interface ContactDetails {
  email: string;
  phone: string;
  website: string;
}

export interface AdditionalInfo {
  qualification: string;
  firmName: string;
  memberSince: string;
  clients: string;
  about: string;
  services: string[];
}

// Component props interfaces
export interface CAProfileHeroProps {
  ca: CA;
  isLoaded: boolean;
  initials: string;
  city: string;
  state: string;
}

export interface CAContactInfoProps {
  contactDetails: ContactDetails;
  isLoaded: boolean;
  caId: string;
}

export interface CAProfessionalDetailsProps {
  additionalInfo: AdditionalInfo;
  isLoaded: boolean;
}

export interface CAAboutSectionProps {
  about: string;
  isLoaded: boolean;
}

export interface CAServicesSectionProps {
  services: string[];
  isLoaded: boolean;
}

export interface CAReviewsSectionProps {
  rating: number;
  reviews: number;
  isLoaded: boolean;
}

export interface CAExperienceSectionProps {
  experiences: Array<{
    id: string;
    title: string;
    employmentType: string;
    companyName: string;
    location: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string;
    industry: string;
    description: string;
    recentService: string;
  }>;
  isLoaded: boolean;
}

export interface CAEducationSectionProps {
  educations: Array<{
    id: string;
    instituteName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
    isCurrent: boolean;
  }>;
  isLoaded: boolean;
}
