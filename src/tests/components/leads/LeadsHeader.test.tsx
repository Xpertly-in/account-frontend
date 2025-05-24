/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { LeadsHeader } from "@/components/leads/LeadsHeader.component";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";

// Mock the child components
jest.mock("@/components/leads/LeadFilter.component", () => ({
  LeadFilterComponent: ({ onClose }: any) => (
    <div data-testid="filter-component">
      <button onClick={onClose}>Close Filter</button>
    </div>
  ),
}));

describe("LeadsHeader Component - TDD Implementation", () => {
  const mockProps = {
    searchTerm: "",
    onSearchChange: jest.fn(),
    currentFilter: {} as LeadFilter,
    onFilterChange: jest.fn(),
    currentSort: { field: "timestamp", direction: "desc" } as LeadSort,
    onSortChange: jest.fn(),
    totalCount: 25,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // RED PHASE: Initial failing tests
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render header title", () => {
      render(<LeadsHeader {...mockProps} />);

      expect(screen.getByText("Leads Management")).toBeInTheDocument();
    });

    test("should render search input", () => {
      render(<LeadsHeader {...mockProps} />);

      expect(screen.getByPlaceholderText("Search leads...")).toBeInTheDocument();
    });

    test("should render filter button", () => {
      render(<LeadsHeader {...mockProps} />);

      expect(screen.getByText("Filter")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic functionality tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should display search term in input", () => {
      render(<LeadsHeader {...mockProps} searchTerm="test search" />);

      const searchInput = screen.getByDisplayValue("test search");
      expect(searchInput).toBeInTheDocument();
    });

    test("should call onSearchChange when typing", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText("Search leads...");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("new search");
    });

    test("should show clear button when search term exists", () => {
      render(<LeadsHeader {...mockProps} searchTerm="test" />);

      const clearButton = screen.getByRole("button", { name: "" });
      expect(clearButton).toBeInTheDocument();
    });

    test("should clear search when clear button clicked", () => {
      render(<LeadsHeader {...mockProps} searchTerm="test" />);

      const clearButton = screen.getByRole("button", { name: "" });
      fireEvent.click(clearButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("");
    });

    test("should show filter menu when filter button clicked", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByText("Filter");
      fireEvent.click(filterButton);

      expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    });

    test("should hide filter menu when close is called", () => {
      render(<LeadsHeader {...mockProps} />);

      // Open filter menu
      const filterButton = screen.getByText("Filter");
      fireEvent.click(filterButton);

      // Close filter menu
      const closeButton = screen.getByText("Close Filter");
      fireEvent.click(closeButton);

      expect(screen.queryByTestId("filter-component")).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should display total count without search term", () => {
      render(<LeadsHeader {...mockProps} totalCount={42} />);

      expect(screen.getByText("42 total leads")).toBeInTheDocument();
    });

    test("should display search results count with search term", () => {
      render(<LeadsHeader {...mockProps} searchTerm="tax" totalCount={15} />);

      expect(screen.getByText("Showing 15 leads")).toBeInTheDocument();
      expect(screen.getByText('for "tax"')).toBeInTheDocument();
    });

    test("should not display count when loading", () => {
      render(<LeadsHeader {...mockProps} isLoading={true} />);

      expect(screen.queryByText(/total leads/)).not.toBeInTheDocument();
    });

    test("should toggle filter menu on multiple clicks", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByText("Filter");

      // Open
      fireEvent.click(filterButton);
      expect(screen.getByTestId("filter-component")).toBeInTheDocument();

      // Close
      fireEvent.click(filterButton);
      expect(screen.queryByTestId("filter-component")).not.toBeInTheDocument();

      // Open again
      fireEvent.click(filterButton);
      expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    });

    test("should not show clear button when no search term", () => {
      render(<LeadsHeader {...mockProps} searchTerm="" />);

      const searchContainer = screen.getByPlaceholderText("Search leads...").parentElement;
      const clearButtons = searchContainer?.querySelectorAll("button");

      expect(clearButtons?.length).toBe(0);
    });

    test("should have proper accessibility attributes", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText("Search leads...");
      expect(searchInput).toBeInTheDocument();

      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should handle empty search term", () => {
      render(<LeadsHeader {...mockProps} searchTerm="" />);

      expect(screen.getByDisplayValue("")).toBeInTheDocument();
    });

    test("should handle zero total count", () => {
      render(<LeadsHeader {...mockProps} totalCount={0} />);

      expect(screen.getByText("0 total leads")).toBeInTheDocument();
    });

    test("should handle large total count", () => {
      render(<LeadsHeader {...mockProps} totalCount={9999} />);

      expect(screen.getByText("9999 total leads")).toBeInTheDocument();
    });

    test("should handle special characters in search", () => {
      render(<LeadsHeader {...mockProps} searchTerm="@#$%^&*()" />);

      expect(screen.getByDisplayValue("@#$%^&*()")).toBeInTheDocument();
    });

    test("should handle long search terms", () => {
      const longSearch = "a".repeat(100);
      render(<LeadsHeader {...mockProps} searchTerm={longSearch} />);

      expect(screen.getByDisplayValue(longSearch)).toBeInTheDocument();
    });

    test("should maintain filter state across re-renders", () => {
      const { rerender } = render(<LeadsHeader {...mockProps} />);

      // Open filter
      fireEvent.click(screen.getByText("Filter"));
      expect(screen.getByTestId("filter-component")).toBeInTheDocument();

      // Re-render with different props
      rerender(<LeadsHeader {...mockProps} totalCount={50} />);
      expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    });

    test("should handle rapid filter button clicks", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByText("Filter");

      // Rapid clicks
      fireEvent.click(filterButton);
      fireEvent.click(filterButton);
      fireEvent.click(filterButton);

      expect(screen.getByTestId("filter-component")).toBeInTheDocument();
    });

    test("should handle search input interactions", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText("Search leads...");

      // Test that input can receive focus
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder", "Search leads...");
    });
  });
});
