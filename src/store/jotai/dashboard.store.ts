import { atom } from "jotai/vanilla";
import { atomWithStorage } from "jotai/utils";
import {
  DashboardSection,
  DashboardState,
  PostComposerState,
} from "@/types/dashboard/dashboard.type";
import { Lead, LeadSortField, SortDirection } from "@/types/dashboard/lead.type";
import { ContactRequest } from "@/types/dashboard/contact-request.type";
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
    sort: { field: "timestamp", direction: "desc" },
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
 * Fetch leads atom - action to fetch leads from Supabase
 */
export const fetchLeadsAtom = atom(null, async (get, set, caId?: string) => {
  // Set loading state
  set(leadsLoadingAtom, true);

  try {
    const { data, error } = await fetchLeads(caId);

    if (error) {
      set(leadsErrorAtom, error.message || "Failed to fetch leads");
      set(leadsDataAtom, []);
    } else {
      set(leadsDataAtom, data || []);
      set(leadsErrorAtom, null);
    }
  } catch (error) {
    console.error("Error in fetchLeadsAtom:", error);
    set(leadsErrorAtom, "An unexpected error occurred");
    set(leadsDataAtom, []);
  } finally {
    set(leadsLoadingAtom, false);
  }
});

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
