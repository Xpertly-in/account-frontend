import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { useRouter } from "next/navigation";
import { Header } from "@/components/contact-requests/Header.component";

// Mock Next.js router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

// Mock Phosphor Icons
jest.mock("@phosphor-icons/react", () => ({
  MagnifyingGlass: ({ className }: { className?: string }) => (
    <div data-testid="magnifying-glass-icon" className={className} />
  ),
  FunnelSimple: ({ className }: { className?: string }) => (
    <div data-testid="funnel-simple-icon" className={className} />
  ),
  X: ({ className }: { className?: string }) => <div data-testid="x-icon" className={className} />,
  ChatCenteredText: ({ className, weight }: { className?: string; weight?: string }) => (
    <div data-testid="chat-centered-text-icon" className={className} data-weight={weight} />
  ),
  Clock: ({ className }: { className?: string }) => (
    <div data-testid="clock-icon" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <div data-testid="check-circle-icon" className={className} />
  ),
  ArrowLeft: ({ className }: { className?: string }) => (
    <div data-testid="arrow-left-icon" className={className} />
  ),
}));

const mockPush = jest.fn();
const mockRouter = {
  push: mockPush,
  back: jest.fn(),
  forward: jest.fn(),
  refresh: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
};

const defaultProps = {
  searchTerm: "",
  onSearchChange: jest.fn(),
  onFilterToggle: jest.fn(),
  onClearSearch: jest.fn(),
  hasActiveFilters: false,
  filterCount: 0,
  newCount: 5,
  repliedCount: 3,
  totalCount: 8,
  isLoading: false,
};

describe("Header", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe("RED PHASE - Basic Rendering", () => {
    it("renders header title", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText("Contact Requests")).toBeInTheDocument();
    });

    it("renders subtitle on desktop", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText("Manage customer inquiries")).toBeInTheDocument();
    });

    it("renders search input", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByPlaceholderText("Search requests...")).toBeInTheDocument();
    });

    it("renders filter button", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByTestId("funnel-simple-icon")).toBeInTheDocument();
    });

    it("renders back button for mobile", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    });
  });

  describe("GREEN PHASE - Functionality", () => {
    it("calls onSearchChange when typing in search input", () => {
      const onSearchChange = jest.fn();
      render(<Header {...defaultProps} onSearchChange={onSearchChange} />);

      const searchInput = screen.getByPlaceholderText("Search requests...");
      fireEvent.change(searchInput, { target: { value: "test search" } });

      expect(onSearchChange).toHaveBeenCalledWith("test search");
    });

    it("calls onFilterToggle when clicking filter button", () => {
      const onFilterToggle = jest.fn();
      render(<Header {...defaultProps} onFilterToggle={onFilterToggle} />);

      const filterButton = screen.getByTestId("funnel-simple-icon").closest("button");
      fireEvent.click(filterButton!);

      expect(onFilterToggle).toHaveBeenCalled();
    });

    it("calls onClearSearch when clicking clear button", () => {
      const onClearSearch = jest.fn();
      render(<Header {...defaultProps} searchTerm="test" onClearSearch={onClearSearch} />);

      const clearButton = screen.getByTestId("x-icon");
      fireEvent.click(clearButton);

      expect(onClearSearch).toHaveBeenCalled();
    });

    it("navigates to dashboard when clicking back button", () => {
      render(<Header {...defaultProps} />);

      const backButton = screen.getByTestId("arrow-left-icon").closest("button");
      fireEvent.click(backButton!);

      expect(mockPush).toHaveBeenCalledWith("/ca/dashboard");
    });

    it("displays search term in input", () => {
      render(<Header {...defaultProps} searchTerm="GST query" />);

      const searchInput = screen.getByDisplayValue("GST query");
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("REFACTOR PHASE - Stats Display", () => {
    it("displays correct new count", () => {
      render(<Header {...defaultProps} newCount={12} />);

      const newCountElements = screen.getAllByText("12");
      expect(newCountElements.length).toBeGreaterThan(0);
    });

    it("displays correct replied count", () => {
      render(<Header {...defaultProps} repliedCount={7} />);

      expect(screen.getByText("7")).toBeInTheDocument();
    });

    it("displays correct total count", () => {
      render(<Header {...defaultProps} totalCount={19} />);

      const totalCountElements = screen.getAllByText("19");
      expect(totalCountElements.length).toBeGreaterThan(0);
    });

    it("displays desktop stats with proper labels", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByText("New Requests")).toBeInTheDocument();
      expect(screen.getByText("Replied")).toBeInTheDocument();
      expect(screen.getByText("Total")).toBeInTheDocument();
    });

    it("displays mobile stats in compact format", () => {
      render(<Header {...defaultProps} newCount={5} totalCount={8} />);

      // Mobile stats should be present
      const clockIcons = screen.getAllByTestId("clock-icon");
      const checkCircleIcons = screen.getAllByTestId("check-circle-icon");

      expect(clockIcons.length).toBeGreaterThan(0);
      expect(checkCircleIcons.length).toBeGreaterThan(0);
    });
  });

  describe("Filter State Management", () => {
    it("shows filter count badge when filters are active", () => {
      render(<Header {...defaultProps} hasActiveFilters={true} filterCount={3} />);

      // Look specifically for the badge element by finding all elements with "3" and checking for the badge
      const allThrees = screen.getAllByText("3");
      const badge = allThrees.find(el => el.closest(".bg-orange-500"));
      expect(badge).toBeInTheDocument();
    });

    it("does not show filter badge when no active filters", () => {
      render(<Header {...defaultProps} hasActiveFilters={false} filterCount={0} />);

      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });

    it("applies correct badge styling for active filters", () => {
      render(<Header {...defaultProps} hasActiveFilters={true} filterCount={2} />);

      const allTwos = screen.getAllByText("2");
      const badge = allTwos.find(el => el.closest(".bg-orange-500"));
      expect(badge).toHaveClass("bg-orange-500", "text-white");
    });
  });

  describe("Search Functionality", () => {
    it("shows clear button when search term exists", () => {
      render(<Header {...defaultProps} searchTerm="test" />);

      expect(screen.getByTestId("x-icon")).toBeInTheDocument();
    });

    it("hides clear button when search term is empty", () => {
      render(<Header {...defaultProps} searchTerm="" />);

      expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
    });

    it("displays search icon in input", () => {
      render(<Header {...defaultProps} />);

      expect(screen.getByTestId("magnifying-glass-icon")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("disables search input when loading", () => {
      render(<Header {...defaultProps} isLoading={true} />);

      const searchInput = screen.getByPlaceholderText("Search requests...");
      expect(searchInput).toBeDisabled();
    });

    it("disables filter button when loading", () => {
      render(<Header {...defaultProps} isLoading={true} />);

      const filterButton = screen.getByTestId("funnel-simple-icon").closest("button");
      expect(filterButton).toBeDisabled();
    });

    it("disables clear button when loading", () => {
      render(<Header {...defaultProps} searchTerm="test" isLoading={true} />);

      const clearButton = screen.getByTestId("x-icon").closest("button");
      expect(clearButton).toBeDisabled();
    });
  });

  describe("Styling and Layout", () => {
    it("applies gradient background", () => {
      const { container } = render(<Header {...defaultProps} />);

      const headerDiv = container.querySelector(".bg-gradient-to-r");
      expect(headerDiv).toHaveClass("from-emerald-500", "to-blue-500");
    });

    it("applies dark mode gradient", () => {
      const { container } = render(<Header {...defaultProps} />);

      const headerDiv = container.querySelector(".dark\\:from-emerald-600");
      expect(headerDiv).toHaveClass("dark:to-blue-600");
    });

    it("applies sticky positioning", () => {
      const { container } = render(<Header {...defaultProps} />);

      const headerDiv = container.querySelector(".sticky");
      expect(headerDiv).toHaveClass("top-0", "z-10");
    });

    it("applies responsive padding", () => {
      const { container } = render(<Header {...defaultProps} />);

      const paddingDiv = container.querySelector(".px-4");
      expect(paddingDiv).toHaveClass("py-3", "sm:px-6", "sm:py-4");
    });
  });

  describe("Icon Styling", () => {
    it("applies correct icon styling for main header icon", () => {
      render(<Header {...defaultProps} />);

      const mainIcon = screen.getAllByTestId("chat-centered-text-icon")[0]; // Get the first one (header icon)
      expect(mainIcon).toHaveClass("h-4", "w-4", "text-white", "sm:h-5", "sm:w-5");
      expect(mainIcon).toHaveAttribute("data-weight", "bold");
    });

    it("applies correct styling for stats icons", () => {
      render(<Header {...defaultProps} />);

      const clockIcons = screen.getAllByTestId("clock-icon");
      const checkCircleIcons = screen.getAllByTestId("check-circle-icon");

      // We have both mobile (h-3 w-3) and desktop (h-4 w-4) icons
      // Just check that icons exist and have appropriate size classes
      clockIcons.forEach(icon => {
        const hasCorrectSize = icon.className.includes("h-3") || icon.className.includes("h-4");
        expect(hasCorrectSize).toBe(true);
      });

      checkCircleIcons.forEach(icon => {
        const hasCorrectSize = icon.className.includes("h-3") || icon.className.includes("h-4");
        expect(hasCorrectSize).toBe(true);
      });
    });
  });

  describe("Responsive Design", () => {
    it("hides subtitle on mobile", () => {
      render(<Header {...defaultProps} />);

      const subtitle = screen.getByText("Manage customer inquiries");
      expect(subtitle).toHaveClass("hidden", "sm:block");
    });

    it("shows mobile stats layout", () => {
      const { container } = render(<Header {...defaultProps} />);

      const mobileStats = container.querySelector(".sm\\:hidden");
      expect(mobileStats).toBeInTheDocument();
    });

    it("shows desktop stats layout", () => {
      const { container } = render(<Header {...defaultProps} />);

      const desktopStats = container.querySelector(".sm\\:grid");
      expect(desktopStats).toHaveClass("sm:grid-cols-3");
    });
  });

  describe("Edge Cases", () => {
    it("handles zero counts gracefully", () => {
      render(<Header {...defaultProps} newCount={0} repliedCount={0} totalCount={0} />);

      const zeroElements = screen.getAllByText("0");
      expect(zeroElements.length).toBeGreaterThan(0);
    });

    it("handles large counts", () => {
      render(<Header {...defaultProps} newCount={999} repliedCount={888} totalCount={1887} />);

      expect(screen.getAllByText("999")).toHaveLength(2); // Mobile and desktop
      expect(screen.getByText("888")).toBeInTheDocument();
      expect(screen.getAllByText("1887")).toHaveLength(2); // Mobile and desktop
    });

    it("handles very long search terms", () => {
      const longSearchTerm = "a".repeat(100);
      render(<Header {...defaultProps} searchTerm={longSearchTerm} />);

      const searchInput = screen.getByDisplayValue(longSearchTerm);
      expect(searchInput).toBeInTheDocument();
    });

    it("handles special characters in search", () => {
      const specialSearch = "test@#$%^&*()";
      render(<Header {...defaultProps} searchTerm={specialSearch} />);

      const searchInput = screen.getByDisplayValue(specialSearch);
      expect(searchInput).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("maintains proper heading hierarchy", () => {
      render(<Header {...defaultProps} />);

      const heading = screen.getByRole("heading", { level: 1 });
      expect(heading).toHaveTextContent("Contact Requests");
    });

    it("provides accessible button labels through icons", () => {
      render(<Header {...defaultProps} />);

      const buttons = screen.getAllByRole("button");
      expect(buttons.length).toBeGreaterThan(0);
    });

    it("maintains focus management for interactive elements", () => {
      render(<Header {...defaultProps} searchTerm="test" />);

      const searchInput = screen.getByPlaceholderText("Search requests...");
      const clearButton = screen.getByTestId("x-icon").closest("button");

      expect(searchInput).not.toHaveAttribute("tabindex", "-1");
      expect(clearButton).not.toHaveAttribute("tabindex", "-1");
    });
  });
});
