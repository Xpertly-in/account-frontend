import React from "react";

/**
 * React Context Provider mocks for testing
 */

/**
 * Creates a mock implementation for the Auth context provider
 * @param overrides - Optional values to override the default mock values
 * @returns Object containing the mock hook and context value
 */
export const createAuthProviderMocks = (overrides = {}) => {
  const authContextValue = {
    isAuthenticated: false,
    user: null,
    loading: false,
    error: null,
    signIn: jest.fn(),
    signUp: jest.fn(),
    signOut: jest.fn(),
    ...overrides,
  };

  const useAuthMock = jest.fn().mockReturnValue(authContextValue);

  jest.mock("@/store/context/Auth.provider", () => ({
    __esModule: true,
    useAuth: useAuthMock,
    AuthProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  }));

  return { useAuthMock, authContextValue };
};

/**
 * Creates a mock implementation for the GoogleAuth context provider
 * @param overrides - Optional values to override the default mock values
 * @returns Object containing the mock hook and context value
 */
export const createGoogleAuthProviderMocks = (overrides = {}) => {
  const googleAuthContextValue = {
    isAuthenticated: false,
    user: null,
    isLoading: false,
    error: null,
    signIn: jest.fn(),
    signOut: jest.fn(),
    ...overrides,
  };

  const useGoogleAuthMock = jest.fn().mockReturnValue(googleAuthContextValue);

  jest.mock("@/store/context/GoogleAuth.provider", () => ({
    __esModule: true,
    useGoogleAuth: useGoogleAuthMock,
    GoogleAuthProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  }));

  return { useGoogleAuthMock, googleAuthContextValue };
};

/**
 * Creates a mock implementation for the Theme context provider
 */
export const createThemeProviderMock = (theme = "light") => {
  const useThemeMock = jest.fn().mockReturnValue({
    theme,
    setTheme: jest.fn(),
    resolvedTheme: theme,
    systemTheme: "light",
  });

  jest.mock("next-themes", () => ({
    useTheme: useThemeMock,
    ThemeProvider: ({ children }: React.PropsWithChildren) => <>{children}</>,
  }));

  return { useThemeMock };
};
