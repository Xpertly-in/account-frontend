import { ContactRequest, ContactRequestFilter, ContactRequestSort } from "./contact-request.type";

/**
 * Dashboard section types
 */
export enum DashboardSection {
  CONTACT_REQUESTS = "contact-requests",
  ANALYTICS = "analytics",
}

/**
 * Dashboard state interface for CA Dashboard
 */
export interface DashboardState {
  activeSection: DashboardSection;
  contactRequests: {
    data: ContactRequest[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    filter: ContactRequestFilter;
    sort: ContactRequestSort;
    page: number;
    pageSize: number;
  };
  metrics: {
    unreadContactRequestsCount: number;
  };
  notifications: {
    isEnabled: boolean;
    unreadCount: number;
  };
}

/**
 * Post composer state for creating forum posts from dashboard
 */
export interface PostComposerState {
  title: string;
  content: string;
  hashtags: string[];
  images: File[];
  isDraft: boolean;
  isLoading: boolean;
  error: string | null;
}
