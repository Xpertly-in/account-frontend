// src/components/features/feed/CommentSection.component.tsx
"use client";
import React, { useState } from "react";
import {
  useComments,
  useCreateComment,
  useDeleteComment,
  useUpdateComment,
} from "@/services/comments.service";
import { useAuth } from "@/store/context/Auth.provider";
import { useRouter, usePathname } from "next/navigation";
import { CommentForm } from "./CommentForm.component";
import { CommentItem } from "./CommentItem.component";

export const CommentSection: React.FC<{ postId: number }> = ({ postId }) => {
  const { auth } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const { data: comments = [], isLoading } = useComments(postId);
  const create = useCreateComment();
  const deleteComment = useDeleteComment();
  const updateComment = useUpdateComment();
  const [replyTo, setReplyTo] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  if (isLoading) return <p>Loading comments…</p>;

  const handleSubmit = (parent_id: number | undefined) => async (c: string, a: string[]) => {
    // redirect to login if not authenticated
    if (!auth.isLoading && !auth.user) {
      localStorage.setItem("postLoginRedirect", pathname);
      router.push("/login/ca");
      return;
    }
    await create.mutateAsync({ post_id: postId, parent_id, content: c, images: a });
    setReplyTo(null);
  };

  const handleDelete = (id: number) => {
    if (confirm("Delete this comment?")) deleteComment.mutate(id);
  };

  const handleUpdate = (content: string) => {
    if (editingId !== null) {
      updateComment.mutate({ id: editingId, content });
      setEditingId(null);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <CommentForm onSubmit={handleSubmit(undefined)} />
      {comments.map(c => (
        <div key={c.id}>
          {editingId === c.id ? (
            <CommentForm initialContent={c.content} onSubmit={content => handleUpdate(content)} />
          ) : (
            <CommentItem
              comment={c}
              onReply={() => setReplyTo(c.id)}
              onEdit={() => setEditingId(c.id)}
              onDelete={() => handleDelete(c.id)}
            />
          )}
          {replyTo === c.id && (
            <div className="pl-8">
              <CommentForm parent_id={c.id} onSubmit={handleSubmit(c.id)} />
            </div>
          )}
          {c.replies?.map(r => (
            <div key={r.id} className="pl-8">
              {editingId === r.id ? (
                <CommentForm
                  initialContent={r.content}
                  onSubmit={newContent => handleUpdate(newContent)}
                />
              ) : (
                <CommentItem
                  comment={r}
                  onEdit={() => setEditingId(r.id)}
                  onDelete={() => handleDelete(r.id)}
                />
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
