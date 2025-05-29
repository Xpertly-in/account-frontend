"use client";

import React from "react";
import { useParams, useRouter } from "next/navigation";
import { usePost, useSimilarPosts } from "@/services/posts.service";
import { CommentSection } from "@/components/features/forum/CommentSection.component";
import { Container } from "@/components/layout/Container.component";
import { Card } from "@/ui/Card.ui";
import { PostCard } from "@/components/features/forum/PostCard.component";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const postId = Number(id);

  const { data: post, isLoading: postLoading } = usePost(postId);
  const { data: similarPosts = [], isLoading: similarLoading } = useSimilarPosts(
    postId,
    post?.category,
    post?.tags
  );

  if (postLoading || !post) {
    return <div className="text-center py-12">Loading post…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-4">
      <Container className="max-w-3xl py-4">
        {/* Back button */}
        <button
          onClick={() => router.push("/forum")}
          className="flex items-center gap-2 text-primary hover:underline mb-4"
        >
          &lt; Back to Feed
        </button>

        {/* Post Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-6">
          <PostCard
            {...post}
            onEdit={id => router.push(`/forum/${id}/edit`)}
            onDelete={id => {
              /* (Optional) confirm + delete */
            }}
          />
          {/* comments */}
          <CommentSection postId={postId} />
        </div>

        {/* Similar Posts */}
        {!similarLoading && similarPosts?.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
              Similar Posts
            </h2>
            <div className="grid grid-cols-1 gap-4 max-h-[60vh] overflow-y-auto">
              {similarPosts.map(sim => (
                <Card key={sim.id} className="overflow-hidden rounded-2xl shadow-xl transition">
                  <PostCard
                    {...sim}
                    onCategoryClick={cat => router.push(`/forum?category=${cat}`)}
                    onTagClick={tag => router.push(`/forum?tags=${tag}`)}
                    onEdit={id => router.push(`/forum/${id}/edit`)}
                    onDelete={() => {}}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
    </div>
  );
}
