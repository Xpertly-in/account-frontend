"use client";

import React, { useEffect, useState, useMemo, useCallback } from "react";
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import { MagnifyingGlass, Funnel, Sliders } from "@phosphor-icons/react";
import { PostCard, PostCardProps } from "./PostCard.component";
import { Input } from "@/ui/Input.ui";
import { Container } from "@/components/layout/Container.component";
import Link from "next/link";
import { Plus } from "@phosphor-icons/react";

export const ForumFeed: React.FC = () => {
  // example data fetch
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortOpen, setSortOpen] = useState(false);
  const [sortOption, setSortOption] = useState<"recent" | "trending">("recent");

  // ↓ lift out fetch logic so we can re-use it
  const fetchPosts = useCallback(async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("is_deleted", false)
      .order("updated_at", { ascending: false });
    if (error) {
      console.error("Error fetching posts:", error);
    } else if (data) {
      setPosts(
        data.map(p => ({
          id: p.id,
          created_at: p.created_at,
          updated_at: p.updated_at,
          title: p.title,
          content: p.content,
          author_id: p.author_id,
          category: p.category,
          tags: p.tags,
          images: p.images,
          likes_count: p.likes_count,
          comment_count: p.comment_count,
          is_deleted: p.is_deleted,
        }))
      );
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  // derive available categories & tags
  const categoriesList = useMemo(
    () => Array.from(new Set(posts.map(p => p.category || ""))).filter(Boolean),
    [posts]
  );
  const tagsList = useMemo(() => Array.from(new Set(posts.flatMap(p => p.tags))), [posts]);

  // combined search + category + tags filter
  const filteredPosts = posts
    .filter(
      p =>
        !searchTerm ||
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.content.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(p => !filterCategory || p.category === filterCategory)
    .filter(p => !filterTags.length || filterTags.every(t => p.tags.includes(t)));

  // apply sorting
  const sortedPosts = useMemo(() => {
    const arr = [...filteredPosts];
    if (sortOption === "trending") {
      return arr.sort((a, b) => (b.likes_count || 0) - (a.likes_count || 0));
    }
    if (sortOption === "recent") {
      return arr.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      );
    }
    return arr; // “relevant” is default order
  }, [filteredPosts, sortOption]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-10">
      <Container className="space-y-12">
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
          <div className="relative">
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
                    <option value="">All</option>
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
          <div className="relative">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
            <div className="col-span-full text-center py-20 text-gray-500">Loading…</div>
          ) : (
            sortedPosts.map(post => (
              <div
                key={post.id}
                className="transition-transform transform hover:-translate-y-1 hover:shadow-xl"
              >
                <PostCard {...post} />
              </div>
            ))
          )}
        </div>
      </Container>
    </div>
  );
};
