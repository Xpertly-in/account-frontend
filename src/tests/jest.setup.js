// jest-dom adds custom jest matchers for asserting on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import "@testing-library/jest-dom";
// import { toHaveNoViolations } from "jest-axe"; // This specific import might not be needed if extend-expect works
import "jest-axe/extend-expect"; // This should globally extend expect

// Add jest-axe matchers - The line above should handle this.
// expect.extend({ toHaveNoViolations }); // Removing this to avoid conflict

// Mock environment variables for tests
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://test.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key";
process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID = "test-ga-id";

// Mock Supabase client
jest.mock("@/helper/supabase.helper", () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      insert: jest.fn().mockReturnThis(),
      update: jest.fn().mockReturnThis(),
      delete: jest.fn().mockReturnThis(),
      auth: {
        signIn: jest.fn(),
        signUp: jest.fn(),
        signOut: jest.fn(),
        onAuthStateChange: jest.fn().mockReturnValue({
          data: { subscription: { unsubscribe: jest.fn() } },
        }),
      },
      // Add any other Supabase methods used in your project
      order: jest.fn().mockResolvedValue({ data: [], error: null }),
      eq: jest.fn().mockResolvedValue({ data: [], error: null }),
      single: jest.fn().mockResolvedValue({ data: {}, error: null }),
      limit: jest.fn().mockResolvedValue({ data: [], error: null }),
      range: jest.fn().mockResolvedValue({ data: [], error: null }),
      rpc: jest.fn().mockResolvedValue({ data: {}, error: null }),
    })),
    auth: {
      signInWithPassword: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: "user-id" }, session: {} }, error: null }),
      signUp: jest
        .fn()
        .mockResolvedValue({ data: { user: { id: "user-id" }, session: {} }, error: null }),
      signOut: jest.fn().mockResolvedValue({ error: null }),
      onAuthStateChange: jest.fn().mockImplementation(callback => {
        // Simulate an auth state change
        // callback("SIGNED_IN", { user: { id: "user-id" } });
        return {
          data: { subscription: { unsubscribe: jest.fn() } },
        };
      }),
      getUser: jest.fn().mockResolvedValue({ data: { user: null }, error: null }),
      getSession: jest.fn().mockResolvedValue({ data: { session: null }, error: null }),
    },
    // Mock storage if you use it
    storage: {
      from: jest.fn(() => ({
        upload: jest.fn(),
        download: jest.fn(),
        remove: jest.fn(),
        list: jest.fn(),
      })),
    },
  },
}));

// Mock Auth provider
jest.mock("@/store/context/Auth.provider", () => {
  const actualAuth = jest.requireActual("@/store/context/Auth.provider");
  return {
    ...actualAuth,
    useAuth: jest.fn(() => ({
      auth: {
        isAuthenticated: false,
        user: null,
        isLoading: false,
        error: null,
        profile: null,
        isCa: false,
        isCustomer: false,
        isOnboardingCompleted: false,
      },
      signIn: jest.fn().mockResolvedValue({ error: null }),
      signUp: jest.fn().mockResolvedValue({ error: null }),
      signOut: jest.fn().mockResolvedValue(undefined),
      signInWithGoogle: jest.fn().mockResolvedValue({ error: null }),
      setAuth: jest.fn(),
      fetchUserProfile: jest.fn().mockResolvedValue(null),
      completeOnboarding: jest.fn().mockResolvedValue(undefined),
    })),
    // AuthProvider: ({ children }: { children: React.ReactNode }) => jest.fn().mockReturnValue(children),
  };
});

// Mock Analytics hooks (unconditional again)
jest.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
    trackUserInteraction: jest.fn(),
    trackPageView: jest.fn(),
    trackError: jest.fn(),
    identifyUser: jest.fn(),
    resetUser: jest.fn(),
    trackFormSubmission: jest.fn(),
    trackProfileView: jest.fn(),
    trackContact: jest.fn(),
    trackLeadView: jest.fn(),
    trackLeadEngagement: jest.fn(),
    trackSearch: jest.fn(),
    isAnalyticsEnabled: jest.fn(() => true),
  }),
}));

jest.mock("@/hooks/useAnalyticsEnabled", () => ({
  useAnalyticsEnabled: () => ({
    analyticsEnabled: false,
    setAnalyticsEnabled: jest.fn(),
    showConsentBanner: false,
    setShowConsentBanner: jest.fn(),
    handleAcceptConsent: jest.fn(),
    handleDeclineConsent: jest.fn(),
  }),
}));

// Mock window.matchMedia
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock ResizeObserver
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock localStorage
const localStorageMock = (function () {
  let store = {};
  return {
    getItem(key) {
      return store[key] || null;
    },
    setItem(key, value) {
      store[key] = value.toString();
    },
    removeItem(key) {
      delete store[key];
    },
    clear() {
      store = {};
    },
    get length() {
      return Object.keys(store).length;
    },
    key(index) {
      const keys = Object.keys(store);
      return keys[index] || null;
    },
  };
})();
Object.defineProperty(window, "localStorage", { value: localStorageMock });

// Mock next/navigation
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"), // Preserve original functionalities
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  useSearchParams: () => ({
    get: jest.fn(),
  }),
  usePathname: () => "/", // Default pathname or a specific one if needed
}));

// Mock Jotai
// If you're using Jotai and its atoms directly in components, you might need to mock them
// or the specific hooks like useAtom.
// Example:
// jest.mock("jotai", () => ({
//   ...jest.requireActual("jotai"),
//   atom: jest.fn(),
//   useAtom: jest.fn(() => [initialValue, jest.fn()]),
// }));
// jest.mock("jotai/utils", () => ({
//   ...jest.requireActual("jotai/utils"),
//   atomWithStorage: jest.fn((key, initialValue) => {
//     const actualAtom = jest.requireActual("jotai").atom(initialValue);
//     return actualAtom;
//   }),
//   // Add other Jotai utils if needed
// }));

// Silence console.error and console.warn during tests to keep output clean
// You can comment this out if you need to see these logs for debugging
// global.console.error = jest.fn();
// global.console.warn = jest.fn();

// You might need to mock specific modules or functions if they cause issues
// Example: mocking a specific library causing problems in JSDOM
// jest.mock('problematic-library', () => ({
//   someFunction: jest.fn(),
// }));

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
  localStorageMock.clear(); // Clear localStorage after each test
});

// You can also add global beforeAll/afterAll if needed
// beforeAll(() => {
//   // Setup before all tests
// });
// afterAll(() => {
//   // Teardown after all tests
// });

console.log("Jest setup file loaded and mocks applied.");
