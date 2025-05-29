export interface CustomerProfile {
  id?: string;
  user_id: string;
  name: string;
  gender?: string;
  profile_picture?: string | null;
  phone?: string;
  about?: string;
  type_of_user?: string;
  type_of_communication?: string;
  verification_status?: 'pending' | 'verified' | 'rejected';
  created_at?: string;
  updated_at?: string;
  onboarding_completed?: boolean;
} 