// src/components/features/feed/PostHeader.component.tsx
import React, { useState, useRef } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar.ui";
import { formatRelativeTime } from "@/utils/date.utils";
import { DotsThree, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { useAuth } from "@/store/context/Auth.provider";
import { useOutsideClick } from "@/hooks/useOutsideClick";
import { PostHeaderProps } from "@/types/feed/post.type";



export const PostHeader: React.FC<PostHeaderProps> = ({
  id,
  author_id,
  author_name,
  author_avatar,
  created_at,
  updated_at,
  category,
  onCategoryClick,
  onEdit,
  onDelete,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, () => setMenuOpen(false));

  const initials = author_name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();
  const displayTime =
    created_at !== updated_at
      ? `edited ${formatRelativeTime(updated_at)}`
      : formatRelativeTime(created_at);

  const { auth } = useAuth();
  const currentUserId = auth.user?.id;

  return (
    <div className="flex items-center p-2">
      {/* avatar + name */}
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          {author_avatar ? (
            <AvatarImage src={author_avatar} alt={`${author_name}'s avatar`} />
          ) : (
            <AvatarFallback>{initials}</AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col">
          <p className="font-semibold text-gray-900 dark:text-gray-100">{author_name}</p>
          <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">{displayTime}</p>
        </div>
      </div>

      {/* category badge */}
      <div className="flex-1 flex justify-center">
        {category && (
          <span
            onClick={e => {
              e.stopPropagation();
              onCategoryClick?.(category);
            }}
            className="bg-gradient-to-r from-primary to-secondary text-white text-xs font-medium px-2 py-0.5 rounded-full cursor-pointer"
          >
            {category}
          </span>
        )}
      </div>

      {/* edit/delete menu */}
      {currentUserId === author_id && (
        <div className="relative" ref={wrapperRef}>
          <button
            onClick={e => {
              e.stopPropagation();
              setMenuOpen(o => !o);
            }}
            aria-label="Open menu"
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <DotsThree size={24} />
          </button>

          {menuOpen && (
            <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
              <button
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onEdit?.(id);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <PencilSimple size={16} />
                Edit Post
              </button>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(false);
                  onDelete?.(id);
                }}
                className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <TrashSimple size={16} />
                Delete Post
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
