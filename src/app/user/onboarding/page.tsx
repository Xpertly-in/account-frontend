"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";

import { supabase } from "@/helper/supabase.helper";
import UserOnboardingForm from "@/components/features/onboarding/UserOnboardingForm.component";

export default function UserOnboardingPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const check = async () => {
      if (!auth.user) return;
      const { data } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("user_id", auth.user.id)
        .single();
      if (!data?.onboarding_completed) router.push("/user/dashboard");
      else setLoading(false);
    };
    check();
  }, [auth.user, router]);

  if (loading) return <div className="flex h-screen items-center justify-center">Loading...</div>;

  return <UserOnboardingForm />;
} 