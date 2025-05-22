// src/app/forum/new/page.tsx
"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { CaretLeft } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container.component";
import { CreatePost } from "@/components/features/forum/CreatePost.component";

export default function NewPostPage() {
  const router = useRouter();
  const { auth } = useAuth();

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      // remember where to go after login
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      router.push("/login/ca");
    }
  }, [auth.user, auth.isLoading, router]);

  if (auth.isLoading || !auth.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-12">
      <Container className="py-16">
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <CaretLeft size={20} weight="bold" />
          Back to Feed
        </button>

        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">
          Create New Post
        </h1>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <CreatePost onPostCreated={() => router.push("/")} />
        </div>
      </Container>
    </div>
  );
}
