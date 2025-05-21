"use client";

import React from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/Card.ui";
import { PostCard, PostCardProps } from "@/components/features/forum/PostCard.components";
import { Button } from "@/ui/Button.ui";
import { useState, useMemo, useEffect } from "react";
import { supabase } from "@/helper/supabase.helper";

// Dummy data for prototyping—swap out for real API data later
const categories = ["News", "Question", "Discussion"];
// const dummyPosts: PostCardProps[] = Array.from({ length: 1000 }, (_, i) => {
//   const ts = new Date(Date.now() - i * 60 * 60 * 1000).toISOString();
//   return {
//     id: i + 1,
//     created_at: ts,
//     updated_at: ts,
//     title: `Post #${i + 1}`,
//     content: `This is the content for post #${i + 1}.`,
//     authorName: `user ${i % 10}`,
//     authorAvatarUrl: i % 3 === 0 ? `https://i.pravatar.cc/150?u=user${i}` : undefined,
//     category: categories[i % categories.length],
//     tags: [`tag${i % 5}`, categories[i % categories.length].toLowerCase()],
//     images: [`https://picsum.photos/seed/${i}/400/200`],
//     likes_count: Math.floor(Math.random() * 100),
//     comment_count: Math.floor(Math.random() * 20),
//     is_deleted: false,
//   };
// });

export const ForumFeed: React.FC = () => {
  // simulate data fetching
  const [posts, setPosts] = useState<PostCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;
  const [loadedCount, setLoadedCount] = useState(pageSize);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  useEffect(() => {
     const fetchPosts = async () => {
       const { data, error } = await supabase
         .from("posts")
         .select(`
           *
         `);
  
       if (error) {
         console.error("Error fetching posts:", error);
       } else if (data) {
         const formatted: PostCardProps[] = data.map(post => ({
           id: post.id,
           created_at: post.created_at,
           updated_at: post.updated_at,
           title: post.title,
           content: post.content,
           author_id: post.author_id,
           authorAvatarUrl: post.author_avatar_url,
           category: post.category,
           tags: post.tags,
           images: post.images,
           likes_count: post.likes_count,
           comment_count: post.comment_count,
           is_deleted: post.is_deleted,
         }));
         setPosts(formatted);
       }
       setIsLoading(false);
     };
     fetchPosts();
   }, []);

  // sort & filter state
  const [sortType, setSortType] = useState<"trending" | "recent" | "relevant">("recent");
  const [filterType, setFilterType] = useState<"All" | PostCardProps["category"]>("All");

  const viewportHeight = 600; // you can tweak this
  const itemHeight = 800; // bumped to account for new spacing
  // derive a filtered & sorted array based on selected filter & sort
  const filteredSortedPosts = useMemo(() => {
    if (isLoading) return [];
    const base = filterType === "All" ? posts : posts.filter(p => p.category === filterType);
    switch (sortType) {
      case "recent":
        return [...base].sort((a, b) => b.id - a.id);
      case "trending":
        return [...base].sort((a, b) => b.id - a.id);
      case "relevant":
      default:
        return base;
    }
  }, [posts, filterType, sortType, isLoading]);

  // 3) Slice for infinite scroll
  const displayedPosts = filteredSortedPosts.slice(0, loadedCount);

  // 4) Load more when needed
  const loadMore = () => {
    if (isFetchingMore || loadedCount >= filteredSortedPosts.length) return;
    setIsFetchingMore(true);
    setTimeout(() => {
      setLoadedCount(prev => Math.min(prev + pageSize, filteredSortedPosts.length));
      setIsFetchingMore(false);
    }, 500);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const post = displayedPosts[index];
    return (
      <div style={style} className="px-4">
        <PostCard
          id={post.id}
          author_id={post.author_id}
          title={post.title}
          content={post.content}
          tags={post.tags}
          images={post.images}
          created_at={post.created_at}
          updated_at={post.updated_at}
        />
      </div>
    );
  };

  // 3) Combine filter & sort controls in header
  return (
    <>
      <div className="px-4 md:px-8 lg:px-16 max-w-4xl mx-auto">
        {/* Filter & Sort Controls */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          {/* Filter Controls */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Filter by:</span>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                className={filterType === "All" ? "border-accent text-accent" : ""}
                onClick={() => setFilterType("All")}
              >
                All
              </Button>
              {categories.map(cat => (
                <Button
                  key={cat}
                  size="sm"
                  variant="outline"
                  className={filterType === cat ? "border-accent text-accent" : ""}
                  onClick={() => setFilterType(cat)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          </div>
          {/* Sort Controls */}
          <div className="flex items-center gap-2"></div>
          <span className="text-sm font-medium">Sort by:</span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={sortType === "trending" ? "default" : "outline"}
              onClick={() => setSortType("trending")}
            >
              Trending
            </Button>
            <Button
              size="sm"
              variant={sortType === "recent" ? "default" : "outline"}
              onClick={() => setSortType("recent")}
            >
              Recent
            </Button>
            <Button
              size="sm"
              variant={sortType === "relevant" ? "default" : "outline"}
              onClick={() => setSortType("relevant")}
            >
              Relevant
            </Button>
          </div>
        </div>
      </div>

      {/* Loading / Empty / List */}
      {isLoading ? (
        <div className="w-full h-[600px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="w-full h-[600px] flex items-center justify-center">
          <p className="text-muted-foreground dark:text-muted-foreground">No posts to display.</p>
        </div>
      ) : (
        <div className="relative w-full h-[400px] md:h-[600px]">
          <FixedSizeList
            height={viewportHeight}
            width="100%"
            itemCount={displayedPosts.length}
            itemSize={itemHeight}
            overscanCount={5}
            onItemsRendered={({ visibleStopIndex }) => {
              if (visibleStopIndex >= displayedPosts.length - 1) {
                loadMore();
              }
            }}
          >
            {Row}
          </FixedSizeList>

          {isFetchingMore && (
            <div className="absolute bottom-4 w-full flex justify-center">
              <div className="animate-spin h-6 w-6 border-t-2 border-primary rounded-full" />
            </div>
          )}
        </div>
      )}
    </>
  );
};
