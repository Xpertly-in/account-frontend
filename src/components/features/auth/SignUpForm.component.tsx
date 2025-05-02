"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import SignUpFormContent from "./SignUpFormContent.component";
import { ExtendedSignUpFormData } from "@/types/auth.type";

interface SignUpFormProps {
  hideContainer?: boolean;
}

export default function SignUpForm({ hideContainer = false }: SignUpFormProps) {
  const router = useRouter();
  const pathname = usePathname();
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

    setIsLoading(true);

    try {
      // Store mock user in localStorage
      const mockUser = {
        id: Date.now().toString(),
        email: formData.email,
        name: formData.name,
      };

      localStorage.setItem("mockUser", JSON.stringify(mockUser));

      toast.success("Sign up successful", {
        description: "Your account has been created.",
      });

      // Short timeout to ensure toast is visible before redirect
      setTimeout(() => {
        // Redirect based on context
        if (isCAContext) {
          router.push("/ca/onboarding");
        } else {
          router.push("/login");
        }
      }, 500);
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Signup error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Render SignUpFormContent directly if hideContainer is true
  if (hideContainer) {
    return (
      <SignUpFormContent
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
        hideContainer={hideContainer}
        setFormData={setFormData}
        isFormValid={isFormValid}
      />
    );
  }

  // Otherwise wrap it in a container
  return (
    <div className="w-full max-w-md rounded-xl border border-border/50 bg-card p-6 shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95 sm:p-8">
      {/* Colored top border */}
      <div className="absolute inset-x-0 top-0 h-1 rounded-t-xl bg-gradient-to-r from-primary via-secondary to-accent"></div>

      <div className="relative">
        <SignUpFormContent
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          hideContainer={hideContainer}
          setFormData={setFormData}
          isFormValid={isFormValid}
        />
      </div>
    </div>
  );
}
