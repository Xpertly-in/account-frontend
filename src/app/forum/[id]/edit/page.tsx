// src/app/forum/new/page.tsx
"use client";

import React, { useEffect, Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { CaretLeft } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container.component";
import { CreatePost } from "@/components/features/forum/CreatePost.component";

function EditPostContent() {
  const router = useRouter();
  const { id } = useParams();
  const { auth } = useAuth();
  const [post, setPost] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    supabase
      .from("posts")
      .select("id, content, category, tags, images")
      .eq("id", id)
      .single()
      .then(({ data }) => setPost(data));
  }, [id]);

  // Redirect to login if unauthenticated
  useEffect(() => {
    if (!auth.isLoading && !auth.user) {
      localStorage.setItem("postLoginRedirect", window.location.pathname);
      router.push("/login/ca");
    }
  }, [auth.user, auth.isLoading, router]);

  if (auth.isLoading || !auth.user || !post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-12">
      <Container className="max-w-3xl py-16">
        {/* Back button */}
        <button
          onClick={() => router.push("/forum")}
          className="flex items-center gap-2 text-primary hover:underline mb-8"
        >
          <CaretLeft size={20} weight="bold" />
          Back to Forum
        </button>
        {/* Title */}
        <h1 className="text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-6">Edit Post</h1>
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12">
          <CreatePost
            postId={id!.toString()}
            initialContent={post.content}
            initialCategory={post.category}
            initialTags={post.tags}
            initialImages={post.images}
            onPostUpdated={() => router.push("/forum")}
          />
        </div>
      </Container>
    </div>
  );
}

export default function EditPostPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPostContent />
    </Suspense>
  );
}
