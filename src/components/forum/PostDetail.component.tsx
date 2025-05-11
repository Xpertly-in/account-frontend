'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { Heart, ChatCircle, Share, Clock, Pencil, Trash, User } from '@phosphor-icons/react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Post } from '@/types/forum.types';
import { cn } from '@/lib/utils';
import { CommentSection } from './CommentSection.component';

interface PostDetailProps {
  postId: string;
}

export function PostDetail({ postId }: PostDetailProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isLiked, setIsLiked] = useState(false);

  // Fetch post details
  const { data: post, isLoading, error } = useQuery<Post>({
    queryKey: ['post', postId],
    queryFn: async () => {
      const response = await fetch(`/api/forum/${postId}`);
      if (!response.ok) throw new Error('Failed to fetch post');
      return response.json();
    },
  });

  // Like/Unlike mutation
  const likeMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/forum/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
      });
      if (!response.ok) throw new Error('Failed to update like');
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['post', postId] });
      setIsLiked(!isLiked);
    },
  });

  // Delete post mutation
  const deleteMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch(`/api/forum/${postId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete post');
      return response.json();
    },
    onSuccess: () => {
      router.push('/forum');
    },
  });

  // Share post
  const handleShare = async () => {
    try {
      await navigator.share({
        title: post?.title,
        text: post?.content,
        url: window.location.href,
      });
    } catch (error) {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(window.location.href);
      // TODO: Show toast notification
    }
  };

  if (isLoading) {
    return <PostDetailSkeleton />;
  }

  if (error || !post) {
    return (
      <div className="text-center py-8 text-destructive">
        <p>Failed to load post. Please try again later.</p>
        <Button
          variant="outline"
          onClick={() => window.location.reload()}
          className="mt-4"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Post Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">{post.title}</h1>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push(`/forum/${postId}/edit`)}
            >
              <Pencil size={20} />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => deleteMutation.mutate()}
              className="text-destructive"
            >
              <Trash size={20} />
            </Button>
          </div>
        </div>

        {/* Author and Metadata */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <User size={20} />
            <span>{post.author_id}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString()}
            </time>
          </div>
        </div>
      </div>

      {/* Post Content */}
      <div className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none mb-8">
        <p>{post.content}</p>
      </div>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded-full bg-secondary text-secondary-foreground"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Interaction Bar */}
      <div className="flex items-center justify-between border-t border-b py-4 mb-8">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => likeMutation.mutate()}
            className={cn(
              'flex items-center gap-1',
              isLiked && 'text-primary'
            )}
          >
            <Heart size={20} weight={isLiked ? 'fill' : 'regular'} />
            <span>{post.likes_count}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <ChatCircle size={20} />
            <span>{post.comment_count}</span>
          </Button>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-1"
        >
          <Share size={20} />
          <span>Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Comments</h2>
        <CommentSection postId={postId} />
      </div>
    </div>
  );
}

function PostDetailSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="space-y-4">
        <Skeleton className="h-8 w-3/4" />
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="h-32 w-full" />
      <div className="flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <div className="flex items-center justify-between border-t border-b py-4">
        <div className="flex gap-4">
          <Skeleton className="h-8 w-16" />
          <Skeleton className="h-8 w-16" />
        </div>
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
} 