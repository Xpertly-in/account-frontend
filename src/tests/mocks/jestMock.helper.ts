import React from "react";

/**
 * Common mock implementations for Jest
 */

// ------------------------
// Navigation Mocks
// ------------------------
export const createNavigationMocks = () => {
  const usePathnameMock = jest.fn().mockReturnValue("/test-page");
  const useSearchParamsMock = jest.fn().mockReturnValue({
    toString: () => "?param=value",
    get: jest.fn(),
  });

  jest.mock("next/navigation", () => ({
    __esModule: true,
    usePathname: usePathnameMock,
    useSearchParams: useSearchParamsMock,
    useRouter: jest.fn().mockReturnValue({
      push: jest.fn(),
      replace: jest.fn(),
      back: jest.fn(),
      refresh: jest.fn(),
    }),
  }));

  return {
    usePathnameMock,
    useSearchParamsMock,
  };
};

// ------------------------
// Next.js Component Mocks
// ------------------------
export const createNextJsMocks = () => {
  // Mock Next/Script
  jest.mock("next/script", () => ({
    __esModule: true,
    default: ({ id, strategy, src, dangerouslySetInnerHTML }: any) => (
      <script
        data-testid={id || "script"}
        data-strategy={strategy}
        data-src={src}
        dangerouslySetInnerHTML={dangerouslySetInnerHTML}
      />
    ),
  }));

  // Mock Next/Link
  jest.mock("next/link", () => {
    const MockLink = ({
      children,
      href,
      ...rest
    }: React.PropsWithChildren<{ href: string; [key: string]: any }>) => (
      <a href={href} {...rest}>
        {children}
      </a>
    );
    MockLink.displayName = "MockNextLink";
    return MockLink;
  });

  // Mock Next/Image
  jest.mock("next/image", () => {
    const MockImage = ({
      src,
      alt,
      width,
      height,
      ...rest
    }: {
      src: string;
      alt: string;
      width?: number;
      height?: number;
      [key: string]: any;
    }) => <img src={src} alt={alt} width={width} height={height} {...rest} />;
    MockImage.displayName = "MockNextImage";
    return MockImage;
  });
};

// ------------------------
// Analytics Mocks
// ------------------------
export const createAnalyticsMocks = (isEnabled = true) => {
  // Mock useAnalyticsEnabled hook
  const useAnalyticsEnabledMock = jest.fn().mockReturnValue(isEnabled);

  jest.mock("@/hooks/useAnalyticsEnabled", () => ({
    __esModule: true,
    useAnalyticsEnabled: useAnalyticsEnabledMock,
  }));

  // Mock Google Analytics helper functions
  const trackEventMock = jest.fn();
  const trackPageViewMock = jest.fn();
  const trackUserInteractionMock = jest.fn();
  const trackFormSubmissionMock = jest.fn();
  const trackProfileViewMock = jest.fn();
  const trackContactFormMock = jest.fn();

  jest.mock("@/helper/googleAnalytics.helper", () => ({
    __esModule: true,
    GA_MEASUREMENT_ID: "G-TESTID",
    trackEvent: trackEventMock,
    trackPageView: trackPageViewMock,
    trackUserInteraction: trackUserInteractionMock,
    trackFormSubmission: trackFormSubmissionMock,
    trackProfileView: trackProfileViewMock,
    trackContactForm: trackContactFormMock,
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
  }));

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

// ------------------------
// Storage Mocks
// ------------------------
export const createLocalStorageMock = () => {
  const store: Record<string, string> = {};

  const localStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };

  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  return { localStorageMock, store };
};

export const createSessionStorageMock = () => {
  const store: Record<string, string> = {};

  const sessionStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };

  Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

  return { sessionStorageMock, store };
};

// ------------------------
// Supabase Mocks
// ------------------------
export const createSupabaseMocks = () => {
  const authMock = {
    signUp: jest.fn(),
    signIn: jest.fn(),
    signOut: jest.fn(),
    onAuthStateChange: jest.fn(),
    getSession: jest.fn(),
    getUser: jest.fn(),
  };

  const databaseMock = {
    from: jest.fn().mockReturnValue({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(),
    }),
  };

  jest.mock("@/lib/supabase", () => ({
    __esModule: true,
    supabase: {
      auth: authMock,
      ...databaseMock,
    },
  }));

  return { authMock, databaseMock };
};

// ------------------------
// Global Window Mocks
// ------------------------
export const mockGlobalWindow = () => {
  // Mock window.gtag
  const gtagMock = jest.fn();
  Object.defineProperty(window, "gtag", { value: gtagMock, writable: true });

  // Mock window.dataLayer
  const dataLayerMock: any[] = [];
  Object.defineProperty(window, "dataLayer", { value: dataLayerMock, writable: true });

  // Mock document.cookie
  Object.defineProperty(document, "cookie", { value: "", writable: true });

  return { gtagMock, dataLayerMock };
};

// ------------------------
// UI Component Mocks
// ------------------------
export const createUiComponentMocks = () => {
  // Mock Button component
  jest.mock("@/ui/Button.ui", () => {
    const MockButton = ({
      children,
      onClick,
      type = "button",
      ...props
    }: React.PropsWithChildren<{
      onClick?: () => void;
      type?: "button" | "submit" | "reset";
      [key: string]: any;
    }>) => (
      <button type={type} onClick={onClick} {...props}>
        {children}
      </button>
    );
    MockButton.displayName = "MockButton";
    return {
      __esModule: true,
      Button: MockButton,
    };
  });

  // Mock Switch component
  jest.mock("@/ui/Switch.ui", () => {
    const MockSwitch = ({
      checked,
      onCheckedChange,
      ...props
    }: {
      checked?: boolean;
      onCheckedChange?: (checked: boolean) => void;
      [key: string]: any;
    }) => (
      <button
        role="switch"
        aria-checked={checked}
        onClick={() => onCheckedChange && onCheckedChange(!checked)}
        {...props}
      />
    );
    MockSwitch.displayName = "MockSwitch";
    return {
      __esModule: true,
      Switch: MockSwitch,
    };
  });

  // Add other UI component mocks as needed
};

// ------------------------
// Context Provider Mocks
// ------------------------
export const createAuthProviderMocks = () => {
  const authContextValue = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
  };

  const useAuthMock = jest.fn().mockReturnValue(authContextValue);

  jest.mock("@/store/context/Auth.provider", () => ({
    __esModule: true,
    useAuth: useAuthMock,
    AuthProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  }));

  return { useAuthMock, authContextValue };
};

export const createGoogleAuthProviderMocks = () => {
  const googleAuthContextValue = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };

  const useGoogleAuthMock = jest.fn().mockReturnValue(googleAuthContextValue);

  jest.mock("@/store/context/GoogleAuth.provider", () => ({
    __esModule: true,
    useGoogleAuth: useGoogleAuthMock,
    GoogleAuthProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  }));

  return { useGoogleAuthMock, googleAuthContextValue };
};
