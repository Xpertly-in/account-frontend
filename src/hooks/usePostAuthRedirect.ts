import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/helper/supabase.helper";

export function usePostAuthRedirect() {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkProfile = async () => {
      if (!auth.user) return;
      // Avoid redirect loop on these pages
      if (!pathname) return;
      if (["/role-select", "/ca/onboarding", "/user/onboarding"].includes(pathname)) return;
      const { data } = await supabase
        .from("ca_profiles")
        .select("role, onboarding_completed")
        .eq("user_id", auth.user.id)
        .single();

      if (!data?.role) {
        router.push("/role-select");
        return;
      }
      if (!data.onboarding_completed) {
        if (data.role === "ca") {
          router.push("/ca/onboarding");
        } else {
          router.push("/user/onboarding");
        }
        return;
      }
      // else: user has role and completed onboarding, allow normal navigation
    };
    checkProfile();
  }, [auth.user, pathname]);
} 