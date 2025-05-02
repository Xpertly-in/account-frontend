"use client";

import { useState } from "react";
import { Input } from "@/ui/Input.ui";
import { User, At, LockKey, Eye, EyeSlash, Check } from "@phosphor-icons/react";
import { ExtendedSignUpFormData } from "@/types/auth.type";

interface SignUpFormFieldsProps {
  formData: ExtendedSignUpFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function SignUpFormFields({ formData, handleChange }: SignUpFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const passwordsMatch =
    formData.password && formData.confirmPassword && formData.password === formData.confirmPassword;

  return (
    <div className="space-y-4">
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
    </div>
  );
}
