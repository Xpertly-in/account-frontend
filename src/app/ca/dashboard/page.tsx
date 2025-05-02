"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";

export default function CADashboardPage() {
  const router = useRouter();
  const { auth, signOut } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");

  useEffect(() => {
    // Check auth from context or localStorage
    const checkAuth = () => {
      if (!auth.isLoading) {
        if (auth.user) {
          setUserName(auth.user.name);
          setUserEmail(auth.user.email);
          setIsLoading(false);
        } else {
          // Try to get from localStorage as a fallback
          const storedUser = localStorage.getItem("mockUser");
          if (storedUser) {
            try {
              const user = JSON.parse(storedUser);
              setUserName(user.name);
              setUserEmail(user.email);
              setIsLoading(false);
            } catch (e) {
              console.error("Error parsing stored user", e);
              router.push("/login");
            }
          } else {
            router.push("/login");
          }
        }
      }
    };

    checkAuth();
  }, [auth, router]);

  const handleSignOut = async () => {
    await signOut();
    // Also remove from localStorage as a fallback
    localStorage.removeItem("mockUser");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="relative min-h-screen w-full bg-gradient-to-b from-background to-background/90 px-4 pb-16 pt-6 sm:px-6 md:px-8 lg:pb-24 lg:pt-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 text-center md:mb-10">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl lg:text-4xl">
            CA Dashboard
          </h1>
          <p className="mt-2 text-sm text-muted-foreground md:text-base">
            Welcome to your professional dashboard
          </p>
        </div>

        <Card className="mx-auto overflow-hidden border bg-card/90 p-6 shadow-lg backdrop-blur-sm sm:rounded-xl md:max-w-4xl">
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold">Welcome, {userName}</h2>
                <p className="text-sm text-muted-foreground">{userEmail}</p>
              </div>
              <Button onClick={handleSignOut} variant="outline" size="sm">
                Sign Out
              </Button>
            </div>

            <div className="rounded-lg bg-muted/30 p-4">
              <h3 className="mb-3 text-lg font-medium">Dashboard Coming Soon</h3>
              <p className="text-sm text-muted-foreground">
                We're building your personalized dashboard. Check back soon for updates!
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  );
}
