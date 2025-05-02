"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/ui/Card.ui";
import { useAuth } from "@/store/context/Auth.provider";
import DynamicForm from "@/components/features/onboarding/DynamicForm.component";
import { DecorativeElements } from "@/ui/DecorativeElements.ui";

export default function OnboardingPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user exists in localStorage if auth context is not available
    const checkAuth = () => {
      if (!auth.isLoading) {
        if (!auth.user) {
          // Try to get from localStorage as a fallback
          const storedUser = localStorage.getItem("mockUser");
          if (!storedUser) {
            router.push("/login");
          } else {
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
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
