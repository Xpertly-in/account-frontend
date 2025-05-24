"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { Input } from "@/ui/Input.ui";
import { Button } from "@/ui/Button.ui"; // Assuming Button.ui.tsx exists for button elements
import { MagnifyingGlass, Funnel, Sliders, Plus, X, Tag } from "@phosphor-icons/react";
import { PostCard, PostCardProps } from "./PostCard.component";
import { Container } from "@/components/layout/Container.component";
import { useAuth } from "@/store/context/Auth.provider";

export const ForumFeed: React.FC = () => {
  const router = useRouter();
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const { auth } = useAuth();
  const currentUserId = auth.user?.id;
  const [isLoading, setIsLoading] = useState(true);

  const PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [tagsOpen, setTagsOpen] = useState(false); // added
  const [filterCategory, setFilterCategory] = useState("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"recent" | "trending">("recent");

  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);

  // const [newThread, setNewThread] = useState("");
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);
  const tagsRef = useRef<HTMLDivElement>(null);
  // // dynamic placeholder messages for the “Start a new thread” input
  // const threadPlaceholders = [
  //   "Start a new thread…",
  //   "Ask your accounting question here…",
  //   "Share your audit tips…",
  //   "Discuss tax strategies…",
  //   "Post your bookkeeping challenge…",
  // ];
  // const [threadPlaceholder, setThreadPlaceholder] = useState(
  //   threadPlaceholders[Math.floor(Math.random() * threadPlaceholders.length)]
  // );
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     const next = threadPlaceholders[Math.floor(Math.random() * threadPlaceholders.length)];
  //     setThreadPlaceholder(next);
  //   }, 3000); // rotate every 8s
  //   return () => clearInterval(interval);
  // }, []);

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

  // Fetch posts from Supabase
  const fetchPosts = useCallback(
    async (pageNumber = 0) => {
      setIsLoading(true);

      // join profiles so we get the user’s display name
      let query = supabase
        .from("posts")
        .select(
          `
          id,
          title,
          content,
          category,
          tags,
          images,
          likes_count,
          comment_count,
          updated_at,
          is_deleted,
          author_id,
          profiles (
            name,
            profile_picture
          )
          `
        )
        .eq("is_deleted", false);
      // let query = supabase.from("posts").select("*").eq("is_deleted", false);

      if (searchTerm) query = query.ilike("content", `%${searchTerm}%`);
      if (filterCategory) query = query.eq("category", filterCategory);
      if (filterTags.length) query = query.contains("tags", filterTags);

      const sortCol = sortOption === "trending" ? "likes_count" : "updated_at";
      query = query.order(sortCol, { ascending: false });

      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (!error && data) {
        const mapped = data.map(p => ({
          id: p.id,
          updated_at: p.updated_at,
          title: p.title,
          content: p.content,
          author_id: p.author_id,
          author_name: p.profiles.name,
          author_avatar: p.profiles.profile_picture,
          category: p.category,
          tags: p.tags,
          images: p.images,
          likes_count: p.likes_count,
          comment_count: p.comment_count,
          is_deleted: p.is_deleted,
        }));
        setPosts(prev => (pageNumber === 0 ? mapped : [...prev, ...mapped]));
        setHasMore(mapped.length === PAGE_SIZE);
      }
      setIsLoading(false);
    },
    [searchTerm, filterCategory, filterTags, sortOption]
  );

  // Reset when filters change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setPosts([]);
  }, [searchTerm, filterCategory, filterTags, sortOption]);

  // Initial & paginated fetch
  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  // Infinite scroll
  useEffect(() => {
    const onScroll = () => {
      if (
        window.innerHeight + window.scrollY + 100 >= document.documentElement.offsetHeight &&
        !isLoading &&
        hasMore
      ) {
        setPage(p => p + 1);
      }
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isLoading, hasMore]);

  // Load category & tag enums
  useEffect(() => {
    supabase
      .from("categories")
      .select("name")
      .then(({ data }) => setCategoriesList(data?.map(c => c.name) ?? []));
    supabase
      .from("tags")
      .select("name")
      .then(({ data }) => setTagsList(data?.map(t => t.name) ?? []));
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (tagsOpen && tagsRef.current && !tagsRef.current.contains(e.target as Node)) {
        setTagsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [tagsOpen]);

  // const handleAddThread = () => {
  //   if (newThread.trim()) {
  //     router.push(`/forum/new?initialContent=${encodeURIComponent(newThread.trim())}`);
  //   }
  // };

  return (
    <div className="relative overflow-hidden min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 py-4">
      {/* Decorative Blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 w-72 h-72 rounded-full bg-gradient-to-tr from-purple-300 to-indigo-300 blur-2xl opacity-30 dark:opacity-20" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-pink-300 to-yellow-300 blur-2xl opacity-30 dark:opacity-20" />

      <Container className="max-w-3xl space-y-8">
        {/* Simplified Search & Filters */}
        <div className="flex items-center mb-6 space-x-3">
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
            <Plus size={20} weight="bold" className="mr-2" />
            Create Post
          </Button>{" "}
        </div>

        {/* replace old “Hero” input with single Create button */}

        {/* Bottom fixed Filter & Sort bar */}
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex z-20">
          <div ref={filterRef} className="flex-1 relative">
            <button
              onClick={() => setFilterOpen(o => !o)}
              className="w-full py-3 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Funnel size={20} />
              <span className="text-sm">Filter</span>
            </button>
            {filterOpen && (
              <div className="absolute bottom-12 left-0 right-0 bg-white dark:bg-gray-800 p-4 shadow-lg border-t border-gray-200 dark:border-gray-700 z-30">
                {/* Category */}
                <div className="mb-4">
                  <label className="text-sm font-medium">Category</label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full mt-1 border rounded px-2 py-1"
                  >
                    <option value="">All Categories</option>
                    {categoriesList.map(c => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                {/* Tags */}
                <div>
                  <label className="text-sm font-medium">Tags</label>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {tagsList.map(tag => (
                      <button
                        key={tag}
                        onClick={() =>
                          setFilterTags(ts =>
                            ts.includes(tag) ? ts.filter(t => t !== tag) : [...ts, tag]
                          )
                        }
                        className={`px-2 py-1 rounded-full text-sm border ${
                          filterTags.includes(tag)
                            ? "bg-primary text-white"
                            : "border-gray-300 dark:border-gray-600"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          <div ref={sortRef} className="flex-1 relative">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="w-full py-3 flex items-center justify-center space-x-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sliders size={20} />
              <span className="text-sm">Sort</span>
            </button>
            {sortOpen && (
              <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-800 p-4 shadow-lg border-t border-gray-200 dark:border-gray-700 z-30">
                {(["recent", "trending"] as const).map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt);
                      setSortOpen(false);
                    }}
                    className="block w-full text-left px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Posts List */}
        <div className="space-y-6">
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
                onDelete={async id => {
                  // guard: only the post’s author may delete
                  if (!currentUserId || currentUserId !== post.author_id) {
                    alert("You are not authorized to delete this post");
                    return;
                  }
                  if (!confirm("Delete this post?")) return;
                  await supabase.from("posts").update({ is_deleted: true }).eq("id", id);
                  setPosts(prev => prev.filter(p => p.id !== id));
                }}
              />
            </Card>
          ))}
          {isLoading && <p className="text-center text-gray-600 dark:text-gray-400">Loading…</p>}
          {!hasMore && !isLoading && (
            <p className="text-center text-gray-600 dark:text-gray-400">No more posts</p>
          )}
        </div>
      </Container>
    </div>
  );
};
