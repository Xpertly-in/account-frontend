/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Pagination } from "@/components/leads/Pagination.component";

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  CaretLeft: () => <div data-testid="caret-left-icon" />,
  CaretRight: () => <div data-testid="caret-right-icon" />,
  DotsThree: () => <div data-testid="dots-three-icon" />,
}));

describe("Pagination Component - TDD Implementation", () => {
  const mockOnPageChange = jest.fn();
  const mockOnPageSizeChange = jest.fn();
  const mockOnNextPage = jest.fn();
  const mockOnPreviousPage = jest.fn();

  const defaultProps = {
    currentPage: 1,
    totalPages: 5,
    pageSize: 10,
    totalCount: 50,
    hasNextPage: true,
    hasPreviousPage: false,
    onPageChange: mockOnPageChange,
    onPageSizeChange: mockOnPageSizeChange,
    onNextPage: mockOnNextPage,
    onPreviousPage: mockOnPreviousPage,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render pagination container", () => {
      render(<Pagination {...defaultProps} />);

      const resultsInfo = screen.getByText("Showing 1-10 of 50 results");
      expect(resultsInfo).toBeInTheDocument();
    });

    test("should render current page", () => {
      render(<Pagination {...defaultProps} />);

      const currentPage = screen.getByText("1");
      expect(currentPage).toBeInTheDocument();
    });

    test("should render next button", () => {
      render(<Pagination {...defaultProps} />);

      const nextButton = screen.getByTestId("caret-right-icon").closest("button");
      expect(nextButton).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should render previous button", () => {
      render(<Pagination {...defaultProps} currentPage={2} hasPreviousPage={true} />);

      const prevButton = screen.getByTestId("caret-left-icon").closest("button");
      expect(prevButton).toBeInTheDocument();
    });

    test("should disable previous button on first page", () => {
      render(<Pagination {...defaultProps} currentPage={1} hasPreviousPage={false} />);

      const prevButton = screen.getByTestId("caret-left-icon").closest("button");
      expect(prevButton).toBeDisabled();
    });

    test("should disable next button on last page", () => {
      render(<Pagination {...defaultProps} currentPage={5} totalPages={5} hasNextPage={false} />);

      const nextButton = screen.getByTestId("caret-right-icon").closest("button");
      expect(nextButton).toBeDisabled();
    });

    test("should call onNextPage when next button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={2} />);

      const nextButton = screen.getByTestId("caret-right-icon").closest("button");
      fireEvent.click(nextButton!);

      expect(mockOnNextPage).toHaveBeenCalledTimes(1);
    });

    test("should call onPreviousPage when previous button clicked", () => {
      render(<Pagination {...defaultProps} currentPage={3} hasPreviousPage={true} />);

      const prevButton = screen.getByTestId("caret-left-icon").closest("button");
      fireEvent.click(prevButton!);

      expect(mockOnPreviousPage).toHaveBeenCalledTimes(1);
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should render page numbers", () => {
      render(<Pagination {...defaultProps} currentPage={3} totalPages={5} />);

      // Should show current page and some surrounding pages
      expect(screen.getByText("3")).toBeInTheDocument();
    });

    test("should highlight current page", () => {
      render(<Pagination {...defaultProps} currentPage={3} />);

      const currentPageButton = screen.getByText("3");
      expect(currentPageButton).toHaveClass("bg-primary");
    });

    test("should handle single page", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={1} />);

      // Component returns null for single page, so nothing should render
      expect(screen.queryByText("Showing")).not.toBeInTheDocument();
    });

    test("should render page size selector", () => {
      render(<Pagination {...defaultProps} />);

      const pageSizeSelect = screen.getByDisplayValue("10");
      expect(pageSizeSelect).toBeInTheDocument();
    });

    test("should call onPageSizeChange when page size changed", () => {
      render(<Pagination {...defaultProps} />);

      const pageSizeSelect = screen.getByDisplayValue("10");
      fireEvent.change(pageSizeSelect, { target: { value: "20" } });

      expect(mockOnPageSizeChange).toHaveBeenCalledWith(20);
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should render quickly", () => {
      const startTime = performance.now();
      render(<Pagination {...defaultProps} />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(screen.getByText("Showing 1-10 of 50 results")).toBeInTheDocument();
    });

    test("should handle zero pages", () => {
      render(<Pagination {...defaultProps} currentPage={1} totalPages={0} />);

      // Component returns null for zero pages
      expect(screen.queryByText("Showing")).not.toBeInTheDocument();
    });

    test("should handle large page numbers", () => {
      render(<Pagination {...defaultProps} currentPage={50} totalPages={100} totalCount={1000} />);

      // Use getAllByText to handle multiple "50" elements and find the button
      const fiftyElements = screen.getAllByText("50");
      const fiftyButton = fiftyElements.find(el => el.tagName === "BUTTON");
      expect(fiftyButton).toBeInTheDocument();
    });

    test("should be accessible", () => {
      render(<Pagination {...defaultProps} />);

      const prevButton = screen.getByTestId("caret-left-icon").closest("button");
      const nextButton = screen.getByTestId("caret-right-icon").closest("button");

      expect(prevButton).toBeInTheDocument();
      expect(nextButton).toBeInTheDocument();
    });

    test("should handle rapid clicks", () => {
      render(<Pagination {...defaultProps} currentPage={3} hasPreviousPage={true} />);

      const nextButton = screen.getByTestId("caret-right-icon").closest("button");

      fireEvent.click(nextButton!);
      fireEvent.click(nextButton!);
      fireEvent.click(nextButton!);

      expect(mockOnNextPage).toHaveBeenCalledTimes(3);
    });

    test("should maintain state across re-renders", () => {
      const { rerender } = render(<Pagination {...defaultProps} currentPage={2} />);

      expect(screen.getByText("2")).toBeInTheDocument();

      rerender(<Pagination {...defaultProps} currentPage={4} />);
      expect(screen.getByText("4")).toBeInTheDocument();
    });
  });
});
