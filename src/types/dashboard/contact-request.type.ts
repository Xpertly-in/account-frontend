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
  TIMESTAMP = "timestamp",
  STATUS = "status",
  USER_NAME = "userName",
}

// Reuse SortDirection from Lead type

/**
 * ContactRequest type definition for CA Dashboard
 * Represents direct contact form submissions from users viewing CA profiles
 */
export interface ContactRequest {
  id: string;
  userId?: string; // Optional, as some users might not be registered
  userName: string;
  userEmail: string;
  userPhone?: string;
  message: string;
  timestamp: string;
  status: `${ContactRequestStatus}`;
  caPrivateNotes?: string; // Private notes added by the CA
}

/**
 * ContactRequestFilter type for filtering contact request lists
 */
export interface ContactRequestFilter {
  status?: `${ContactRequestStatus}`[];
  dateRange?: {
    from: string;
    to: string;
  };
}

/**
 * ContactRequestSort type for sorting contact request lists
 */
export type ContactRequestSort = {
  field: `${ContactRequestSortField}`;
  direction: "asc" | "desc"; // Reusing string literals directly to avoid circular reference
};
