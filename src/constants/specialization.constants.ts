import { UrgencyLevel, ContactPreference } from "@/types/common.type";
import { EnvelopeSimpleIcon, PhoneIcon } from "@phosphor-icons/react";

/**
 * ⚠️ DEPRECATION NOTICE
 *
 * The specialization constants in this file are now DEPRECATED.
 * Specializations are now managed in the database via:
 * - specialization_categories table
 * - specializations table
 *
 * Use the new specialization service instead:
 * - useSpecializations() - for all specializations
 * - useSpecializationCategories() - for categories
 * - useSpecializationsWithCategories() - for combined data
 *
 * This file is kept temporarily for any legacy code that might reference it.
 * It will be removed in a future update.
 *
 * @deprecated Use @/services/specialization.service instead
 */

/**
 * Service option interface for consistent typing
 */
export interface ISpecialization {
  value: string;
  label: string;
  category: string;
  description?: string;
}

/**
 * Service categories for grouping related services
 */
export const SPECIALIZATION_CATEGORIES = {
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
export const SPECIALIZATION: ISpecialization[] = [
  // Tax Services
  {
    value: "income-tax-filing",
    label: "Income Tax Filing",
    category: SPECIALIZATION_CATEGORIES.TAX,
  },
  { value: "itr-filing", label: "ITR Filing", category: SPECIALIZATION_CATEGORIES.TAX },
  { value: "tax-filing", label: "Tax Filing", category: SPECIALIZATION_CATEGORIES.TAX },
  { value: "tax-planning", label: "Tax Planning", category: SPECIALIZATION_CATEGORIES.TAX },
  { value: "tax-consultation", label: "Tax Consultation", category: SPECIALIZATION_CATEGORIES.TAX },
  { value: "tds-filing", label: "TDS Filing", category: SPECIALIZATION_CATEGORIES.TAX },

  // GST Services
  { value: "gst-registration", label: "GST Registration", category: SPECIALIZATION_CATEGORIES.GST },
  { value: "gst-filing", label: "GST Filing", category: SPECIALIZATION_CATEGORIES.GST },
  {
    value: "gst-return-filing",
    label: "GST Return Filing",
    category: SPECIALIZATION_CATEGORIES.GST,
  },

  // Registration Services
  {
    value: "company-registration",
    label: "Company Registration",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "company-incorporation",
    label: "Company Incorporation",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "partnership-registration",
    label: "Partnership Registration",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "llp-registration",
    label: "LLP Registration",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "startup-registration",
    label: "Startup Registration",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "business-setup",
    label: "Business Setup",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },
  {
    value: "business-registration",
    label: "Business Registration",
    category: SPECIALIZATION_CATEGORIES.REGISTRATION,
  },

  // Audit Services
  { value: "statutory-audit", label: "Statutory Audit", category: SPECIALIZATION_CATEGORIES.AUDIT },
  { value: "internal-audit", label: "Internal Audit", category: SPECIALIZATION_CATEGORIES.AUDIT },
  { value: "company-audit", label: "Company Audit", category: SPECIALIZATION_CATEGORIES.AUDIT },
  { value: "financial-audit", label: "Financial Audit", category: SPECIALIZATION_CATEGORIES.AUDIT },
  { value: "audit", label: "Audit", category: SPECIALIZATION_CATEGORIES.AUDIT },
  { value: "audit-services", label: "Audit Services", category: SPECIALIZATION_CATEGORIES.AUDIT },

  // Compliance Services
  {
    value: "compliance-management",
    label: "Compliance Management",
    category: SPECIALIZATION_CATEGORIES.COMPLIANCE,
  },
  { value: "compliance", label: "Compliance", category: SPECIALIZATION_CATEGORIES.COMPLIANCE },
  {
    value: "compliance-services",
    label: "Compliance Services",
    category: SPECIALIZATION_CATEGORIES.COMPLIANCE,
  },
  {
    value: "esi-pf-registration",
    label: "ESI & PF Registration",
    category: SPECIALIZATION_CATEGORIES.COMPLIANCE,
  },

  // Accounting Services
  { value: "book-keeping", label: "Book Keeping", category: SPECIALIZATION_CATEGORIES.ACCOUNTING },
  { value: "bookkeeping", label: "Bookkeeping", category: SPECIALIZATION_CATEGORIES.ACCOUNTING },
  {
    value: "bookkeeping-accounting",
    label: "Bookkeeping & Accounting",
    category: SPECIALIZATION_CATEGORIES.ACCOUNTING,
  },
  {
    value: "accounting-services",
    label: "Accounting Services",
    category: SPECIALIZATION_CATEGORIES.ACCOUNTING,
  },
  { value: "accounting", label: "Accounting", category: SPECIALIZATION_CATEGORIES.ACCOUNTING },
  {
    value: "payroll-management",
    label: "Payroll Management",
    category: SPECIALIZATION_CATEGORIES.ACCOUNTING,
  },
  { value: "payroll", label: "Payroll", category: SPECIALIZATION_CATEGORIES.ACCOUNTING },

  // Planning & Advisory Services
  {
    value: "investment-planning",
    label: "Investment Planning",
    category: SPECIALIZATION_CATEGORIES.PLANNING,
  },
  {
    value: "financial-planning",
    label: "Financial Planning",
    category: SPECIALIZATION_CATEGORIES.PLANNING,
  },
  {
    value: "mutual-fund-advisory",
    label: "Mutual Fund Advisory",
    category: SPECIALIZATION_CATEGORIES.ADVISORY,
  },
  {
    value: "insurance-planning",
    label: "Insurance Planning",
    category: SPECIALIZATION_CATEGORIES.PLANNING,
  },
  {
    value: "financial-consulting",
    label: "Financial Consulting",
    category: SPECIALIZATION_CATEGORIES.ADVISORY,
  },
  {
    value: "business-advisory",
    label: "Business Advisory",
    category: SPECIALIZATION_CATEGORIES.ADVISORY,
  },
  {
    value: "startup-advisory",
    label: "Startup Advisory",
    category: SPECIALIZATION_CATEGORIES.ADVISORY,
  },

  // General/Other Services
  {
    value: "general-consultation",
    label: "General Consultation",
    category: SPECIALIZATION_CATEGORIES.ADVISORY,
  },
  { value: "other", label: "Other", category: SPECIALIZATION_CATEGORIES.OTHER },
] as const;

// ============================================================================
// HELPER FUNCTIONS - Simple utility functions
// ============================================================================

/**
 * Get all services as select options
 */
export const getAllSpecialization = (): { value: string; label: string }[] => {
  return SPECIALIZATION.map(specialization => ({
    value: specialization.value,
    label: specialization.label,
  }));
};

/**
 * Get service labels only
 */
export const getSpecializationLabels = (): string[] => {
  return SPECIALIZATION.map(specialization => specialization.label);
};

/**
 * Get services grouped by category
 */
export const getSpecializationByCategory = () => {
  return SPECIALIZATION.reduce((acc, specialization) => {
    const category = specialization.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(specialization);
    return acc;
  }, {} as Record<string, ISpecialization[]>);
};

/**
 * Get service label by value
 */
export const getSpecializationLabel = (value: string): string => {
  const specialization = SPECIALIZATION.find(s => s.value === value);
  return specialization?.label || value;
};

/**
 * Search services by query
 */
export const searchSpecialization = (query: string): ISpecialization[] => {
  const lowerQuery = query.toLowerCase();
  return SPECIALIZATION.filter(
    specialization =>
      specialization.label.toLowerCase().includes(lowerQuery) ||
      specialization.description?.toLowerCase().includes(lowerQuery) ||
      specialization.category.toLowerCase().includes(lowerQuery)
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
