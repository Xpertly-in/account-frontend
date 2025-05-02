"use client";

import { createContext, useContext, useEffect, useState } from "react";
// Import types from the new location
import { AuthState, MockUser } from "@/types/auth.type";

// Create a context for authentication
// Use imported AuthState type
const AuthContext = createContext<{
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; user: any }>; // Keep user as any for now to match mock return
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}>({
  auth: { user: null, isLoading: true },
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Use imported AuthState type
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
  });

  // Check for existing user on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        setAuth({
          // Parse and assert type to MockUser
          user: JSON.parse(storedUser) as MockUser,
          isLoading: false,
        });
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error loading user from localStorage", error);
      setAuth(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  // Mock sign in
  const signIn = async (email: string, password: string) => {
    try {
      const storedUser = localStorage.getItem("mockUser");
      if (storedUser) {
        // Parse and assert type to MockUser
        const user = JSON.parse(storedUser) as MockUser;
        if (user.email === email) {
          setAuth({ user, isLoading: false });
          return { error: null };
        }
      }
      return { error: { message: "Invalid email or password" } };
    } catch (error) {
      console.error("Error signing in", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // Mock sign up
  // Return type includes MockUser structure implicitly
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const mockUser: MockUser = {
        id: Date.now().toString(),
        email,
        name,
      };
      localStorage.setItem("mockUser", JSON.stringify(mockUser));
      // Return the created mock user structure
      return { error: null, user: mockUser };
    } catch (error) {
      console.error("Error signing up", error);
      return { error: { message: "An unexpected error occurred" }, user: null };
    }
  };

  // Mock sign out
  const signOut = async () => {
    localStorage.removeItem("mockUser");
    setAuth({ user: null, isLoading: false });
  };

  // Mock reset password
  const resetPassword = async (email: string) => {
    console.log(`Password reset requested for ${email}`);
    return { error: null };
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
