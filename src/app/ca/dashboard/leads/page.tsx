"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { LeadsComponent } from "@/components/leads/Leads.component";
import { BackButton } from "@/ui/BackButton.ui";

export default function LeadsPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated && isLoaded) {
      router.push("/login/ca");
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
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton to="/ca/dashboard" label="Back to Dashboard" className="mb-4" />
      <LeadsComponent />
    </div>
  );
}
