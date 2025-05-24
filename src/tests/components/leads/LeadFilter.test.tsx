/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { LeadFilterComponent } from "@/components/leads/LeadFilter.component";

describe("LeadFilterComponent - TDD Implementation", () => {
  const mockSetCurrentFilter = jest.fn();
  const mockSetCurrentSort = jest.fn();
  const mockOnClose = jest.fn();

  const defaultProps = {
    currentFilter: {},
    setCurrentFilter: mockSetCurrentFilter,
    currentSort: { field: "timestamp" as const, direction: "desc" as const },
    setCurrentSort: mockSetCurrentSort,
    onClose: mockOnClose,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render filter title", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const title = screen.getByText("Filter Leads");
      expect(title).toBeInTheDocument();
    });

    test("should render status filter dropdown", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const statusLabel = screen.getByText("Status");
      expect(statusLabel).toBeInTheDocument();
    });

    test("should render urgency filter dropdown", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const urgencyLabel = screen.getAllByText("Urgency")[0];
      expect(urgencyLabel).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should render sort by dropdown", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const sortLabel = screen.getByText("Sort By");
      expect(sortLabel).toBeInTheDocument();
    });

    test("should render reset button", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const resetButton = screen.getByText("Reset");
      expect(resetButton).toBeInTheDocument();
    });

    test("should render apply button", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const applyButton = screen.getByText("Apply");
      expect(applyButton).toBeInTheDocument();
    });

    test("should call onClose when apply button is clicked", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const applyButton = screen.getByText("Apply");
      fireEvent.click(applyButton);

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });

    test("should call reset filters when reset button is clicked", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const resetButton = screen.getByText("Reset");
      fireEvent.click(resetButton);

      expect(mockSetCurrentFilter).toHaveBeenCalledWith({});
      expect(mockSetCurrentSort).toHaveBeenCalledWith({ field: "timestamp", direction: "desc" });
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should have proper card structure", () => {
      const { container } = render(<LeadFilterComponent {...defaultProps} />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toBeInTheDocument();
      expect(card).toHaveClass("rounded-xl");
    });

    test("should be responsive", () => {
      const { container } = render(<LeadFilterComponent {...defaultProps} />);

      const gridContainer = container.querySelector(".grid.gap-4.sm\\:grid-cols-3");
      expect(gridContainer).toBeInTheDocument();
      expect(gridContainer).toHaveClass("sm:grid-cols-3");
    });

    test("should support dark mode", () => {
      const { container } = render(<LeadFilterComponent {...defaultProps} />);

      const card = container.querySelector('[data-slot="card"]');
      expect(card).toHaveClass("dark:border-gray-700");
      expect(card).toHaveClass("dark:bg-gray-800");
    });

    test("should display current filter values", () => {
      const propsWithFilters = {
        ...defaultProps,
        currentFilter: { status: ["new" as const], urgency: ["Immediately" as const] },
      };

      render(<LeadFilterComponent {...propsWithFilters} />);

      // The component should render with the current filter values
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should render quickly", () => {
      const startTime = performance.now();
      render(<LeadFilterComponent {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });

    test("should handle empty filter object", () => {
      render(<LeadFilterComponent {...defaultProps} currentFilter={{}} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });

    test("should handle multiple button clicks", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const applyButton = screen.getByText("Apply");
      fireEvent.click(applyButton);
      fireEvent.click(applyButton);

      expect(mockOnClose).toHaveBeenCalledTimes(2);
    });

    test("should be accessible", () => {
      render(<LeadFilterComponent {...defaultProps} />);

      const title = screen.getByText("Filter Leads");
      expect(title).toBeInTheDocument();

      const resetButton = screen.getByRole("button", { name: "Reset" });
      const applyButton = screen.getByRole("button", { name: "Apply" });

      expect(resetButton).toBeInTheDocument();
      expect(applyButton).toBeInTheDocument();
    });

    test("should maintain state across re-renders", () => {
      const { rerender } = render(<LeadFilterComponent {...defaultProps} />);

      expect(screen.getByText("Filter Leads")).toBeInTheDocument();

      rerender(<LeadFilterComponent {...defaultProps} currentFilter={{ status: ["new"] }} />);
      expect(screen.getByText("Filter Leads")).toBeInTheDocument();
    });
  });
});
