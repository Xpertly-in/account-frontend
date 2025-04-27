"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { AuthState } from "@/types/auth.type";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { PASSWORD_RESET_REDIRECT_URL } from "@/utils/app.constants";

// Create a context for authentication
const AuthContext = createContext<{
  auth: AuthState;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: any; user: any }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: any }>;
}>({
  auth: { user: null, session: null, isLoading: true },
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
    session: null,
    isLoading: true,
  });

  // Handle auth state changes
  useEffect(() => {
    // Initial session check
    const getSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error);
        setAuth(prev => ({ ...prev, isLoading: false }));
        return;
      }

      const { session } = data;

      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setAuth({ user, session, isLoading: false });
      } else {
        setAuth(prev => ({ ...prev, isLoading: false }));
      }
    };

    getSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent, session: Session | null) => {
      if (session) {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setAuth({ user, session, isLoading: false });
      } else {
        setAuth({ user: null, session: null, isLoading: false });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Sign in with email and password
  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  // Sign up with email and password
  const signUp = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
        },
      },
    });
    return { error, user: data.user };
  };

  // Sign out
  const signOut = async () => {
    await supabase.auth.signOut();
  };

  // Reset password
  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: PASSWORD_RESET_REDIRECT_URL,
    });
    return { error };
  };

  return (
    <AuthContext.Provider value={{ auth, signIn, signUp, signOut, resetPassword }}>
      {children}
    </AuthContext.Provider>
  );
}
