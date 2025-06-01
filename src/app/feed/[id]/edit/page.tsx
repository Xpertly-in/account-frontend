// src/app/feed/new/page.tsx
"use client";

import React, { useEffect, Suspense, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { CaretLeft } from "@phosphor-icons/react";
import { Container } from "@/components/layout/Container.component";
import { CreatePost } from "@/components/features/feed/post/CreatePost.component";

function EditPostContent() {
  const router = useRouter();
  const { id } = useParams();
  const { auth } = useAuth();
  const [post, setPost] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    supabase
      .from("posts")
      .select("id, title, content, category, tags, images, author_id")
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

  // Prevent non-authors from editing
  useEffect(() => {
    if (!auth.isLoading && auth.user && post) {
      if (post.author_id !== auth.user.id) {
        router.push("/feed");
      }
    }
  }, [auth.isLoading, auth.user, post, router]);

  if (auth.isLoading || !auth.user || !post) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-12">
      <Container className="max-w-3xl py-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/feed")}
          className="flex items-center gap-2 text-primary hover:underline mb-2"
        >
          <CaretLeft size={20} weight="bold" />
          Back to Feed
        </button>
        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-4">
          <CreatePost
            postId={id!.toString()}
            initialTitle={post.title}
            initialContent={post.content}
            initialCategory={post.category}
            initialTags={post.tags}
            initialImages={post.images}
            onPostUpdated={() => router.push("/feed")}
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
