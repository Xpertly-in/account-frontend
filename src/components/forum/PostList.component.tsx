'use client';

import { useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Post, PostQueryParams } from '@/types/forum.types';
import { PostCard } from './PostCard.component';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Loader2 } from 'lucide-react';

interface PostListProps {
  initialPosts?: Post[];
  viewMode: 'grid' | 'list';
  queryParams: PostQueryParams;
}

export function PostList({ initialPosts, viewMode, queryParams }: PostListProps) {
  const [page, setPage] = useState(1);

  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isPending,
    isError,
  } = useInfiniteQuery({
    queryKey: ['posts', queryParams],
    queryFn: async ({ pageParam = 1 }) => {
      const params = new URLSearchParams();
      params.append('page', pageParam.toString());
      params.append('limit', '10');
      
      if (queryParams.search) params.append('search', queryParams.search);
      if (queryParams.category) params.append('category', queryParams.category);
      if (queryParams.tags?.length) params.append('tags', queryParams.tags.join(','));
      if (queryParams.sortBy) params.append('sortBy', queryParams.sortBy);
      if (queryParams.sortOrder) params.append('sortOrder', queryParams.sortOrder);

      const response = await fetch(`/api/forum?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (!lastPage.pagination.hasMore) return undefined;
      return lastPage.pagination.page + 1;
    },
    initialData: initialPosts
      ? {
          pages: [
            {
              data: initialPosts,
              pagination: {
                total: initialPosts.length,
                page: 1,
                limit: 10,
                hasMore: false,
              },
            },
          ],
          pageParams: [1],
        }
      : undefined,
  });

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  const posts = data.pages.flatMap((page) => page.data);

  if (posts.length === 0) {
    return (
      <div className="text-center text-muted-foreground py-8">
        No posts found
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
            : 'space-y-4'
        }
      >
        {posts.map((post: Post) => (
          <PostCard key={post.id} post={post} viewMode={viewMode} />
        ))}
      </div>

      {hasNextPage && (
        <div className="flex justify-center pt-4">
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="px-4 py-2 text-sm font-medium text-primary hover:text-primary/80 disabled:opacity-50"
          >
            {isFetchingNextPage ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              'Load More'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function PostListSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
          : 'space-y-4'
      }
    >
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="p-4 rounded-lg border bg-card space-y-3"
        >
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-20 w-full" />
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
      ))}
    </div>
  );
} 