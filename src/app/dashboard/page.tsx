"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import ProfileCard from "@/components/features/dashboard/ProfileCard.component";

export default function DashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    if (!auth.user) {
      router.push("/login");
    }
  }, [auth.user, router]);

  if (!auth.user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Profile Card - 1/3 width */}
        <ProfileCard />

        {/* Main Content - 2/3 width */}
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          {/* Add your dashboard content here */}
        </div>
      </div>
    </div>
  );
} 