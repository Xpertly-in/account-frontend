"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import { CaretLeft, CaretRight, Clock, Link } from "@phosphor-icons/react";
import { cn } from "@/helper/tw.helper";
import { Card } from "@/ui/Card.ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/Avatar.ui";
import { formatRelativeTime } from "@/utils/date.utils";

export interface PostCardProps {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  author_id: string;
  category?: string;
  tags: string[];
  images: string[];
  likes_count?: number;
  comment_count?: number;
  is_deleted?: boolean;
}

export const PostCard: React.FC<PostCardProps> = ({
  author_id,
  title,
  content,
  images,
  tags,
  updated_at,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  // compute initials if no avatar image
  const initials = author_id
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
  const relativeTime = useMemo(() => formatRelativeTime(new Date(updated_at)), [updated_at]);

  return (
    <Card className="overflow-hidden">
      {/* Author Header */}
      <div className="flex items-center gap-3 p-4">
        <Avatar className="size-10">
            <AvatarFallback>{initials}</AvatarFallback>
        </Avatar>
        <span className="font-semibold text-gray-900 dark:text-white">{author_id}</span>
      </div>

      {/* Title, Content & Carousel */}
        <div className="px-4 pb-4 md:grid md:grid-cols-2 md:items-start md:gap-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {title}
            </h3>
            <p className="mt-2 text-gray-700 dark:text-gray-400 text-sm">
              {content}
            </p>
          </div>
          {images && images.length > 0 && (
            <div className="relative w-full h-48 md:h-56 lg:h-64 bg-muted overflow-hidden rounded-md">
              <Image
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                fill
                className="object-cover"
              />
          {/* Prev Button */}
          {currentIndex > 0 && (
            <button
              onClick={() => setCurrentIndex(i => i - 1)}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-1 rounded-full"
            >
              <CaretLeft size={24} className="text-primary" />
            </button>
          )}
          {/* Next Button */}
          {currentIndex < images.length - 1 && (
            <button
              onClick={() => setCurrentIndex(i => i + 1)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-1 rounded-full"
            >
              <CaretRight size={24} className="text-primary" />
            </button>
          )}
          {/* Dots */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-1">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={cn(
                  "w-2 h-2 rounded-full",
                  idx === currentIndex ? "bg-primary" : "bg-muted-foreground"
                )}
              />
            ))}
          </div>
          </div>
        )}
      </div>

      {/* Hashtag Links */}
      {tags && tags.length > 0 && (
        <div className="px-4 pb-4 flex flex-wrap gap-2">
          {tags.map(tag => (
            <Link
              key={tag}
              href={`/forum?tag=${encodeURIComponent(tag)}`}
              className="rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-primary hover:bg-blue-100 dark:bg-blue-500/20 dark:text-blue-200 dark:hover:bg-blue-500/30"
            >
              #{tag}
            </Link>
          ))}
        </div>
      )}

      {/* Timestamp */}
      <div className="px-4 pb-4 flex items-center text-xs text-muted-foreground dark:text-muted-foreground gap-1">
        <Clock className="h-4 w-4" weight="duotone" />
        <span>{relativeTime}</span>
      </div>
    </Card>
  );
};
