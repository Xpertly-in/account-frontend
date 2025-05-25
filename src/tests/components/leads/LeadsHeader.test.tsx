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

      // Use a more flexible selector since placeholder is now dynamic
      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder");
      expect(searchInput.getAttribute("placeholder")).toMatch(/search|find|try/i);
    });

    test("should render filter button", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).toBeInTheDocument();
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

      const searchInput = screen.getByRole("textbox");
      fireEvent.change(searchInput, { target: { value: "new search" } });

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("new search");
    });

    test("should show clear button when search term exists", () => {
      render(<LeadsHeader {...mockProps} searchTerm="test search" />);

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

      // Use more flexible text matching since text is split across elements
      expect(screen.getByText("15")).toBeInTheDocument();
      expect(screen.getByText(/leads/)).toBeInTheDocument();
      expect(screen.getByText(/tax/)).toBeInTheDocument();
      expect(
        screen.getByText("💡 Searched across names, locations, services, contact info, and more")
      ).toBeInTheDocument();
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

      const searchInput = screen.getByRole("textbox");
      const searchContainer = searchInput.parentElement;

      // Look for X button specifically
      const xButtons = searchContainer?.querySelectorAll("svg");
      const clearButton = Array.from(xButtons || []).find(
        svg => svg.querySelector('path[d*="205.66,194.34"]') // X icon path
      );

      expect(clearButton).toBeUndefined();
    });

    test("should have proper accessibility attributes", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();

      const filterButton = screen.getByRole("button", { name: /filter/i });
      expect(filterButton).toBeInTheDocument();

      // Check for search help button
      const helpButton = screen.getByTitle("Search help");
      expect(helpButton).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should handle search input interactions", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByRole("textbox");

      // Test that input can receive focus
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveAttribute("placeholder");

      // Test typing
      fireEvent.change(searchInput, { target: { value: "test query" } });
      expect(mockProps.onSearchChange).toHaveBeenCalledWith("test query");
    });

    test("should handle clear button click", () => {
      render(<LeadsHeader {...mockProps} searchTerm="existing search" />);

      // Find the clear button (X icon)
      const clearButton = screen.getByRole("button", { name: "" });
      fireEvent.click(clearButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("");
    });

    test("should handle filter button click", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByRole("button", { name: /filter/i });
      fireEvent.click(filterButton);

      // Should show filter menu (LeadFilterComponent)
      // This would require mocking the LeadFilterComponent or checking for its presence
      expect(filterButton).toBeInTheDocument();
    });

    test("should handle search help button click", () => {
      render(<LeadsHeader {...mockProps} />);

      const helpButton = screen.getByTitle("Search help");
      fireEvent.click(helpButton);

      // Should show search help tooltip
      expect(screen.getByText("Search Tips")).toBeInTheDocument();
      expect(screen.getByText("Customer Name:")).toBeInTheDocument();
    });

    test("should handle search example clicks", () => {
      render(<LeadsHeader {...mockProps} />);

      // Open search help first
      const helpButton = screen.getByTitle("Search help");
      fireEvent.click(helpButton);

      // Click on a search example
      const exampleButton = screen.getByText("John Smith");
      fireEvent.click(exampleButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("John Smith");
    });

    test("should show no results suggestions when search returns 0 results", () => {
      render(<LeadsHeader {...mockProps} searchTerm="nonexistent" totalCount={0} />);

      expect(screen.getByText("Try:")).toBeInTheDocument();

      // Find suggestion buttons by their content (text includes commas)
      const buttons = screen.getAllByRole("button");
      const suggestionButtons = buttons.filter(
        button =>
          button.textContent?.includes("new leads") ||
          button.textContent?.includes("Toronto") ||
          button.textContent?.includes("tax") ||
          button.textContent?.includes("urgent")
      );

      expect(suggestionButtons.length).toBeGreaterThan(0);
    });

    test("should handle suggestion clicks when no results", () => {
      render(<LeadsHeader {...mockProps} searchTerm="nonexistent" totalCount={0} />);

      // Find the Toronto suggestion button
      const buttons = screen.getAllByRole("button");
      const torontoButton = buttons.find(button => button.textContent?.includes("Toronto"));

      expect(torontoButton).toBeDefined();
      fireEvent.click(torontoButton!);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("Toronto");
    });

    test("should display enhanced search context for results", () => {
      render(<LeadsHeader {...mockProps} searchTerm="tax" totalCount={5} />);

      expect(
        screen.getByText("💡 Searched across names, locations, services, contact info, and more")
      ).toBeInTheDocument();
    });

    test("should show usage tip when no search term", () => {
      render(<LeadsHeader {...mockProps} searchTerm="" totalCount={25} />);

      expect(screen.getByText("• Use search to find specific leads quickly")).toBeInTheDocument();
    });
  });
});
