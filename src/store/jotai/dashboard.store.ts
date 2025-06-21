import { atom } from "jotai/vanilla";
import { atomWithStorage } from "jotai/utils";
import {
  DashboardSection,
  DashboardState,
  PostComposerState,
} from "@/types/dashboard/dashboard.type";
import { Lead, LeadSortField, LeadFilter } from "@/types/dashboard/lead.type";
import { ContactRequest, ContactRequestSortField } from "@/types/dashboard/contact-request.type";
import { SortDirection, PaginationParams } from "@/types/common.type";
import { DASHBOARD_PAGINATION } from "@/constants/dashboard.constants";
import { fetchLeads } from "@/services/leads.service";

/**
 * Initial dashboard state
 */
const initialDashboardState: DashboardState = {
  activeSection: DashboardSection.LEADS,
  leads: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    filter: {},
    sort: { field: LeadSortField.TIMESTAMP, direction: SortDirection.DESC },
    page: DASHBOARD_PAGINATION.INITIAL_PAGE,
    pageSize: DASHBOARD_PAGINATION.DEFAULT_PAGE_SIZE,
  },
  contactRequests: {
    data: [],
    isLoading: false,
    error: null,
    totalCount: 0,
    filter: {},
    sort: { field: ContactRequestSortField.CREATED_AT, direction: SortDirection.DESC },
    page: DASHBOARD_PAGINATION.INITIAL_PAGE,
    pageSize: DASHBOARD_PAGINATION.DEFAULT_PAGE_SIZE,
  },
  metrics: {
    newLeadsCount: 0,
    unreadContactRequestsCount: 0,
    totalLeadsThisMonth: 0,
    leadResponseRate: 0,
    avgResponseTime: 0,
  },
  notifications: {
    isEnabled: true,
    unreadCount: 0,
  },
};

/**
 * Initial post composer state
 */
const initialPostComposerState: PostComposerState = {
  title: "",
  content: "",
  hashtags: [],
  images: [],
  isDraft: false,
  isLoading: false,
  error: null,
};

/**
 * Active section atom - persists across sessions
 */
export const activeSectionAtom = atomWithStorage<DashboardSection>(
  "xpertly_ca_dashboard_active_section",
  DashboardSection.LEADS
);

/**
 * Dashboard state atom
 */
export const dashboardStateAtom = atom<DashboardState>(initialDashboardState);

/**
 * Leads loading atom
 */
export const leadsLoadingAtom = atom(
  get => get(dashboardStateAtom).leads.isLoading,
  (get, set, isLoading: boolean) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        isLoading,
      },
    });
  }
);

/**
 * Leads data atom
 */
export const leadsDataAtom = atom(
  get => get(dashboardStateAtom).leads.data,
  (get, set, data: Lead[]) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        data,
        isLoading: false,
        error: null,
      },
    });
  }
);

/**
 * Leads error atom
 */
export const leadsErrorAtom = atom(
  get => get(dashboardStateAtom).leads.error,
  (get, set, error: string | null) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        error,
        isLoading: false,
      },
    });
  }
);

/**
 * Pagination atoms for leads
 */
export const leadsPageAtom = atom(
  get => get(dashboardStateAtom).leads.page,
  (get, set, page: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        page,
      },
    });
  }
);

export const leadsPageSizeAtom = atom(
  get => get(dashboardStateAtom).leads.pageSize,
  (get, set, pageSize: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        pageSize,
        page: 1, // Reset to first page when changing page size
      },
    });
  }
);

export const leadsTotalCountAtom = atom(
  get => get(dashboardStateAtom).leads.totalCount,
  (get, set, totalCount: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        totalCount,
      },
    });
  }
);

/**
 * Computed pagination metadata atoms
 */
export const leadsTotalPagesAtom = atom(get => {
  const { totalCount, pageSize } = get(dashboardStateAtom).leads;
  return pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
});

export const leadsHasNextPageAtom = atom(get => {
  const { page } = get(dashboardStateAtom).leads;
  const totalPages = get(leadsTotalPagesAtom);
  return page < totalPages;
});

export const leadsHasPreviousPageAtom = atom(get => {
  const { page } = get(dashboardStateAtom).leads;
  return page > 1;
});

/**
 * Pagination action atoms
 */
export const leadsNextPageAtom = atom(null, (get, set) => {
  const hasNext = get(leadsHasNextPageAtom);
  if (hasNext) {
    const currentPage = get(leadsPageAtom);
    set(leadsPageAtom, currentPage + 1);
  }
});

export const leadsPreviousPageAtom = atom(null, (get, set) => {
  const hasPrevious = get(leadsHasPreviousPageAtom);
  if (hasPrevious) {
    const currentPage = get(leadsPageAtom);
    set(leadsPageAtom, currentPage - 1);
  }
});

export const leadsGoToPageAtom = atom(null, (get, set, page: number) => {
  const totalPages = get(leadsTotalPagesAtom);
  if (page >= 1 && page <= totalPages) {
    set(leadsPageAtom, page);
  }
});

/**
 * Search atoms for leads
 */
export const leadsSearchAtom = atom(
  get => get(dashboardStateAtom).leads.filter.search || "",
  (get, set, search: string) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        filter: {
          ...current.leads.filter,
          search,
        },
        page: 1, // Reset to first page when search changes
      },
    });
  }
);

/**
 * Filter atoms for leads
 */
export const leadsFilterAtom = atom(
  get => get(dashboardStateAtom).leads.filter,
  (get, set, filter: LeadFilter) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      leads: {
        ...current.leads,
        filter,
        page: 1, // Reset to first page when filter changes
      },
    });
  }
);

/**
 * Updated fetch leads atom with pagination support
 */
export const fetchLeadsAtom = atom(
  null,
  async (get, set, caId?: string, filter?: LeadFilter, pagination?: PaginationParams) => {
    // Set loading state
    set(leadsLoadingAtom, true);

    try {
      // Use provided pagination or get from store
      const paginationParams = pagination || {
        page: get(leadsPageAtom),
        pageSize: get(leadsPageSizeAtom),
      };

      const result = await fetchLeads(caId, filter, paginationParams);

      if (result.error) {
        set(leadsErrorAtom, result.error.message || "Failed to fetch leads");
        set(leadsDataAtom, []);
        set(leadsTotalCountAtom, 0);
      } else {
        set(leadsDataAtom, result.data || []);
        set(leadsErrorAtom, null);
        set(leadsTotalCountAtom, result.totalCount);

        // Update pagination state if it was provided
        if (pagination) {
          set(leadsPageAtom, pagination.page);
          set(leadsPageSizeAtom, pagination.pageSize);
        }
      }
    } catch (error) {
      console.error("Error in fetchLeadsAtom:", error);
      set(leadsErrorAtom, "An unexpected error occurred");
      set(leadsDataAtom, []);
      set(leadsTotalCountAtom, 0);
    } finally {
      set(leadsLoadingAtom, false);
    }
  }
);

/**
 * Contact requests loading atom
 */
export const contactRequestsLoadingAtom = atom(
  get => get(dashboardStateAtom).contactRequests.isLoading,
  (get, set, isLoading: boolean) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        isLoading,
      },
    });
  }
);

/**
 * Contact requests data atom
 */
export const contactRequestsDataAtom = atom(
  get => get(dashboardStateAtom).contactRequests.data,
  (get, set, data: ContactRequest[]) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        data,
        isLoading: false,
        error: null,
      },
    });
  }
);

/**
 * Dashboard metrics atom
 */
export const metricsAtom = atom(
  get => get(dashboardStateAtom).metrics,
  (get, set, metrics: DashboardState["metrics"]) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      metrics,
    });
  }
);

/**
 * Post composer state atom with draft storage
 */
export const postComposerAtom = atomWithStorage<PostComposerState>(
  "xpertly_ca_dashboard_post_draft",
  initialPostComposerState
);

/**
 * Reset dashboard state action
 */
export const resetDashboardAction = atom(null, (get, set) => {
  set(dashboardStateAtom, initialDashboardState);
  set(postComposerAtom, initialPostComposerState);
});
