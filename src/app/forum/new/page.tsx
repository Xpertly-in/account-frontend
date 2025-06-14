"use client";

import { useProtectedRoute } from "@/hooks/useProtectedRoute";
import { Container } from "@/components/layout/Container.component";
import { useAuth } from "@/store/context/Auth.provider";
import { CaretLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

export default function NewForumPostPage() {
  // This will handle authentication and redirects
  useProtectedRoute();
  
  const router = useRouter();
  const { auth } = useAuth();

  // If not authenticated, the hook will handle the redirect
  if (!auth.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-12">
      <Container className="max-w-3xl py-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/forum")}
          className="flex items-center gap-2 text-primary hover:underline mb-2"
        >
          <CaretLeft size={20} weight="bold" />
          Back to Forum
        </button>
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-4">
          {/* Add your forum post form component here */}
          <h1 className="text-2xl font-bold mb-4">Create New Post</h1>
          {/* Your form content */}
        </div>
      </Container>
    </div>
  );
} 