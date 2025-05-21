"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/ui/Card.ui";
import { useAuth } from "@/store/context/Auth.provider";
import DynamicForm from "@/components/features/onboarding/DynamicForm.component";
import { DecorativeElements } from "@/ui/DecorativeElements.ui";
import { supabase } from "@/helper/supabase.helper";

export default function OnboardingPage() {
  const router = useRouter();
  const { auth } = useAuth();

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-gradient-to-b from-background to-background/90">
      <div className="container mx-auto px-0 py-6 sm:px-0 md:px-2 lg:py-8">
        <div className="mx-auto max-w-5xl">
        
            <DynamicForm />
          
        </div>
      </div>
    </div>
  );
}
