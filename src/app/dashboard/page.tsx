"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { Toaster } from "sonner";
import { User, Calendar, FileText } from "@phosphor-icons/react";
import { supabase } from "@/helper/supabase.helper";

export default function DashboardPage() {


  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">Welcome to your personal dashboard.</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40">
            <User className="h-6 w-6 text-primary dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">Profile</h3>
          <p className="mt-2 text-muted-foreground">
            Manage your profile information and preferences.
          </p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-secondary/20 to-secondary/30 dark:from-secondary/30 dark:to-secondary/40">
            <Calendar className="h-6 w-6 text-secondary dark:text-blue-400" />
          </div>
          <h3 className="text-xl font-semibold">Bookings</h3>
          <p className="mt-2 text-muted-foreground">View and manage your appointments with CAs.</p>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-accent/20 to-accent/30 dark:from-accent/30 dark:to-accent/40">
            <FileText className="h-6 w-6 text-accent dark:text-green-400" />
          </div>
          <h3 className="text-xl font-semibold">Documents</h3>
          <p className="mt-2 text-muted-foreground">Access and manage your financial documents.</p>
        </div>
      </div>

      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
}
