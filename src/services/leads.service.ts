import { supabase } from "@/helper/supabase.helper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import {
  Lead,
  LeadFilter,
  PaginationParams,
  PaginatedLeadsResponse,
} from "@/types/dashboard/lead.type";

// ============================================================================
// CORE SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetches leads from the database with pagination support and CA-specific preferences
 */
export const fetchLeads = async (
  caId?: string,
  filter?: LeadFilter,
  pagination?: PaginationParams
): Promise<PaginatedLeadsResponse> => {
  try {
    // Build base query for counting
    let countQuery = supabase.from("leads").select("*", { count: "exact", head: true });

    // Build main query with proper joins
    let query = supabase.from("leads").select(`
        *,
        profiles!leads_customer_id_fkey(name),
        lead_engagements!left(
          viewed_at,
          is_hidden,
          hidden_at,
          notes,
          updated_at
        )
      `);

    // Apply CA-specific filtering if caId is provided
    if (caId) {
      query = query.eq("lead_engagements.ca_id", caId);
      if (!filter?.includeHidden) {
        query = query.not("lead_engagements.is_hidden", "eq", true);
      }
    }

    // Apply other filters
    if (filter?.urgency && filter.urgency.length > 0) {
      query = query.in("urgency", filter.urgency);
      countQuery = countQuery.in("urgency", filter.urgency);
    }
    if (filter?.services && filter.services.length > 0) {
      query = query.overlaps("services", filter.services);
      countQuery = countQuery.overlaps("services", filter.services);
    }
    if (filter?.status && filter.status.length > 0) {
      query = query.in("status", filter.status);
      countQuery = countQuery.in("status", filter.status);
    }
    if (filter?.dateRange) {
      query = query.gte("created_at", filter.dateRange.from).lte("created_at", filter.dateRange.to);
      countQuery = countQuery
        .gte("created_at", filter.dateRange.from)
        .lte("created_at", filter.dateRange.to);
    }

    // Apply search functionality
    if (filter?.search && filter.search.trim()) {
      const searchTerm = filter.search.trim();
      const searchConditions = [
        `profiles.name.ilike.%${searchTerm}%`,
        `location_city.ilike.%${searchTerm}%`,
        `location_state.ilike.%${searchTerm}%`,
      ];
      query = query.or(searchConditions.join(","));
      countQuery = countQuery.or(searchConditions.join(","));
      query = query.or(`services.cs.{${searchTerm}}`);
      countQuery = countQuery.or(`services.cs.{${searchTerm}}`);
    }

    // Get total count
    const { count, error: countError } = await countQuery;
    if (countError) throw countError;

    // Apply pagination
    if (pagination) {
      const { page, pageSize } = pagination;
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;
      query = query.range(from, to);
    }

    // Execute main query
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    // Transform data
    const transformedData =
      data?.map((lead: any) => {
        const engagement = lead.lead_engagements?.[0];
        return {
          id: lead.id,
          customerId: lead.customer_id,
          customerName: lead.profiles?.name || "Unknown Customer",
          services: lead.services || [],
          urgency: lead.urgency,
          location: {
            city: lead.location_city || "",
            state: lead.location_state || "",
          },
          contactPreference: lead.contact_preference,
          contactInfo: lead.contact_info,
          notes: lead.notes,
          timestamp: lead.created_at,
          status: lead.status,
          engagementCount: 0,
          hasEngagement: !!engagement,
          isHidden: engagement?.is_hidden || false,
          hiddenAt: engagement?.hidden_at,
          caNotes: engagement?.notes,
        };
      }) || [];

    // Calculate pagination metadata
    const totalCount = count || 0;
    const currentPage = pagination?.page || 1;
    const pageSize = pagination?.pageSize || totalCount;
    const totalPages = Math.ceil(totalCount / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      data: transformedData,
      error: null,
      totalCount,
      hasNextPage,
      hasPreviousPage,
      currentPage,
      pageSize,
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching leads:", error);
    return {
      data: [],
      error,
      totalCount: 0,
      hasNextPage: false,
      hasPreviousPage: false,
      currentPage: 1,
      pageSize: pagination?.pageSize || 10,
      totalPages: 0,
    };
  }
};

/**
 * Creates a new lead engagement record
 */
const createLeadEngagement = async (leadId: string, caId: string) => {
  const engagement = {
    lead_id: leadId,
    ca_id: caId,
    viewed_at: new Date().toISOString(),
    is_hidden: false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("lead_engagements")
    .insert(engagement)
    .select()
    .single();

  if (error) throw error;

  // Update lead status to "contacted"
  await supabase
    .from("leads")
    .update({ status: "contacted", updated_at: new Date().toISOString() })
    .eq("id", leadId)
    .eq("status", "new");

  return data;
};

/**
 * Hides a lead for a specific CA
 */
const hideLead = async (leadId: string, caId: string) => {
  const { data, error } = await supabase
    .from("lead_engagements")
    .upsert(
      {
        lead_id: leadId,
        ca_id: caId,
        is_hidden: true,
        hidden_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lead_id,ca_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Unhides a lead for a specific CA
 */
const unhideLead = async (leadId: string, caId: string) => {
  const { data, error } = await supabase
    .from("lead_engagements")
    .upsert(
      {
        lead_id: leadId,
        ca_id: caId,
        is_hidden: false,
        hidden_at: null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "lead_id,ca_id" }
    )
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================================================
// TANSTACK QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch leads with TanStack Query
 */
export const useLeads = (filter?: LeadFilter, pagination?: PaginationParams) => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["leads", auth.user?.id, filter, pagination],
    queryFn: () => fetchLeads(auth.user?.id, filter, pagination),
    enabled: !!auth.user?.id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  return {
    leads: data?.data || [],
    totalCount: data?.totalCount || 0,
    hasNextPage: data?.hasNextPage || false,
    hasPreviousPage: data?.hasPreviousPage || false,
    currentPage: data?.currentPage || 1,
    pageSize: data?.pageSize || 10,
    totalPages: data?.totalPages || 0,
    isLoading,
    isError,
    error,
    refetch,
  };
};

/**
 * Hook to create lead engagement
 */
export const useCreateEngagement = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: (leadId: string) => createLeadEngagement(leadId, auth.user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    createEngagement: mutate,
  };
};

/**
 * Hook to hide/unhide leads
 */
export const useHideLead = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const hideMutation = useMutation({
    mutationFn: (leadId: string) => hideLead(leadId, auth.user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  const unhideMutation = useMutation({
    mutationFn: (leadId: string) => unhideLead(leadId, auth.user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });

  return {
    hideLead: hideMutation.mutate,
    unhideLead: unhideMutation.mutate,
    isHiding: hideMutation.isPending,
    isUnhiding: unhideMutation.isPending,
    hideError: hideMutation.error,
    unhideError: unhideMutation.error,
  };
};
