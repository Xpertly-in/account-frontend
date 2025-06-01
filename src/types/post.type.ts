// src/types/post.type.ts

export interface PostFilter {
  searchTerm?: string;
  category?: string;
  tags?: string[];
  sortOption?: "recent" | "top";
}
