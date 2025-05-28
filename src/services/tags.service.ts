// src/services/forum.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// fetch all tag names
export async function fetchTags(): Promise<string[]> {
  const { data, error } = await supabase.from("tags").select("name");
  if (error) throw error;
  return data?.map(t => t.name) ?? [];
}
export function useTags() {
  return useQuery<string[], Error>({
    queryKey: ["tags"],
    queryFn: fetchTags,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}

// upsert a tag
export async function upsertTag(name: string): Promise<void> {
  const { error } = await supabase.from("tags").upsert({ name });
  if (error) throw error;
}

/** Mutation hook to create/update a tag */
export function useUpsertTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertTag,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tags"] }),
  });
}
