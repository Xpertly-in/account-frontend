// src/services/posts.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import type { PostCardProps, PostFilter, PostPayload, PostsPage } from "@/types/feed/post.type";
import { POST_SELECT } from "@/constants/feed.constants";
import { useAuth } from "@/store/context/Auth.provider";
import { getSignedUrls } from "./storage.service";

// Normalize a raw row to your PostCardProps
async function normalizePost(p: any): Promise<PostCardProps> {
  const profile = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
  return {
    id: p.id,
    created_at: p.created_at,
    updated_at: p.updated_at,
    title: p.title,
    content: p.content,
    author_id: p.author_id,
    author_name: profile?.name ?? "",
    author_avatar: profile?.profile_picture ?? undefined,
    category: p.category,
    tags: p.tags,
    images: await getSignedUrls(p.images),
    reaction_counts: p.reaction_counts,
    is_deleted: p.is_deleted,
    commentCount: p.comments?.length ?? 0,
  };
}

// --------------------------------------------------------------------------
// CREATE / UPDATE POST SERVICE
// --------------------------------------------------------------------------

/** insert a new post */
export async function createPost(p: PostPayload) {
  const { data, error } = await supabase.from("posts").insert([p]);
  if (error) throw error;
  return data;
}

/** update an existing post */
export async function updatePost(id: string, p: PostPayload) {
  const { data, error } = await supabase.from("posts").update(p).eq("id", id);
  if (error) throw error;
  return data;
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
  let query = supabase.from("posts").select(POST_SELECT).eq("is_deleted", false);

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

  const mapped = await Promise.all((data || []).map(normalizePost));
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
    refetchOnMount: "always",
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

// --------------------------------------------------------------------------
// FETCH SINGLE POST
// --------------------------------------------------------------------------
/** Fetch a single post by id */
export async function fetchPostById(id: number): Promise<PostCardProps> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", id)
    .eq("is_deleted", false)
    .single();
  if (error) throw error;
  return normalizePost(data);
}

// --------------------------------------------------------------------------
// FETCH SIMILAR POSTS
// --------------------------------------------------------------------------
/** Fetch similar posts by same category or overlapping tags (excludes current id) */
export async function fetchSimilarPosts(
  id: number,
  category?: string,
  tags?: string[]
): Promise<PostCardProps[]> {
  let q = supabase.from("posts").select(POST_SELECT).eq("is_deleted", false).neq("id", id);
  if (category) q = q.eq("category", category);
  else if (tags?.length) q = q.overlaps("tags", tags);
  q = q.order("updated_at", { ascending: false }).limit(4);
  const { data, error } = await q;
  if (error) throw error;
  return Promise.all((data || []).map(normalizePost));
}

// single‐post hook
export const usePost = (id: number) =>
  useQuery<PostCardProps>({
    queryKey: ["post", id],
    queryFn: () => fetchPostById(id),
    enabled: Boolean(id),
  });

// similar‐posts hook
export const useSimilarPosts = (id: number, category?: string, tags?: string[]) =>
  useQuery<PostCardProps[]>({
    queryKey: ["similarPosts", id],
    queryFn: () => fetchSimilarPosts(id, category, tags),
    enabled: Boolean(id && (category || tags?.length)),
  });

/**
 * Hook: create a post, then invalidate the feed list
 */
export function useCreatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createPost,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"], refetchType: "all" }),
  });
}

/**
 * Hook: update a post, then invalidate the feed list
 */
export function useUpdatePostMutation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: PostPayload }) => updatePost(id, data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["posts"] }),
  });
}
