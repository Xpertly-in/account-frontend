import React from "react";
import { render, screen } from "@testing-library/react";
import { GoogleAnalytics } from "@/components/features/analytics/GoogleAnalytics.component";
import { Provider } from "@/store/jotai";
import { mockGlobalWindow } from "@/tests/mocks/jestMock.helper";

// Set up window mocks
beforeAll(() => {
  // Explicitly mock window.gtag
  const { gtagMock } = mockGlobalWindow();
});

// Mock navigation
jest.mock("next/navigation", () => ({
  __esModule: true,
  usePathname: jest.fn().mockReturnValue("/test-page"),
  useSearchParams: jest.fn().mockReturnValue({
    toString: () => "?param=value",
  }),
}));

// Mock Next.js Script component
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

// Mock analytics enabled hook
jest.mock("@/hooks/useAnalyticsEnabled", () => ({
  __esModule: true,
  useAnalyticsEnabled: jest.fn().mockReturnValue(true),
}));

// Get mocked hook
const useAnalyticsEnabled = require("@/hooks/useAnalyticsEnabled").useAnalyticsEnabled;

// Mock window objects
mockGlobalWindow();

describe("GoogleAnalytics", () => {
  // Set up common mocks
  beforeEach(() => {
    useAnalyticsEnabled.mockReturnValue(true);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders GA scripts when analytics are enabled", () => {
    render(
      <Provider>
        <GoogleAnalytics />
      </Provider>
    );

    // Check that the scripts are rendered
    expect(screen.getByTestId("script")).toBeInTheDocument();
    expect(screen.getByTestId("google-analytics")).toBeInTheDocument();
  });

  test("does not render GA scripts when analytics are disabled", () => {
    // Mock analytics as disabled
    useAnalyticsEnabled.mockReturnValue(false);

    const { container } = render(
      <Provider>
        <GoogleAnalytics />
      </Provider>
    );

    // Check that no scripts are rendered
    expect(container).toBeEmptyDOMElement();
  });

  test("renders with the correct GA Measurement ID", () => {
    render(
      <Provider>
        <GoogleAnalytics />
      </Provider>
    );

    // Check that the script has the correct src with the GA Measurement ID
    const script = screen.getByTestId("script");
    expect(script).toHaveAttribute("data-src", expect.stringContaining("gtag/js"));
  });
});
