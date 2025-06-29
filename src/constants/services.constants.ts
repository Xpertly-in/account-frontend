import { UrgencyLevel, ContactPreference } from "@/types/common.type";
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react";

/**
 * Service option interface for consistent typing
 */
export interface ServiceOption {
  value: string;
  label: string;
  category: string;
  description?: string;
}

/**
 * Service categories for grouping related services
 */
export const SERVICE_CATEGORIES = {
  TAX: "Tax Services",
  GST: "GST Services",
  REGISTRATION: "Registration Services",
  AUDIT: "Audit Services",
  COMPLIANCE: "Compliance Services",
  ADVISORY: "Advisory Services",
  ACCOUNTING: "Accounting Services",
  PLANNING: "Planning Services",
  OTHER: "Other Services",
} as const;

/**
 * SINGLE SOURCE OF TRUTH - All services in one place
 * Simple structure: just categories and services
 */
export const SERVICES: ServiceOption[] = [
  // Tax Services
  { value: "income-tax-filing", label: "Income Tax Filing", category: SERVICE_CATEGORIES.TAX },
  { value: "itr-filing", label: "ITR Filing", category: SERVICE_CATEGORIES.TAX },
  { value: "tax-filing", label: "Tax Filing", category: SERVICE_CATEGORIES.TAX },
  { value: "tax-planning", label: "Tax Planning", category: SERVICE_CATEGORIES.TAX },
  { value: "tax-consultation", label: "Tax Consultation", category: SERVICE_CATEGORIES.TAX },
  { value: "tds-filing", label: "TDS Filing", category: SERVICE_CATEGORIES.TAX },

  // GST Services
  { value: "gst-registration", label: "GST Registration", category: SERVICE_CATEGORIES.GST },
  { value: "gst-filing", label: "GST Filing", category: SERVICE_CATEGORIES.GST },
  { value: "gst-return-filing", label: "GST Return Filing", category: SERVICE_CATEGORIES.GST },

  // Registration Services
  {
    value: "company-registration",
    label: "Company Registration",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },
  {
    value: "company-incorporation",
    label: "Company Incorporation",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },
  {
    value: "partnership-registration",
    label: "Partnership Registration",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },
  {
    value: "llp-registration",
    label: "LLP Registration",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },
  {
    value: "startup-registration",
    label: "Startup Registration",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },
  { value: "business-setup", label: "Business Setup", category: SERVICE_CATEGORIES.REGISTRATION },
  {
    value: "business-registration",
    label: "Business Registration",
    category: SERVICE_CATEGORIES.REGISTRATION,
  },

  // Audit Services
  { value: "statutory-audit", label: "Statutory Audit", category: SERVICE_CATEGORIES.AUDIT },
  { value: "internal-audit", label: "Internal Audit", category: SERVICE_CATEGORIES.AUDIT },
  { value: "company-audit", label: "Company Audit", category: SERVICE_CATEGORIES.AUDIT },
  { value: "financial-audit", label: "Financial Audit", category: SERVICE_CATEGORIES.AUDIT },
  { value: "audit", label: "Audit", category: SERVICE_CATEGORIES.AUDIT },
  { value: "audit-services", label: "Audit Services", category: SERVICE_CATEGORIES.AUDIT },

  // Compliance Services
  {
    value: "compliance-management",
    label: "Compliance Management",
    category: SERVICE_CATEGORIES.COMPLIANCE,
  },
  { value: "compliance", label: "Compliance", category: SERVICE_CATEGORIES.COMPLIANCE },
  {
    value: "compliance-services",
    label: "Compliance Services",
    category: SERVICE_CATEGORIES.COMPLIANCE,
  },
  {
    value: "esi-pf-registration",
    label: "ESI & PF Registration",
    category: SERVICE_CATEGORIES.COMPLIANCE,
  },

  // Accounting Services
  { value: "book-keeping", label: "Book Keeping", category: SERVICE_CATEGORIES.ACCOUNTING },
  { value: "bookkeeping", label: "Bookkeeping", category: SERVICE_CATEGORIES.ACCOUNTING },
  {
    value: "bookkeeping-accounting",
    label: "Bookkeeping & Accounting",
    category: SERVICE_CATEGORIES.ACCOUNTING,
  },
  {
    value: "accounting-services",
    label: "Accounting Services",
    category: SERVICE_CATEGORIES.ACCOUNTING,
  },
  { value: "accounting", label: "Accounting", category: SERVICE_CATEGORIES.ACCOUNTING },
  {
    value: "payroll-management",
    label: "Payroll Management",
    category: SERVICE_CATEGORIES.ACCOUNTING,
  },
  { value: "payroll", label: "Payroll", category: SERVICE_CATEGORIES.ACCOUNTING },

  // Planning & Advisory Services
  {
    value: "investment-planning",
    label: "Investment Planning",
    category: SERVICE_CATEGORIES.PLANNING,
  },
  {
    value: "financial-planning",
    label: "Financial Planning",
    category: SERVICE_CATEGORIES.PLANNING,
  },
  {
    value: "mutual-fund-advisory",
    label: "Mutual Fund Advisory",
    category: SERVICE_CATEGORIES.ADVISORY,
  },
  {
    value: "insurance-planning",
    label: "Insurance Planning",
    category: SERVICE_CATEGORIES.PLANNING,
  },
  {
    value: "financial-consulting",
    label: "Financial Consulting",
    category: SERVICE_CATEGORIES.ADVISORY,
  },
  { value: "business-advisory", label: "Business Advisory", category: SERVICE_CATEGORIES.ADVISORY },
  { value: "startup-advisory", label: "Startup Advisory", category: SERVICE_CATEGORIES.ADVISORY },

  // General/Other Services
  {
    value: "general-consultation",
    label: "General Consultation",
    category: SERVICE_CATEGORIES.ADVISORY,
  },
  { value: "other", label: "Other", category: SERVICE_CATEGORIES.OTHER },
] as const;

// ============================================================================
// HELPER FUNCTIONS - Simple utility functions
// ============================================================================

/**
 * Get all services as select options
 */
export const getAllServices = (): { value: string; label: string }[] => {
  return SERVICES.map(service => ({
    value: service.value,
    label: service.label,
  }));
};

/**
 * Get service labels only
 */
export const getServiceLabels = (): string[] => {
  return SERVICES.map(service => service.label);
};

/**
 * Get services grouped by category
 */
export const getServicesByCategory = () => {
  return SERVICES.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(service);
    return acc;
  }, {} as Record<string, ServiceOption[]>);
};

/**
 * Get service label by value
 */
export const getServiceLabel = (value: string): string => {
  const service = SERVICES.find(s => s.value === value);
  return service?.label || value;
};

/**
 * Search services by query
 */
export const searchServices = (query: string): ServiceOption[] => {
  const lowerQuery = query.toLowerCase();
  return SERVICES.filter(
    service =>
      service.label.toLowerCase().includes(lowerQuery) ||
      service.description?.toLowerCase().includes(lowerQuery) ||
      service.category.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Urgency options with descriptions for contact requests
 */
export const URGENCY_OPTIONS = [
  {
    value: UrgencyLevel.IMMEDIATELY,
    label: "Immediately",
    description: "Need help right away",
  },
  {
    value: UrgencyLevel.WITHIN_A_WEEK,
    label: "Within a week",
    description: "Can wait a few days",
  },
  {
    value: UrgencyLevel.THIS_MONTH,
    label: "This month",
    description: "No immediate rush",
  },
  {
    value: UrgencyLevel.FLEXIBLE,
    label: "Flexible",
    description: "Just exploring options",
  },
] as const;

/**
 * Contact preference options with icons for contact requests
 */
export const CONTACT_PREFERENCE_OPTIONS = [
  {
    value: ContactPreference.EMAIL,
    label: "Email",
    icon: EnvelopeSimpleIcon,
  },
  {
    value: ContactPreference.PHONE,
    label: "Phone",
    icon: PhoneIcon,
  },
] as const;
