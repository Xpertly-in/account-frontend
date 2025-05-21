"use client";

import React from "react";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/ui/Card.ui";

// Dummy data for prototyping—swap out for real API data later
interface ForumPost {
  id: number;
  title: string;
  content: string;
}
const dummyPosts: ForumPost[] = Array.from({ length: 1000 }, (_, i) => ({
  id: i,
  title: `Post #${i + 1}`,
  content: `This is the content for post #${i + 1}.`,
}));

export const ForumFeed: React.FC = () => {
    const viewportHeight = 600;    // you can tweak this
    const itemHeight = 160;        // bumped to account for new spacing
  
    const Row = ({ index, style }: ListChildComponentProps) => {
      const post = dummyPosts[index];
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
                <p className="text-gray-700 dark:text-gray-400 text-sm">
                  {post.content}
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      );
    };
  
    return (
      <div className="w-full h-[600px]">
        <FixedSizeList
          height={viewportHeight}
          width="100%"
          itemCount={dummyPosts.length}
          itemSize={itemHeight}
        >
          {Row}
        </FixedSizeList>
      </div>
    );
  };