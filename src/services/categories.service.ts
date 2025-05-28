// src/services/forum.service.ts
import { supabase } from "@/helper/supabase.helper";
import { useQuery } from "@tanstack/react-query";

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