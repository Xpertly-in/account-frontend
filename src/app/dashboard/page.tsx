"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/providers/AuthProvider.component";
import { Toaster } from "sonner";

export default function DashboardPage() {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      router.push("/login");
    }
  }, [auth.isLoading, auth.user, router]);

  if (auth.isLoading) {
    return (
      <div className="flex min-h-[70vh] w-full flex-col items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        <p className="mt-4 text-muted-foreground">Loading your dashboard...</p>
      </div>
    );
  }

  if (!auth.user) return null;

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your personal dashboard.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-primary dark:text-blue-400"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Profile</h3>
          <p className="mt-2 text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 dark:from-secondary/30 dark:to-secondary/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-secondary dark:text-blue-400"
            >
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
              <path d="M9 14h6" />
              <path d="M9 18h6" />
              <path d="M9 10h.01" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Bookings</h3>
          <p className="mt-2 text-muted-foreground">View and manage your appointments with CAs.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/30 dark:from-accent/30 dark:to-accent/40">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6 text-accent dark:text-green-400"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold">Documents</h3>
          <p className="mt-2 text-muted-foreground">Access and manage your financial documents.</p>
        </div>
      </div>

      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
}
