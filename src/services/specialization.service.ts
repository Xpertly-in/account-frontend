import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Specialization Category type based on the new specialization_categories table
export interface SpecializationCategory {
  id: number;
  name: string;
  code: string;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Specialization type based on the new specializations table
export interface Specialization {
  id: number;
  name: string;
  code: string;
  category_id: number;
  description?: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Combined specialization with category info
export interface SpecializationWithCategory extends Specialization {
  category_name: string;
  category_code: string;
  category_description?: string;
  category_display_order: number;
}

// Specialization map for easy reference
export type SpecializationMap = Map<number, Specialization>;
export type SpecializationCategoryMap = Map<number, SpecializationCategory>;

/**
 * Fetch all active specialization categories from the database
 */
export async function fetchSpecializationCategories(): Promise<SpecializationCategory[]> {
  const { data, error } = await supabase
    .from("specialization_categories")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching specialization categories:", error);
    throw new Error("Failed to fetch specialization categories");
  }

  return data || [];
}

/**
 * Fetch all active specializations from the database
 */
export async function fetchSpecializations(): Promise<Specialization[]> {
  const { data, error } = await supabase
    .from("specializations")
    .select("*")
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching specializations:", error);
    throw new Error("Failed to fetch specializations");
  }

  return data || [];
}

/**
 * Fetch specializations with their category information
 */
export async function fetchSpecializationsWithCategories(): Promise<SpecializationWithCategory[]> {
  const { data, error } = await supabase
    .from("specializations_with_categories")
    .select("*")
    .eq("is_active", true);

  if (error) {
    console.error("Error fetching specializations with categories:", error);
    throw new Error("Failed to fetch specializations with categories");
  }

  return data || [];
}

/**
 * Fetch specializations by category
 */
export async function fetchSpecializationsByCategory(
  categoryId: number
): Promise<Specialization[]> {
  const { data, error } = await supabase
    .from("specializations")
    .select("*")
    .eq("category_id", categoryId)
    .eq("is_active", true)
    .order("display_order");

  if (error) {
    console.error("Error fetching specializations by category:", error);
    throw new Error("Failed to fetch specializations by category");
  }

  return data || [];
}

/**
 * Create specialization maps for easy ID-to-specialization lookups
 */
export function createSpecializationMap(specializations: Specialization[]): SpecializationMap {
  return new Map(specializations.map(spec => [spec.id, spec]));
}

export function createSpecializationCategoryMap(
  categories: SpecializationCategory[]
): SpecializationCategoryMap {
  return new Map(categories.map(cat => [cat.id, cat]));
}

/**
 * Get specialization names from an array of specialization IDs
 */
export function getSpecializationNames(
  specializationIds: number[],
  specializationMap: SpecializationMap
): string[] {
  return specializationIds.map(id => specializationMap.get(id)?.name).filter(Boolean) as string[];
}

/**
 * Get specialization IDs from an array of specialization names
 */
export function getSpecializationIds(
  specializationNames: string[],
  specializationMap: SpecializationMap
): number[] {
  const nameToIdMap = new Map(
    Array.from(specializationMap.values()).map(spec => [spec.name.toLowerCase(), spec.id])
  );

  return specializationNames
    .map(name => nameToIdMap.get(name.toLowerCase()))
    .filter(Boolean) as number[];
}

/**
 * Group specializations by category
 */
export function groupSpecializationsByCategory(
  specializations: SpecializationWithCategory[]
): Record<string, SpecializationWithCategory[]> {
  return specializations.reduce((acc, spec) => {
    const categoryName = spec.category_name;
    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(spec);
    return acc;
  }, {} as Record<string, SpecializationWithCategory[]>);
}

/**
 * Hook to fetch all specialization categories with caching
 */
export function useSpecializationCategories() {
  return useQuery({
    queryKey: ["specialization-categories"],
    queryFn: fetchSpecializationCategories,
    staleTime: 60 * 60 * 1000, // 1 hour - categories don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch all specializations with caching
 */
export function useSpecializations() {
  return useQuery({
    queryKey: ["specializations"],
    queryFn: fetchSpecializations,
    staleTime: 60 * 60 * 1000, // 1 hour - specializations don't change often
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to fetch specializations with categories
 */
export function useSpecializationsWithCategories() {
  return useQuery({
    queryKey: ["specializations-with-categories"],
    queryFn: fetchSpecializationsWithCategories,
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
  });
}

/**
 * Hook to get specialization maps for easy lookups
 */
export function useSpecializationMaps() {
  const { data: specializations = [], ...specializationsRest } = useSpecializations();
  const { data: categories = [], ...categoriesRest } = useSpecializationCategories();

  const specializationMap = createSpecializationMap(specializations);
  const categoryMap = createSpecializationCategoryMap(categories);

  return {
    specializationMap,
    categoryMap,
    specializations,
    categories,
    isLoading: specializationsRest.isLoading || categoriesRest.isLoading,
    error: specializationsRest.error || categoriesRest.error,
  };
}

/**
 * Hook to fetch specializations by category ID
 */
export function useSpecializationsByCategory(categoryId: number) {
  return useQuery({
    queryKey: ["specializations-by-category", categoryId],
    queryFn: () => fetchSpecializationsByCategory(categoryId),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
    retry: 3,
    refetchOnWindowFocus: false,
    enabled: !!categoryId,
  });
}
