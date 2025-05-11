'use client';

import Link from 'next/link';
import { Heart, ChatCircle, Clock } from '@phosphor-icons/react';
import { Post } from '@/types/forum.types';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';

interface PostCardProps {
  post: Post;
  viewMode: 'grid' | 'list';
}

export function PostCard({ post, viewMode }: PostCardProps) {
  return (
    <div className={`p-4 rounded-lg border bg-card hover:shadow-md transition-shadow ${
      viewMode === 'grid' ? 'h-full' : ''
    }`}>
      <div className="flex items-start gap-3">
        {post.author_id}
      </div>

      <p className="mt-3 text-sm line-clamp-3">{post.content}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
          >
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <Heart size={16} weight="fill" />
          <span>{post.likes_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <ChatCircle size={16} weight="fill" />
          <span>{post.comment_count}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={16} weight="fill" />
          <span>{formatDistanceToNow(new Date(post.created_at), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  );
} 