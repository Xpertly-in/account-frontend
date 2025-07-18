import { atom } from "jotai/vanilla";
import { atomWithStorage } from "jotai/utils";
import {
  DashboardSection,
  DashboardState,
  PostComposerState,
} from "@/types/dashboard/dashboard.type";
import {
  ContactRequest,
  ContactRequestSortField,
  ContactRequestFilter,
} from "@/types/dashboard/contact-request.type";
import { SortDirection, PaginationParams } from "@/types/common.type";
import { DASHBOARD_PAGINATION } from "@/constants/dashboard.constants";
import { fetchContactRequests } from "@/services/contact-requests.service";

/**
 * Initial dashboard state
 */
const initialDashboardState: DashboardState = {
  activeSection: DashboardSection.CONTACT_REQUESTS, // Set default to contact requests or another valid section
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
    unreadContactRequestsCount: 0,
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
  DashboardSection.CONTACT_REQUESTS // Set to a valid section
);

/**
 * Dashboard state atom
 */
export const dashboardStateAtom = atom<DashboardState>(initialDashboardState);

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
 * Contact requests error atom
 */
export const contactRequestsErrorAtom = atom(
  get => get(dashboardStateAtom).contactRequests.error,
  (get, set, error: string | null) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        error,
        isLoading: false,
      },
    });
  }
);

/**
 * Pagination atoms for contact requests
 */
export const contactRequestsPageAtom = atom(
  get => get(dashboardStateAtom).contactRequests.page,
  (get, set, page: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        page,
      },
    });
  }
);

export const contactRequestsPageSizeAtom = atom(
  get => get(dashboardStateAtom).contactRequests.pageSize,
  (get, set, pageSize: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        pageSize,
        page: 1, // Reset to first page when changing page size
      },
    });
  }
);

export const contactRequestsTotalCountAtom = atom(
  get => get(dashboardStateAtom).contactRequests.totalCount,
  (get, set, totalCount: number) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        totalCount,
      },
    });
  }
);

/**
 * Computed pagination metadata atoms for contact requests
 */
export const contactRequestsTotalPagesAtom = atom(get => {
  const { totalCount, pageSize } = get(dashboardStateAtom).contactRequests;
  return pageSize > 0 ? Math.ceil(totalCount / pageSize) : 1;
});

export const contactRequestsHasNextPageAtom = atom(get => {
  const { page } = get(dashboardStateAtom).contactRequests;
  const totalPages = get(contactRequestsTotalPagesAtom);
  return page < totalPages;
});

export const contactRequestsHasPreviousPageAtom = atom(get => {
  const { page } = get(dashboardStateAtom).contactRequests;
  return page > 1;
});

/**
 * Pagination action atoms for contact requests
 */
export const contactRequestsNextPageAtom = atom(null, (get, set) => {
  const hasNext = get(contactRequestsHasNextPageAtom);
  if (hasNext) {
    const currentPage = get(contactRequestsPageAtom);
    set(contactRequestsPageAtom, currentPage + 1);
  }
});

export const contactRequestsPreviousPageAtom = atom(null, (get, set) => {
  const hasPrevious = get(contactRequestsHasPreviousPageAtom);
  if (hasPrevious) {
    const currentPage = get(contactRequestsPageAtom);
    set(contactRequestsPageAtom, currentPage - 1);
  }
});

export const contactRequestsGoToPageAtom = atom(null, (get, set, page: number) => {
  const totalPages = get(contactRequestsTotalPagesAtom);
  if (page >= 1 && page <= totalPages) {
    set(contactRequestsPageAtom, page);
  }
});

/**
 * Search atoms for contact requests
 */
export const contactRequestsSearchAtom = atom(
  get => get(dashboardStateAtom).contactRequests.filter.search || "",
  (get, set, search: string) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        filter: {
          ...current.contactRequests.filter,
          search,
        },
        page: 1, // Reset to first page when search changes
      },
    });
  }
);

/**
 * Filter atoms for contact requests
 */
export const contactRequestsFilterAtom = atom(
  get => get(dashboardStateAtom).contactRequests.filter,
  (get, set, filter: ContactRequestFilter) => {
    const current = get(dashboardStateAtom);
    set(dashboardStateAtom, {
      ...current,
      contactRequests: {
        ...current.contactRequests,
        filter,
        page: 1, // Reset to first page when filter changes
      },
    });
  }
);

/**
 * Fetch contact requests atom with pagination support
 */
export const fetchContactRequestsAtom = atom(
  null,
  async (get, set, caId?: string, filter?: ContactRequestFilter, pagination?: PaginationParams) => {
    // Set loading state
    set(contactRequestsLoadingAtom, true);

    try {
      // Use provided pagination or get from store
      const paginationParams = pagination || {
        page: get(contactRequestsPageAtom),
        pageSize: get(contactRequestsPageSizeAtom),
      };

      const result = await fetchContactRequests(caId, filter, paginationParams);

      if (result.error) {
        set(contactRequestsErrorAtom, result.error.message || "Failed to fetch contact requests");
        set(contactRequestsDataAtom, []);
        set(contactRequestsTotalCountAtom, 0);
      } else {
        set(contactRequestsDataAtom, result.data || []);
        set(contactRequestsErrorAtom, null);
        set(contactRequestsTotalCountAtom, result.totalCount);

        // Update pagination state if it was provided
        if (pagination) {
          set(contactRequestsPageAtom, pagination.page);
          set(contactRequestsPageSizeAtom, pagination.pageSize);
        }
      }
    } catch (error) {
      console.error("Error in fetchContactRequestsAtom:", error);
      set(contactRequestsErrorAtom, "An unexpected error occurred");
      set(contactRequestsDataAtom, []);
      set(contactRequestsTotalCountAtom, 0);
    } finally {
      set(contactRequestsLoadingAtom, false);
    }
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
