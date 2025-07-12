"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { Toaster } from "sonner";
import { User, EnvelopeSimple, ChatCenteredText } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/auth.type";

export default function CADashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // Redirect based on role
        if (profile?.role === UserRole.CUSTOMER) {
          router.push("/user/profile");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    };

    checkRole();
  }, [auth.user, router]);

  useEffect(() => {
    // Set user information if available
    if (auth.user) {
      setUserName(auth.user.user_metadata?.name || "User");
      setUserEmail(auth.user.email || "");
    }
  }, [auth.user]);

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome, {userName}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div
          className="cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95"
          onClick={() => router.push("/xpert/profile")}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40">
            <User className="h-6 w-6 text-primary dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">Profile</h3>
          <p className="mt-2 text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>

        <div
          className="cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95"
          onClick={() => router.push("/xpert/dashboard/leads")}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-blue-600/30 dark:from-blue-500/30 dark:to-blue-600/40">
            <EnvelopeSimple className="h-6 w-6 text-blue-500 dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">Leads</h3>
          <p className="mt-2 text-muted-foreground">View and manage your potential client leads.</p>
          <div className="mt-3 inline-flex items-center justify-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary dark:bg-primary/20">
            New
          </div>
        </div>

        <div
          className="cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95"
          onClick={() => router.push("/xpert/dashboard/contact-requests")}
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/20 to-emerald-600/30 dark:from-emerald-500/30 dark:to-emerald-600/40">
            <ChatCenteredText className="h-6 w-6 text-emerald-500 dark:text-emerald-400" />
          </div>
          <h3 className="text-xl font-semibold">Contact Requests</h3>
          <p className="mt-2 text-muted-foreground">
            View and respond to direct contact requests from customers.
          </p>
          <div className="mt-3 inline-flex items-center justify-center rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500 dark:bg-emerald-500/20">
            New
          </div>
        </div>
      </div>

      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
}
