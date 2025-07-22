import { User } from "@supabase/supabase-js";

// Auth Types - Single source of truth for authentication and user roles
export interface AuthState {
  user: any | null; // Supabase User type
  isLoading: boolean;
  isAuthenticated: boolean;
}

/**
 * User roles enum - Single source of truth for all user roles
 * Values match what's stored in the database profiles.role field
 */
export enum UserRole {
  ACCOUNTANT = "ACCOUNTANT", // CA/Chartered Accountant role
  CUSTOMER = "CUSTOMER",     // Customer/Client role  
  ADMIN = "ADMIN",           // Admin role (future use)
}

/**
 * Type helper for role checking
 */
export type UserRoleType = keyof typeof UserRole;

export interface AuthContextType {
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}
