"use client";

import React, { useEffect, useState, useRef } from "react";
import { QueryProvider } from "@/store/context/Query.provider";
import { ThemeProvider } from "@/store/context/Theme.provider";
import { AuthProvider } from "@/store/context/Auth.provider";
import { GoogleAuthProvider } from "@/store/context/GoogleAuth.provider";
import { JotaiProvider } from "@/store/jotai/Jotai.provider";
import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// Always use dynamic imports for analytics components
const GoogleAnalytics = dynamic(
  () => import("@/components/features/analytics/GoogleAnalytics.component"),
  { ssr: false }
);

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  // Ensure consistent hydration across environments
  const [mounted, setMounted] = useState(false);
  // Use ref to prevent hydration mismatches across re-renders
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      // Small delay to ensure consistent hydration
      setTimeout(() => {
        setMounted(true);
      }, 0);
    }
  }, []);

  // Provide QueryClient immediately but delay analytics components
  return (
    <ThemeProvider>
      <QueryProvider>
        <JotaiProvider>
          <AuthProvider>
            <GoogleAuthProvider>
              {children}
              {mounted && (
                <>
                  <GoogleAnalytics />
                </>
              )}
            </GoogleAuthProvider>
          </AuthProvider>
        </JotaiProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
