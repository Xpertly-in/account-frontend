import { Lead, LeadFilter, LeadSort } from "./lead.type";
import { ContactRequest, ContactRequestFilter, ContactRequestSort } from "./contact-request.type";

/**
 * Dashboard section types
 */
export enum DashboardSection {
  LEADS = "leads",
  CONTACT_REQUESTS = "contact-requests",
  FEED_POSTS = "feed-posts",
  ANALYTICS = "analytics",
}

/**
 * Dashboard state interface for CA Dashboard
 */
export interface DashboardState {
  activeSection: DashboardSection;
  leads: {
    data: Lead[];
    isLoading: boolean;
    error: string | null;
    totalCount: number;
    filter: LeadFilter;
    sort: LeadSort;
    page: number;
    pageSize: number;
  };
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
    newLeadsCount: number;
    unreadContactRequestsCount: number;
    totalLeadsThisMonth: number;
    leadResponseRate: number;
    avgResponseTime: number;
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
