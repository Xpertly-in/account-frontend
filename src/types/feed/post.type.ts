// src/types/post.type.ts

export interface PostFilter {
  searchTerm?: string;
  category?: string;
  tags?: string[];
  sortOption?: "recent" | "top";
}

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

export interface PostsPage {
  data: PostCardProps[];
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
}

export interface PostPayload {
  title: string;
  content: string;
  category: string;
  tags: string[];
  images: string[];
  author_id: string;
  updated_at?: string;
}

export interface PostActionsProps {
  id: number;
  title: string;
  commentCount: number;
}

export interface PostBodyProps {
  title: string;
  content: string;
  tags: string[];
  onTagClick?: (t: string) => void;
}

export interface PostHeaderProps {
  id: number;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  created_at: string;
  updated_at: string;
  category?: string;
  onCategoryClick?: (c: string) => void;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
}