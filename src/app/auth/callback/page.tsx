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
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();
        if (error) {
          throw error;
        }

        if (session?.user) {
          // Check if user has a role and onboarding status
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, onboarding_completed")
            .eq("user_id", session.user.id)
            .single();

          if (profileError) {
            if (profileError.code === "PGRST116") {
              // No profile exists, create a basic profile and redirect to role selection
              const { error: insertError } = await supabase
                .from("profiles")
                .insert([{
                  user_id: session.user.id,
                  email: session.user.email,
                  name: session.user.user_metadata?.full_name || session.user.email,
                  profile_picture: session.user.user_metadata?.avatar_url,
                  onboarding_completed: false
                }]);

              if (insertError) {
                console.error("Error creating profile:", insertError);
                throw insertError;
              }
              
              router.push("/role-select");
              return;
            }
            console.error("Error checking profile:", profileError);
            throw profileError;
          }

          // If no role is set, redirect to role selection
          if (!profile?.role) {
            router.push("/role-select");
            return;
          }

          // If role exists but onboarding is not completed
          if (!profile.onboarding_completed) {
            router.push(profile.role === "ACCOUNTANT" ? "/ca/onboarding" : "/user/onboarding");
            return;
          }

          // If both role exists and onboarding is completed, go to dashboard
          if (profile.role === "ACCOUNTANT") {
            router.push("/ca/dashboard");
          } else {
            router.push("/user/dashboard");
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
    <div className="fixed inset-0 flex items-center justify-center bg-background">
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="text-sm font-medium text-muted-foreground">Completing authentication...</p>
      </div>
    </div>
  );
}
