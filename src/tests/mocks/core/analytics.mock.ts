/**
 * Analytics-related mocks for testing
 */

/**
 * Creates mock implementations for analytics hooks and functions
 * @param isEnabled - Whether analytics should be enabled in the mock
 * @returns Object containing references to the created mocks
 */
export const createAnalyticsMocks = (isEnabled = true) => {
  // Mock useAnalyticsEnabled hook
  jest.mock("@/hooks/useAnalyticsEnabled", () => ({
    __esModule: true,
    useAnalyticsEnabled: jest.fn().mockReturnValue(isEnabled),
  }));

  // Mock Google Analytics helper functions
  jest.mock("@/helper/googleAnalytics.helper", () => {
    return {
      __esModule: true,
      GA_MEASUREMENT_ID: "G-TESTID",
      trackEvent: jest.fn(),
      trackPageView: jest.fn(),
      trackUserInteraction: jest.fn(),
      trackFormSubmission: jest.fn(),
      trackProfileView: jest.fn(),
      trackContactForm: jest.fn(),
      EventAction: {
        VIEW: "view",
        CLICK: "click",
        SUBMIT: "submit",
        CONTACT: "contact",
      },
      EventCategory: {
        PAGE_VIEW: "page_view",
        USER_INTERACTION: "user_interaction",
        FORM_SUBMISSION: "form_submission",
        PROFILE_VIEW: "profile_view",
        CONTACT: "contact",
      },
    };
  });

  // Get mocked hook
  const useAnalyticsEnabledMock = require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled;

  // Get mocked GA functions
  const googleAnalytics = jest.requireMock("@/helper/googleAnalytics.helper");
  const {
    trackEvent: trackEventMock,
    trackPageView: trackPageViewMock,
    trackUserInteraction: trackUserInteractionMock,
    trackFormSubmission: trackFormSubmissionMock,
    trackProfileView: trackProfileViewMock,
    trackContactForm: trackContactFormMock,
  } = googleAnalytics;

  return {
    useAnalyticsEnabledMock,
    trackEventMock,
    trackPageViewMock,
    trackUserInteractionMock,
    trackFormSubmissionMock,
    trackProfileViewMock,
    trackContactFormMock,
  };
};
