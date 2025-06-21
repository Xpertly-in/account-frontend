/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { LeadEmptyState } from "@/components/leads/LeadEmptyState.component";

describe("LeadEmptyState Component - TDD Implementation", () => {
  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render empty state message", () => {
      render(<LeadEmptyState searchTerm="" />);

      expect(screen.getByText("No leads found")).toBeInTheDocument();
    });

    test("should render empty state description for no search", () => {
      render(<LeadEmptyState searchTerm="" />);

      expect(
        screen.getByText("You'll see new leads here when customers submit inquiries")
      ).toBeInTheDocument();
    });

    test("should render empty state description for search", () => {
      render(<LeadEmptyState searchTerm="test" />);

      expect(screen.getByText("Try adjusting your search filters")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should display the main empty state container", () => {
      render(<LeadEmptyState searchTerm="" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toBeInTheDocument();
    });

    test("should display appropriate styling classes", () => {
      render(<LeadEmptyState searchTerm="" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toHaveClass("text-center");
    });

    test("should render with proper text hierarchy", () => {
      render(<LeadEmptyState searchTerm="" />);

      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
      expect(heading).toHaveTextContent("No leads found");
    });

    test("should render Phosphor icon", () => {
      render(<LeadEmptyState searchTerm="" />);

      const iconContainer = screen
        .getByText("No leads found")
        .closest("div")
        ?.querySelector(".bg-blue-100");
      expect(iconContainer).toBeInTheDocument();
    });

    test("should be accessible", () => {
      render(<LeadEmptyState searchTerm="" />);

      const heading = screen.getByRole("heading");
      expect(heading).toBeInTheDocument();
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should handle different search term scenarios", () => {
      const { rerender } = render(<LeadEmptyState searchTerm="" />);

      expect(screen.getByText("No leads found")).toBeInTheDocument();
      expect(
        screen.getByText("You'll see new leads here when customers submit inquiries")
      ).toBeInTheDocument();

      rerender(<LeadEmptyState searchTerm="test search" />);
      expect(screen.getByText("No leads found")).toBeInTheDocument();
      expect(screen.getByText("Try adjusting your search filters")).toBeInTheDocument();
    });

    test("should maintain consistent styling across different states", () => {
      render(<LeadEmptyState searchTerm="test" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toHaveClass("text-center");
      expect(container).toHaveClass("rounded-xl");
    });

    test("should be responsive", () => {
      render(<LeadEmptyState searchTerm="" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toHaveClass("flex-col");
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should render quickly", () => {
      const startTime = performance.now();
      render(<LeadEmptyState searchTerm="" />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText("No leads found")).toBeInTheDocument();
    });

    test("should handle multiple renders", () => {
      const { rerender } = render(<LeadEmptyState searchTerm="" />);

      expect(screen.getByText("No leads found")).toBeInTheDocument();

      rerender(<LeadEmptyState searchTerm="new search" />);
      expect(screen.getByText("No leads found")).toBeInTheDocument();
    });

    test("should support dark mode classes", () => {
      render(<LeadEmptyState searchTerm="" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toHaveClass("dark:bg-gray-800");
    });

    test("should be mobile-friendly", () => {
      render(<LeadEmptyState searchTerm="" />);

      const container = screen.getByText("No leads found").closest("div");
      expect(container).toHaveClass("text-center");
      expect(container).toHaveClass("py-12");
    });
  });
});
