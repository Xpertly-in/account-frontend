import { SortDirection, ContactPreference, DateRangeFilter, Location } from "@/types/common.type";

/**
 * Lead status enum
 */
export enum LeadStatus {
  NEW = "new",
  CONTACTED = "contacted",
  CLOSED = "closed",
  ARCHIVED = "archived",
}

/**
 * Lead urgency enum
 */
export enum LeadUrgency {
  IMMEDIATELY = "Immediately",
  WITHIN_A_WEEK = "Within a week",
  THIS_MONTH = "This month",
  JUST_EXPLORING = "Just exploring",
}

/**
 * Lead sort field enum
 */
export enum LeadSortField {
  TIMESTAMP = "timestamp",
  URGENCY = "urgency",
}

/**
 * Lead type definition for CA Dashboard
 * Represents leads submitted by users through the customer onboarding flow
 */
export interface Lead {
  id: string;
  customerId: string; // Reference to customer profile
  customerName: string; // For display purposes
  profilePicture?: string; // Customer profile picture URL
  services: string[]; // Array of requested services
  urgency: `${LeadUrgency}`; // Using enum values
  location: Location;
  contactPreference: `${ContactPreference}`; // Using enum values
  contactInfo: string; // Phone number or email based on preference
  notes?: string; // Additional notes provided by customer
  timestamp: string; // When the lead was submitted
  status: `${LeadStatus}`; // Using enum values
  engagementCount?: number; // Number of CAs who have viewed this lead
  hasEngagement?: boolean; // Whether current CA has engaged with this lead

  // CA-specific fields (populated from lead_engagements for current CA)
  isHidden?: boolean; // Whether current CA has hidden this lead
  hiddenAt?: string; // When current CA hid this lead
  caNotes?: string; // CA-specific notes about this lead
}

/**
 * LeadFilter type for filtering lead lists
 */
export interface LeadFilter {
  urgency?: `${LeadUrgency}`[];
  services?: string[];
  dateRange?: DateRangeFilter;
  status?: `${LeadStatus}`[];
  location?: string[]; // Filter by specific cities
  includeHidden?: boolean; // Whether to include leads hidden by current CA
  search?: string; // Search term for customer names, services, and locations
}

/**
 * LeadSort type for sorting lead lists
 */
export type LeadSort = {
  field: `${LeadSortField}`;
  direction: `${SortDirection}`;
};

/**
 * Paginated response interface for leads
 */
export interface PaginatedLeadsResponse {
  data: Lead[] | null;
  error: any;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  currentPage: number;
  pageSize: number;
  totalPages: number;
}

export interface LeadEngagement {
  id: string;
  leadId: string;
  caId: string;
  viewedAt: string;

  // CA-specific preference fields
  isHidden: boolean;
  hiddenAt?: string;
  notes?: string;
  updatedAt: string;
}
