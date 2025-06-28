import { UrgencyLevel, ContactPreference } from "@/types/common.type";
import { EnvelopeSimple, Phone } from "@phosphor-icons/react";

/**
 * Common services offered by CAs
 * Used in contact forms and service selection dropdowns
 */
export const COMMON_SERVICES = [
  "Income Tax Filing",
  "GST Registration & Filing",
  "Business Registration",
  "Audit Services",
  "Tax Planning",
  "Financial Consulting",
  "Bookkeeping",
  "Other",
] as const;

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
    icon: EnvelopeSimple,
  },
  {
    value: ContactPreference.PHONE,
    label: "Phone",
    icon: Phone,
  },
] as const;
