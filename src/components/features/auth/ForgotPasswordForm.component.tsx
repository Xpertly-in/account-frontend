"use client";

import { useState } from "react";
import Link from "next/link";
import { ForgotPasswordFormData } from "@/types/auth.type";
import { useAuth } from "@/store/context/Auth.provider";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { At, ArrowRight, ArrowLeft } from "@phosphor-icons/react";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const { resetPassword } = useAuth();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await resetPassword(formData.email);

      if (error) {
        toast.error("Password reset failed", {
          description: error.message || "Please check your email address and try again.",
        });
        return;
      }

      setIsSuccess(true);
      toast.success("Password reset email sent", {
        description: "Please check your email for instructions to reset your password.",
      });
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Password reset error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95 sm:p-8">
      {/* Colored top border */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="relative">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-foreground dark:text-white sm:text-3xl">
            Reset your password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground dark:text-blue-100/70">
            {isSuccess
              ? "Check your email for the reset link"
              : "Enter your email to receive a password reset link"}
          </p>
        </div>

        {isSuccess ? (
          <div className="space-y-5">
            <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400 dark:text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Password reset email sent successfully. Please check your inbox (and spam
                    folder) for instructions.
                  </p>
                </div>
              </div>
            </div>

            <Button
              asChild
              variant="outline"
              className="w-full border-border bg-card transition-colors hover:border-primary hover:bg-primary/10 hover:text-primary dark:border-blue-700/50 dark:bg-gray-800/50 dark:hover:border-blue-500 dark:hover:bg-blue-900/30"
            >
              <Link href="/login" className="flex items-center justify-center gap-2">
                <ArrowLeft weight="bold" className="h-4 w-4" />
                <span>Back to login</span>
              </Link>
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/70 dark:text-blue-300/70">
                  <At weight="bold" className="h-5 w-5" />
                </div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="pl-10"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white transition-all hover:shadow-md dark:from-blue-500 dark:to-blue-600"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-b-transparent"></span>
                  <span>Sending reset link...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span>Send reset link</span>
                  <ArrowRight weight="bold" className="h-4 w-4" />
                </div>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground dark:text-blue-100/70">
              Remembered your password?{" "}
              <Link
                href="/login"
                className="font-medium text-primary transition-colors hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
              >
                Back to login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
