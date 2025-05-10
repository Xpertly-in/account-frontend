import { renderHook, act } from '@testing-library/react';
import { useAnalytics } from '@/hooks/useAnalytics';
import * as useAnalyticsEnabled from '@/hooks/useAnalyticsEnabled';
import * as googleAnalytics from '@/helper/googleAnalytics.helper';
import { Provider } from 'jotai';
import React, { ReactNode } from 'react';

// Mock dependencies
jest.mock('@/hooks/useAnalyticsEnabled', () => ({
  __esModule: true,
  useAnalyticsEnabled: jest.fn(),
}));

jest.mock('@/helper/googleAnalytics.helper', () => ({
  __esModule: true,
  trackEvent: jest.fn(),
  trackPageView: jest.fn(),
  trackUserInteraction: jest.fn(),
  trackFormSubmission: jest.fn(),
  trackProfileView: jest.fn(),
  trackContactForm: jest.fn(),
  EventAction: {
    VIEW: 'view',
    CLICK: 'click',
    SUBMIT: 'submit',
    CONTACT: 'contact',
  },
  EventCategory: {
    PAGE_VIEW: 'page_view',
    USER_INTERACTION: 'user_interaction',
    FORM_SUBMISSION: 'form_submission',
    PROFILE_VIEW: 'profile_view',
    CONTACT: 'contact',
  },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
  <Provider>{children}</Provider>
);

describe('useAnalytics', () => {
  // Set up mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
    (useAnalyticsEnabled.useAnalyticsEnabled as jest.Mock).mockReturnValue(true);
  });

  test('returns analytics tracking functions', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    expect(result.current).toHaveProperty('trackEvent');
    expect(result.current).toHaveProperty('trackPageView');
    expect(result.current).toHaveProperty('trackUserInteraction');
    expect(result.current).toHaveProperty('trackFormSubmission');
    expect(result.current).toHaveProperty('trackProfileView');
    expect(result.current).toHaveProperty('trackContact');
    expect(result.current).toHaveProperty('isAnalyticsEnabled');
  });

  test('calls Google Analytics when analytics are enabled', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    const testEvent = {
      name: 'test_event',
      category: 'test_category',
      action: 'test_action',
      label: 'test_label',
    };

    // Call trackEvent
    act(() => {
      result.current.trackEvent(testEvent);
    });

    // Verify Google Analytics was called
    expect(googleAnalytics.trackEvent).toHaveBeenCalledWith(testEvent);
  });

  test('does not call Google Analytics when analytics are disabled', () => {
    (useAnalyticsEnabled.useAnalyticsEnabled as jest.Mock).mockReturnValue(false);

    const { result } = renderHook(() => useAnalytics(), { wrapper });

    const testEvent = {
      name: 'test_event',
      category: 'test_category',
      action: 'test_action',
      label: 'test_label',
    };

    // Call trackEvent
    act(() => {
      result.current.trackEvent(testEvent);
    });

    // Verify Google Analytics was not called
    expect(googleAnalytics.trackEvent).not.toHaveBeenCalled();
  });

  test('calls trackPageView correctly', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    const pageViewEvent = {
      url: '/test-page',
      title: 'Test Page',
      timestamp: 123456789,
    };

    act(() => {
      result.current.trackPageView(pageViewEvent);
    });

    expect(googleAnalytics.trackPageView).toHaveBeenCalledWith(
      pageViewEvent.url,
      pageViewEvent.title
    );
  });

  test('calls trackUserInteraction correctly', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    const userInteractionEvent = {
      action: 'click',
      label: 'test-button',
      value: 1,
      params: { param1: 'value1' },
      timestamp: 123456789,
    };

    act(() => {
      result.current.trackUserInteraction(userInteractionEvent);
    });

    expect(googleAnalytics.trackUserInteraction).toHaveBeenCalledWith(
      userInteractionEvent.action,
      userInteractionEvent.label,
      userInteractionEvent.value,
      userInteractionEvent.params
    );
  });

  test('calls trackFormSubmission correctly', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackFormSubmission('test-form', true, { formData: 'test' });
    });

    expect(googleAnalytics.trackFormSubmission).toHaveBeenCalledWith(
      'test-form',
      true,
      { formData: 'test' }
    );
  });

  test('calls trackProfileView correctly', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackProfileView('123', 'ca_profile');
    });

    expect(googleAnalytics.trackProfileView).toHaveBeenCalledWith('123', 'ca_profile');
  });

  test('calls trackContact correctly', () => {
    const { result } = renderHook(() => useAnalytics(), { wrapper });

    act(() => {
      result.current.trackContact('ca_contact', true, { contactData: 'test' });
    });

    expect(googleAnalytics.trackContactForm).toHaveBeenCalledWith(
      'ca_contact',
      true,
 