import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/onboarding.type";

export function useProtectedRoute() {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = async () => {
      // Skip check for public routes
      if (!pathname) return;
      if (["/login", "/signup", "/role-select", "/auth/callback"].includes(pathname)) return;

      // If not authenticated, store current path and redirect to login
      if (!auth.user) {
        // Store the current path for redirect after login
        localStorage.setItem("postLoginRedirect", pathname);
        router.push("/login");
        return;
      }

      // If authenticated, check role and onboarding status
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, onboarding_completed")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // If no role is set, redirect to role selection
        if (!profile?.role) {
          router.push("/role-select");
          return;
        }

        // If onboarding is not completed, redirect to appropriate onboarding
        if (!profile.onboarding_completed) {
          router.push(profile.role === UserRole.ACCOUNTANT ? "/ca/onboarding" : "/user/onboarding");
          return;
        }

        // If both role and onboarding are completed, check if user is trying to access wrong role's pages
        if (profile.role === UserRole.ACCOUNTANT && pathname.startsWith("/user/")) {
          router.push("/ca/dashboard");
        } else if (profile.role === UserRole.CUSTOMER && pathname.startsWith("/ca/")) {
          router.push("/user/dashboard");
        }
      } catch (error) {
        console.error("Error checking profile:", error);
      }
    };

    checkAuth();
  }, [auth.user, pathname, router]);
} 