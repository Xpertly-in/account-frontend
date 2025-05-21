"use client";

import React from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Card, CardHeader, CardTitle, CardContent } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { useState, useMemo, useEffect } from "react";

// Dummy data for prototyping—swap out for real API data later
interface ForumPost {
  id: number;
  title: string;
  content: string;
  category: "News" | "Question" | "Discussion";
}
const categories: ForumPost["category"][] = ["News", "Question", "Discussion"];
const dummyPosts: ForumPost[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Post #${i + 1}`,
  content: `This is the content for post #${i + 1}.`,
  category: categories[i % categories.length],
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
  const itemHeight = 160; // bumped to account for new spacing
  // derive a filtered & sorted array based on selected filter & sort
  const filteredSortedPosts = useMemo(() => {
    if (isLoading) return [];
    const base = filterType === "All" ? posts : posts.filter((p) => p.category === filterType);
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
      setLoadedCount((prev) => Math.min(prev + pageSize, filteredSortedPosts.length));
      setIsFetchingMore(false);
    }, 500);
  };

  const Row = ({ index, style }: ListChildComponentProps) => {
    const post = displayedPosts[index];
    return (
      <div style={style} className="px-4">
        <Card className="relative group overflow-hidden hover:shadow-lg transition-all duration-200">
          {/* gradient accent stripe */}
          <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-primary via-secondary to-accent" />

          <div className="pt-2">
            <CardHeader className="border-b dark:border-gray-700 pb-2">
              <CardTitle className="text-lg text-primary dark:text-primary-foreground">
                {post.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-2">
              <p className="text-gray-700 dark:text-gray-400 text-sm">{post.content}</p>
            </CardContent>
          </div>
        </Card>
      </div>
    );
  };

  // 3) Combine filter & sort controls in header
  return (
    <>
      {/* Filter & Sort Controls */}
      <div className="px-4 flex justify-between items-center mb-4">
        {/* Filter Controls */}
        <div className="flex gap-2">
          <Button
            size="sm"
            variant={filterType === "All" ? "default" : "outline"}
            onClick={() => setFilterType("All")}
          >
            All
          </Button>
          {categories.map(cat => (
            <Button
              key={cat}
              size="sm"
              variant={filterType === cat ? "default" : "outline"}
              onClick={() => setFilterType(cat)}
            >
              {cat}
            </Button>
          ))}
        </div>
        {/* Sort Controls */}
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

      {isLoading ? (
        <div className="w-full h-[600px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary" />
        </div>
      ) : displayedPosts.length === 0 ? (
        <div className="w-full h-[600px] flex items-center justify-center">
          <p className="text-muted-foreground dark:text-muted-foreground">No posts to display.</p>
        </div>
      ) : (
        <div className="relative w-full h-[600px]">
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
