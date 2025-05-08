"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { useGoogleAuth } from "@/store/context/GoogleAuth.provider";
import { Button } from "@/ui/Button.ui";
import { GoogleButton } from "@/ui/GoogleButton.ui";
import { AuthDivider } from "@/ui/AuthDivider.ui";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import SignUpFormFields from "./SignUpFormFields.component";
import SignUpFormTerms from "./SignUpFormTerms.component";
import { ExtendedSignUpFormData } from "@/types/auth.type";
import Link from "next/link";

interface SignUpFormProps {
  hideContainer?: boolean;
}

export default function SignUpForm({ hideContainer = false }: SignUpFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { signUp } = useAuth();
  const { signIn: signInWithGoogle } = useGoogleAuth();
  const [formData, setFormData] = useState<ExtendedSignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  // Check if we're in the CA context
  const isCAContext = pathname?.includes("/ca") || pathname?.includes("/signup/ca");

  // Validate form when inputs change
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid =
      formData.name.trim().length > 0 &&
      emailRegex.test(formData.email) &&
      formData.password.length >= 8 &&
      formData.password === formData.confirmPassword &&
      formData.acceptTerms;

    setIsFormValid(isValid);
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isFormValid) {
      return;
    }

    console.log("formData", formData);

    setIsLoading(true);

    try {
      const { error, user } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        if (error.code === "user_already_exists") {
          toast.error("Account already exists", {
            description: "Please sign in instead or use a different email address.",
            action: {
              label: "Sign in",
              onClick: () => router.push("/login/ca"),
            },
          });
        } else {
          toast.error("Sign up failed", {
            description: error.message || "Please check your information and try again.",
          });
        }
        return;
      }

      toast.success("Sign up successful", {
        description: "Your account has been created.",
      });

      // Short timeout to ensure toast is visible before redirect
      setTimeout(() => {
        router.push("/ca/onboarding");
      }, 500);
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      toast.error("Failed to sign in with Google");
      console.error("Google sign-in error:", error);
    }
  };

  const formContent = (
    <>
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Create your account</h2>
        <p className="mt-2 text-sm text-muted-foreground dark:text-blue-100/70">
          Join us to get started with your journey
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <SignUpFormFields formData={formData} handleChange={handleChange} />

        <SignUpFormTerms formData={formData} setFormData={setFormData} />

        <Button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-primary to-secondary text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
              <span>Creating account...</span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Create account</span>
              <ArrowRight weight="bold" className="h-4 w-4" />
            </div>
          )}
        </Button>

        <AuthDivider />

        <GoogleButton onClick={handleGoogleSignIn} />

        {!hideContainer && (
          <div className="text-center text-sm text-muted-foreground dark:text-blue-100/70">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-primary transition-colors hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in
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
