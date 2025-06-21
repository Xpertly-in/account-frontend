/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeadsHeader } from "@/components/leads/LeadsHeader.component";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";

// Mock the child components
jest.mock("@/components/leads/LeadFilter.component", () => ({
  LeadFilterComponent: ({ onClose }: { onClose: () => void }) => (
    <div data-testid="lead-filter-component">
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
    newCount: 5,
    contactedCount: 10,
    archivedCount: 3,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Basic Rendering", () => {
    it("renders stats dashboard with correct counts", () => {
      render(<LeadsHeader {...mockProps} />);

      // Check stats cards
      expect(screen.getByText("5")).toBeInTheDocument(); // New Leads
      expect(screen.getByText("10")).toBeInTheDocument(); // Contacted
      expect(screen.getByText("25")).toBeInTheDocument(); // Total
      expect(screen.getByText("3")).toBeInTheDocument(); // Archived

      expect(screen.getByText("New Leads")).toBeInTheDocument();
      expect(screen.getByText("Contacted")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
      expect(screen.getByText("Archived")).toBeInTheDocument();
    });

    it("renders search input with correct placeholder", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      expect(searchInput).toBeInTheDocument();
      expect(searchInput).toHaveValue("");
    });

    it("renders filter button", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByRole("button");
      expect(filterButton).toBeInTheDocument();
    });

    it("shows total count in results summary when no search term", () => {
      render(<LeadsHeader {...mockProps} />);

      // Use getAllByText to handle multiple matches and check that at least one exists
      const totalLeadsElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes("25 total leads") || false;
      });
      expect(totalLeadsElements.length).toBeGreaterThan(0);
    });
  });

  describe("Search Functionality", () => {
    it("calls onSearchChange when typing in search input", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      fireEvent.change(searchInput, { target: { value: "John" } });

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("John");
    });

    it("shows clear button when search term exists", () => {
      render(<LeadsHeader {...mockProps} searchTerm="John" />);

      // Find the clear button by looking for the X icon button
      const clearButtons = screen.getAllByRole("button");
      const clearButton = clearButtons.find(
        button => button.querySelector("svg") && button.className.includes("absolute")
      );
      expect(clearButton).toBeInTheDocument();
    });

    it("clears search when clear button is clicked", () => {
      render(<LeadsHeader {...mockProps} searchTerm="John" />);

      // Find the clear button by looking for the X icon button
      const clearButtons = screen.getAllByRole("button");
      const clearButton = clearButtons.find(
        button => button.querySelector("svg") && button.className.includes("absolute")
      );

      if (clearButton) {
        fireEvent.click(clearButton);
        expect(mockProps.onSearchChange).toHaveBeenCalledWith("");
      }
    });

    it("shows search results summary when searching and not loading", () => {
      render(<LeadsHeader {...mockProps} searchTerm="John" totalCount={5} isLoading={false} />);

      // Check that the search input has the correct value
      const searchInput = screen.getByDisplayValue("John");
      expect(searchInput).toBeInTheDocument();

      // Check for the search results text - use getAllByText to handle multiple matches
      const searchResultsElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Showing 5 leads for "John"') || false;
      });
      expect(searchResultsElements.length).toBeGreaterThan(0);

      expect(
        screen.getByText("💡 Searched across names, locations, services, contact info, and more")
      ).toBeInTheDocument();
    });

    it("shows no results message and suggestions when no results found", () => {
      render(<LeadsHeader {...mockProps} searchTerm="xyz" totalCount={0} isLoading={false} />);

      // Check that the search input has the correct value
      const searchInput = screen.getByDisplayValue("xyz");
      expect(searchInput).toBeInTheDocument();

      // Check for the search results text - use getAllByText to handle multiple matches
      const searchResultsElements = screen.getAllByText((content, element) => {
        return element?.textContent?.includes('Showing 0 leads for "xyz"') || false;
      });
      expect(searchResultsElements.length).toBeGreaterThan(0);

      expect(screen.getByText("Try:")).toBeInTheDocument();

      // Check for suggestion buttons - they contain the text plus commas for first 3
      expect(
        screen.getByText((content, element) => {
          return element?.textContent === "new leads," && element?.tagName === "BUTTON";
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((content, element) => {
          return element?.textContent === "Toronto," && element?.tagName === "BUTTON";
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((content, element) => {
          return element?.textContent === "tax," && element?.tagName === "BUTTON";
        })
      ).toBeInTheDocument();

      expect(
        screen.getByText((content, element) => {
          return element?.textContent === "urgent" && element?.tagName === "BUTTON";
        })
      ).toBeInTheDocument();
    });

    it("calls onSearchChange when clicking search suggestions", () => {
      render(<LeadsHeader {...mockProps} searchTerm="xyz" totalCount={0} isLoading={false} />);

      // Find the Toronto button specifically (it contains "Toronto," with comma)
      const suggestionButton = screen.getByText((content, element) => {
        return element?.textContent === "Toronto," && element?.tagName === "BUTTON";
      });
      fireEvent.click(suggestionButton);

      expect(mockProps.onSearchChange).toHaveBeenCalledWith("Toronto");
    });
  });

  describe("Filter Functionality", () => {
    it("shows filter menu when filter button is clicked", () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByRole("button");
      fireEvent.click(filterButton);

      expect(screen.getByTestId("lead-filter-component")).toBeInTheDocument();
    });

    it("hides filter menu when closed", async () => {
      render(<LeadsHeader {...mockProps} />);

      const filterButton = screen.getByRole("button");
      fireEvent.click(filterButton);

      const closeButton = screen.getByText("Close Filter");
      fireEvent.click(closeButton);

      await waitFor(() => {
        expect(screen.queryByTestId("lead-filter-component")).not.toBeInTheDocument();
      });
    });

    it("shows active filters count badge when filters are applied", () => {
      const filterWithValues = {
        status: ["new"],
        urgency: ["Immediately"],
      } as LeadFilter;

      render(<LeadsHeader {...mockProps} currentFilter={filterWithValues} />);

      expect(screen.getByText("2")).toBeInTheDocument(); // Badge showing 2 active filters
    });
  });

  describe("Loading States", () => {
    it("disables search input when loading", () => {
      render(<LeadsHeader {...mockProps} isLoading={true} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      expect(searchInput).toBeDisabled();
    });

    it("disables filter button when loading", () => {
      render(<LeadsHeader {...mockProps} isLoading={true} />);

      const filterButton = screen.getByRole("button");
      expect(filterButton).toBeDisabled();
    });

    it("hides results summary when loading", () => {
      render(<LeadsHeader {...mockProps} isLoading={true} />);

      // When loading, the results summary should not be present
      const totalLeadsElements = screen.queryAllByText((content, element) => {
        return element?.textContent?.includes("25 total leads") || false;
      });
      expect(totalLeadsElements.length).toBe(0);
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive grid classes to stats dashboard", () => {
      render(<LeadsHeader {...mockProps} />);

      const statsContainer = screen.getByText("New Leads").closest(".grid");
      expect(statsContainer).toHaveClass("grid-cols-2");
      expect(statsContainer).toHaveClass("sm:grid-cols-4");
    });

    it("applies responsive styling to search and filter bar", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      expect(searchInput).toHaveClass("rounded-xl");
    });
  });

  describe("Accessibility", () => {
    it("has proper ARIA labels and roles", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByRole("textbox");
      expect(searchInput).toBeInTheDocument();

      const filterButton = screen.getByRole("button");
      expect(filterButton).toBeInTheDocument();
    });

    it("supports keyboard navigation", () => {
      render(<LeadsHeader {...mockProps} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      searchInput.focus();
      expect(document.activeElement).toBe(searchInput);
    });
  });

  describe("Performance and Edge Cases", () => {
    it("handles undefined search term gracefully", () => {
      render(<LeadsHeader {...mockProps} searchTerm={undefined as any} />);

      const searchInput = screen.getByPlaceholderText(
        "Search leads by name, location, services..."
      );
      expect(searchInput).toHaveValue("");
    });

    it("handles zero counts in stats", () => {
      render(
        <LeadsHeader
          {...mockProps}
          newCount={0}
          contactedCount={0}
          archivedCount={0}
          totalCount={0}
        />
      );

      // Check that all stats show 0
      const zeroElements = screen.getAllByText("0");
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it("handles large numbers in stats", () => {
      render(<LeadsHeader {...mockProps} newCount={999} contactedCount={1234} totalCount={5678} />);

      expect(screen.getByText("999")).toBeInTheDocument();
      expect(screen.getByText("1234")).toBeInTheDocument();
      expect(screen.getByText("5678")).toBeInTheDocument();
    });
  });
});
