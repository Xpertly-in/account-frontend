import {
  SortDirection,
  ContactPreference,
  UrgencyLevel,
  DateRangeFilter,
  Location,
} from "@/types/common.type";

/**
 * Contact request status enum
 */
export enum ContactRequestStatus {
  NEW = "new",
  REPLIED = "replied",
  IGNORED = "ignored",
}

/**
 * Contact request sort field enum
 */
export enum ContactRequestSortField {
  CREATED_AT = "created_at",
  STATUS = "status",
  CUSTOMER_NAME = "customer_name",
  URGENCY = "urgency",
}

/**
 * ContactRequest type definition for CA Dashboard
 * Represents direct contact form submissions from users (registered or anonymous)
 */
export interface ContactRequest {
  // Core identification
  id: string;
  ca_id: string; // Which CA received this request (required)

  // Customer information (flexible for non-registered users)
  customer_id?: string; // Optional - only if customer is registered
  customer_name: string; // Required - either from profile or form input
  customer_email: string; // Required - primary contact method
  customer_phone?: string; // Optional - additional contact method

  // Request details
  subject: string;
  message: string;
  service_needed?: string;
  urgency: UrgencyLevel;
  contact_preference: ContactPreference;
  contact_detail: string; // Actual contact info based on preference

  // Location (optional)
  location?: Location;

  // Status and notes
  status: ContactRequestStatus;
  ca_private_notes?: string; // CA's private notes

  // Timestamps
  created_at: string;
  updated_at: string;
  replied_at?: string;
}

/**
 * ContactRequestFilter type for filtering contact request lists
 */
export interface ContactRequestFilter {
  status?: `${ContactRequestStatus}`[];
  urgency?: `${UrgencyLevel}`[];
  service_needed?: string[];
  contact_preference?: `${ContactPreference}`[];
  dateRange?: DateRangeFilter;
  search?: string; // Search term for customer names and messages
}

/**
 * ContactRequestSort type for sorting contact request lists
 */
export type ContactRequestSort = {
  field: `${ContactRequestSortField}`;
  direction: `${SortDirection}`;
};

/**
 * Interface for creating a new contact request (from customer form)
 */
export interface CreateContactRequestData {
  ca_id: string;
  customer_id?: string; // Optional - if customer is logged in
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  subject: string;
  message: string;
  service_needed?: string;
  urgency: `${UrgencyLevel}`;
  contact_preference: `${ContactPreference}`;
  contact_detail: string;
  location_city?: string;
  location_state?: string;
}

/**
 * Interface for updating contact request (CA actions)
 */
export interface UpdateContactRequestData {
  status?: `${ContactRequestStatus}`;
  ca_private_notes?: string;
  replied_at?: string;
  updated_at: string; // Application handles this timestamp
}
