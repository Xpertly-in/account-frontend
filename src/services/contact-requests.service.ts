import { supabase } from "@/helper/supabase.helper";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/store/context/Auth.provider";
import {
  ContactRequest,
  ContactRequestFilter,
  ContactRequestSort,
  ContactRequestStatus,
  CreateContactRequestData,
  UpdateContactRequestData,
} from "@/types/dashboard/contact-request.type";
import { FilterOption, PaginationParams } from "@/types/common.type";

// ============================================================================
// CORE SERVICE FUNCTIONS
// ============================================================================

/**
 * Interface for paginated contact requests response
 */
export interface PaginatedContactRequestsResponse {
  data: ContactRequest[] | null;
  error: any;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

/**
 * Fetches contact requests from the database with pagination support and filtering
 */
export const fetchContactRequests = async (
  caId?: string,
  filter?: ContactRequestFilter,
  pagination?: PaginationParams,
  sort?: ContactRequestSort
): Promise<PaginatedContactRequestsResponse> => {
  try {
    // Build query for contact requests
    let query = supabase
      .from("contact_requests")
      .select("*")
      .eq("ca_id", caId || "");

    // Apply basic filters
    if (filter?.status && filter.status.length > 0) {
      query = query.in("status", filter.status);
    }
    if (filter?.urgency && filter.urgency.length > 0) {
      query = query.in("urgency", filter.urgency);
    }
    if (filter?.contact_preference && filter.contact_preference.length > 0) {
      query = query.in("contact_preference", filter.contact_preference);
    }
    if (filter?.service_needed && filter.service_needed.length > 0) {
      query = query.in("service_needed", filter.service_needed);
    }
    if (filter?.dateRange) {
      if (filter.dateRange.from) {
        query = query.gte("created_at", filter.dateRange.from);
      }
      if (filter.dateRange.to) {
        query = query.lte("created_at", filter.dateRange.to);
      }
    }

    // Execute query
    const { data, error } = await query;
    if (error) throw error;

    // Transform data to match ContactRequest interface
    let transformedData: ContactRequest[] =
      data?.map((request: any) => ({
        id: request.id,
        ca_id: request.ca_id,
        customer_id: request.customer_id,
        customer_name: request.customer_name,
        customer_email: request.customer_email,
        customer_phone: request.customer_phone,
        subject: request.subject,
        message: request.message,
        service_needed: request.service_needed,
        urgency: request.urgency,
        contact_preference: request.contact_preference,
        contact_detail: request.contact_detail,
        location:
          request.location_city && request.location_state
            ? {
                city: request.location_city,
                state: request.location_state,
              }
            : undefined,
        status: request.status,
        ca_private_notes: request.ca_private_notes,
        created_at: request.created_at,
        updated_at: request.updated_at,
        replied_at: request.replied_at,
      })) || [];

    // Apply search filtering in JavaScript
    if (filter?.search && filter.search.trim()) {
      const searchTerm = filter.search.trim().toLowerCase();

      transformedData = transformedData.filter(request => {
        const searchableText = [
          request.customer_name,
          request.subject,
          request.message,
          request.service_needed,
          request.urgency,
          request.contact_preference,
          request.location?.city,
          request.location?.state,
        ]
          .filter(Boolean)
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
          case "created_at":
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
            break;
          case "customer_name":
            aValue = a.customer_name.toLowerCase();
            bValue = b.customer_name.toLowerCase();
            break;
          case "status":
            // Status priority: new > replied > ignored
            const statusPriority = { new: 1, replied: 2, ignored: 3 };
            aValue = statusPriority[a.status as keyof typeof statusPriority] || 999;
            bValue = statusPriority[b.status as keyof typeof statusPriority] || 999;
            break;
          case "urgency":
            // Urgency priority: Immediately > Within a week > This month > Flexible
            const urgencyPriority = {
              Immediately: 1,
              "Within a week": 2,
              "This month": 3,
              Flexible: 4,
            };
            aValue = urgencyPriority[a.urgency as keyof typeof urgencyPriority] || 999;
            bValue = urgencyPriority[b.urgency as keyof typeof urgencyPriority] || 999;
            break;
          default:
            aValue = new Date(a.created_at).getTime();
            bValue = new Date(b.created_at).getTime();
        }

        // Apply sort direction
        if (sort.direction === "asc") {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });
    } else {
      // Default sorting: newest first
      transformedData.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
    }

    // Calculate pagination metadata
    const actualCount = transformedData.length;
    const currentPage = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;

    // Apply pagination to transformed data
    let paginatedData = transformedData;
    if (pagination || actualCount > 10) {
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
    console.error("Error fetching contact requests:", error);
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
 * Creates a new contact request
 */
const createContactRequest = async (data: CreateContactRequestData) => {
  const contactRequest = {
    ca_id: data.ca_id,
    customer_id: data.customer_id || null,
    customer_name: data.customer_name,
    customer_email: data.customer_email,
    customer_phone: data.customer_phone || null,
    subject: data.subject,
    message: data.message,
    service_needed: data.service_needed || null,
    urgency: data.urgency,
    contact_preference: data.contact_preference,
    contact_detail: data.contact_detail,
    location_city: data.location_city || null,
    location_state: data.location_state || null,
    status: "new",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data: result, error } = await supabase
    .from("contact_requests")
    .insert(contactRequest)
    .select()
    .single();

  if (error) throw error;
  return result;
};

/**
 * Updates a contact request status
 */
const updateContactRequestStatus = async (
  requestId: string,
  status: ContactRequestStatus,
  caId: string
) => {
  const updateData: any = {
    status,
    updated_at: new Date().toISOString(),
  };

  // Set replied_at timestamp when status changes to replied
  if (status === ContactRequestStatus.REPLIED) {
    updateData.replied_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("contact_requests")
    .update(updateData)
    .eq("id", requestId)
    .eq("ca_id", caId) // Ensure CA can only update their own requests
    .select()
    .single();

  if (error) throw error;
  return data;
};

/**
 * Updates contact request private notes
 */
const updateContactRequestNotes = async (requestId: string, notes: string, caId: string) => {
  const { data, error } = await supabase
    .from("contact_requests")
    .update({
      ca_private_notes: notes,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("ca_id", caId) // Ensure CA can only update their own requests
    .select()
    .single();

  if (error) throw error;
  return data;
};

// ============================================================================
// FILTER OPTIONS SERVICE FUNCTIONS
// ============================================================================

/**
 * Fetches all filter options for contact requests in a single API call
 */
export const fetchContactRequestFilterOptions = async (
  caId?: string,
  currentFilter?: Partial<ContactRequestFilter>
): Promise<{
  data: {
    status: FilterOption[];
    urgency: FilterOption[];
    service_needed: FilterOption[];
    contact_preference: FilterOption[];
  };
  error: any;
}> => {
  try {
    // Build query with dependent filtering
    let query = supabase
      .from("contact_requests")
      .select("status, urgency, service_needed, contact_preference")
      .eq("ca_id", caId || "")
      .not("status", "is", null)
      .not("urgency", "is", null)
      .not("contact_preference", "is", null);

    // Apply dependent filters to narrow down the dataset
    if (currentFilter?.status && currentFilter.status.length > 0) {
      query = query.in("status", currentFilter.status);
    }
    if (currentFilter?.urgency && currentFilter.urgency.length > 0) {
      query = query.in("urgency", currentFilter.urgency);
    }
    if (currentFilter?.contact_preference && currentFilter.contact_preference.length > 0) {
      query = query.in("contact_preference", currentFilter.contact_preference);
    }
    if (currentFilter?.service_needed && currentFilter.service_needed.length > 0) {
      query = query.in("service_needed", currentFilter.service_needed);
    }

    const { data, error } = await query;

    if (error) throw error;

    // Process status options
    const statusCounts = data.reduce((acc: Record<string, number>, request) => {
      if (request.status) acc[request.status] = (acc[request.status] || 0) + 1;
      return acc;
    }, {});

    const statusOptions: FilterOption[] = Object.entries(statusCounts).map(([value, count]) => ({
      value,
      label: value.charAt(0).toUpperCase() + value.slice(1),
      count,
    }));

    // Process urgency options
    const urgencyCounts = data.reduce((acc: Record<string, number>, request) => {
      if (request.urgency) acc[request.urgency] = (acc[request.urgency] || 0) + 1;
      return acc;
    }, {});

    const urgencyOptions: FilterOption[] = Object.entries(urgencyCounts).map(([value, count]) => ({
      value,
      label: value,
      count,
    }));

    // Process service options
    const serviceCounts = data.reduce((acc: Record<string, number>, request) => {
      if (request.service_needed) {
        acc[request.service_needed] = (acc[request.service_needed] || 0) + 1;
      }
      return acc;
    }, {});

    const serviceOptions: FilterOption[] = Object.entries(serviceCounts)
      .map(([value, count]) => ({
        value,
        label: value,
        count,
      }))
      .sort((a, b) => b.count - a.count);

    // Process contact preference options
    const preferenceCounts = data.reduce((acc: Record<string, number>, request) => {
      if (request.contact_preference)
        acc[request.contact_preference] = (acc[request.contact_preference] || 0) + 1;
      return acc;
    }, {});

    const contactPreferenceOptions: FilterOption[] = Object.entries(preferenceCounts).map(
      ([value, count]) => ({
        value,
        label: value,
        count,
      })
    );

    return {
      data: {
        status: statusOptions,
        urgency: urgencyOptions,
        service_needed: serviceOptions,
        contact_preference: contactPreferenceOptions,
      },
      error: null,
    };
  } catch (error) {
    console.error("Error fetching contact request filter options:", error);
    return {
      data: {
        status: [],
        urgency: [],
        service_needed: [],
        contact_preference: [],
      },
      error,
    };
  }
};

// ============================================================================
// TANSTACK QUERY HOOKS
// ============================================================================

/**
 * Hook to fetch contact requests with TanStack Query
 */
export const useContactRequests = (
  filter?: ContactRequestFilter,
  pagination?: PaginationParams,
  sort?: ContactRequestSort
) => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contact-requests", auth.user?.id, filter, pagination, sort],
    queryFn: () => fetchContactRequests(auth.user?.id, filter, pagination, sort),
    enabled: !!auth.user?.id,
    staleTime: 0, // Always refetch when query key changes
    refetchOnWindowFocus: false,
  });

  return {
    contactRequests: data?.data || [],
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
 * Hook to create contact request
 */
export const useCreateContactRequest = () => {
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: (data: CreateContactRequestData) => createContactRequest(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    createContactRequest: mutate,
  };
};

/**
 * Hook to update contact request status
 */
export const useUpdateContactRequestStatus = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({ requestId, status }: { requestId: string; status: ContactRequestStatus }) =>
      updateContactRequestStatus(requestId, status, auth.user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateStatus: mutate,
  };
};

/**
 * Hook to update contact request notes
 */
export const useUpdateContactRequestNotes = () => {
  const { auth } = useAuth();
  const queryClient = useQueryClient();

  const { data, isPending, isSuccess, isError, error, mutate } = useMutation({
    mutationFn: ({ requestId, notes }: { requestId: string; notes: string }) =>
      updateContactRequestNotes(requestId, notes, auth.user?.id || ""),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-requests"] });
    },
  });

  return {
    data,
    isLoading: isPending,
    isSuccess,
    isError,
    error,
    updateNotes: mutate,
  };
};

/**
 * Hook to fetch contact request filter options
 */
export const useContactRequestFilterOptions = (currentFilter?: Partial<ContactRequestFilter>) => {
  const { auth } = useAuth();

  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["contact-request-filter-options", auth.user?.id, currentFilter],
    queryFn: () => fetchContactRequestFilterOptions(auth.user?.id, currentFilter),
    enabled: !!auth.user?.id,
    staleTime: 5 * 60 * 1000, // 5 minutes for dependent filters
    refetchOnWindowFocus: false,
  });

  return {
    statusOptions: data?.data.status || [],
    urgencyOptions: data?.data.urgency || [],
    serviceOptions: data?.data.service_needed || [],
    contactPreferenceOptions: data?.data.contact_preference || [],
    isLoading,
    isError,
    error,
    refetch,
  };
};
