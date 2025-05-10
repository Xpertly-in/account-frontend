import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { AnalyticsOptOut } from "@/components/features/analytics/AnalyticsOptOut.component";

// Mock GA measurement ID
jest.mock("@/helper/googleAnalytics.helper", () => ({
  __esModule: true,
  GA_MEASUREMENT_ID: "G-TESTID",
}));

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn().mockReturnValue(null),
  setItem: jest.fn(),
  clear: jest.fn(),
  removeItem: jest.fn(),
  key: jest.fn(),
  length: 0,
};

// Mock gtag
const gtagMock = jest.fn();

describe("AnalyticsOptOut", () => {
  beforeEach(() => {
    // Setup mocks
    Object.defineProperty(window, "localStorage", { value: localStorageMock });
    Object.defineProperty(window, "gtag", { value: gtagMock });

    // Mock document.cookie
    Object.defineProperty(document, "cookie", { value: "", writable: true });

    // Reset mocks
    jest.clearAllMocks();
  });

  test('renders the "Privacy Settings" button initially', () => {
    render(<AnalyticsOptOut />);

    expect(screen.getByText("Privacy Settings")).toBeInTheDocument();
    expect(screen.queryByText("Analytics Preferences")).not.toBeInTheDocument();
  });

  test('opens the panel when the "Privacy Settings" button is clicked', () => {
    render(<AnalyticsOptOut />);

    const button = screen.getByText("Privacy Settings");
    fireEvent.click(button);

    expect(screen.getByText("Analytics Preferences")).toBeInTheDocument();
    expect(screen.getByText("Allow analytics tracking")).toBeInTheDocument();
  });

  test("closes the panel when the X button is clicked", () => {
    render(<AnalyticsOptOut />);

    // Open the panel
    const button = screen.getByText("Privacy Settings");
    fireEvent.click(button);

    // Click the close button
    const xButton = screen.getByRole("button", { name: "" });
    fireEvent.click(xButton);

    // The panel should be closed, and the "Privacy Settings" button should be visible
    expect(screen.getByText("Privacy Settings")).toBeInTheDocument();
    expect(screen.queryByText("Analytics Preferences")).not.toBeInTheDocument();
  });

  test("toggles opt-out state when the switch is clicked", () => {
    render(<AnalyticsOptOut />);

    // Open the panel
    const button = screen.getByText("Privacy Settings");
    fireEvent.click(button);

    // Find and click the switch
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toBeInTheDocument();

    // Switch should be on by default (analytics enabled)
    expect(switchElement).toHaveAttribute("aria-checked", "true");

    // Click to opt out (turn off analytics)
    fireEvent.click(switchElement);

    // Verify local storage was updated
    expect(localStorageMock.setItem).toHaveBeenCalledWith("xpertly_analytics_opt_out", "true");

    // Verify gtag was called with correct parameters
    expect(gtagMock).toHaveBeenCalledWith("config", "G-TESTID", {
      send_page_view: false,
      anonymize_ip: true,
    });

    // Verify the switch is now off
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });

  test("loads opt-out preference from localStorage on mount", () => {
    // Set initial state in localStorage
    localStorageMock.getItem.mockReturnValueOnce("true");

    render(<AnalyticsOptOut />);

    // Open the panel
    const button = screen.getByText("Privacy Settings");
    fireEvent.click(button);

    // Switch should be off (analytics disabled)
    const switchElement = screen.getByRole("switch");
    expect(switchElement).toHaveAttribute("aria-checked", "false");
  });
});
