import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export interface State {
  id: number;
  name: string;
  code: string;
}

export interface District {
  id: number;
  name: string;
  state_id: number;
  state?: State;
}

// Get all states
export const useStates = () => {
  return useQuery({
    queryKey: ["states"],
    queryFn: async () => {
      const { data, error } = await supabase.from("states").select("*").order("name");

      if (error) throw error;
      return data as State[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Get districts by state
export const useDistrictsByState = (stateId?: number) => {
  return useQuery({
    queryKey: ["districts", stateId],
    queryFn: async () => {
      if (!stateId) return [];

      const { data, error } = await supabase
        .from("districts")
        .select("*")
        .eq("state_id", stateId)
        .order("name");

      if (error) throw error;
      return data as District[];
    },
    enabled: !!stateId,
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Get all districts with state info
export const useAllDistricts = () => {
  return useQuery({
    queryKey: ["all-districts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("districts")
        .select(
          `
          *,
          state:states(*)
        `
        )
        .order("name");

      if (error) throw error;
      return data as (District & { state: State })[];
    },
    staleTime: 1000 * 60 * 60, // 1 hour
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });
};

// Search locations
export const useLocationSearch = (searchTerm: string) => {
  return useQuery({
    queryKey: ["location-search", searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 2) return [];

      const { data, error } = await supabase
        .from("districts")
        .select(
          `
          *,
          state:states(*)
        `
        )
        .or(`name.ilike.%${searchTerm}%,state.name.ilike.%${searchTerm}%`)
        .order("name")
        .limit(10);

      if (error) throw error;
      return data as (District & { state: State })[];
    },
    enabled: !!searchTerm && searchTerm.length >= 2,
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
};
