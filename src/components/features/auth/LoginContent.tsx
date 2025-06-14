"use client";

import { Container } from "@/components/layout/Container.component";
import LoginForm from "@/components/features/auth/LoginForm.component";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/helper/supabase.helper";

// Separate component to handle search params safely
function Login() {
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const router = useRouter();
  const { auth } = useAuth();

  useEffect(() => {
    const checkAuth = async () => {
      if (auth.user) {
        const redirectTo = localStorage.getItem("postLoginRedirect") || "/dashboard";
        localStorage.removeItem("postLoginRedirect");
        router.replace(redirectTo);
        return;
      }
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        const redirectTo = localStorage.getItem("postLoginRedirect") || "/dashboard";
        localStorage.removeItem("postLoginRedirect");
        router.replace(redirectTo);
      }
    };
    checkAuth();
  }, [auth, router]);

  return (
    <Container className="flex min-h-screen items-center justify-center py-12">
      <LoginForm />
    </Container>
  );
}

// Main component with Suspense boundary
export default function LoginContent() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-lg text-gray-500">Loading...</p>
        </div>
      }
    >
      <Login />
    </Suspense>
  );
} 