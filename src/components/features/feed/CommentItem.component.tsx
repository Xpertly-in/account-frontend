// src/components/features/feed/CommentItem.component.tsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { DotsThree, PencilSimple, TrashSimple } from "@phosphor-icons/react";
import { useAuth } from "@/store/context/Auth.provider";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar.ui";
import { formatRelativeTime } from "@/utils/date.utils";
import { ReactionButton } from "./ReactionButton.component";
import { ReactionSummary } from "./ReactionSummary.component";
import type { Comment } from "@/types/comment.type";
import { useOutsideClick } from "@/hooks/useOutsideClick";

interface Props {
  comment: Comment;
  onReply?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}
export const CommentItem: React.FC<Props> = ({ comment, onReply, onEdit, onDelete }) => {
  const isEdited = comment.updated_at !== comment.created_at;
  const displayTime = isEdited
    ? `edited ${formatRelativeTime(comment.updated_at)}`
    : formatRelativeTime(comment.created_at);
  const [reactionVersion, setReactionVersion] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const { auth } = useAuth();
  const currentUserId = auth.user?.id;

  useOutsideClick(wrapperRef, () => setMenuOpen(false));

  return (
    <div className="flex space-x-3 py-3 border-b border-gray-200 dark:border-gray-700">
      <Avatar className="h-10 w-10">
        {comment.author_avatar ? (
          <AvatarImage src={comment.author_avatar} alt={comment.author_name} />
        ) : (
          <AvatarFallback>{comment.author_name[0]}</AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between items-center text-sm">
          <div>
            <span className="font-semibold text-gray-900 dark:text-gray-100">
              {comment.author_name}
            </span>
            <span className="text-xs ml-2 text-gray-500 dark:text-gray-400">{displayTime}</span>
          </div>
          {currentUserId === comment.author_id && (
            <div className="relative" ref={wrapperRef}>
              <button
                onClick={e => {
                  e.stopPropagation();
                  setMenuOpen(o => !o);
                }}
                className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                aria-label="Comment menu"
              >
                <DotsThree size={20} />
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-10">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onEdit?.(comment.id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <PencilSimple size={14} /> Edit
                  </button>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      setMenuOpen(false);
                      onDelete?.(comment.id);
                    }}
                    className="flex items-center gap-1 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <TrashSimple size={14} /> Delete
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{comment.content}</p>
        {comment.images.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {comment.images.map((url, i) => (
              <img key={i} src={url} className="w-20 h-20 object-cover rounded-lg shadow-sm" />
            ))}
          </div>
        )}
        <div className="flex justify-left">
          <ReactionSummary targetType="comment" targetId={comment.id} version={reactionVersion} />
        </div>
        <div className="flex items-center space-x-4 text-xs">
          <ReactionButton
            targetType="comment"
            targetId={comment.id}
            onReactComplete={() => setReactionVersion(v => v + 1)}
          />
          {onReply && (
            <button
              onClick={e => {
                e.stopPropagation();
                onReply();
              }}
              className="text-primary hover:underline"
            >
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
