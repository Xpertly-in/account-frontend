/**
 * Common types shared across the application
 */

/**
 * Sort direction enum
 */
export enum SortDirection {
  ASC = "asc",
  DESC = "desc",
}

/**
 * Contact preference enum
 */
export enum ContactPreference {
  PHONE = "Phone",
  WHATSAPP = "WhatsApp",
  EMAIL = "Email",
}

/**
 * Urgency level enum (shared between leads and contact requests)
 */
export enum UrgencyLevel {
  IMMEDIATELY = "Immediately",
  WITHIN_A_WEEK = "Within a week",
  THIS_MONTH = "This month",
  FLEXIBLE = "Flexible", // More generic than "Just exploring"
}

/**
 * Filter option interface for dynamic dropdowns
 */
export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

/**
 * Location filter option with nested structure
 */
export interface LocationOption {
  state: string;
  cities: FilterOption[];
  totalCount: number;
}

/**
 * Pagination parameters for queries
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * Date range filter interface
 */
export interface DateRangeFilter {
  from: string;
  to: string;
}

/**
 * Location interface for addresses
 */
export interface Location {
  city: string;
  state: string;
} 