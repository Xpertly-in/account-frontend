"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { toast } from "sonner";
import SignUpFormContent from "./SignUpFormContent.component";
import { ExtendedSignUpFormData } from "@/types/auth.type";

interface SignUpFormProps {
  hideContainer?: boolean;
}

export default function SignUpForm({ hideContainer = false }: SignUpFormProps) {
  const router = useRouter();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState<ExtendedSignUpFormData>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    acceptTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

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
      const { error } = await signUp(formData.email, formData.password, formData.name);

      if (error) {
        toast.error("Sign up failed", {
          description: error.message || "Please check your information and try again.",
        });
        return;
      }

      toast.success("Sign up successful", {
        description: "Please check your email for verification.",
      });

      router.push("/login");
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
