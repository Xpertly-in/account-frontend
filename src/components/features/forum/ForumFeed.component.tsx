"use client";

import React, { useEffect, useState, useMemo } from "react";
import { supabase } from "@/helper/supabase.helper";
import { Card } from "@/ui/Card.ui";
import {
  MagnifyingGlass,
  Funnel,
  Sliders,
} from "@phosphor-icons/react";
import { PostCard, PostCardProps } from "./PostCard.component";
import { Input } from "@/ui/Input.ui";

export const ForumFeed: React.FC = () => {
  // example data fetch
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [filterTags, setFilterTags] = useState<string[]>([]);

  useEffect(() => {
    let mounted = true;
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("is_deleted", false)
        .order("updated_at", { ascending: false });
      if (error) {
        console.error("Error fetching posts:", error);
      } else if (data && mounted) {
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
      if (mounted) setIsLoading(false);
    };
    fetchPosts();
    return () => {
      mounted = false;
    };
  }, []);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-6 px-4 sm:px-6 md:px-8 lg:px-16">
      <div className="max-w-full sm:max-w-lg md:max-w-2xl lg:max-w-3xl xl:max-w-4xl mx-auto space-y-6">
        {/* Search + Filter/Sort Icons */}
        <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4 flex flex-col sm:flex-row items-center gap-2 relative">
          <MagnifyingGlass size={20} className="text-gray-500 dark:text-gray-400" />
          <Input
            placeholder="Search posts…"
            className="flex-1"
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
          <button className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            <Sliders size={20} className="text-gray-500 dark:text-gray-400" />
          </button>
        </Card>

        {/* Feed */}
        <div className="space-y-6">
          {isLoading
            ? "Loading..."
            : filteredPosts.map(post => <PostCard key={post.id} {...post} />)}
        </div>
      </div>
    </div>
  );
};
