import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/lib/supabase";

export function useRequireRole() {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;
      if (pathname === "/role-select") return;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .single();
      if (!data?.role) {
        router.push("/role-select");
      }
    };
    checkRole();
  }, [auth.user, pathname]);
}
