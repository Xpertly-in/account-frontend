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
    // Build a simple query without complex joins for search
    let query = supabase.from("leads").select(`
        *,
        profiles!leads_customer_id_fkey(name),
        lead_engagements!left(
          ca_id,
          viewed_at,
          is_hidden,
          hidden_at,
          notes,
          updated_at
        )
      `);

    // Apply basic filters first (these work fine with joins)
    if (filter?.urgency && filter.urgency.length > 0) {
      query = query.in("urgency", filter.urgency);
    }
    if (filter?.services && filter.services.length > 0) {
      query = query.overlaps("services", filter.services);
    }
    if (filter?.status && filter.status.length > 0) {
      query = query.in("status", filter.status);
    }
    if (filter?.dateRange) {
      query = query.gte("created_at", filter.dateRange.from).lte("created_at", filter.dateRange.to);
    }

    // For search, we'll apply it after fetching the data to avoid Supabase join issues
    // Execute main query (no search at DB level to avoid join conflicts)
    const { data, error } = await query.order("created_at", { ascending: false });
    if (error) throw error;

    // Transform data and apply CA-specific filtering
    let transformedData =
      data?.map((lead: any) => {
        // Find engagement for this specific CA
        const engagement = lead.lead_engagements?.find((eng: any) => eng.ca_id === caId);

        return {
          id: lead.id,
          customerId: lead.customer_id,
          customerName: lead.profiles?.name || "Unknown Customer",
          profilePicture: lead.profiles?.profile_picture || undefined,
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

    // Apply CA-specific filtering after transformation
    if (caId && !filter?.includeHidden) {
      transformedData = transformedData.filter(lead => !lead.isHidden);
    }

    // Apply search filtering in JavaScript (to avoid Supabase join issues)
    if (filter?.search && filter.search.trim()) {
      const searchTerm = filter.search.trim().toLowerCase();

      transformedData = transformedData.filter(lead => {
        // Search across all relevant fields
        const searchableText = [
          lead.customerName,
          lead.location.city,
          lead.location.state,
          lead.contactInfo,
          lead.notes,
          lead.urgency,
          lead.status,
          lead.contactPreference,
          ...(lead.services || []),
        ]
          .join(" ")
          .toLowerCase();

        return searchableText.includes(searchTerm);
      });
    }

    // Calculate pagination metadata
    const actualCount = transformedData.length;
    const currentPage = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 5; // Default to 5 leads per page

    // Apply pagination to transformed data
    let paginatedData = transformedData;
    if (pagination || actualCount > 5) {
      // Apply pagination if specified or if more than 5 leads
      const from = (currentPage - 1) * pageSize;
      const to = from + pageSize;
      paginatedData = transformedData.slice(from, to);
    }

    const totalPages = Math.ceil(actualCount / pageSize);
    const hasNextPage = currentPage < totalPages;
    const hasPreviousPage = currentPage > 1;

    return {
      data: paginatedData,
      error: null,
      totalCount: actualCount,
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
    staleTime: 0, // Always refetch when query key changes
    refetchOnWindowFocus: false,
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
