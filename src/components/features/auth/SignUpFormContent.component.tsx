"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Checkbox } from "@/ui/Checkbox.ui";
import { User, At, LockKey, Eye, EyeSlash, ArrowRight, Check } from "@phosphor-icons/react";
import { AuthFormData } from "@/types/auth.type";

// Extended AuthFormData with additional fields for signup
export interface ExtendedSignUpFormData extends AuthFormData {
  name: string;
  acceptTerms: boolean;
  confirmPassword: string;
}

interface SignUpFormContentProps {
  formData: ExtendedSignUpFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
  hideContainer?: boolean;
  setFormData: React.Dispatch<React.SetStateAction<ExtendedSignUpFormData>>;
  isFormValid: boolean;
}

export default function SignUpFormContent({
  formData,
  handleChange,
  handleSubmit,
  isLoading,
  hideContainer = false,
  setFormData,
  isFormValid = false,
}: SignUpFormContentProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <>
      <div className="mb-4 text-center">
        <h2 className="text-2xl font-bold text-foreground dark:text-white">Create an account</h2>
        <p className="mt-2 text-sm text-muted-foreground dark:text-blue-100/70">
          Sign up to get started with Xpertly
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/70 dark:text-blue-300/70">
              <User weight="bold" className="h-5 w-5" />
            </div>
            <Input
              type="text"
              name="name"
              placeholder="Full name"
              value={formData.name}
              onChange={handleChange}
              required
              className="pl-10"
            />
          </div>
        </div>

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

        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/70 dark:text-blue-300/70">
              <LockKey weight="bold" className="h-5 w-5" />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-10 pr-10"
            />
            <button
              type="button"
              className="absolute inset-y-0 right-3 flex items-center text-muted-foreground/70 dark:text-blue-300/70 hover:text-foreground dark:hover:text-white transition-colors"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeSlash weight="bold" className="h-5 w-5" />
              ) : (
                <Eye weight="bold" className="h-5 w-5" />
              )}
            </button>
          </div>
          <p className="text-xs text-muted-foreground dark:text-blue-100/50">
            Must be at least 8 characters
          </p>
        </div>

        <div className="space-y-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center text-muted-foreground/70 dark:text-blue-300/70">
              <LockKey weight="bold" className="h-5 w-5" />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              name="confirmPassword"
              placeholder="Confirm password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className={`pl-10 pr-10 ${
                passwordsMatch && formData.confirmPassword
                  ? "border-green-500 dark:border-green-600"
                  : ""
              }`}
            />
            <div className="absolute inset-y-0 right-3 flex items-center space-x-1">
              {passwordsMatch && formData.confirmPassword && (
                <Check weight="bold" className="h-5 w-5 text-green-500 dark:text-green-400" />
              )}
              <button
                type="button"
                className="flex items-center text-muted-foreground/70 dark:text-blue-300/70 hover:text-foreground dark:hover:text-white transition-colors"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeSlash weight="bold" className="h-5 w-5" />
                ) : (
                  <Eye weight="bold" className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          {formData.confirmPassword && !passwordsMatch && (
            <p className="text-xs text-red-500 dark:text-red-400">Passwords do not match</p>
          )}
        </div>

        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              id="terms"
              name="acceptTerms"
              checked={formData.acceptTerms}
              onCheckedChange={(checked: boolean) =>
                setFormData(prev => ({ ...prev, acceptTerms: checked }))
              }
              className="data-[state=checked]:bg-primary data-[state=checked]:text-white"
            />
          </div>
          <div className="flex-grow">
            <label htmlFor="terms" className="text-xs text-muted-foreground dark:text-blue-100/70">
              I agree to the{" "}
              <Link
                href="/terms"
                className="text-primary underline-offset-2 hover:underline dark:text-blue-400"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="text-primary underline-offset-2 hover:underline dark:text-blue-400"
              >
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>

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
}
