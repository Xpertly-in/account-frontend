"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ensureCaProfile } from "@/helper/googleAuth.helper";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
);

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        console.log("[AuthCallback] session:", session);
        console.log("[AuthCallback] getSession error:", error);

        if (error) throw error;

        if (session?.user) {
          console.log("[AuthCallback] session.user:", session.user);
          // Ensure ca_profile exists and get onboarding_completed status
          const onboardingCompleted = await ensureCaProfile(session.user);
          console.log("[AuthCallback] onboardingCompleted:", onboardingCompleted);

          if (onboardingCompleted) {
            router.push("/ca/dashboard");
          } else {
            router.push("/ca/onboarding");
          }
        } else {
          console.log("[AuthCallback] No user in session");
          throw new Error("No user in session");
        }
      } catch (error) {
        console.error("[AuthCallback] Error:", error);
        toast.error("Authentication failed");
        router.push("/login");
      }
    };

    handleCallback();
  }, [router]);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
} 