"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/ui/Card.ui";
import { useAuth } from "@/store/context/Auth.provider";
import DynamicForm from "@/components/features/onboarding/DynamicForm.component";
import { DecorativeElements } from "@/ui/DecorativeElements.ui";
import { supabase } from "@/helper/supabase.helper";

export default function OnboardingPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!auth.isLoading) {
        if (auth.user) {
          setIsLoading(false);
          return;
        }
        // Try to get from localStorage as a fallback
        const storedUser = localStorage.getItem("mockUser");
        if (storedUser) {
          setIsLoading(false);
          return;
        }
        // Try to get Supabase session as a fallback (for Google sign-in)
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setIsLoading(false);
        } else {
          router.push("/login");
        }
      }
    };

    checkAuth();
  }, [auth, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-background to-background/90 px-4 pb-16 pt-6 sm:px-6 md:px-8 lg:pb-24 lg:pt-8">
      {/* Decorative elements - hidden on mobile */}
      <div className="hidden md:block">
        <DecorativeElements />
      </div>

      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center md:mb-10">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            Complete Your CA Profile
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Let's set up your professional profile to connect with clients
          </p>
        </div>

        <Card className="mx-auto overflow-hidden border-0 bg-card/90 p-0 shadow-lg backdrop-blur-sm sm:rounded-xl sm:border md:max-w-4xl">
          <DynamicForm />
        </Card>
      </div>
    </main>
  );
}
