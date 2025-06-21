/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactRequestEmptyState } from "@/components/contact-requests/EmptyState.component";

// Mock Phosphor Icons
jest.mock("@phosphor-icons/react", () => ({
  ChatCenteredText: ({ className }: { className?: string }) => (
    <div data-testid="chat-centered-text-icon" className={className} />
  ),
}));

describe("ContactRequestEmptyState", () => {
  describe("Default Empty State", () => {
    it("renders default empty state without search term or filters", () => {
      render(<ContactRequestEmptyState />);

      expect(screen.getByText("No contact requests yet")).toBeInTheDocument();
      expect(screen.getByText(/When customers reach out to you/)).toBeInTheDocument();
      expect(screen.getByTestId("chat-centered-text-icon")).toBeInTheDocument();
    });

    it("displays correct icon for default state", () => {
      render(<ContactRequestEmptyState />);

      const icon = screen.getByTestId("chat-centered-text-icon");
      expect(icon).toHaveClass("h-12", "w-12");
    });

    it("applies correct styling classes", () => {
      const { container } = render(<ContactRequestEmptyState />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("text-center", "py-12");

      const maxWidthDiv = mainDiv.querySelector(".max-w-md");
      expect(maxWidthDiv).toBeInTheDocument();
      expect(maxWidthDiv).toHaveClass("mx-auto");
    });

    it("applies dark mode classes", () => {
      render(<ContactRequestEmptyState />);

      const title = screen.getByText("No contact requests yet");
      expect(title).toHaveClass("text-gray-900", "dark:text-gray-100");

      const description = screen.getByText(/When customers reach out to you/);
      expect(description).toHaveClass("text-gray-500", "dark:text-gray-400");
    });
  });

  describe("Search/Filter Empty State", () => {
    it("renders search empty state when search term is provided", () => {
      render(<ContactRequestEmptyState searchTerm="test search" />);

      expect(screen.getByText("No contact requests found")).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search or filters/)).toBeInTheDocument();
      expect(screen.getByText('Searched for: "test search"')).toBeInTheDocument();
    });

    it("renders filter empty state when hasActiveFilters is true", () => {
      render(<ContactRequestEmptyState hasActiveFilters={true} />);

      expect(screen.getByText("No contact requests found")).toBeInTheDocument();
      expect(screen.getByText(/Try adjusting your search or filters/)).toBeInTheDocument();
    });

    it("renders search empty state with both search term and active filters", () => {
      render(<ContactRequestEmptyState searchTerm="urgent" hasActiveFilters={true} />);

      expect(screen.getByText("No contact requests found")).toBeInTheDocument();
      expect(screen.getByText('Searched for: "urgent"')).toBeInTheDocument();
    });

    it("displays search icon for filtered state", () => {
      const { container } = render(<ContactRequestEmptyState searchTerm="test" />);

      const searchIcon = container.querySelector('svg[viewBox="0 0 24 24"]');
      expect(searchIcon).toBeInTheDocument();
      expect(searchIcon).toHaveClass("h-12", "w-12");
    });

    it("does not show search term when only hasActiveFilters is true", () => {
      render(<ContactRequestEmptyState hasActiveFilters={true} />);

      expect(screen.queryByText(/Searched for:/)).not.toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("applies custom className", () => {
      const { container } = render(<ContactRequestEmptyState className="custom-class" />);

      const mainDiv = container.firstChild as HTMLElement;
      expect(mainDiv).toHaveClass("custom-class");
    });

    it("handles empty search term", () => {
      render(<ContactRequestEmptyState searchTerm="" />);

      expect(screen.getByText("No contact requests yet")).toBeInTheDocument();
      expect(screen.queryByText(/Searched for:/)).not.toBeInTheDocument();
    });

    it("handles undefined props gracefully", () => {
      render(<ContactRequestEmptyState searchTerm={undefined} hasActiveFilters={undefined} />);

      expect(screen.getByText("No contact requests yet")).toBeInTheDocument();
      expect(screen.getByTestId("chat-centered-text-icon")).toBeInTheDocument();
    });
  });

  describe("Styling and Layout", () => {
    it("applies correct text styling", () => {
      render(<ContactRequestEmptyState />);

      const title = screen.getByText("No contact requests yet");
      expect(title).toHaveClass("text-lg", "font-medium", "mb-2");

      const description = screen.getByText(/When customers reach out to you/);
      expect(description).toHaveClass("text-sm", "leading-relaxed");
    });

    it("applies correct icon container styling", () => {
      const { container } = render(<ContactRequestEmptyState />);

      const iconContainer = container.querySelector(".text-gray-400");
      expect(iconContainer).toHaveClass("mx-auto", "mb-4", "dark:text-gray-500");
    });

    it("applies correct search term styling", () => {
      render(<ContactRequestEmptyState searchTerm="test" />);

      const searchText = screen.getByText('Searched for: "test"');
      expect(searchText).toHaveClass("text-xs", "text-gray-400", "dark:text-gray-500", "mt-2");
    });
  });

  describe("Edge Cases", () => {
    it("handles very long search terms", () => {
      const longSearchTerm = "a".repeat(100);
      render(<ContactRequestEmptyState searchTerm={longSearchTerm} />);

      expect(screen.getByText(`Searched for: "${longSearchTerm}"`)).toBeInTheDocument();
    });

    it("handles special characters in search term", () => {
      const specialSearchTerm = "test@#$%^&*()";
      render(<ContactRequestEmptyState searchTerm={specialSearchTerm} />);

      expect(screen.getByText(`Searched for: "${specialSearchTerm}"`)).toBeInTheDocument();
    });

    it("maintains accessibility with proper heading hierarchy", () => {
      render(<ContactRequestEmptyState />);

      const heading = screen.getByRole("heading", { level: 3 });
      expect(heading).toHaveTextContent("No contact requests yet");
    });
  });
});
