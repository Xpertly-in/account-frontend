"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Button } from "@/ui/Button.ui"; // Assuming Button.ui.tsx exists for button elements
import { MagnifyingGlass, Plus, CaretDown, TrashSimple } from "@phosphor-icons/react";
import { PostCard } from "./PostCard.component";
import { Container } from "@/components/layout/Container.component";
import { usePosts, PostFilter, useDeletePost } from "@/services/posts.service";
import { useCategories } from "@/services/categories.service";
import { useTags } from "@/services/tags.service";
import { useAuth } from "@/store/context/Auth.provider";

export const ForumFeed: React.FC = () => {
  const router = useRouter();
  const { auth } = useAuth();
  const currentUserId = auth.user?.id;

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false); // added
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"recent" | "top">("recent");
  // deletion mutation
  const deletePostMutation = useDeletePost();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  // const [newThread, setNewThread] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);

  // replace manual state + fetch with React-Query hook
  const filterOpts: PostFilter = {
    searchTerm,
    category: filterCategory,
    tags: filterTags,
    sortOption,
  };
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = usePosts(
    filterOpts,
    10
  );
  const posts = data?.pages.flatMap(p => p.data) || [];

  // Click-outside to close dropdowns
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [filterOpen]);
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (sortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [sortOpen]);

  // Infinite scroll triggers next page via React-Query
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY + 100 >= document.documentElement.offsetHeight &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  // replace manual effect+state with React-Query hooks:
  const { data: categoriesList = [] } = useCategories();
  const { data: tagsList = [] } = useTags();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tagsOpen && tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
        setTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tagsOpen]);

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
            onClick={() => router.push("/forum/new")}
            className="p-3 bg-gradient-to-r from-primary to-secondary text-white rounded-full shadow-lg hover:scale-105 transition"
            aria-label="Create new post"
          >
            <Plus size={20} weight="bold" className="mr" />
            Create Post
          </Button>{" "}
        </div>

        {/* Category, Tags, Sort dropdowns */}
        <div className="flex items-center mb-4">
          {/* horizontal line */}
          <div className="flex-1 border-t border-gray-400 dark:border-gray-700" />
          <div className="flex items-center space-x-4 pl-4">
            {/* Category dropdown */}
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setFilterOpen(o => !o)}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                {/* lighter label */}
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Category:
                </span>
                {/* bolder value */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  {filterCategory || "All"}
                </span>
                <CaretDown size={16} />
              </button>
              {filterOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 p-2 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  <ul className="text-sm">
                    <li>
                      <button
                        onClick={() => {
                          setFilterCategory("");
                          setFilterOpen(false);
                        }}
                        className={`block w-full text-left px-2 py-1 ${
                          !filterCategory ? "font-semibold text-primary" : ""
                        }`}
                      >
                        All
                      </button>
                    </li>
                    {categoriesList.map(c => (
                      <li key={c}>
                        <button
                          onClick={() => {
                            setFilterCategory(c);
                            setFilterOpen(false);
                          }}
                          className={`block w-full text-left px-2 py-1 ${
                            filterCategory === c ? "font-semibold text-primary" : ""
                          }`}
                        >
                          {c}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
            {/* Tags dropdown */}
            <div ref={tagsRef} className="relative">
              <button
                onClick={() => setTagsOpen(o => !o)}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                {/* lighter label */}
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">Tags:</span>
                {/* bolder value */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  {filterTags.length > 0 ? filterTags.join(", ") : "All"}
                </span>
                <CaretDown size={16} />
              </button>
              {tagsOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 p-2 shadow-lg border border-gray-200 dark:border-gray-700 z-50 max-h-60 overflow-y-auto">
                  {tagsList.map(tag => (
                    <label
                      key={tag}
                      className="flex items-center space-x-2 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={filterTags.includes(tag)}
                        onChange={() =>
                          setFilterTags(ts =>
                            ts.includes(tag) ? ts.filter(t => t !== tag) : [...ts, tag]
                          )
                        }
                        className="h-4 w-4 text-primary border-gray-300 rounded"
                      />
                      <span>{tag}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
            {/* Sort by dropdown */}
            <div ref={sortRef} className="relative">
              <button
                onClick={() => setSortOpen(o => !o)}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-300 hover:text-primary"
              >
                {/* lighter label */}
                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Sort by:
                </span>
                {/* bolder value */}
                <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200">
                  {sortOption[0].toUpperCase() + sortOption.slice(1)}
                </span>
                <CaretDown size={16} />
              </button>
              {sortOpen && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 p-2 shadow-lg border border-gray-200 dark:border-gray-700 z-50">
                  {(["recent", "top"] as const).map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setSortOption(opt);
                        setSortOpen(false);
                      }}
                      className={`block w-full text-left px-2 py-1 text-sm ${
                        sortOption === opt ? "font-semibold text-primary" : ""
                      }`}
                    >
                      {opt[0].toUpperCase() + opt.slice(1)}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-2">
          {posts.map(post => (
            <Card
              key={post.id}
              className="overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition py-2"
            >
              <PostCard
                {...post}
                onCategoryClick={cat => setFilterCategory(cat)}
                onTagClick={tag => setFilterTags(ts => (ts.includes(tag) ? ts : [...ts, tag]))}
                onEdit={id => router.push(`/forum/${id}/edit`)}
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
            </Card>
          ))}
          {isLoading && <p className="text-center text-gray-600 dark:text-gray-400">Loading…</p>}
          {!hasNextPage && !isLoading && (
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
              <button
                onClick={() => setDeleteDialogOpen(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (deleteTarget !== null) deletePostMutation.mutate(deleteTarget);
                  setDeleteDialogOpen(false);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
