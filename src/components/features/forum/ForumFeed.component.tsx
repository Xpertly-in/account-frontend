"use client";

import React from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/Card.ui";
import { PostCard } from "@/components/features/forum/PostCard.components";
import { Button } from "@/ui/Button.ui";
import { useState, useMemo, useEffect } from "react";

// Dummy data for prototyping—swap out for real API data later
interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: "News" | "Question" | "Discussion";
  authorName: string;
  authorAvatarUrl?: string;
  images?: string[];
  hashtags?: string[];
  timestamp: string;
}
const categories: ForumPost["category"][] = ["News", "Question", "Discussion"];
const dummyPosts: ForumPost[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Post #${i + 1}`,
  content: `This is the content for post #${i + 1}.`,
  category: categories[i % categories.length],
  authorName: `User ${i % 10}`,
  authorAvatarUrl: i % 3 === 0 ? `https://i.pravatar.cc/150?u=user${i}` : undefined,
  images: [
    `https://picsum.photos/seed/${i}/400/200`,
    `https://picsum.photos/seed/${i + 1}/400/200`,
    `https://picsum.photos/seed/${i + 2}/400/200`,
  ],
  hashtags: [`topic${i % 5}`, categories[i % categories.length].toLowerCase()],
  timestamp: new Date(Date.now() - (1000 - i) * 60 * 1000).toISOString(), // i minutes ago
}));

export const ForumFeed: React.FC = () => {
  // simulate data fetching
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const pageSize = 20;
  const [loadedCount, setLoadedCount] = useState(pageSize);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setPosts(dummyPosts);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // sort & filter state
  const [sortType, setSortType] = useState<"trending" | "recent" | "relevant">("recent");
  const [filterType, setFilterType] = useState<"All" | ForumPost["category"]>("All");

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
          authorName={post.authorName}
          authorAvatarUrl={post.authorAvatarUrl}
          title={post.title}
          content={post.content}
          hashtags={post.hashtags}
          images={post.images}
          timestamp={post.timestamp}
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
