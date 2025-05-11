"use client";

import * as React from "react";
import { createContext, useContext, useState } from "react";
import { signInWithGoogle, checkProfileExists } from "@/helper/googleAuth.helper";
import { useRouter } from "next/navigation";

interface GoogleAuthContextType {
  isLoading: boolean;
  error: string | null;
  signIn: () => Promise<void>;
}

const GoogleAuthContext = createContext<GoogleAuthContextType | undefined>(undefined);

export function GoogleAuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const signIn = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await signInWithGoogle();

      if (response?.url) {
        // Redirect to Google OAuth page
        window.location.href = response.url;
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to sign in with Google");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GoogleAuthContext.Provider value={{ isLoading, error, signIn }}>
      {children}
    </GoogleAuthContext.Provider>
  );
}

export function useGoogleAuth() {
  const context = useContext(GoogleAuthContext);
  if (context === undefined) {
    throw new Error("useGoogleAuth must be used within a GoogleAuthProvider");
  }
  return context;
}
