// src/types/comment.type.ts
import type { ReactionType } from "../feed/reaction.type";

export interface Comment {
  id: number;
  post_id: number;
  parent_id: number | null;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  images: string[];
  reaction_counts?: Record<ReactionType, number>;
  created_at: string;
  updated_at: string;
  replies?: Comment[];
}

export interface CommentFormProps {
  parent_id?: number;
  onSubmit: (content: string, images: string[]) => void;
  initialContent?: string;
  placeholder?: string;
  submitLabel?: string;
}

export interface CommentItemProps {
  comment: Comment;
  onReply?: () => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}