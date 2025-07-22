import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Language type based on the new languages table
export interface Language {
  id: number;
  name: string;
  code?: string;
  native_name?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Language map for easy reference
export type LanguageMap = Map<number, Language>;

/**
 * Fetch all active languages from the database
 */
export async function fetchLanguages(): Promise<Language[]> {
  const { data, error } = await supabase
    .from("languages")
    .select("*")
    .eq("is_active", true)
    .order("name");

  if (error) {
    console.error("Error fetching languages:", error);
    throw new Error("Failed to fetch languages");
  }

  return data || [];
}

/**
 * Create a language map for easy ID-to-language lookups
 */
export function createLanguageMap(languages: Language[]): LanguageMap {
  return new Map(languages.map(lang => [lang.id, lang]));
}

/**
 * Get language names from an array of language IDs
 */
export function getLanguageNames(languageIds: number[], languageMap: LanguageMap): string[] {
  return languageIds.map(id => languageMap.get(id)?.name).filter(Boolean) as string[];
}

/**
 * Get language IDs from an array of language names
 */
export function getLanguageIds(languageNames: string[], languageMap: LanguageMap): number[] {
  const nameToIdMap = new Map(
    Array.from(languageMap.values()).map(lang => [lang.name.toLowerCase(), lang.id])
  );

  return languageNames.map(name => nameToIdMap.get(name.toLowerCase())).filter(Boolean) as number[];
}

/**
 * Hook to fetch all languages with caching
 */
export function useLanguages() {
  return useQuery({
    queryKey: ["languages"],
    queryFn: fetchLanguages,
    staleTime: 60 * 60 * 1000, // 1 hour - languages don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get language map for easy lookups
 */
export function useLanguageMap() {
  const { data: languages = [], ...rest } = useLanguages();

  const languageMap = createLanguageMap(languages);

  return {
    languageMap,
    languages,
    ...rest,
  };
}
