"use client";

import React, { useState, useMemo } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { Card } from "@/ui/Card.ui";
import { Avatar, AvatarFallback } from "@/ui/Avatar.ui";
import { formatRelativeTime } from "@/utils/date.utils";
import {
  ThumbsUp,
  ChatCircle,
  ShareNetwork,
  PaperPlaneRight,
  DotsThree,
  CaretLeft,
  CaretRight,
  X,
} from "@phosphor-icons/react";

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
  category,
  author_id,
  title,
  content,
  images,
  tags,
  updated_at,
  likes_count = 0,
  comment_count = 0,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const initials = useMemo(
    () =>
      author_id
        .split(" ")
        .map(n => n[0])
        .join("")
        .toUpperCase(),
    [author_id]
  );
  const relativeTime = useMemo(() => formatRelativeTime(new Date(updated_at)), [updated_at]);

  return (
    <Card className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-4">
        <div>
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-gray-900 dark:text-gray-100">{author_id}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{relativeTime}</p>
            </div>
          </div>
          {category && (
            <span className="mt-2 inline-block bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-2 py-0.5 rounded-full">
              {category}
            </span>
          )}
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <DotsThree size={20} />
        </button>
      </div>

      {/* Body & Image Carousel */}
      <div className="px-4 pb-4 space-y-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
          <p className="text-sm text-gray-700 dark:text-gray-300">{content}</p>
        </div>
        {images?.length > 0 && (
          <div
            className="relative w-full aspect-video bg-muted overflow-hidden rounded-lg cursor-zoom-in"
            onClick={() => {
              setPreviewIndex(currentIndex);
              setIsPreviewOpen(true);
            }}
          >
            <Image
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              fill
              className="object-cover"
            />
            {/* Prev */}
            {currentIndex > 0 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setCurrentIndex(i => i - 1);
                }}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-3 rounded-full"
              >
                <CaretLeft size={24} className="text-primary" />
              </button>
            )}
            {/* Next */}
            {currentIndex < images.length - 1 && (
              <button
                onClick={e => {
                  e.stopPropagation();
                  setCurrentIndex(i => i + 1);
                }}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-background/50 p-3 rounded-full"
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
                  className={`w-2 h-2 rounded-full ${
                    idx === currentIndex ? "bg-primary" : "bg-muted-foreground"
                  }`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tags */}
      {tags?.length > 0 && (
        <div className="px-4 py-2 flex flex-wrap gap-2">
          {tags.map(tag => (
            <span
              key={tag}
              className="bg-secondary/10 text-secondary text-xs font-medium px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 flex justify-between text-gray-600 dark:text-gray-400">
        <button className="flex items-center gap-1 hover:text-primary">
          <ThumbsUp size={18} />
          <span className="text-sm">{likes_count}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary">
          <ChatCircle size={18} />
          <span className="text-sm">{comment_count}</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary">
          <ShareNetwork size={18} />
          <span className="text-sm">Share</span>
        </button>
      </div>
      {/* Image preview modal */}
      {isPreviewOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
            onClick={() => setIsPreviewOpen(false)}
          >
            <button
              className="absolute top-4 right-4 text-white"
              onClick={() => setIsPreviewOpen(false)}
            >
              <X size={32} weight="bold" />
            </button>
            <img
              src={images[previewIndex]}
              alt={`Preview ${previewIndex + 1}`}
              className="max-h-[90vh] max-w-[90vw] object-contain"
            />
          </div>,
          document.body
        )}
    </Card>
  );
};
