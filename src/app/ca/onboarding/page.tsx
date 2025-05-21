"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/ui/Card.ui";
import { useAuth } from "@/store/context/Auth.provider";
import DynamicForm from "@/components/features/onboarding/DynamicForm.component";
import { DecorativeElements } from "@/ui/DecorativeElements.ui";
import { supabase } from "@/helper/supabase.helper";
import { UserRole } from "@/types/onboarding.type";

export default function OnboardingPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!auth.user) return;

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role, onboarding_completed")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          setIsLoading(false);
          return;
        }

        // If onboarding is completed, redirect to appropriate dashboard
        if (profile?.onboarding_completed) {
          if (profile.role === UserRole.ACCOUNTANT) {
            router.push("/ca/dashboard");
          } else {
            router.push("/dashboard");
          }
          return;
        }

        // If no role is set, redirect to role selection
        if (!profile?.role) {
          router.push("/role-select");
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error checking onboarding status:", error);
        setIsLoading(false);
      }
    };

    checkOnboardingStatus();
  }, [auth.user, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-0 py-6 sm:px-0 md:px-2 lg:py-8">
        <div className="mx-auto max-w-5xl">
          <DynamicForm />
        </div>
      </div>
    </div>
  );
}
