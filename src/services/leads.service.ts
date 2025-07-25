import { supabase } from "@/helper/supabase.helper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import {
  LeadFilter,
  LeadSort,
  PaginationParams,
  PaginatedLeadsResponse,
  FilterOption,
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
  pagination?: PaginationParams,
  sort?: LeadSort
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
    if (filter?.location && filter.location.length > 0) {
      query = query.in("location_city", filter.location);
    }
    if (filter?.dateRange) {
      query = query.gte("created_at", filter.dateRange.from).lte("created_at", filter.dateRange.to);
    }

    // For search and sorting, we'll apply them after fetching the data to avoid Supabase join issues
    // Execute main query (no sorting at DB level to avoid join conflicts)
    const { data, error } = await query;
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

    // Apply sorting
    if (sort) {
      transformedData.sort((a, b) => {
        let aValue: any;
        let bValue: any;

        switch (sort.field) {
          case "timestamp":
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
            break;
          case "urgency":
            // Define urgency priority order (higher priority = lower number)
            const urgencyPriority = {
              Immediately: 1,
              "Within a week": 2,
              "This month": 3,
              "Just exploring": 4,
            };
            aValue = urgencyPriority[a.urgency as keyof typeof urgencyPriority] || 999;
            bValue = urgencyPriority[b.urgency as keyof typeof urgencyPriority] || 999;
            break;

          default:
            aValue = new Date(a.timestamp).getTime();
            bValue = new Date(b.timestamp).getTime();
        }

        // For urgency, we want to invert the logic since lower numbers = higher priority
        if (sort.field === "urgency") {
          if (sort.direction === "asc") {
            // asc = least urgent first (higher numbers first)
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          } else {
            // desc = most urgent first (lower numbers first) - this is the intuitive default
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          }
        } else {
          // Normal sorting for other fields
          if (sort.direction === "asc") {
            return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
          } else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
          }
        }
      });
    } else {
      // Default sorting: newest first
      transformedData.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
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
// FILTER OPTIONS SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetches all filter options in a single API call for better performance
 * Supports dependent filtering where options are filtered based on current selections
 */
export const fetchAllFilterOptions = async (
  currentFilter?: Partial<LeadFilter>
): Promise<{
  data: {
    status: FilterOption[];
    urgency: FilterOption[];
    services: FilterOption[];
    contactPreference: FilterOption[];
    location: FilterOption[];
  };
  error: any;
}> => {
  try {
    // Build query with dependent filtering
    let query = supabase
      .from("leads")
      .select("status, urgency, services, contact_preference, location_city, location_state")
      .not("status", "is", null)
      .not("urgency", "is", null)
      .not("services", "is", null)
      .not("contact_preference", "is", null)
      .not("location_city", "is", null)
      .not("location_state", "is", null);

    // Apply dependent filters to narrow down the dataset
    if (currentFilter?.status && currentFilter.status.length > 0) {
      query = query.in("status", currentFilter.status);
    }
    if (currentFilter?.urgency && currentFilter.urgency.length > 0) {
      query = query.in("urgency", currentFilter.urgency);
    }
    if (currentFilter?.services && currentFilter.services.length > 0) {
      query = query.overlaps("services", currentFilter.services);
    }
    if (currentFilter?.location && currentFilter.location.length > 0) {
      query = query.in("location_city", currentFilter.location);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process status options
    const statusCounts = data.reduce((acc: Record<string, number>, lead) => {
      if (lead.status) acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    const statusOptions: FilterOption[] = Object.entries(statusCounts).map(([value, count]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    }));

    // Process urgency options
    const urgencyCounts = data.reduce((acc: Record<string, number>, lead) => {
      if (lead.urgency) acc[lead.urgency] = (acc[lead.urgency] || 0) + 1;
      return acc;
    }, {});

    const urgencyOptions: FilterOption[] = Object.entries(urgencyCounts).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));

    // Process services options
    const serviceCounts = data.reduce((acc: Record<string, number>, lead) => {
      if (lead.services && Array.isArray(lead.services)) {
        lead.services.forEach((service: string) => {
          acc[service] = (acc[service] || 0) + 1;
        });
      }
      return acc;
    }, {});

    const servicesOptions: FilterOption[] = Object.entries(serviceCounts)
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Process contact preference options
    const preferenceCounts = data.reduce((acc: Record<string, number>, lead) => {
      if (lead.contact_preference)
        acc[lead.contact_preference] = (acc[lead.contact_preference] || 0) + 1;
      return acc;
    }, {});

    const contactPreferenceOptions: FilterOption[] = Object.entries(preferenceCounts).map(
      ([value, count]) => ({
        value,
        label: value,
        count,
      })
    );

    // Process location options (cities only)
    const cityCounts = data.reduce((acc: Record<string, number>, lead) => {
      const city = lead.location_city;
      if (city) {
        acc[city] = (acc[city] || 0) + 1;
      }
      return acc;
    }, {});

    const locationOptions: FilterOption[] = Object.entries(cityCounts)
      .map(([city, count]) => ({
        value: city,
        label: city,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    return {
      data: {
        status: statusOptions,
        urgency: urgencyOptions,
        services: servicesOptions,
        contactPreference: contactPreferenceOptions,
        location: locationOptions,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching all filter options:", error);
    return {
      data: {
        status: [],
        urgency: [],
        services: [],
        contactPreference: [],
        location: [],
      },
      error,
    };
  }
};

// ============================================================================
// TANSTACK QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch leads with TanStack Query
 */
export const useLeads = (filter?: LeadFilter, pagination?: PaginationParams, sort?: LeadSort) => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["leads", auth.user?.id, filter, pagination, sort],
    queryFn: () => fetchLeads(auth.user?.id, filter, pagination, sort),
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

// ============================================================================
// FILTER OPTIONS TANSTACK QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch all filter options in a single API call
 * Supports dependent filtering where options update based on current filter state
 */
export const useAllFilterOptions = (currentFilter?: Partial<LeadFilter>) => {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["filter-options", "all", currentFilter],
    queryFn: () => fetchAllFilterOptions(currentFilter),
    staleTime: 5 * 60 * 1000, // 5 minutes for dependent filters (shorter cache)
    refetchOnWindowFocus: false,
  });

  return {
    statusOptions: data?.data.status || [],
    urgencyOptions: data?.data.urgency || [],
    servicesOptions: data?.data.services || [],
    contactPreferenceOptions: data?.data.contactPreference || [],
    locationOptions: data?.data.location || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
