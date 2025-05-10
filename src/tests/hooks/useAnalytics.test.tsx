import React from "react";
import { renderHook, act } from "@testing-library/react";
import { useAnalytics } from "@/hooks/useAnalytics";
import { Provider } from "@/store/jotai";
import { mockGlobalWindow } from "@/tests/mocks/jestMock.helper";

// Set up window mocks
beforeAll(() => {
  // Explicitly mock window.gtag
  const { gtagMock } = mockGlobalWindow();
});

// Mock the helper functions directly
jest.mock("@/hooks/useAnalyticsEnabled", () => ({
  __esModule: true,
  useAnalyticsEnabled: jest.fn().mockReturnValue(true),
}));

// Mock GA helper functions
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

// Import the mocked modules
const googleAnalytics = jest.requireMock("@/helper/googleAnalytics.helper");
const {
  trackEvent: trackEventMock,
  trackPageView: trackPageViewMock,
  trackUserInteraction: trackUserInteractionMock,
  trackFormSubmission: trackFormSubmissionMock,
  trackProfileView: trackProfileViewMock,
  trackContactForm: trackContactFormMock,
} = googleAnalytics;

// Mock window objects
mockGlobalWindow();

// Provider wrapper for Jotai
const wrapper = ({ children }: { children: React.ReactNode }) => <Provider>{children}</Provider>;

describe("useAnalytics", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("returns analytics tracking functions", () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    expect(result.current).toHaveProperty("trackEvent");
    expect(result.current).toHaveProperty("trackPageView");
    expect(result.current).toHaveProperty("trackUserInteraction");
    expect(result.current).toHaveProperty("trackFormSubmission");
    expect(result.current).toHaveProperty("trackProfileView");
    expect(result.current).toHaveProperty("trackContact");
    expect(result.current).toHaveProperty("isAnalyticsEnabled");
  });

  test("respects analytics enabled state for event tracking", () => {
    // Set analytics as enabled
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackEvent({
        name: "test-event",
        category: "test-category",
        action: "test-action",
        label: "test-label",
        value: 1,
        params: { test: "param" },
      });
    });

    // Verify GA tracking function was called
    expect(trackEventMock).toHaveBeenCalledWith({
      name: "test-event",
      category: "test-category",
      action: "test-action",
      label: "test-label",
      value: 1,
      params: { test: "param" },
    });
  });

  test("does not call GA when analytics are disabled", () => {
    // Set analytics as disabled
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(false);

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackEvent({
        name: "test-event",
        category: "test-category",
        action: "test-action",
        label: "test-label",
      });
    });

    // Verify GA tracking function was NOT called
    expect(trackEventMock).not.toHaveBeenCalled();
  });

  test("calls trackPageView correctly", () => {
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackPageView({
        url: "/test-page",
        title: "Test Page",
        timestamp: 123456789,
      });
    });

    expect(trackPageViewMock).toHaveBeenCalledWith("/test-page", "Test Page");
  });

  test("calls trackUserInteraction correctly", () => {
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackUserInteraction({
        action: "click",
        label: "test-button",
        value: 1,
        params: { component: "test" },
        timestamp: 123456789,
      });
    });

    expect(trackUserInteractionMock).toHaveBeenCalledWith("click", "test-button", 1, {
      component: "test",
    });
  });

  test("calls trackFormSubmission correctly", () => {
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackFormSubmission("test-form", true, { formData: "test" });
    });

    expect(trackFormSubmissionMock).toHaveBeenCalledWith("test-form", true, { formData: "test" });
  });

  test("calls trackProfileView correctly", () => {
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackProfileView("123", "ca_profile");
    });

    expect(trackProfileViewMock).toHaveBeenCalledWith("123", "ca_profile");
  });

  test("calls trackContact correctly", () => {
    require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled.mockReturnValue(true);
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackContact("contact_form", true, { method: "email" });
    });

    expect(trackContactFormMock).toHaveBeenCalledWith("contact_form", true, { method: "email" });
  });
});
