import React, { ReactElement } from "react";
import { render, RenderOptions } from "@testing-library/react";
import { ThemeProvider } from "@/store/context/Theme.provider";
import { axe } from "jest-axe";

// Interface for the AllProviders props
interface AllProvidersProps {
  children: React.ReactNode;
  theme?: "light" | "dark";
  withAuth?: boolean;
}

// We're not auto-importing Auth provider to avoid Supabase initialization errors
// Create a wrapper with only the theme provider
const AllProviders = ({ children, theme = "light" }: AllProvidersProps) => {
  return <ThemeProvider defaultTheme={theme}>{children}</ThemeProvider>;
};

// Interface for the custom render options
interface CustomRenderOptions extends Omit<RenderOptions, "wrapper"> {
  theme?: "light" | "dark";
  viewport?: { width: number; height: number };
}

// Custom render function that includes only theme provider
const customRender = (
  ui: ReactElement,
  { theme = "light", ...options }: CustomRenderOptions = {}
) => {
  return render(ui, {
    wrapper: props => <AllProviders {...props} theme={theme} />,
    ...options,
  });
};

// Function to set up window dimensions for responsive testing
const setWindowDimensions = (width: number, height: number = 768) => {
  Object.defineProperty(window, "innerWidth", { writable: true, configurable: true, value: width });
  Object.defineProperty(window, "innerHeight", {
    writable: true,
    configurable: true,
    value: height,
  });
  window.dispatchEvent(new Event("resize"));
};

// Viewport sizes for mobile-first testing
const viewports = {
  mobile: { width: 375, height: 667 },
  mobileLarge: { width: 425, height: 812 },
  tablet: { width: 768, height: 1024 },
  laptop: { width: 1024, height: 768 },
  desktop: { width: 1440, height: 900 },
};

// Function to create a mock file for FileUpload testing
const createMockFile = (name: string, size: number, type: string) => {
  const file = new File(["mock file content"], name, { type });
  Object.defineProperty(file, "size", {
    get() {
      return size;
    },
  });
  return file;
};

// Mock router for testing
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
  pathname: "/",
  query: {},
};

// Utility to simulate a responsive window for mobile-first testing
const renderWithViewport = (
  ui: ReactElement,
  { viewport = viewports.mobile, theme = "light", ...options }: CustomRenderOptions = {}
) => {
  setWindowDimensions(viewport.width, viewport.height);
  return customRender(ui, { theme, ...options });
};

/**
 * Custom render function for testing dark mode
 * Uses direct DOM manipulation rather than provider context
 * @param ui - The React element to render
 * @param theme - The theme to apply ('light' or 'dark')
 */
export function renderWithTheme(ui: React.ReactElement, theme: "light" | "dark" = "light") {
  // Add data-theme attribute to simulate dark mode
  document.documentElement.setAttribute("data-theme", theme);

  // Clean up after test
  return {
    ...render(ui),
    cleanup: () => document.documentElement.removeAttribute("data-theme"),
  };
}

/**
 * A11y test helper - runs axe on rendered component
 * @param container - The container to test
 */
export async function checkA11y(container: HTMLElement) {
  const results = await axe(container);
  expect(results).toHaveNoViolations();
}

/**
 * A11y test helper for dark mode
 * @param ui - React component to test
 */
export async function checkA11yInDarkMode(ui: React.ReactElement) {
  const { container, cleanup } = renderWithTheme(ui, "dark");
  await checkA11y(container);
  cleanup();
}

/**
 * Generate a very long string for testing overflow
 * @param char - Character to repeat
 * @param length - Length of string
 */
export function generateLongString(char: string = "a", length: number = 1000): string {
  return char.repeat(length);
}

/**
 * Common special characters string for testing input handling
 */
export const specialCharacters = "!@#$%^&*()_+{}|:<>?~`-=[]\\;',./";

// Export all utilities
export * from "@testing-library/react";
export {
  customRender as render,
  renderWithViewport,
  setWindowDimensions,
  viewports,
  createMockFile,
  mockRouter,
};
