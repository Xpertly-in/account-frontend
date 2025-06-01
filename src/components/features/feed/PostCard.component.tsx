"use client";

import { useComments } from "@/services/comments.service";
import { PostHeader } from "./PostHeader.component";
import { PostBody } from "./PostBody.component";
import { ImageCarousel } from "./ImageCarousel.component";
import { PostActions } from "./PostActions.component";

export interface PostCardProps {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  category?: string;
  tags: string[];
  images: string[];
  reaction_counts?: Record<string, number>;
  is_deleted?: boolean;
  onCategoryClick?: (category: string) => void;
  onTagClick?: (tag: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export const PostCard: React.FC<PostCardProps> = props => {
  const { id } = props;
  const { data: comments = [] } = useComments(id);
  const commentCount = comments.length;

  return (
    <div className="rounded-lg overflow-hidden">
      {/* Header */}
      <PostHeader {...props} />
      <PostBody {...props} />
      <ImageCarousel images={props.images} />
      <PostActions {...props} commentCount={commentCount} />
    </div>
  );
};
