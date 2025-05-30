// src/components/features/forum/CommentSection.component.tsx
"use client";
import React, { useState } from "react";
import { useComments, useCreateComment } from "@/services/comments.service";
import { CommentForm } from "./CommentForm.component";
import { CommentItem } from "./CommentItem.component";

export const CommentSection: React.FC<{ postId: number }> = ({ postId }) => {
  const { data: comments = [], isLoading } = useComments(postId);
  const create = useCreateComment();
  const [replyTo, setReplyTo] = useState<number | null>(null);

  if (isLoading) return <p>Loading comments…</p>;

  const handleSubmit = (parent_id: number | undefined) => async (c: string, a: string[]) => {
    await create.mutateAsync({ post_id: postId, parent_id, content: c, images: a });
    setReplyTo(null);
  };

  return (
    <div className="mt-6 space-y-4">
      <CommentForm onSubmit={handleSubmit(undefined)} />
      {comments.map(c => (
        <div key={c.id}>
          <CommentItem comment={c} onReply={() => setReplyTo(c.id)} />
          {replyTo === c.id && (
            <div className="pl-8">
              <CommentForm parent_id={c.id} onSubmit={handleSubmit(c.id)} />
            </div>
          )}
          {c.replies?.map(r => (
            <div key={r.id} className="pl-8">
              <CommentItem comment={r} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};
