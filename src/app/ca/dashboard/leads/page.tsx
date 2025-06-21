"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { LeadsComponent } from "@/components/leads/Leads.component";
import { Button } from "@/ui/Button.ui";
import { ArrowLeft, EnvelopeSimple } from "@phosphor-icons/react";

export default function LeadsPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated && isLoaded) {
      router.push("/login");
      return;
    }
  }, [auth.isAuthenticated, router, isLoaded]);

  useEffect(() => {
    // Set isLoaded after checking auth state
    setIsLoaded(true);
  }, []);

  // Only redirect if explicitly not authenticated (after isLoaded is true)
  if (isLoaded && auth.isAuthenticated === false) {
    return null; // The useEffect will handle redirection
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Premium Header with Gradient Background */}
      <div className="bg-gradient-to-r from-blue-500 to-emerald-500 dark:from-blue-600 dark:to-emerald-600 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {/* Header Row */}
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/ca/dashboard")}
              className="p-2 text-white hover:bg-white/10 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:h-9 sm:w-9">
              <EnvelopeSimple className="h-4 w-4 text-white sm:h-5 sm:w-5" weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white sm:text-xl">Leads</h1>
              <p className="text-blue-100 text-xs sm:text-sm hidden sm:block">
                Manage potential client leads
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        <LeadsComponent />
      </div>
    </div>
  );
}
