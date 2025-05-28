"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthFormData } from "@/types/auth.type";
import { useAuth } from "@/store/context/Auth.provider";
import { useGoogleAuth } from "@/store/context/GoogleAuth.provider";
import { Button } from "@/ui/Button.ui";
import { GoogleButton } from "@/ui/GoogleButton.ui";
import { AuthDivider } from "@/ui/AuthDivider.ui";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import LoginFormFields from "./LoginFormFields.component";
import LoginFormSecurity from "./LoginFormSecurity.component";
import { supabase } from "@/lib/supabase";
import { useAnalytics } from "@/hooks/useAnalytics";
import { EventCategory } from "@/helper/googleAnalytics.helper";
import { usePostAuthRedirect } from "@/hooks/usePostAuthRedirect";
import { UserRole } from "@/types/onboarding.type";

interface LoginFormProps {
  hideContainer?: boolean;
}

export default function LoginForm({ hideContainer = false }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const {
    signIn: signInWithGoogle,
    isLoading: isGoogleLoading,
    error: googleError,
  } = useGoogleAuth();
  const { trackFormSubmission, trackEvent, trackUserInteraction } = useAnalytics();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const { auth } = useAuth();

  // Validate form when inputs change
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(formData.email) && formData.password.length >= 8;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Track login attempt
    trackEvent({
      name: "login_attempt",
      category: EventCategory.FORM_SUBMISSION,
      action: "submit",
      label: "login_form",
      params: {
        method: "email",
        email_domain: formData.email.split("@")[1],
      },
    });

    try {
      const { error: signInError, data } = await signIn(formData.email, formData.password);
      const user = data?.user;

      if (signInError) {
        // Track failed login
        trackFormSubmission("login_form", false, {
          method: "email",
          error: signInError.message,
        });

        if (signInError.message === "Invalid login credentials") {
          toast.error("Invalid credentials", {
            description: "Please check your email and password and try again.",
          });
        } else {
          toast.error("Login failed", {
            description: signInError.message || "Please check your credentials and try again.",
          });
        }
        return;
      }

      if (!user) {
        // Track failed login
        trackFormSubmission("login_form", false, {
          method: "email",
          error: "No user data received",
        });

        toast.error("Login failed", {
          description: "No user data received. Please try again.",
        });
        return;
      }

      // After successful login, first check role
      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role, onboarding_completed")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        toast.error("An error occurred while checking your profile");
        return;
      }

      // If no role is set, redirect to role selection
      if (!profile?.role) {
        router.push("/role-select");
        return;
      }

      // If role exists, then check onboarding status
      if (!profile.onboarding_completed) {
        router.push(profile.role === UserRole.ACCOUNTANT ? "/ca/onboarding" : "/user/onboarding");
        return;
      }

      // If both role exists and onboarding is completed, go to dashboard
      if (profile.role === UserRole.ACCOUNTANT) {
        router.push("/ca/dashboard");
      } else {
        router.push("/user/dashboard");
      }
    } catch (error) {
      // Track login error
      trackFormSubmission("login_form", false, {
        method: "email",
        error: "Unexpected error",
      });

      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      // The auth callback page will handle the role check and redirect
    } catch (error) {
      toast.error("Failed to sign in with Google");
      console.error("Google sign-in error:", error);
    }
  };

  // Remove the useEffect for role checking since it's now handled in the callback
  useEffect(() => {
    if (auth.user) {
      // Only handle non-Google auth redirects here
      if (!window.location.pathname.includes('/auth/callback')) {
        checkAndRedirect();
      }
    }
  }, [auth.user]);

  const formContent = (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Welcome back</h2>
        <p className="mt-2 text-sm text-muted-foreground dark:text-blue-100/70">
          Sign in to your account to continue
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <LoginFormFields formData={formData} handleChange={handleChange} />

        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
              <span>Signing in...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Sign in</span>
              <ArrowRight weight="bold" className="h-4 w-4" />
            </div>
          )}
        </Button>

        <AuthDivider />

        <GoogleButton
          onClick={handleGoogleSignIn}
          isLoading={isGoogleLoading}
          error={googleError || undefined}
        />

        <LoginFormSecurity />

        {!hideContainer && (
          <div className="text-center text-sm text-muted-foreground dark:text-blue-100/70">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-medium text-primary transition-colors hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up
            </Link>
          </div>
        )}
      </form>
    </>
  );

  if (hideContainer) {
    return formContent;
  }

  return (
    <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95 sm:p-8">
      {/* Colored top border */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="relative">{formContent}</div>
    </div>
  );
}
