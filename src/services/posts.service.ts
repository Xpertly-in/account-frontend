// src/services/posts.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import type { PostCardProps } from "@/components/features/forum/PostCard.component";

export interface PostFilter {
  searchTerm?: string;
  category?: string;
  tags?: string[];
  sortOption?: "recent" | "top";
}

export interface PostsPage {
  data: PostCardProps[];
  currentPage: number;
  pageSize: number;
  hasNextPage: boolean;
}

/**
 * Fetch a single page of posts with filters & pagination
 */
export async function fetchPosts(
  userId: string | undefined,
  filter: PostFilter,
  page: number,
  pageSize: number
): Promise<PostsPage> {
  let query = supabase
    .from("posts")
    .select(
      `
      id,
      title,
      content,
      category,
      tags,
      images,
      reaction_counts,
      updated_at,
      is_deleted,
      author_id,
      profiles (
        name,
        profile_picture
      )
    `
    )
    .eq("is_deleted", false);

  if (filter.searchTerm) {
    query = query.or(`content.ilike.%${filter.searchTerm}%,title.ilike.%${filter.searchTerm}%`);
  }
  if (filter.category) {
    query = query.eq("category", filter.category);
  }
  if (filter.tags && filter.tags.length) {
    query = query.overlaps("tags", filter.tags);
  }

  const sortCol = filter.sortOption === "top" ? "likes_count" : "updated_at";
  query = query.order(sortCol, { ascending: false });

  const from = page * pageSize;
  const to = from + pageSize - 1;
  query = query.range(from, to);

  const { data, error } = await query;
  if (error) throw error;

  const mapped: PostCardProps[] = (data || []).map(p => {
    // profiles is returned as an array; grab the first profile record
    const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    return {
      id: p.id,
      updated_at: p.updated_at,
      title: p.title,
      content: p.content,
      author_id: p.author_id,
      author_name: profile?.name || "",
      author_avatar: profile?.profile_picture || undefined,
      category: p.category,
      tags: p.tags,
      images: p.images,
      reaction_counts: p.reaction_counts,
      is_deleted: p.is_deleted,
    };
  });

  return {
    data: mapped,
    currentPage: page,
    pageSize,
    hasNextPage: mapped.length === pageSize,
  };
}

/**
 * Hook to paginate posts via React-Query
 */
export function usePosts(filter: PostFilter, pageSize = 10) {
  const { auth } = useAuth();
  return useInfiniteQuery({
    queryKey: ["posts", auth.user?.id, filter],
    queryFn: ({ pageParam = 0 }) => fetchPosts(auth.user?.id, filter, pageParam, pageSize),
    getNextPageParam: last => (last.hasNextPage ? last.currentPage + 1 : undefined),
    initialPageParam: 0,
    staleTime: 0,
    refetchOnWindowFocus: false,
  });
}

/**
+ * Soft-delete a post by setting `is_deleted = true`
+ */
export async function deletePost(postId: number): Promise<void> {
  const { error } = await supabase.from("posts").update({ is_deleted: true }).eq("id", postId);
  if (error) throw error;
}

/**
    + * Hook to delete a post and invalidate the posts query
    + */
export function useDeletePost() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deletePost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
