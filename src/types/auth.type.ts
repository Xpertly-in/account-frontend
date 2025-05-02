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

export interface AuthState {
  user: any | null;
  session: any | null;
  isLoading: boolean;
}
