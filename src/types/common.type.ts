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
 * Filter chip type enum for categorizing filter chips
 */
export enum FilterChipType {
  STATUS = "status",
  URGENCY = "urgency",
  SERVICE = "service",
  LOCATION = "location",
  CONTACT_PREFERENCE = "contact_preference",
  SEARCH = "search",
  DATE_RANGE = "date_range",
}

/**
 * Date range preset labels enum
 */
export enum DateRangePresetLabel {
  TODAY = "Today",
  THIS_WEEK = "This Week",
  THIS_MONTH = "This Month",
  LAST_30_DAYS = "Last 30 Days",
  LAST_7_DAYS = "Last 7 Days",
  LAST_90_DAYS = "Last 90 Days",
  CUSTOM = "Custom Range",
}

/**
 * Date range preset variants enum
 */
export enum DateRangePresetVariant {
  DEFAULT = "default",
  SECONDARY = "secondary",
  OUTLINE = "outline",
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

/**
 * Badge variant types for consistent styling across components
 */
export type BadgeVariant =
  // Core variants
  | "default"
  | "secondary"
  | "destructive"
  | "outline"
  // Urgency variants
  | "urgent"
  | "high"
  | "medium"
  | "low"
  // Status variants
  | "new"
  | "replied"
  | "ignored"
  | "contacted"
  | "closed"
  | "archived"
  // Contact preference variants
  | "phone"
  | "email"
  | "whatsapp";

/**
 * Helper functions to map data values to Badge variants
 */
export const getBadgeVariantForUrgency = (urgency: UrgencyLevel): BadgeVariant => {
  switch (urgency) {
    case UrgencyLevel.IMMEDIATELY:
      return "urgent";
    case UrgencyLevel.WITHIN_A_WEEK:
      return "high";
    case UrgencyLevel.THIS_MONTH:
      return "medium";
    case UrgencyLevel.FLEXIBLE:
      return "low";
    default:
      return "default";
  }
};

export const getBadgeVariantForContactPreference = (
  preference: ContactPreference
): BadgeVariant => {
  switch (preference) {
    case ContactPreference.PHONE:
      return "phone";
    case ContactPreference.EMAIL:
      return "email";
    case ContactPreference.WHATSAPP:
      return "whatsapp";
    default:
      return "outline";
  }
};

export const getBadgeVariantForStatus = (status: string): BadgeVariant => {
  switch (status.toLowerCase()) {
    case "new":
      return "new";
    case "replied":
      return "replied";
    case "ignored":
      return "ignored";
    case "contacted":
      return "contacted";
    case "closed":
      return "closed";
    case "archived":
      return "archived";
    default:
      return "default";
  }
};
