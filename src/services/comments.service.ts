// src/services/comments.service.ts
import { supabase } from "@/helper/supabase.helper";
import { getSignedUrls } from "./storage.service";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import type { Comment } from "@/types/comment.type";


const COMMENT_SELECT = `
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

async function normalize(r: any): Promise<Comment> {
  const prof = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
  return {
    id: r.id,
    post_id: r.post_id,
    parent_id: r.parent_id,
    author_id: r.author_id,
    author_name: prof?.name ?? "",
    author_avatar: prof?.profile_picture ?? undefined,
    content: r.content,
    images: await getSignedUrls(r.images || []),
    reaction_counts: r.reaction_counts || {},
    created_at: r.created_at,
    updated_at: r.updated_at,
  };
}

// fetch all comments & nest one level
export async function fetchComments(postId: number): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select(COMMENT_SELECT)
    .eq("post_id", postId)
    .order("updated_at", { ascending: true });
  if (error) throw error;
  const flat = await Promise.all((data || []).map(normalize));
  const map = new Map<number, Comment>();
  const roots: Comment[] = [];
  flat.forEach(c => {
    if (c.parent_id == null) {
      map.set(c.id, { ...c, replies: [] });
      roots.push(map.get(c.id)!);
    } else if (map.has(c.parent_id)) {
      map.get(c.parent_id)!.replies!.push(c);
    }
  });
  // sort each comment's replies by most-recently updated first
  roots.forEach(root => {
    root.replies?.sort(
      (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    );
  });
  // then sort top-level comments by most-recently updated first
  roots.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
  return roots;
}

// post a new comment or reply
export async function createComment(payload: {
  post_id: number;
  parent_id?: number;
  content: string;
  images: string[];
  author_id: string;
}): Promise<Comment> {
  const { data, error } = await supabase
    .from("comments")
    .insert([
      {
        post_id: payload.post_id,
        parent_id: payload.parent_id || null,
        content: payload.content,
        images: payload.images,
        author_id: payload.author_id,
      },
    ])
    .select(COMMENT_SELECT)
    .single();
  if (error) throw error;
  return normalize(data);
}

export function useComments(postId: number) {
  return useQuery<Comment[]>({
    queryKey: ["comments", postId],
    queryFn: () => fetchComments(postId),
    enabled: Boolean(postId),
  });
}

export function useCreateComment() {
  const { auth } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (p: { post_id: number; parent_id?: number; content: string; images: string[] }) =>
      createComment({ ...p, author_id: auth.user!.id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
  });
}

// comment edit & delete
export async function deleteComment(id: number): Promise<void> {
  const { error } = await supabase.from("comments").delete().eq("id", id);
  if (error) throw error;
}

export function useDeleteComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteComment,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["comments"] });
    },
  });
}

export async function updateComment(id: number, content: string): Promise<Comment> {
  const nowUtc = new Date().toISOString();
  const { data, error } = await supabase
    .from("comments")
    .update({ content, updated_at: nowUtc })
    .eq("id", id)
    .select(COMMENT_SELECT)
    .single();
  if (error) throw error;
  return normalize(data);
}

export function useUpdateComment() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (vars: { id: number; content: string }) => updateComment(vars.id, vars.content),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["comments"] }),
  });
}
