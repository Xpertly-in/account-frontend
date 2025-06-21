/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { FilterChips, type FilterChip } from "@/ui/FilterChips.ui";
import { createContactRequestFilterChips } from "@/helper/contact-request.helper";
import { FilterChipType } from "@/types/common.type";
import { ContactRequestFilter } from "@/types/dashboard/contact-request.type";

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  X: () => <div data-testid="x-icon" />,
}));

describe("FilterChips Component - Contact Request Implementation", () => {
  const mockOnRemoveChip = jest.fn();
  const mockOnClearAll = jest.fn();

  const sampleChips: FilterChip[] = [
    {
      id: "status-0",
      label: "New",
      value: "new",
      type: FilterChipType.STATUS,
    },
    {
      id: "urgency-0",
      label: "Immediately",
      value: "Immediately",
      type: FilterChipType.URGENCY,
    },
    {
      id: "service-0",
      label: "Tax Preparation",
      value: "Tax Preparation",
      type: FilterChipType.SERVICE,
    },
    {
      id: "contact_preference-0",
      label: "Email",
      value: "Email",
      type: FilterChipType.CONTACT_PREFERENCE,
    },
    {
      id: "search",
      label: '"John Smith"',
      value: "John Smith",
      type: FilterChipType.SEARCH,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // BASIC RENDERING TESTS
  // ============================================================================

  describe("Basic Rendering", () => {
    test("renders filter chips correctly", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      expect(screen.getByText("5 filters applied:")).toBeInTheDocument();
      expect(screen.getByText("New")).toBeInTheDocument();
      expect(screen.getByText("Immediately")).toBeInTheDocument();
      expect(screen.getByText("Tax Preparation")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText('"John Smith"')).toBeInTheDocument();
    });

    test("renders nothing when no chips provided", () => {
      const { container } = render(
        <FilterChips chips={[]} onRemoveChip={mockOnRemoveChip} onClearAll={mockOnClearAll} />
      );

      expect(container.firstChild).toBeNull();
    });

    test("renders clear all button by default", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      expect(screen.getByText("Clear all")).toBeInTheDocument();
    });

    test("hides clear all button when showClearAll is false", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
          showClearAll={false}
        />
      );

      expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // INTERACTION TESTS
  // ============================================================================

  describe("User Interactions", () => {
    test("calls onRemoveChip when remove button is clicked", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      const removeButtons = screen.getAllByTestId("x-icon");
      fireEvent.click(removeButtons[0]);

      expect(mockOnRemoveChip).toHaveBeenCalledWith("status-0");
    });

    test("calls onClearAll when clear all button is clicked", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      const clearAllButton = screen.getByText("Clear all");
      fireEvent.click(clearAllButton);

      expect(mockOnClearAll).toHaveBeenCalled();
    });

    test("shows more chips when show more button is clicked", () => {
      const manyChips = Array.from({ length: 8 }, (_, i) => ({
        id: `chip-${i}`,
        label: `Chip ${i}`,
        value: `chip-${i}`,
        type: FilterChipType.STATUS,
      }));

      render(
        <FilterChips
          chips={manyChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
          maxVisible={5}
        />
      );

      expect(screen.getByText("+3 more")).toBeInTheDocument();
      expect(screen.queryByText("Chip 5")).not.toBeInTheDocument();

      fireEvent.click(screen.getByText("+3 more"));

      expect(screen.getByText("Show less")).toBeInTheDocument();
      expect(screen.getByText("Chip 5")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // BADGE VARIANT TESTS
  // ============================================================================

  describe("Badge Variants", () => {
    test("applies correct variants for different chip types", () => {
      const { container } = render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      // Status chip should use status-specific variant (new = blue)
      const statusBadge = screen.getByText("New").closest("div");
      expect(statusBadge).toHaveClass("bg-blue-500"); // "new" status variant

      // Urgency chip should use urgency-specific variant (immediately = urgent = red)
      const urgencyBadge = screen.getByText("Immediately").closest("div");
      expect(urgencyBadge).toHaveClass("bg-red-500"); // "urgent" variant

      // Service chip should use secondary variant
      const serviceBadge = screen.getByText("Tax Preparation").closest("div");
      expect(serviceBadge).toHaveClass("bg-secondary"); // secondary variant

      // Contact preference chip should use contact preference variant (email = cyan)
      const contactBadge = screen.getByText("Email").closest("div");
      expect(contactBadge).toHaveClass("bg-cyan-100"); // email variant
    });

    test("uses custom variant when provided", () => {
      const customChips: FilterChip[] = [
        {
          id: "custom-1",
          label: "Custom",
          value: "custom",
          type: FilterChipType.STATUS,
          variant: "destructive",
        },
      ];

      render(
        <FilterChips
          chips={customChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      const customBadge = screen.getByText("Custom").closest("div");
      expect(customBadge).toHaveClass("bg-destructive"); // destructive variant
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe("Accessibility", () => {
    test("provides proper aria labels for remove buttons", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      expect(screen.getByLabelText("Remove New filter")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove Immediately filter")).toBeInTheDocument();
      expect(screen.getByLabelText("Remove Tax Preparation filter")).toBeInTheDocument();
    });

    test("handles keyboard navigation", () => {
      render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      const removeButton = screen.getByLabelText("Remove New filter");
      removeButton.focus();
      expect(removeButton).toHaveFocus();
    });
  });

  // ============================================================================
  // HELPER FUNCTION TESTS
  // ============================================================================

  describe("createContactRequestFilterChips Helper", () => {
    test("creates chips from contact request filter", () => {
      const filter: ContactRequestFilter = {
        status: ["new", "replied"],
        urgency: ["Immediately", "Within a week"],
        service_needed: ["Tax Preparation", "Bookkeeping"],
        contact_preference: ["Email", "Phone"],
        search: "John Smith",
        dateRange: {
          from: "2024-01-01",
          to: "2024-01-31",
        },
      };

      const chips = createContactRequestFilterChips(filter);

      expect(chips).toHaveLength(10); // 2 status + 2 urgency + 2 service + 2 contact + 1 search + 1 date

      // Check status chips
      expect(chips.find(c => c.type === FilterChipType.STATUS && c.value === "new")).toBeDefined();
      expect(
        chips.find(c => c.type === FilterChipType.STATUS && c.value === "replied")
      ).toBeDefined();

      // Check urgency chips
      expect(
        chips.find(c => c.type === FilterChipType.URGENCY && c.value === "Immediately")
      ).toBeDefined();

      // Check service chips
      expect(
        chips.find(c => c.type === FilterChipType.SERVICE && c.value === "Tax Preparation")
      ).toBeDefined();

      // Check contact preference chips
      expect(
        chips.find(c => c.type === FilterChipType.CONTACT_PREFERENCE && c.value === "Email")
      ).toBeDefined();

      // Check search chip
      expect(
        chips.find(c => c.type === FilterChipType.SEARCH && c.value === "John Smith")
      ).toBeDefined();

      // Check date range chip
      expect(chips.find(c => c.type === FilterChipType.DATE_RANGE)).toBeDefined();
    });

    test("handles empty filter", () => {
      const filter: ContactRequestFilter = {};
      const chips = createContactRequestFilterChips(filter);

      expect(chips).toHaveLength(0);
    });

    test("handles partial date range", () => {
      const filterWithFromDate: ContactRequestFilter = {
        dateRange: { from: "2024-01-01", to: "" },
      };

      const chipsFromDate = createContactRequestFilterChips(filterWithFromDate);
      expect(chipsFromDate).toHaveLength(1);
      expect(chipsFromDate[0].label).toContain("From");

      const filterWithToDate: ContactRequestFilter = {
        dateRange: { from: "", to: "2024-01-31" },
      };

      const chipsToDate = createContactRequestFilterChips(filterWithToDate);
      expect(chipsToDate).toHaveLength(1);
      expect(chipsToDate[0].label).toContain("Until");
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe("Edge Cases", () => {
    test("handles single filter correctly", () => {
      const singleChip: FilterChip[] = [
        {
          id: "single",
          label: "Single",
          value: "single",
          type: FilterChipType.STATUS,
        },
      ];

      render(
        <FilterChips
          chips={singleChip}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
        />
      );

      expect(screen.getByText("1 filter applied:")).toBeInTheDocument();
    });

    test("handles missing onClearAll prop", () => {
      render(<FilterChips chips={sampleChips} onRemoveChip={mockOnRemoveChip} />);

      expect(screen.queryByText("Clear all")).not.toBeInTheDocument();
    });

    test("applies custom className", () => {
      const { container } = render(
        <FilterChips
          chips={sampleChips}
          onRemoveChip={mockOnRemoveChip}
          onClearAll={mockOnClearAll}
          className="custom-class"
        />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });
});
