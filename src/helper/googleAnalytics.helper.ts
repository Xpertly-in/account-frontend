import { GA4Event } from "@/types/analytics.type";

declare global {
  interface Window {
    gtag: (
      command: "config" | "event" | "js",
      targetId: string,
      config?: {
        page_path?: string;
        page_title?: string;
        [key: string]: any;
      }
    ) => void;
    dataLayer: any[];
  }
}

// GA4 Measurement ID
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-DP11JWRL6V";

// Event Categories
export const EventCategory = {
  PAGE_VIEW: "page_view",
  USER_INTERACTION: "user_interaction",
  FORM_SUBMISSION: "form_submission",
  PROFILE_VIEW: "profile_view",
  CONTACT: "contact",
} as const;

// Event Actions
export const EventAction = {
  VIEW: "view",
  CLICK: "click",
  SUBMIT: "submit",
  CONTACT: "contact",
} as const;

// Page View Tracking
export const trackPageView = (url: string, title?: string) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("config", GA_MEASUREMENT_ID, {
      page_path: url,
      page_title: title,
    });
  }
};

// Custom Event Tracking
export const trackEvent = (event: GA4Event) => {
  if (typeof window !== "undefined" && typeof window.gtag === "function") {
    window.gtag("event", event.name, {
      event_category: event.category,
      event_action: event.action,
      event_label: event.label,
      value: event.value,
      ...event.params,
    });
  }
};

// User Interaction Tracking
export const trackUserInteraction = (
  action: (typeof EventAction)[keyof typeof EventAction],
  label: string,
  value?: number,
  params?: Record<string, any>
) => {
  trackEvent({
    name: "user_interaction",
    category: EventCategory.USER_INTERACTION,
    action,
    label,
    value,
    params,
  });
};

// Form Submission Tracking
export const trackFormSubmission = (
  formName: string,
  success: boolean,
  params?: Record<string, any>
) => {
  trackEvent({
    name: "form_submission",
    category: EventCategory.FORM_SUBMISSION,
    action: EventAction.SUBMIT,
    label: formName,
    value: success ? 1 : 0,
    params,
  });
};

// Profile View Tracking
export const trackProfileView = (profileId: string, profileType: string) => {
  trackEvent({
    name: "profile_view",
    category: EventCategory.PROFILE_VIEW,
    action: EventAction.VIEW,
    label: profileId,
    params: { profile_type: profileType },
  });
};

// Contact Form Tracking
export const trackContactForm = (
  formType: string,
  success: boolean,
  params?: Record<string, any>
) => {
  trackEvent({
    name: "contact_form",
    category: EventCategory.CONTACT,
    action: EventAction.CONTACT,
    label: formType,
    value: success ? 1 : 0,
    params,
  });
};
