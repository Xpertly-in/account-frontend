"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/ui/Input.ui";
import { At, LockKey, Eye, EyeSlash } from "@phosphor-icons/react";
import { AuthFormData } from "@/types/auth.type";

interface LoginFormFieldsProps {
  formData: AuthFormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function LoginFormFields({ formData, handleChange }: LoginFormFieldsProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
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
        <div className="flex justify-end">
          <Link
            href="/login/forgot-password"
            className="text-xs text-primary transition-colors hover:text-primary/80 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Forgot password?
          </Link>
        </div>
      </div>
    </>
  );
}
