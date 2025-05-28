// src/services/forum.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// fetch all category names
export async function fetchCategories(): Promise<string[]> {
  const { data, error } = await supabase.from("categories").select("name");
  if (error) throw error;
  return data?.map(c => c.name) ?? [];
}
export function useCategories() {
  return useQuery<string[], Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
  });
}


// upsert a category
export async function upsertCategory(name: string): Promise<void> {
  const { error } = await supabase.from("categories").upsert({ name });
  if (error) throw error;
}

/** Mutation hook to create/update a category */
export function useUpsertCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertCategory,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["categories"] }),
  });
}