/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { render } from "@/tests/test-utils";
import { LeadFilterComponent } from "@/components/leads/LeadFilter.component";
import { LeadFilter, LeadSort, LeadStatus, LeadUrgency } from "@/types/dashboard/lead.type";

// Import mocks
import "@/tests/mocks";

// Mock the leads service
jest.mock("@/services/leads.service", () => ({
  useAllFilterOptions: jest.fn(),
}));

// Get the mocked function
const mockUseAllFilterOptions = require("@/services/leads.service").useAllFilterOptions;

// Mock filter options data
const mockFilterOptions = {
  statusOptions: [
    { value: "new", label: "New", count: 15 },
    { value: "contacted", label: "Contacted", count: 8 },
    { value: "closed", label: "Closed", count: 5 },
    { value: "archived", label: "Archived", count: 2 },
  ],
  urgencyOptions: [
    { value: "Immediately", label: "Immediately", count: 10 },
    { value: "Within a week", label: "Within a week", count: 12 },
    { value: "This month", label: "This month", count: 6 },
    { value: "Just exploring", label: "Just exploring", count: 2 },
  ],
  servicesOptions: [
    { value: "Tax Filing", label: "Tax Filing", count: 20 },
    { value: "Business Registration", label: "Business Registration", count: 15 },
    { value: "Accounting", label: "Accounting", count: 18 },
    { value: "Audit", label: "Audit", count: 8 },
  ],
  contactPreferenceOptions: [
    { value: "Phone", label: "Phone", count: 25 },
    { value: "WhatsApp", label: "WhatsApp", count: 10 },
    { value: "Email", label: "Email", count: 5 },
  ],
  locationOptions: [
    { value: "Mumbai", label: "Mumbai", count: 15 },
    { value: "Delhi", label: "Delhi", count: 12 },
    { value: "Bangalore", label: "Bangalore", count: 8 },
    { value: "Chennai", label: "Chennai", count: 5 },
  ],
  isLoading: false,
  isError: false,
  error: null,
  refetch: jest.fn(),
};

describe("Enhanced LeadFilter Component", () => {
  const mockSetCurrentFilter = jest.fn();
  const mockSetCurrentSort = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    currentFilter: {} as LeadFilter,
    setCurrentFilter: mockSetCurrentFilter,
    currentSort: { field: "timestamp" as const, direction: "desc" as const } as LeadSort,
    setCurrentSort: mockSetCurrentSort,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAllFilterOptions.mockReturnValue(mockFilterOptions);
  });

  // ============================================================================
  // BASIC RENDERING TESTS
  // ============================================================================

  describe("Basic Rendering", () => {
    it("renders filter card with title and description", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
      expect(screen.getByText("Set filters to narrow down the lead list")).toBeInTheDocument();
    });

    it("renders all filter labels", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Urgency")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Sort By")).toBeInTheDocument();
    });

    it("renders Reset and Apply buttons", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    });

    it("applies proper responsive grid classes", () => {
      const { container } = render(<LeadFilterComponent {...defaultProps} />);

      const gridContainer = container.querySelector(
        ".grid.gap-4.sm\\:grid-cols-2.lg\\:grid-cols-5"
      );
      expect(gridContainer).toBeInTheDocument();
    });

    it("applies dark mode classes", () => {
      const { container } = render(<LeadFilterComponent {...defaultProps} />);

      const card = container.querySelector('[class*="dark:border-gray-700"]');
      expect(card).toBeInTheDocument();
    });
  });

  // ============================================================================
  // COMBOBOX INTEGRATION TESTS
  // ============================================================================

  describe("Combobox Integration", () => {
    it("renders all filter comboboxes with correct placeholders", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Select statuses...")).toBeInTheDocument();
      expect(screen.getByText("Select urgencies...")).toBeInTheDocument();
      expect(screen.getByText("Select services...")).toBeInTheDocument();
      expect(screen.getByText("Select cities...")).toBeInTheDocument();
    });

    it("renders comboboxes as interactive elements", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const comboboxes = screen.getAllByRole("combobox");
      expect(comboboxes).toHaveLength(5); // Status, Urgency, Services, Location, Sort By

      comboboxes.forEach(combobox => {
        expect(combobox).toBeInTheDocument();
        expect(combobox).not.toBeDisabled();
      });
    });

    it("shows proper ARIA attributes for comboboxes", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const comboboxes = screen.getAllByRole("combobox");
      comboboxes.forEach(combobox => {
        expect(combobox).toHaveAttribute("aria-expanded", "false");
        expect(combobox).toHaveAttribute("aria-haspopup", "listbox");
      });
    });
  });

  // ============================================================================
  // DEPENDENT FILTERING TESTS
  // ============================================================================

  describe("Dependent Filtering", () => {
    it("shows smart filtering indicator when filters are applied", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: {
          status: ["new"] as LeadStatus[],
          urgency: ["Immediately"] as LeadUrgency[],
        },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      expect(screen.getByText("Smart Filtering Active")).toBeInTheDocument();
      expect(
        screen.getByText(
          "Filter options are updated based on your current selections to show only available combinations."
        )
      ).toBeInTheDocument();
    });

    it("hides smart filtering indicator when no filters are applied", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.queryByText("Smart Filtering Active")).not.toBeInTheDocument();
    });

    it("calls useAllFilterOptions with base filter for dependent filtering", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: {
          status: ["new"] as LeadStatus[],
          urgency: ["Immediately"] as LeadUrgency[],
          services: ["Tax Filing"],
        },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      expect(mockUseAllFilterOptions).toHaveBeenCalledWith({
        urgency: ["Immediately"],
        services: ["Tax Filing"],
        location: undefined,
      });
    });

    it("shows smart filtering for each filter type", () => {
      const testCases = [
        { status: ["new"] as LeadStatus[] },
        { urgency: ["Immediately"] as LeadUrgency[] },
        { services: ["Tax Filing"] },
        { location: ["Mumbai"] },
      ];

      testCases.forEach(filter => {
        const { unmount } = render(
          <LeadFilterComponent {...defaultProps} currentFilter={filter} />
        );

        expect(screen.getByText("Smart Filtering Active")).toBeInTheDocument();
        unmount();
      });
    });
  });

  // ============================================================================
  // LOADING STATES TESTS
  // ============================================================================

  describe("Loading States", () => {
    it("shows loading placeholders when data is loading", () => {
      mockUseAllFilterOptions.mockReturnValue({
        ...mockFilterOptions,
        isLoading: true,
      });

      render(<LeadFilterComponent {...defaultProps} />);

      const loadingTexts = screen.getAllByText("Updating options...");
      expect(loadingTexts.length).toBeGreaterThan(0);
    });

    it("shows loading state correctly", () => {
      mockUseAllFilterOptions.mockReturnValue({
        ...mockFilterOptions,
        isLoading: true,
      });

      render(<LeadFilterComponent {...defaultProps} />);

      // Check that loading placeholders are shown
      const loadingTexts = screen.getAllByText("Updating options...");
      expect(loadingTexts.length).toBeGreaterThan(0);

      // Check that comboboxes are rendered (they should be present even when loading)
      const comboboxes = screen.getAllByRole("combobox");
      expect(comboboxes).toHaveLength(5); // Status, Urgency, Services, Location, Sort By
    });

    it("shows normal placeholders when not loading", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Select statuses...")).toBeInTheDocument();
      expect(screen.getByText("Select urgencies...")).toBeInTheDocument();
      expect(screen.getByText("Select services...")).toBeInTheDocument();
      expect(screen.getByText("Select cities...")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // RESET AND APPLY FUNCTIONALITY TESTS
  // ============================================================================

  describe("Reset and Apply Functionality", () => {
    it("resets all filters when reset button is clicked", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const resetButton = screen.getByRole("button", { name: "Reset" });
      fireEvent.click(resetButton);

      expect(mockSetCurrentFilter).toHaveBeenCalledWith({});
      expect(mockSetCurrentSort).toHaveBeenCalledWith({
        field: "timestamp",
        direction: "desc",
      });
    });

    it("calls onClose when apply button is clicked", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const applyButton = screen.getByRole("button", { name: "Apply" });
      fireEvent.click(applyButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    it("maintains filter state after reset until apply is clicked", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: { status: ["new"] as LeadStatus[] },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      const resetButton = screen.getByRole("button", { name: "Reset" });
      fireEvent.click(resetButton);

      // Reset should be called but component still shows smart filtering until apply
      expect(mockSetCurrentFilter).toHaveBeenCalledWith({});
    });
  });

  // ============================================================================
  // DISPLAY VALUES TESTS
  // ============================================================================

  describe("Display Values", () => {
    it("displays selected filter values in comboboxes", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: {
          status: ["new", "contacted"] as LeadStatus[],
          urgency: ["Immediately"] as LeadUrgency[],
          services: ["Tax Filing", "Accounting"],
          location: ["Mumbai"],
        },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      // Check if selected values are displayed (exact text depends on Combobox implementation)
      expect(screen.getByText("New, Contacted")).toBeInTheDocument();
      expect(screen.getByText("Immediately")).toBeInTheDocument();
      expect(screen.getByText("Tax Filing, Accounting")).toBeInTheDocument();
      expect(screen.getByText("Mumbai")).toBeInTheDocument();
    });

    it("shows truncated display for many selected options", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: {
          services: ["Tax Filing", "Accounting", "Audit", "Business Registration"],
        },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      // Should show truncated display with "+X more" - check for partial text match
      const truncatedText = screen.getByText(/Tax Filing.*\+.*more/);
      expect(truncatedText).toBeInTheDocument();
    });

    it("displays current sort value", () => {
      const propsWithSort = {
        ...defaultProps,
        currentSort: { field: "urgency" as const, direction: "desc" as const },
      };

      render(<LeadFilterComponent {...propsWithSort} />);

      // Look for the sort value in the Sort By combobox
      const sortComboboxes = screen.getAllByText("Urgency");
      expect(sortComboboxes.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe("Accessibility", () => {
    it("has proper labels for all filter inputs", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Status")).toBeInTheDocument();
      expect(screen.getByText("Urgency")).toBeInTheDocument();
      expect(screen.getByText("Services")).toBeInTheDocument();
      expect(screen.getByText("Location")).toBeInTheDocument();
      expect(screen.getByText("Sort By")).toBeInTheDocument();
    });

    it("has accessible button roles", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByRole("button", { name: "Reset" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Apply" })).toBeInTheDocument();
    });

    it("supports keyboard navigation", async () => {
      const user = userEvent.setup();
      render(<LeadFilterComponent {...defaultProps} />);

      const resetButton = screen.getByRole("button", { name: "Reset" });
      resetButton.focus();

      await user.keyboard("{Tab}");
      const applyButton = screen.getByRole("button", { name: "Apply" });
      expect(applyButton).toHaveFocus();
    });
  });

  // ============================================================================
  // ERROR HANDLING TESTS
  // ============================================================================

  describe("Error Handling", () => {
    it("handles empty filter options gracefully", () => {
      mockUseAllFilterOptions.mockReturnValue({
        statusOptions: [],
        urgencyOptions: [],
        servicesOptions: [],
        contactPreferenceOptions: [],
        locationOptions: [],
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });

    it("handles undefined filter values gracefully", () => {
      const propsWithUndefined = {
        ...defaultProps,
        currentFilter: {
          status: undefined,
          urgency: undefined,
          services: undefined,
          location: undefined,
        },
      };

      render(<LeadFilterComponent {...propsWithUndefined} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });

    it("handles missing callback functions gracefully", () => {
      const propsWithoutCallbacks = {
        ...defaultProps,
        setCurrentFilter: undefined as any,
        setCurrentSort: undefined as any,
        onClose: undefined as any,
      };

      expect(() => {
        render(<LeadFilterComponent {...propsWithoutCallbacks} />);
      }).not.toThrow();
    });

    it("handles API errors gracefully", () => {
      mockUseAllFilterOptions.mockReturnValue({
        ...mockFilterOptions,
        isError: true,
        error: new Error("API Error"),
      });

      render(<LeadFilterComponent {...defaultProps} />);

      // Component should still render even with API errors
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE TESTS
  // ============================================================================

  describe("Performance", () => {
    it("renders efficiently with large filter options", () => {
      const largeFilterOptions = {
        statusOptions: Array.from({ length: 50 }, (_, i) => ({
          value: `status${i}`,
          label: `Status ${i}`,
          count: i + 1,
        })),
        urgencyOptions: mockFilterOptions.urgencyOptions,
        servicesOptions: Array.from({ length: 100 }, (_, i) => ({
          value: `service${i}`,
          label: `Service ${i}`,
          count: i + 1,
        })),
        contactPreferenceOptions: mockFilterOptions.contactPreferenceOptions,
        locationOptions: Array.from({ length: 200 }, (_, i) => ({
          value: `city${i}`,
          label: `City ${i}`,
          count: i + 1,
        })),
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      };

      mockUseAllFilterOptions.mockReturnValue(largeFilterOptions);

      const startTime = performance.now();
      render(<LeadFilterComponent {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });

    it("handles rapid filter changes efficiently", async () => {
      const user = userEvent.setup();
      render(<LeadFilterComponent {...defaultProps} />);

      const resetButton = screen.getByRole("button", { name: "Reset" });

      // Rapidly click reset multiple times
      for (let i = 0; i < 5; i++) {
        await user.click(resetButton);
      }

      expect(mockSetCurrentFilter).toHaveBeenCalledTimes(5);
    });
  });

  // ============================================================================
  // INTEGRATION TESTS
  // ============================================================================

  describe("Integration", () => {
    it("integrates properly with useAllFilterOptions hook", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      expect(mockUseAllFilterOptions).toHaveBeenCalledWith({
        urgency: undefined,
        services: undefined,
        location: undefined,
      });
    });

    it("passes correct filter context for dependent filtering", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: {
          status: ["new"] as LeadStatus[],
          services: ["Tax Filing"],
        },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      expect(mockUseAllFilterOptions).toHaveBeenCalledWith({
        urgency: undefined,
        services: ["Tax Filing"],
        location: undefined,
      });
    });

    it("maintains component state across re-renders", () => {
      const { rerender } = render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();

      rerender(<LeadFilterComponent {...defaultProps} currentFilter={{ status: ["new"] }} />);
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
      expect(screen.getByText("Smart Filtering Active")).toBeInTheDocument();
    });
  });
});
