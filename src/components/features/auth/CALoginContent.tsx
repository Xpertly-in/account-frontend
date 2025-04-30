"use client";

import { Container } from "@/components/layout/Container.component";
import CAAuthTabs from "@/components/features/auth/CAAuthTabs.component";
import { useSearchParams } from "next/navigation";

export default function CALoginContent() {
  const searchParams = useSearchParams();
  const defaultTab = searchParams.get("tab") === "signup" ? "signup" : "login";

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background with subtle gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/80 to-white dark:from-gray-900/90 dark:to-gray-800/90 z-0"></div>

      {/* Simple background patterns */}
      <div className="absolute inset-0 bg-[url('/subtle-pattern.svg')] bg-repeat opacity-5 dark:opacity-10 pointer-events-none"></div>

      {/* Minimal background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 dark:from-blue-600/10 animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-accent/5 to-transparent rounded-full blur-3xl translate-y-1/3 -translate-x-1/2 dark:from-blue-400/10 animate-pulse-slow animation-delay-2000"></div>

      {/* Content - Centered with minimal styling */}
      <Container className="relative flex min-h-screen items-center justify-center z-10">
        <CAAuthTabs defaultTab={defaultTab as "login" | "signup"} />
      </Container>
    </div>
  );
}