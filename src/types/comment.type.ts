// src/types/comment.type.ts
import type { ReactionType } from "./reaction.type";

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
