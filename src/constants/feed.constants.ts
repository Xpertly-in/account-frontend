// src/constants/feed.constants.ts

import type { ReactionType } from "@/types/feed/reaction.type";
import { ThumbsUp, Heart, Smiley, SmileySad, Flame, Icon } from "@phosphor-icons/react";

export const POST_SELECT = `
  id,
  title,
  content,
  category,
  tags,
  images,
  created_at,
  updated_at,
  is_deleted,
  author_id,
  profiles (
    name,
    profile_picture
  ),
  comments ( id )
`;

export const COMMENT_SELECT = `
  id,
  post_id,
  parent_id,
  content,
  images,
  reaction_counts,
  created_at,
  updated_at,
  author_id,
  profiles ( name, profile_picture )
`;

export const REACTIONS: { type: ReactionType; icon: Icon; bg: string; fg: string }[] = [
  { type: "like", icon: ThumbsUp, bg: "bg-blue-100", fg: "text-blue-500" },
  { type: "love", icon: Heart, bg: "bg-red-100", fg: "text-red-500" },
  { type: "laugh", icon: Smiley, bg: "bg-yellow-100", fg: "text-yellow-500" },
  { type: "sad", icon: SmileySad, bg: "bg-purple-100", fg: "text-purple-500" },
  { type: "fire", icon: Flame, bg: "bg-orange-100", fg: "text-orange-500" },
];
