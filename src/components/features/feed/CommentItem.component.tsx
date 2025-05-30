// src/components/features/feed/CommentItem.component.tsx
"use client";
import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar.ui";
import { formatRelativeTime } from "@/utils/date.utils";
import { ReactionButton } from "./ReactionButton.component";
import { ReactionSummary } from "./ReactionSummary.component";
import type { Comment } from "@/services/comments.service";

interface Props {
  comment: Comment;
  onReply?: () => void;
}
export const CommentItem: React.FC<Props> = ({ comment, onReply }) => {
  const [reactionVersion, setReactionVersion] = useState(0);

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
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatRelativeTime(comment.created_at)}
            </span>
          </div>
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            •••
          </button>
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
            <button onClick={onReply} className="text-primary hover:underline">
              Reply
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
