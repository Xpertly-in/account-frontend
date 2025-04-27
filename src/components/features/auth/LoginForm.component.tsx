"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AuthFormData } from "@/types/auth.type";
import { useAuth } from "@/components/providers/AuthProvider.component";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "@phosphor-icons/react";
import { toast } from "sonner";
import LoginFormFields from "./LoginFormFields.component";
import LoginFormSecurity from "./LoginFormSecurity.component";

interface LoginFormProps {
  hideContainer?: boolean;
}

export default function LoginForm({ hideContainer = false }: LoginFormProps) {
  const router = useRouter();
  const { signIn } = useAuth();
  const [formData, setFormData] = useState<AuthFormData>({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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

    try {
      const { error } = await signIn(formData.email, formData.password);

      if (error) {
        toast.error("Login failed", {
          description: error.message || "Please check your credentials and try again.",
        });
        return;
      }

      toast.success("Login successful", {
        description: "Welcome back!",
      });

      router.push("/dashboard");
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

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

        <LoginFormSecurity />

        {!hideContainer && (
          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
            <span className="mx-3 flex-shrink text-xs text-muted-foreground dark:text-blue-100/50">
              OR
            </span>
            <div className="flex-grow border-t border-border dark:border-blue-800/50"></div>
          </div>
        )}

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
