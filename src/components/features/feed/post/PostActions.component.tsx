// src/components/features/feed/PostActions.component.tsx
import React, { useState } from "react";
import { ReactionSummary } from "../ReactionSummary.component";
import { ReactionButton } from "../ReactionButton.component";
import { ChatCircle } from "@phosphor-icons/react";
import { ShareButton } from "@/ui/ShareButton.ui";
import { CommentSection } from "../comment/CommentSection.component";
import { PostActionsProps } from "@/types/feed/post.type";
import { useComments } from "@/services/comments.service";
import { useQuery } from "@tanstack/react-query";
import { fetchReactionsForPosts } from "@/services/reactions.service";

export const PostActions: React.FC<PostActionsProps> = ({ id, title, commentCount }) => {
  const [reactionVersion, setReactionVersion] = useState(0);
  const [showCommentsPreview, setShowCommentsPreview] = useState(false);
  // only fetch comments when preview is open
  const { data: comments = [] } = useComments(id, showCommentsPreview);

  const { data: reactionsBatch = {} } = useQuery({
      queryKey: ["reactionsBatch", id],
      queryFn:() => fetchReactionsForPosts("post", [id]),
      enabled: true
  });
  return (
    <>
      <div className="flex justify-between items-center px-3 pb-1">
        <ReactionSummary
          targetType="post"
          targetId={id}
          version={reactionVersion}
          initialCounts={reactionsBatch[id]?.counts}
          initialLatestNames={reactionsBatch[id]?.latestNames}
        />
        <button
          type="button"
          className="flex items-center gap-1 hover:text-primary cursor-pointer hover:underline"
          onClick={e => {
            e.stopPropagation();
            setShowCommentsPreview(prev => !prev);
          }}
        >
          <span className="text-sm">{commentCount} Comments</span>
        </button>
      </div>

      <div className="border-t pt-1 flex justify-between px-3 py-2">
        <ReactionButton
          targetType="post"
          targetId={id}
          onReactComplete={() => setReactionVersion(v => v + 1)}
        />
        <button
          type="button"
          className="flex items-center gap-1 hover:text-primary"
          onClick={e => {
            e.stopPropagation();
            setShowCommentsPreview(prev => !prev);
          }}
        >
          <ChatCircle size={18} />
          <span className="text-sm">Comments</span>
        </button>
        <ShareButton postId={id} title={title} />
      </div>

      {showCommentsPreview && (
        <div className="px-4 pb-4">
          <CommentSection postId={id} comments={comments} />
        </div>
      )}
    </>
  );
};
