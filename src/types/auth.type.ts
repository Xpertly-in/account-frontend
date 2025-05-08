import { User } from '@supabase/supabase-js';

export interface AuthFormData {
  email: string;
  password: string;
}

export interface ExtendedSignUpFormData extends AuthFormData {
  name: string;
  acceptTerms: boolean;
  confirmPassword: string;
}

export interface SignUpFormData extends AuthFormData {
  name: string;
  confirmPassword: string;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

// Define simplified Auth types
export interface MockUser {
  id: string;
  email: string;
  name: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
