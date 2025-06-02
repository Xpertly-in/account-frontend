"use client";

import React, { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDeletePost, usePost, useSimilarPosts } from "@/services/posts.service";
import { CommentSection } from "@/components/features/feed/comment/CommentSection.component";
import { Container } from "@/components/layout/Container.component";
import { Card } from "@/ui/Card.ui";
import { PostCard } from "@/components/features/feed/post/PostCard.component";
import Link from "next/link";
import { useComments } from "@/services/comments.service";
import { useAuth } from "@/store/context/Auth.provider";
import { TrashSimple } from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { auth } = useAuth();
  const currentUserId = auth.user?.id;
  const postId = Number(id);

  const { data: post, isLoading: postLoading } = usePost(postId);
  const { data: comments = [] } = useComments(postId);
  const { data: similarPosts = [], isLoading: similarLoading } = useSimilarPosts(
    postId,
    post?.category,
    post?.tags
  );

  // deletion mutation
  const deletePostMutation = useDeletePost();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  if (postLoading || !post) {
    return <div className="text-center py-12">Loading post…</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-primary/30 dark:from-primary-dark/10 dark:to-primary-dark/30 py-4">
      <Container className="max-w-3xl py-4">
        {/* Back button */}
        <Link href="/feed">
          <button className="flex items-center gap-2 text-primary hover:underline mb-4">
            &lt; Back to Feed
          </button>
        </Link>

        {/* Post Detail */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-4 md:p-6">
          <PostCard
            {...post}
            onEdit={id => router.push(`/feed/${id}/edit`)}
            onDelete={id => {
              // guard: only the post’s author may delete
              if (!currentUserId || currentUserId !== post.author_id) {
                alert("You are not authorized to delete this post");
                return;
              }
              // open confirmation dialog
              setDeleteTarget(id);
              setDeleteDialogOpen(true);
            }}
          />
          {/* comments */}
          <CommentSection postId={postId} comments={comments} />
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
                    onCategoryClick={cat => router.push(`/feed?category=${cat}`)}
                    onTagClick={tag => router.push(`/feed?tags=${tag}`)}
                    onEdit={id => router.push(`/feed/${id}/edit`)}
                    onDelete={() => {}}
                  />
                </Card>
              ))}
            </div>
          </div>
        )}
      </Container>
      {/* Delete confirmation modal */}
      {deleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-80">
            <TrashSimple size={24} className="mx-auto text-red-500 mb-2" />
            <h2 className="text-lg font-semibold text-center mb-2">Confirm Delete Post?</h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 text-center">
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (deleteTarget !== null) deletePostMutation.mutate(deleteTarget);
                  setDeleteDialogOpen(false);
                  router.push("/feed");
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
