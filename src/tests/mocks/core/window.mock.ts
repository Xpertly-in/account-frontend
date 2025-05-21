/**
 * Window and global object mocks for testing
 */

/**
 * Creates mock implementations for global window objects and methods
 * @returns Object containing references to the created mocks
 */
export const mockGlobalWindow = () => {
  // Mock gtag function
  Object.defineProperty(window, "gtag", {
    value: jest.fn(),
    writable: true,
  });

  // Mock matchMedia
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // Deprecated
      removeListener: jest.fn(), // Deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  // Mock scrollTo
  Object.defineProperty(window, "scrollTo", {
    writable: true,
    value: jest.fn(),
  });

  // Mock dataLayer for GA
  window.dataLayer = window.dataLayer || [];

  // Return mocked functions for additional control in tests
  return {
    gtagMock: window.gtag,
    matchMediaMock: window.matchMedia,
    scrollToMock: window.scrollTo,
  };
};

/**
 * Mocks window.ResizeObserver for components that use it
 */
export const mockResizeObserver = () => {
  class MockResizeObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  // @ts-expect-error - We're deliberately overwriting this
  window.ResizeObserver = MockResizeObserver;

  return MockResizeObserver;
};

/**
 * Mocks window.IntersectionObserver for components that use it
 */
export const mockIntersectionObserver = () => {
  class MockIntersectionObserver {
    observe = jest.fn();
    unobserve = jest.fn();
    disconnect = jest.fn();
  }

  // @ts-expect-error - We're deliberately overwriting this
  window.IntersectionObserver = MockIntersectionObserver;

  return MockIntersectionObserver;
};
