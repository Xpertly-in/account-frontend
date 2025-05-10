import { useAtom } from "jotai";
import {
  trackEventAtom,
  trackPageViewAtom,
  trackUserInteractionAtom,
} from "@/store/jotai/analytics.atoms";
import {
  trackEvent as trackGAEvent,
  trackPageView as trackGAPageView,
  trackUserInteraction as trackGAUserInteraction,
  trackFormSubmission as trackGAFormSubmission,
  trackProfileView as trackGAProfileView,
  trackContactForm as trackGAContactForm,
  EventAction,
} from "@/helper/googleAnalytics.helper";
import type { GA4Event, PageViewEvent, UserInteractionEvent } from "@/types/analytics.type";
import { useAnalyticsEnabled } from "./useAnalyticsEnabled";

export const useAnalytics = () => {
  const [, trackEventState] = useAtom(trackEventAtom);
  const [, trackPageViewState] = useAtom(trackPageViewAtom);
  const [, trackUserInteractionState] = useAtom(trackUserInteractionAtom);
  const isAnalyticsEnabled = useAnalyticsEnabled();

  const trackEvent = (event: GA4Event) => {
    // Always track in Jotai state
    trackEventState(event);

    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAEvent(event);
    }
  };

  const trackPageView = (event: PageViewEvent) => {
    // Always track in Jotai state
    trackPageViewState(event);

    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAPageView(event.url, event.title);
    }
  };

  const trackUserInteraction = (event: UserInteractionEvent) => {
    // Always track in Jotai state
    trackUserInteractionState(event);

    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAUserInteraction(
        event.action as (typeof EventAction)[keyof typeof EventAction],
        event.label,
        event.value,
        event.params
      );
    }
  };

  const trackFormSubmission = (
    formName: string,
    success: boolean,
    params?: Record<string, any>
  ) => {
    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAFormSubmission(formName, success, params);
    }
  };

  const trackProfileView = (profileId: string, profileType: string) => {
    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAProfileView(profileId, profileType);
    }
  };

  const trackContact = (formType: string, success: boolean, params?: Record<string, any>) => {
    // Only track in GA4 if analytics are enabled
    if (isAnalyticsEnabled) {
      trackGAContactForm(formType, success, params);
    }
  };

  return {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackFormSubmission,
    trackProfileView,
    trackContact,
    isAnalyticsEnabled,
  };
};
