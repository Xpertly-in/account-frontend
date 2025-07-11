"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { AuthState } from "@/types/auth.type";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";

// Create a context for authentication
const AuthContext = createContext<{
  auth: AuthState;
  signIn: (
    email: string,
    password: string
  ) => Promise<{ error: any; data?: { user: User | null } }>;
  signUp: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ error: any; user: User | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}>({
  auth: { user: null, isLoading: true, isAuthenticated: false },
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null, user: null }),
  signOut: async () => {},
  resetPassword: async () => ({ error: null }),
});

// Custom hook to use the auth context
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [auth, setAuth] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  const router = useRouter();

  // Check for existing session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        setAuth({
          user: session?.user || null,
          isLoading: false,
          isAuthenticated: !!session?.user,
        });
      } catch (error) {
        console.error("Error checking session", error);
        setAuth(prev => ({ ...prev, isLoading: false, isAuthenticated: false }));
      }
    };

    checkSession();
  }, []);

  // Sign in with Supabase
  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error };
      }

      setAuth({ user: data.user, isLoading: false, isAuthenticated: !!data.user });
      return { error: null, data: { user: data.user } };
    } catch (error) {
      console.error("Error signing in", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // Sign up with Supabase
  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        return { error, user: null };
      }

      // Create CA profile record
      if (data.user) {
        const { error: profileError } = await supabase.from("profiles").insert([
          {
            user_id: data.user.id,
            email: data.user.email,
            name: name,
          },
        ]);

        if (profileError) {
          console.error("Error creating profile:", profileError);
          // Don't return error here as the user is already created
        }
      }

      return { error: null, user: data.user };
    } catch (error) {
      console.error("Error signing up", error);
      return { error: { message: "An unexpected error occurred" }, user: null };
    }
  };

  // Sign out with Supabase
  const signOut = async () => {
    try {
      // Clear any stored data
      localStorage.removeItem("mockUser");
      localStorage.removeItem("postLoginRedirect");

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Update local state
      setAuth({ user: null, isLoading: false, isAuthenticated: false });

      // Force a hard refresh to clear any cached state
      window.location.href = "/";
    } catch (error) {
      console.error("Error signing out:", error);
      // Even if there's an error, try to clear local state and redirect
      setAuth({ user: null, isLoading: false, isAuthenticated: false });
      window.location.href = "/";
    }
  };

  // Reset password with Supabase
  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      return { error };
    } catch (error) {
      console.error("Error resetting password", error);
      return { error: { message: "An unexpected error occurred" } };
    }
  };

  // Listen for auth state changes
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        setAuth({ user: session.user, isLoading: false, isAuthenticated: true });
      } else if (event === "SIGNED_OUT") {
        setAuth({ user: null, isLoading: false, isAuthenticated: false });
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
