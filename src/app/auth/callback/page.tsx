"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { toast } from "sonner";
import { ensureCaProfile } from "@/helper/googleAuth.helper";
import { UserRole } from "@/types/auth.type";

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
          // Check for stored redirect path
          const storedRedirect = localStorage.getItem("postLoginRedirect");

          // Check if user has a role
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role")
            .eq("auth_user_id", session.user.id)
            .single();

          if (profileError) {
            if (profileError.code === "PGRST116") {
              // No profile exists, create a basic profile and redirect to role selection
              const { error: insertError } = await supabase.from("profiles").insert([
                {
                  auth_user_id: session.user.id,
                  email: session.user.email,
                  first_name: session.user.user_metadata?.full_name || session.user.email,
                },
              ]);

              if (insertError) {
                console.error("Error creating profile:", insertError);
                throw insertError;
              }

              localStorage.removeItem("postLoginRedirect"); // Clear stored redirect
              router.push("/role-select");
              return;
            }
            console.error("Error checking profile:", profileError);
            throw profileError;
          }

          if (!profileError && !profile?.role) {
            localStorage.removeItem("postLoginRedirect"); // Clear stored redirect
            router.push("/role-select");
            return;
          }

          // Redirect based on user role (existing user) or role selection for new user above
          if (profile.role === UserRole.ACCOUNTANT) {
            router.push("/xpert/dashboard");
          } else {
            router.push("/user/dashboard");
          }
          return;

          // If both role exists and onboarding is completed, check for stored redirect
          if (storedRedirect) {
            localStorage.removeItem("postLoginRedirect"); // Clear stored redirect
            router.push(storedRedirect);
          } else {
            // Default redirect based on role
            if (profile.role === "ACCOUNTANT") {
              router.push("/xpert/dashboard");
            } else {
              router.push("/user/dashboard");
            }
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
