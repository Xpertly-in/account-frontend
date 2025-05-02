"use client";

import { Card } from "@/ui/Card.ui";
import SignUpForm from "@/components/features/auth/SignUpForm.component";
import { DecorativeElements } from "@/ui/DecorativeElements.ui";

export default function CASignUpPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-background to-background/90 px-4 py-12 sm:px-6 md:px-8">
      {/* Decorative elements - hidden on mobile */}
      <div className="absolute hidden w-full md:block">
        <DecorativeElements />
      </div>

      <div className="z-10 w-full max-w-md">
        <div className="mb-6 text-center md:mb-8">
          <h1 className="text-2xl font-bold text-foreground md:text-3xl">Sign Up as a CA</h1>
          <p className="mt-2 text-sm text-muted-foreground">Create your account to get started</p>
        </div>

        <SignUpForm />

        <div className="mt-6 text-center text-sm text-muted-foreground">
          <p>
            Already have an account?{" "}
            <a href="/login" className="font-medium text-primary hover:text-primary/90">
              Log in
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
