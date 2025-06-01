"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Button } from "@/ui/Button.ui"; // Assuming Button.ui.tsx exists for button elements
import { MagnifyingGlass, Plus, TrashSimple } from "@phosphor-icons/react";
import { PostCard } from "./post/PostCard.component";
import { Container } from "@/components/layout/Container.component";
import { usePosts, useDeletePost } from "@/services/posts.service";
import { useCategories } from "@/services/categories.service";
import { useTags } from "@/services/tags.service";
import { useAuth } from "@/store/context/Auth.provider";
import { Select } from "@/ui/Select.ui";
import { Combobox } from "@/ui/Combobox.ui";
import { PostCardSkeleton } from "./post/PostCardSkeleton.component";
import { PostFilter } from "@/types/feed/post.type";
import { useDebounce } from "@/hooks/useDebounce";

export const Feed: React.FC = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const currentUserId = auth.user?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortOption, setSortOption] = useState<"recent" | "top">("recent");
  // deletion mutation
  const deletePostMutation = useDeletePost();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // replace manual effect+state with React-Query hooks:
  const { data: categoriesList = [] } = useCategories();
  const { data: tagsList = [] } = useTags();

  // memoize filter object so queryKey stays stable
  const filterOpts = useMemo<PostFilter>(
    () => ({
      searchTerm: debouncedSearchTerm,
      category: filterCategory,
      tags: filterTags,
      sortOption,
    }),
    [debouncedSearchTerm, filterCategory, filterTags, sortOption]
  );
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(
    filterOpts,
    10
  );
  const posts = data?.pages.flatMap(p => p.data) || [];

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!sentinelRef.current) return;
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { rootMargin: "100px" }
    );
    observer.observe(sentinelRef.current);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-6">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-300 blur-2xl opacity-30 dark:opacity-20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-300 to-yellow-300 blur-2xl opacity-30 dark:opacity-20" />

      <Container className="max-w-3xl space-y-4">
        {/* Simplified Search & Filters */}
        <div className="flex items-center mb-4 space-x-3">
          <div className="relative flex-1 bg-white rounded-full">
            <MagnifyingGlass
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <Input
              placeholder="Search posts…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.currentTarget.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-full focus:ring-primary focus:border-primary"
            />
          </div>
          <Button
            onClick={() => router.push("/feed/new")}
            className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:scale-105 transition"
            aria-label="Create new post"
          >
            <Plus size={20} weight="bold" className="mr" />
            Create Post
          </Button>{" "}
        </div>

        {/* Category, Tags & Sort inline filters */}
        {/* Category, Tags & Sort inline filters */}
        <div className="flex items-center mb-4">
          {/* horizontal divider */}
          <div className="flex-1 border-t border-gray-300 dark:border-gray-700" />
          <div className="flex items-center space-x-4 pl-4 text-sm text-gray-600 dark:text-gray-300">
            {/* Category */}
            <div className="flex items-center space-x-1 cursor-pointer whitespace-nowrap">
              <span>Category:</span>
              <Combobox
                options={[
                  { value: "", label: "All" },
                  ...categoriesList.map(c => ({ value: c, label: c })),
                ]}
                value={filterCategory}
                onValueChange={v => setFilterCategory(v as string)}
                placeholder="All"
                searchPlaceholder="Search categories…"
                className="!w-auto bg-transparent border-none p-0 text-sm focus:ring-0"
              />
            </div>
            {/* Tags */}
            <div className="flex items-center space-x-1 cursor-pointer whitespace-nowrap">
              <span>Tags:</span>
              <Combobox
                multiple
                options={tagsList.map(tag => ({ value: tag, label: tag }))}
                value={filterTags}
                onValueChange={v => setFilterTags(v as string[])}
                placeholder="All"
                searchPlaceholder="Search tags…"
                className="!w-auto bg-transparent border-none p-0 text-sm focus:ring-0"
              />
            </div>
            {/* Sort */}
            <div className="flex items-center space-x-1 cursor-pointer whitespace-nowrap">
              <span>Sort by:</span>
              <Select
                value={sortOption}
                onChange={e => setSortOption(e.target.value as "recent" | "top")}
                className="!w-auto !bg-transparent !border-none !px-0 !pr-8 !py-0 !ring-0 focus:!ring-0 text-sm hover:text-primary"
              >
                <option value="recent">Recent</option>
                <option value="top">Top</option>
              </Select>
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-2">
          {/* Initial load skeletons */}
          {isLoading &&
            posts.length === 0 &&
            [...Array(3)].map((_, i) => <PostCardSkeleton key={i} />)}

          {/* Empty-state when no posts match filters */}
          {!isLoading && posts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No posts found
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
                We couldn’t find any posts matching your search or filters.
              </p>
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("");
                  setFilterCategory("");
                  setFilterTags([]);
                }}
              >
                Clear filters
              </Button>
            </div>
          )}
          {/* Actual posts */}
          {!isLoading &&
            posts.map(post => (
              <Card
                key={post.id}
                className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition py-2"
                onClick={() => router.push(`/feed/${post.id}`)}
              >
                <PostCard {...post} /* … */ />
              </Card>
            ))}
          {/* Sentinel for infinite scroll */}
          <div ref={sentinelRef} className="h-1" />
          {/* “Load more” skeleton */}
          {isFetchingNextPage && <PostCardSkeleton />}
          {/* End‐of‐feed message */}
          {!hasNextPage && !isLoading && !isFetchingNextPage && posts.length > 0 && (
            <p className="text-center text-gray-600 dark:text-gray-400">No more posts</p>
          )}
        </div>
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
};
