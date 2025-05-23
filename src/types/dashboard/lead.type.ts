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
  LOCATION_CITY = "location.city",
}

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
 * Lead type definition for CA Dashboard
 * Represents leads submitted by users through the customer onboarding flow
 */
export interface Lead {
  id: string;
  customerId: string; // Reference to customer profile
  customerName: string; // For display purposes
  services: string[]; // Array of requested services
  urgency: `${LeadUrgency}`; // Using enum values
  location: {
    city: string;
    state: string;
  };
  contactPreference: `${ContactPreference}`; // Using enum values
  contactInfo: string; // Phone number or email based on preference
  notes?: string; // Additional notes provided by customer
  timestamp: string; // When the lead was submitted
  status: `${LeadStatus}`; // Using enum values
  engagementCount?: number; // Number of CAs who have viewed this lead
}

/**
 * LeadFilter type for filtering lead lists
 */
export interface LeadFilter {
  urgency?: `${LeadUrgency}`[];
  services?: string[];
  dateRange?: {
    from: string;
    to: string;
  };
  status?: `${LeadStatus}`[];
}

/**
 * LeadSort type for sorting lead lists
 */
export type LeadSort = {
  field: `${LeadSortField}`;
  direction: `${SortDirection}`;
};

export interface LeadEngagement {
  id: string;
  leadId: string;
  caId: string;
  viewedAt: string;
}
