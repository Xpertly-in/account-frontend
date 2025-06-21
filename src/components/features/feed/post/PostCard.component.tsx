"use client";

import { PostHeader } from "./PostHeader.component";
import { PostBody } from "./PostBody.component";
import { ImageCarousel } from "../ImageCarousel.component";
import { PostActions } from "./PostActions.component";
import { PostCardProps } from "@/types/feed/post.type";


export const PostCard: React.FC<PostCardProps> = props => {
  const { commentCount } = props;

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
