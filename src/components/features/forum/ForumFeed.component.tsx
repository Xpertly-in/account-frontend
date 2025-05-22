"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { MagnifyingGlass, Funnel, Sliders, X } from "@phosphor-icons/react";
import { PostCard, PostCardProps } from "./PostCard.component";
import { Input } from "@/ui/Input.ui";
import { Container } from "@/components/layout/Container.component";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";

export const ForumFeed: React.FC = () => {
  // example data fetch
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // add pagination state
  const PAGE_SIZE = 10;
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"recent" | "trending">("recent");

  // refs for dropdowns
  const filterRef = useRef<HTMLDivElement>(null);
  const sortRef = useRef<HTMLDivElement>(null);

  // close filter if clicked outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (filterOpen && filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [filterOpen]);

  // close sort if clicked outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (sortOpen && sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [sortOpen]);

  // ↓ lift out fetch logic so we can re-use it
  const fetchPosts = useCallback(
    async (pageNumber = 0) => {
      setIsLoading(true);

      // Base query (excluding deleted)
      let query = supabase.from("posts").select("*").eq("is_deleted", false);

      // Search
      if (searchTerm) {
        query = query.or(`content.ilike.%${searchTerm}%`);
      }

      // Category filter
      if (filterCategory) {
        query = query.eq("category", filterCategory);
      }

      // Tags filter (array contains)
      if (filterTags.length) {
        query = query.contains("tags", filterTags);
      }

      // Sort: trending=likes_count, recent=updated_at
      const sortCol = sortOption === "trending" ? "likes_count" : "updated_at";
      query = query.order(sortCol, { ascending: false });

      // Apply pagination
      const from = pageNumber * PAGE_SIZE;
      const to = from + PAGE_SIZE - 1;
      query = query.range(from, to);

      const { data, error } = await query;
      if (error) {
        console.error("Error fetching posts:", error);
      } else {
        const mapped = data.map(p => ({
          id: p.id,
          created_at: p.created_at,
          updated_at: p.updated_at,
          content: p.content,
          author_id: p.author_id,
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

  // reset pagination when filters/search/sort change
  useEffect(() => {
    setPage(0);
    setHasMore(true);
    setPosts([]);
  }, [searchTerm, filterCategory, filterTags, sortOption]);

  // fetch posts on mount and when page changes
  useEffect(() => {
    fetchPosts(page);
  }, [fetchPosts, page]);

  // {{ edit_5 }} infinite-scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop + 100 >=
          document.documentElement.offsetHeight &&
        !isLoading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isLoading, hasMore]);

  // fetch category & tag enums from Supabase
  const [categoriesList, setCategoriesList] = useState<string[]>([]);
  const [tagsList, setTagsList] = useState<string[]>([]);
  useEffect(() => {
    const loadEnums = async () => {
      const { data: cData } = await supabase.from("categories").select("name");
      setCategoriesList(cData?.map(c => c.name) ?? []);
      const { data: tData } = await supabase.from("tags").select("name");
      setTagsList(tData?.map(t => t.name) ?? []);
    };
    loadEnums();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <Container className="space-y-12 !max-w-2xl">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100">
            Community Forum
          </h2>
          <div className="mt-2 h-1 w-20 bg-primary mx-auto rounded-full" />
        </div>
        {/* Search + Filter/Sort Icons */}
        <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 flex flex-col sm:flex-row items-center gap-4">
          <MagnifyingGlass size={20} className="text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search posts…"
            className="flex-1 border-primary/50 shadow-sm"
            value={searchTerm}
            onChange={e => setSearchTerm(e.currentTarget.value)}
          />
          <div ref={filterRef} className="relative">
            <button
              onClick={() => setFilterOpen(o => !o)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Funnel size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            {filterOpen && (
              <div className="absolute top-full right-0 mt-2 w-64 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-4 z-10">
                <div className="mb-4">
                  <label className="text-sm font-medium block mb-1">Category</label>
                  <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full rounded border bg-transparent px-2 py-1 text-sm"
                  >
                    <option value="">All Categories</option>
                    {categoriesList.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium block mb-1">Tags</label>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-auto">
                    {tagsList.map(tag => (
                      <button
                        key={tag}
                        type="button"
                        onClick={() =>
                          setFilterTags(ts =>
                            ts.includes(tag) ? ts.filter(t => t !== tag) : [...ts, tag]
                          )
                        }
                        className={`px-2 py-1 text-xs rounded-full ${
                          filterTags.includes(tag)
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-600 dark:text-gray-300"
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setFilterOpen(false)}
                    className="px-3 py-1 bg-primary text-white rounded text-sm"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
          <div ref={sortRef} className="relative">
            <button
              onClick={() => setSortOpen(o => !o)}
              className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Sliders size={20} className="text-gray-500 dark:text-gray-400" />
            </button>
            {sortOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-gray-700 rounded-lg shadow-lg p-2 z-10">
                {["recent", "trending"].map(opt => (
                  <button
                    key={opt}
                    onClick={() => {
                      setSortOption(opt as any);
                      setSortOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1 text-sm rounded ${
                      sortOption === opt
                        ? "bg-primary text-white"
                        : "hover:bg-gray-100 dark:hover:bg-gray-600"
                    }`}
                  >
                    {opt[0].toUpperCase() + opt.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Active Filters */}
        <div className="flex flex-wrap gap-2">
          {searchTerm && (
            <span className="flex items-center gap-1 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 px-2 py-1 rounded-full text-sm">
              Search: "{searchTerm}"
              <X size={14} className="cursor-pointer" onClick={() => setSearchTerm("")} />
            </span>
          )}
          {filterCategory && (
            <span className="flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-sm">
              Category: {filterCategory}
              <X size={14} className="cursor-pointer" onClick={() => setFilterCategory("")} />
            </span>
          )}
          {filterTags.map(tag => (
            <span
              key={tag}
              className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm"
            >
              #{tag}
              <X
                size={14}
                className="cursor-pointer"
                onClick={() => setFilterTags(ts => ts.filter(t => t !== tag))}
              />
            </span>
          ))}
          {sortOption !== "recent" && (
            <span className="flex items-center gap-1 bg-secondary/10 text-secondary px-2 py-1 rounded-full text-sm">
              Sort: {sortOption[0].toUpperCase() + sortOption.slice(1)}
              <X size={14} className="cursor-pointer" onClick={() => setSortOption("recent")} />
            </span>
          )}
          {(searchTerm || filterCategory || filterTags.length > 0 || sortOption !== "recent") && (
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterCategory("");
                setFilterTags([]);
                setSortOption("recent");
              }}
              className="text-sm text-red-500 hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
        {/* Floating “new post” */}
        <Link
          href="/forum/new"
          title="Create New Post"
          className="fixed bottom-10 right-6 z-50 bg-primary text-white p-4 rounded-full shadow-lg transition-transform duration-200 ease-out hover:bg-primary/90 hover:scale-110 hover:shadow-xl"
          aria-label="Create new post"
        >
          <Plus size={24} weight="fill" />
        </Link>
        {/* Posts Grid */}
        <div className="space-y-6">
          {posts.map(post => (
            <div
              key={post.id}
              className="transition-transform transform hover:-translate-y-1 hover:shadow-xl"
            >
              <PostCard
                {...post}
                onCategoryClick={cat => setFilterCategory(cat)}
                onTagClick={tag => setFilterTags(ts => (ts.includes(tag) ? ts : [...ts, tag]))}
              />
            </div>
          ))}
        </div>
        {isLoading && <div className="text-center py-6 text-gray-500">Loading more posts…</div>}
        {!hasMore && !isLoading && (
          <div className="text-center py-6 text-gray-500">No more posts.</div>
        )}
      </Container>
    </div>
  );
};
