// Base types
export type UUID = string;
export type Timestamp = string;

// Post related types
export interface Post {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category: string;
  tags: string[];
  likes_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
}

// Comment related types
export interface Comment {
  id: number;
  post_id: number;
  parent_id?: number; // For nested comments
  content: string;
  author_id: string;
  images: string[];
  likes_count: number;
  created_at: Timestamp;
  updated_at: Timestamp;
  is_deleted: boolean;
  replies?: Comment[]; // For nested comments
}

// Like related types
export interface Like {
  id: number;
  user_id: string;
  target_id: number; // Post or Comment ID
  target_type: 'post' | 'comment';
  created_at: Timestamp;
}

// API Response types
export interface PostResponse {
  data: Post;
  error: null | string;
}

export interface PostsResponse {
  data: Post[];
  error: null | string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface CommentResponse {
  data: Comment;
  error: null | string;
}

export interface CommentsResponse {
  data: Comment[];
  error: null | string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

export interface LikeResponse {
  data: Like;
  error: null | string;
}

export interface LikesResponse {
  data: Like[];
  error: null | string;
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Post creation/update types
export interface CreatePostInput {
  title: string;
  content: string;
  category: string;
  tags?: string[];
  images?: string[];
}

export interface UpdatePostInput extends Partial<CreatePostInput> {
  id: number;
}

// Comment creation/update types
export interface CreateCommentInput {
  post_id: number;
  parent_id?: number;
  content: string;
  images?: string[];
}

export interface UpdateCommentInput extends Partial<CreateCommentInput> {
  id: number;
}

// Like creation types
export interface CreateLikeInput {
  target_id: number;
  target_type: 'post' | 'comment';
}

// Post query types
export interface PostQueryParams {
  search?: string;
  category?: string;
  tags?: string[];
  sortBy?: 'created_at' | 'updated_at' | 'likes_count' | 'comment_count';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

// Comment query types
export interface CommentQueryParams {
  post_id: number;
  page?: number;
  limit?: number;
  parent_id?: number;
  sortBy?: 'created_at' | 'updatedat' | 'likes_count';
  sortOrder?: 'asc' | 'desc';
}

// Like query types
export interface LikeQueryParams {
  target_id?: number;
  target_type?: 'post' | 'comment';
  user_id?: string;
  page?: number;
  limit?: number;
  sortBy?: 'created_at';
  sortOrder?: 'asc' | 'desc';
}

// Post state types
export interface PostState {
  isLoading: boolean;
  error: string | null;
  data: Post | null;
}

export interface PostsState {
  isLoading: boolean;
  error: string | null;
  data: Post[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Comment state types
export interface CommentState {
  isLoading: boolean;
  error: string | null;
  data: Comment | null;
}

export interface CommentsState {
  isLoading: boolean;
  error: string | null;
  data: Comment[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
}

// Like state types
export interface LikeState {
  isLoading: boolean;
  error: string | null;
  data: Like | null;
}

export interface LikesState {
  isLoading: boolean;
  error: string | null;
  data: Like[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    hasMore: boolean;
  };
} 