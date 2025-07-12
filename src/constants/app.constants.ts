// Supabase configuration
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const SUPABASE_SERVICE_ROLE_KEY = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || "";

// App configuration
export const APP_NAME = "Xpertly";
export const APP_DESCRIPTION = "Find and connect with trusted Chartered Accountants";

// API endpoints
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// Environment
export const IS_PRODUCTION = process.env.NODE_ENV === "production";
export const ENVIRONMENT = process.env.NODE_ENV || "development";

// Auth related
export const AUTH_REDIRECT_URL = process.env.NEXT_PUBLIC_AUTH_REDIRECT_URL || "";
export const PASSWORD_RESET_REDIRECT_URL = `${
  typeof window !== "undefined" ? window.location.origin : ""
}/reset-password`;
