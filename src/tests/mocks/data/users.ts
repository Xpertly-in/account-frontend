import { User } from "@supabase/supabase-js";
import { MockUser } from "@/types/auth.type";

// Mock Supabase User
export const mockUser: User = {
  id: "mock-user-id",
  email: "test@example.com",
  app_metadata: {
    provider: "email",
  },
  user_metadata: {
    name: "Test User",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "authenticated",
} as User;

// Mock CA User
export const mockCAUser: User = {
  id: "mock-ca-user-id",
  email: "ca@example.com",
  app_metadata: {
    provider: "email",
  },
  user_metadata: {
    name: "CA Test User",
  },
  aud: "authenticated",
  created_at: new Date().toISOString(),
  role: "authenticated",
} as User;

// Mock users for localStorage (mock auth)
export const mockUsers: MockUser[] = [
  {
    id: "mock-user-id",
    email: "test@example.com",
    name: "Test User",
  },
  {
    id: "mock-ca-user-id",
    email: "ca@example.com",
    name: "CA Test User",
  },
];
