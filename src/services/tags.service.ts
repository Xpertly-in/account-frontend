// src/services/forum.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useQuery } from "@tanstack/react-query";

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