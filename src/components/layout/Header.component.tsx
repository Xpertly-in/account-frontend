"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/helper/tw.helper";
import Link from "next/link";
import { Logo } from "@/ui/Logo.ui";
import { Button } from "@/ui/Button.ui";
import { ThemeToggle } from "@/ui/ThemeToggle.ui";
import { useAuth } from "@/store/context/Auth.provider";
import { User, SignOut, List, X, Briefcase } from "@phosphor-icons/react";
import { supabase } from "@/helper/supabase.helper";
import { UserRole } from "@/types/onboarding.type";

export function Header() {
  const { auth, signOut } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [hasSession, setHasSession] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);

  // Wait for hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Check for Supabase session and user role
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setHasSession(!!session?.user);

      if (session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", session.user.id)
          .single();
        
        setUserRole(profile?.role || null);
      }
    };
    checkSession();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = "/";
  };

  const isLoggedIn = mounted && (auth.user || hasSession);
  const pathname = usePathname() ?? '';
  const dashboardPath = userRole === UserRole.ACCOUNTANT ? "/ca/dashboard" : "/user/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-background/80 dark:border-border/50 dark:bg-background/90">
      <div className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between md:h-20">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Logo size="sm" />
            </Link>
            <nav className="ml-8 hidden items-center space-x-8 md:flex">
              <Link
                href="/search"
                className={cn(
                  "font-medium transition-colors hover:text-primary dark:hover:text-primary",
                  pathname?.startsWith("/search")
                    ? "text-primary dark:text-primary"
                    : "text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
                )}
              >
                Find CA
              </Link>
              <Link
                href="/about"
                className={cn(
                  "font-medium transition-colors hover:text-primary dark:hover:text-primary",
                  pathname?.startsWith("/about")
                    ? "text-primary dark:text-primary"
                    : "text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
                )}
              >
                About
              </Link>
              <Link
                href="/feed"
                className={cn(
                  "font-medium transition-colors hover:text-primary dark:hover:text-primary",
                  pathname?.startsWith("/feed")
                    ? "text-primary dark:text-primary"
                    : "text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
                )}
              >
                Feed
              </Link>
              <Link
                href="/contact"
                className={cn(
                  "font-medium transition-colors hover:text-primary dark:hover:text-primary",
                  pathname?.startsWith("/contact")
                    ? "text-primary dark:text-primary"
                    : "text-foreground/90 hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
                )}
              >
                Contact
              </Link>
            </nav>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center p-2 text-foreground/80 md:hidden"
          >
            {mobileMenuOpen ? <X size={24} weight="bold" /> : <List size={24} weight="bold" />}
          </button>

          {/* Desktop menu */}
          <div className="hidden items-center space-x-4 md:flex">
            <ThemeToggle />

            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Link href={dashboardPath}>
                  <Button
                    variant="outline"
                    className="rounded-lg border-primary/20 px-4 py-2 text-primary transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:border-primary/30 dark:text-primary/90 dark:hover:border-primary/40 dark:hover:bg-primary/20 dark:hover:text-primary"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="rounded-lg text-foreground/80 transition-colors hover:bg-background hover:text-foreground dark:text-foreground/70 dark:hover:bg-background/80 dark:hover:text-foreground"
                >
                  <SignOut size={20} weight="bold" className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center">
                <Link href="/login">
                  <Button
                    variant="default"
                    className="rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
                  >
                    <Briefcase weight="bold" className="h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border bg-background px-4 py-4 md:hidden dark:border-border/50">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/search"
              className="font-medium text-foreground/90 transition-colors hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find CA
            </Link>
            <Link
              href="/about"
              className="font-medium text-foreground/90 transition-colors hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Link
              href="/contact"
              className="font-medium text-foreground/90 transition-colors hover:text-foreground dark:text-foreground/80 dark:hover:text-foreground"
              onClick={() => setMobileMenuOpen(false)}
            >
              Contact
            </Link>

            <div className="pt-2">
              <ThemeToggle />
            </div>

            {isLoggedIn ? (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href={dashboardPath} onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="outline"
                    className="w-full justify-start rounded-lg border-primary/20 px-4 py-2.5 text-primary transition-colors hover:border-primary/30 hover:bg-primary/10 hover:text-primary dark:border-primary/30 dark:text-primary/90 dark:hover:border-primary/40 dark:hover:bg-primary/20 dark:hover:text-primary"
                  >
                    <User size={20} weight="bold" className="mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  onClick={() => {
                    handleSignOut();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full justify-start rounded-lg text-foreground/80 transition-colors hover:bg-background hover:text-foreground dark:text-foreground/70 dark:hover:bg-background/80 dark:hover:text-foreground"
                >
                  <SignOut size={20} weight="bold" className="mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex flex-col space-y-3 pt-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button
                    variant="default"
                    className="w-full justify-start rounded-lg bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
                  >
                    <Briefcase weight="bold" className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
