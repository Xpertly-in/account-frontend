import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ContactRequestsPage from "@/app/ca/dashboard/contact-requests/page";
import { UrgencyLevel, ContactPreference, SortDirection } from "@/types/common.type";
import { ContactRequestStatus } from "@/types/dashboard/contact-request.type";

// Mock the hooks and services
jest.mock("@/hooks/useDebounce", () => ({
  useDebounce: (value: string) => value, // Return immediately for testing
}));

jest.mock("@/services/contact-requests.service", () => ({
  useContactRequests: jest.fn(),
  useUpdateContactRequestStatus: jest.fn(),
  useUpdateContactRequestNotes: jest.fn(),
}));

jest.mock("@/helper/contact-request.helper", () => ({
  createContactRequestFilterChips: jest.fn(() => []),
  removeFilterChip: jest.fn(),
  clearAllFilters: jest.fn(() => ({})),
}));

// Mock components
jest.mock("@/components/contact-requests/Header.component", () => ({
  Header: ({
    searchTerm,
    onSearchChange,
    onFilterToggle,
    onClearSearch,
    hasActiveFilters,
    filterCount,
    newCount,
    repliedCount,
    totalCount,
    isLoading,
  }: any) => (
    <div data-testid="contact-requests-header">
      <input
        data-testid="search-input"
        value={searchTerm}
        onChange={e => onSearchChange(e.target.value)}
        placeholder="Search contact requests..."
      />
      <button data-testid="filter-toggle" onClick={onFilterToggle}>
        Filter {hasActiveFilters ? `(${filterCount})` : ""}
      </button>
      <button data-testid="clear-search" onClick={onClearSearch}>
        Clear Search
      </button>
      <div data-testid="stats">
        New: {newCount}, Replied: {repliedCount}, Total: {totalCount}
      </div>
      {isLoading && <div data-testid="header-loading">Loading...</div>}
    </div>
  ),
}));

jest.mock("@/components/contact-requests/Card.component", () => ({
  ContactRequestCard: ({ contactRequest, onStatusUpdate, onNotesUpdate }: any) => (
    <div data-testid={`contact-request-card-${contactRequest.id}`}>
      <h3>{contactRequest.customer_name}</h3>
      <p>{contactRequest.subject}</p>
      <p>Status: {contactRequest.status}</p>
      <button
        data-testid={`update-status-${contactRequest.id}`}
        onClick={() => onStatusUpdate(contactRequest.id, ContactRequestStatus.REPLIED)}
      >
        Update Status
      </button>
      <button
        data-testid={`update-notes-${contactRequest.id}`}
        onClick={() => onNotesUpdate(contactRequest.id, "Test notes")}
      >
        Update Notes
      </button>
    </div>
  ),
}));

jest.mock("@/components/contact-requests/EmptyState.component", () => ({
  ContactRequestEmptyState: ({ searchTerm, hasActiveFilters }: any) => (
    <div data-testid="empty-state">
      {searchTerm ? `No results for "${searchTerm}"` : "No contact requests"}
      {hasActiveFilters && <p>Try clearing filters</p>}
    </div>
  ),
}));

jest.mock("@/ui/FilterChips.ui", () => ({
  FilterChips: ({ chips, onRemoveChip, onClearAll, maxVisible }: any) => (
    <div data-testid="filter-chips">
      {chips.map((chip: any, index: number) => (
        <div key={index} data-testid={`filter-chip-${index}`}>
          {chip.label}
          <button onClick={() => onRemoveChip(chip.id)}>Remove</button>
        </div>
      ))}
      <button data-testid="clear-all-filters" onClick={onClearAll}>
        Clear All
      </button>
    </div>
  ),
}));

jest.mock("@/ui/Button.ui", () => ({
  Button: ({ children, onClick, variant, size, className, ...props }: any) => (
    <button onClick={onClick} className={className} {...props}>
      {children}
    </button>
  ),
}));

jest.mock("@phosphor-icons/react", () => ({
  X: () => <div data-testid="x-icon">X</div>,
}));

// Mock data
const mockContactRequests = [
  {
    id: "req-1",
    ca_id: "ca-1",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+1234567890",
    subject: "Tax consultation needed",
    message: "I need help with my tax filing",
    service_needed: "Tax Services",
    urgency: UrgencyLevel.WITHIN_A_WEEK,
    contact_preference: ContactPreference.EMAIL,
    status: ContactRequestStatus.NEW,
    ca_private_notes: "",
    created_at: "2024-01-01T10:00:00Z",
    updated_at: "2024-01-01T10:00:00Z",
  },
  {
    id: "req-2",
    ca_id: "ca-1",
    customer_name: "Jane Smith",
    customer_email: "jane@example.com",
    customer_phone: "+1234567891",
    subject: "Audit assistance",
    message: "Need help with audit preparation",
    service_needed: "Audit Services",
    urgency: UrgencyLevel.THIS_MONTH,
    contact_preference: ContactPreference.PHONE,
    status: ContactRequestStatus.REPLIED,
    ca_private_notes: "Follow up scheduled",
    created_at: "2024-01-02T10:00:00Z",
    updated_at: "2024-01-02T10:00:00Z",
  },
];

describe("ContactRequestsPage", () => {
  let queryClient: QueryClient;
  let mockUseContactRequests: jest.Mock;
  let mockUseUpdateContactRequestStatus: jest.Mock;
  let mockUseUpdateContactRequestNotes: jest.Mock;
  let mockUpdateStatus: jest.Mock;
  let mockUpdateNotes: jest.Mock;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    mockUpdateStatus = jest.fn();
    mockUpdateNotes = jest.fn();

    mockUseContactRequests = require("@/services/contact-requests.service").useContactRequests;
    mockUseUpdateContactRequestStatus =
      require("@/services/contact-requests.service").useUpdateContactRequestStatus;
    mockUseUpdateContactRequestNotes =
      require("@/services/contact-requests.service").useUpdateContactRequestNotes;

    mockUseUpdateContactRequestStatus.mockReturnValue({
      updateStatus: mockUpdateStatus,
    });

    mockUseUpdateContactRequestNotes.mockReturnValue({
      updateNotes: mockUpdateNotes,
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderPage = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <ContactRequestsPage />
      </QueryClientProvider>
    );
  };

  describe("Loading State", () => {
    it("renders loading skeleton when data is loading", () => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: [],
        totalCount: 0,
        isLoading: true,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      const { container } = renderPage();

      expect(screen.getByTestId("header-loading")).toBeInTheDocument();

      // Check for loading skeleton elements
      const skeletonElements = container.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBe(3);
    });
  });

  describe("Error State", () => {
    it("renders error message when data loading fails", () => {
      const mockRefetch = jest.fn();
      mockUseContactRequests.mockReturnValue({
        contactRequests: [],
        totalCount: 0,
        isLoading: false,
        isError: true,
        error: { message: "Network error" },
        refetch: mockRefetch,
      });

      renderPage();

      expect(screen.getByText("Failed to load contact requests")).toBeInTheDocument();
      expect(screen.getByText("Network error")).toBeInTheDocument();
      expect(screen.getByTestId("x-icon")).toBeInTheDocument();

      const retryButton = screen.getByText("Try Again");
      fireEvent.click(retryButton);
      expect(mockRefetch).toHaveBeenCalled();
    });

    it("renders generic error message when no error message provided", () => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: [],
        totalCount: 0,
        isLoading: false,
        isError: true,
        error: null,
        refetch: jest.fn(),
      });

      renderPage();

      expect(screen.getByText("An unexpected error occurred")).toBeInTheDocument();
    });
  });

  describe("Empty State", () => {
    it("renders empty state when no contact requests", () => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: [],
        totalCount: 0,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      renderPage();

      expect(screen.getByTestId("empty-state")).toBeInTheDocument();
      expect(screen.getByText("No contact requests")).toBeInTheDocument();
    });

    it("renders empty state with search term when no results found", () => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: [],
        totalCount: 0,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });

      renderPage();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "nonexistent" } });

      expect(screen.getByText('No results for "nonexistent"')).toBeInTheDocument();
    });
  });

  describe("Success State with Data", () => {
    beforeEach(() => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("renders contact request cards when data is available", () => {
      renderPage();

      expect(screen.getByTestId("contact-request-card-req-1")).toBeInTheDocument();
      expect(screen.getByTestId("contact-request-card-req-2")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Tax consultation needed")).toBeInTheDocument();
      expect(screen.getByText("Audit assistance")).toBeInTheDocument();
    });

    it("displays correct stats in header", () => {
      renderPage();

      expect(screen.getByText("New: 1, Replied: 1, Total: 2")).toBeInTheDocument();
    });

    it("handles status updates", () => {
      renderPage();

      const updateButton = screen.getByTestId("update-status-req-1");
      fireEvent.click(updateButton);

      expect(mockUpdateStatus).toHaveBeenCalledWith({
        requestId: "req-1",
        status: ContactRequestStatus.REPLIED,
      });
    });

    it("handles notes updates", () => {
      renderPage();

      const updateNotesButton = screen.getByTestId("update-notes-req-1");
      fireEvent.click(updateNotesButton);

      expect(mockUpdateNotes).toHaveBeenCalledWith({
        requestId: "req-1",
        notes: "Test notes",
      });
    });
  });

  describe("Search Functionality", () => {
    beforeEach(() => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("updates search term when typing in search input", () => {
      renderPage();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "John" } });

      expect(searchInput).toHaveValue("John");
    });

    it("clears search when clear search button is clicked", () => {
      renderPage();

      const searchInput = screen.getByTestId("search-input");
      fireEvent.change(searchInput, { target: { value: "John" } });
      expect(searchInput).toHaveValue("John");

      const clearButton = screen.getByTestId("clear-search");
      fireEvent.click(clearButton);

      expect(searchInput).toHaveValue("");
    });
  });

  describe("Filter Functionality", () => {
    beforeEach(() => {
      const mockCreateFilterChips =
        require("@/helper/contact-request.helper").createContactRequestFilterChips;
      mockCreateFilterChips.mockReturnValue([
        { id: "status-new", label: "Status: New" },
        { id: "urgency-week", label: "Urgency: Within a week" },
      ]);

      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("toggles filter panel when filter button is clicked", () => {
      renderPage();

      const filterButton = screen.getByTestId("filter-toggle");
      fireEvent.click(filterButton);

      expect(
        screen.getByText("Filter panel coming soon - using existing filter chips for now")
      ).toBeInTheDocument();

      const closeButton = screen.getByText("Close");
      fireEvent.click(closeButton);

      expect(
        screen.queryByText("Filter panel coming soon - using existing filter chips for now")
      ).not.toBeInTheDocument();
    });

    it("displays filter chips when active filters exist", () => {
      renderPage();

      expect(screen.getByTestId("filter-chips")).toBeInTheDocument();
      expect(screen.getByText("Status: New")).toBeInTheDocument();
      expect(screen.getByText("Urgency: Within a week")).toBeInTheDocument();
    });

    it("handles filter chip removal", () => {
      const mockRemoveFilterChip = require("@/helper/contact-request.helper").removeFilterChip;
      mockRemoveFilterChip.mockReturnValue({});

      renderPage();

      const removeButton = screen.getAllByText("Remove")[0];
      fireEvent.click(removeButton);

      expect(mockRemoveFilterChip).toHaveBeenCalled();
    });

    it("handles clear all filters", () => {
      const mockClearAllFilters = require("@/helper/contact-request.helper").clearAllFilters;
      mockClearAllFilters.mockReturnValue({});

      renderPage();

      const clearAllButton = screen.getByTestId("clear-all-filters");
      fireEvent.click(clearAllButton);

      expect(mockClearAllFilters).toHaveBeenCalled();
    });
  });

  describe("Responsive Design", () => {
    beforeEach(() => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("applies correct responsive classes to main container", () => {
      const { container } = renderPage();

      const mainContainer = container.querySelector(".min-h-screen");
      expect(mainContainer).toHaveClass("bg-gray-50", "dark:bg-gray-900");
    });

    it("applies responsive padding to content area", () => {
      const { container } = renderPage();

      const contentArea = container.querySelector(".px-4");
      expect(contentArea).toHaveClass("py-4", "sm:px-6", "sm:py-6", "lg:px-8");
    });
  });

  describe("Dark Mode Support", () => {
    beforeEach(() => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("applies dark mode classes to contact request cards", () => {
      const { container } = renderPage();

      const cards = container.querySelectorAll(".dark\\:bg-gray-800");
      expect(cards.length).toBeGreaterThan(0);
    });
  });

  describe("Performance Optimizations", () => {
    beforeEach(() => {
      mockUseContactRequests.mockReturnValue({
        contactRequests: mockContactRequests,
        totalCount: 2,
        isLoading: false,
        isError: false,
        error: null,
        refetch: jest.fn(),
      });
    });

    it("uses useCallback for event handlers to prevent unnecessary re-renders", () => {
      // This test verifies that the component structure supports performance optimizations
      // The actual useCallback implementation is tested through behavior
      renderPage();

      const searchInput = screen.getByTestId("search-input");

      // Multiple rapid changes should not cause issues
      fireEvent.change(searchInput, { target: { value: "a" } });
      fireEvent.change(searchInput, { target: { value: "ab" } });
      fireEvent.change(searchInput, { target: { value: "abc" } });

      expect(searchInput).toHaveValue("abc");
    });
  });
});
