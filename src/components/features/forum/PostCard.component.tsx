"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
  PencilSimple,
  TrashSimple,
  CaretLeft,
  CaretRight,
  X,
} from "@phosphor-icons/react";
import { useAuth } from "@/store/context/Auth.provider";

export interface PostCardProps {
  id: number;
  created_at: string;
  updated_at: string;
  content: string;
  author_id: string;
  category?: string;
  tags: string[];
  images: string[];
  likes_count?: number;
  comment_count?: number;
  is_deleted?: boolean;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  id,
  category,
  author_id,
  content,
  images,
  tags,
  updated_at,
  likes_count = 0,
  comment_count = 0,
  onCategoryClick,
  onTagClick,
  onEdit,
  onDelete,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [hasOverflow, setHasOverflow] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewIndex, setPreviewIndex] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
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
  const { auth } = useAuth();
  const currentUserName = auth.user?.user_metadata?.name ?? auth.user?.email ?? auth.user?.id
  const wrapperRef = useRef<HTMLDivElement>(null);
  // Replace the old “close on any mousedown” effect with this:
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      // only close if the click is outside our menu/button wrapper
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const touchStartX = useRef(0);

  // swipe handlers for carousel
  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const SWIPE_THRESHOLD = 50;
    if (deltaX > SWIPE_THRESHOLD && currentIndex > 0) {
      setCurrentIndex(i => i - 1);
    } else if (deltaX < -SWIPE_THRESHOLD && currentIndex < images.length - 1) {
      setCurrentIndex(i => i + 1);
    }
  };

  // measure overflow once when content changes (when collapsed)
  useEffect(() => {
    if (!expanded && contentRef.current) {
      const el = contentRef.current;
      if (el.scrollHeight > el.clientHeight) {
        setHasOverflow(true);
      }
    }
  }, [content, expanded]);

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between p-3">
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
        </div>
        <div className="flex items-center space-x-2">
          {category && (
            <span
              onClick={() => onCategoryClick?.(category)}
              className="mt-4 inline-block bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
            >
              {category}
            </span>
          )}
          
          {currentUserName === author_id && (
            <div className="relative" ref={wrapperRef}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                aria-label="Open menu"
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              >
                <DotsThree size={20} />
              </button>
              {menuOpen && onEdit && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      console.log(`Editing post with ID: ${id}`); // keep your log
                      onEdit(id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilSimple size={16} />
                    Edit Post
                  </button>
                  <button
                    onClick={() => {
                      setMenuOpen(false);
                      onDelete?.(id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 w-full text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrashSimple size={16} />
                    Delete Post
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Body & Image Carousel */}
      <div className="px-3 pb-3 space-y-2">
        <div
          ref={contentRef}
          className={`prose text-sm text-gray-700 dark:prose-invert dark:text-gray-300 max-w-none ${
            expanded ? "" : "line-clamp-3 overflow-hidden"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
        {/* only show toggle if content overflows */}
        {hasOverflow && (
          <button onClick={() => setExpanded(prev => !prev)} className="text-primary text-sm mt-1">
            {expanded ? "Show less" : "Read more"}
          </button>
        )}
        {images?.length > 0 && (
          <div
            className="relative w-full aspect-video bg-muted overflow-hidden rounded-lg cursor-zoom-in"
            onClick={() => {
              setPreviewIndex(currentIndex);
              setIsPreviewOpen(true);
            }}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img
              src={images[currentIndex]}
              alt={`Slide ${currentIndex + 1}`}
              className="w-full h-full object-contain object-center"
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

      {/* Tags (clickable) */}
      {tags?.length > 0 && (
        <div className="px-3 py-1 flex flex-wrap gap-1">
          {tags.map(tag => (
            <span
              key={tag}
              onClick={() => onTagClick?.(tag)}
              className="bg-secondary/10 text-secondary text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 px-3 py-2 flex justify-between text-gray-600 dark:text-gray-400">
        <button className="flex items-center gap-1 hover:text-primary">
          <ThumbsUp size={18} />
          <span className="text-sm"> {likes_count} Likes</span>
        </button>
        <button className="flex items-center gap-1 hover:text-primary">
          <ChatCircle size={18} />
          <span className="text-sm"> {comment_count} Comments</span>
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
    </div>
  );
};
