'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, ChatCircle, Clock, User, Pencil, Trash } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Comment, CreateCommentInput } from '@/types/forum.types';
import { cn } from '@/lib/utils';

interface CommentSectionProps {
  postId: string;
}

export function CommentSection({ postId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const [newComment, setNewComment] = useState('');
  const [isLiked, setIsLiked] = useState<Record<number, boolean>>({});

  // Fetch comments
  const { data: comments, isLoading } = useQuery<Comment[]>({
    queryKey: ['comments', postId],
    queryFn: async () => {
      const response = await fetch(`/api/forum/${postId}/comments`);
      if (!response.ok) throw new Error('Failed to fetch comments');
      return response.json();
    },
  });

  // Create comment mutation
  const createCommentMutation = useMutation({
    mutationFn: async (input: CreateCommentInput) => {
      const response = await fetch(`/api/forum/${postId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error('Failed to create comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setNewComment('');
    },
  });

  // Like/Unlike comment mutation
  const likeCommentMutation = useMutation({
    mutationFn: async ({ commentId }: { commentId: number }) => {
      const response = await fetch(`/api/forum/comments/${commentId}/like`, {
        method: isLiked[commentId] ? 'DELETE' : 'POST',
      });
      if (!response.ok) throw new Error('Failed to update like');
      return response.json();
    },
    onSuccess: (_, { commentId }) => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      setIsLiked(prev => ({ ...prev, [commentId]: !prev[commentId] }));
    },
  });

  // Delete comment mutation
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: number) => {
      const response = await fetch(`/api/forum/comments/${commentId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete comment');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments', postId] });
    },
  });

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    createCommentMutation.mutate({
      content: newComment,
      post_id: parseInt(postId),
    });
  };

  if (isLoading) {
    return <CommentSectionSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Comment Form */}
      <form onSubmit={handleSubmitComment} className="space-y-4">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="w-full min-h-[100px] p-3 rounded-lg border bg-background"
          required
        />
        <Button type="submit" disabled={createCommentMutation.isPending}>
          Post Comment
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-6">
        {comments?.map((comment) => (
          <div key={comment.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User size={20} />
                <span className="font-medium">{comment.author_id}</span>
              </div>
              <div className="flex items-center gap-2">
                <time className="text-sm text-muted-foreground">
                  {new Date(comment.created_at).toLocaleDateString()}
                </time>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteCommentMutation.mutate(comment.id)}
                >
                  <Trash size={16} />
                </Button>
              </div>
            </div>

            <p className="text-sm">{comment.content}</p>

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => likeCommentMutation.mutate({ commentId: comment.id })}
                className={cn(
                  'flex items-center gap-1',
                  isLiked[comment.id] && 'text-primary'
                )}
              >
                <Heart size={16} weight={isLiked[comment.id] ? 'fill' : 'regular'} />
                <span>{comment.likes_count}</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="flex items-center gap-1"
              >
                <ChatCircle size={16} />
                <span>Reply</span>
              </Button>
            </div>

            {/* Nested Comments */}
            {comment.replies && comment.replies.length > 0 && (
              <div className="ml-8 mt-4 space-y-4">
                {comment.replies.map((reply) => (
                  <div key={reply.id} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <User size={16} />
                        <span className="font-medium">{reply.author_id}</span>
                      </div>
                      <time className="text-sm text-muted-foreground">
                        {new Date(reply.created_at).toLocaleDateString()}
                      </time>
                    </div>
                    <p className="text-sm">{reply.content}</p>
                    <div className="flex items-center gap-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => likeCommentMutation.mutate({ commentId: reply.id })}
                        className={cn(
                          'flex items-center gap-1',
                          isLiked[reply.id] && 'text-primary'
                        )}
                      >
                        <Heart size={16} weight={isLiked[reply.id] ? 'fill' : 'regular'} />
                        <span>{reply.likes_count}</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function CommentSectionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="space-y-2">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-16 w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 