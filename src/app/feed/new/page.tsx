// src/app/feed/new/page.tsx
"use client";

import React, { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { CaretLeft } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container.component";
import { CreatePost } from "@/components/features/feed/post/CreatePost.component";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function NewPostContent() {
  const router = useRouter();
  const { auth } = useAuth();
  const searchParams = useSearchParams();
  const initialContent = searchParams.get("initialContent") ?? "";

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      router.push("/login/ca");
    }
  }, [auth.user, auth.isLoading, router]);

  if (auth.isLoading || !auth.user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-12">
      <Container className="max-w-3xl py-4">
        {/* Back button */}
        <Link href="/feed">
          <button className="flex items-center gap-2 text-primary hover:underline mb-2">
            <CaretLeft size={20} weight="bold" />
            Back to Feed
          </button>
        </Link>
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-4">
          <CreatePost
            initialContent={initialContent ?? ""}
            onPostCreated={() => {
              <Link href="/feed" />;
            }}
          />
        </div>
      </Container>
    </div>
  );
}

export default function NewPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewPostContent />
    </Suspense>
  );
}
