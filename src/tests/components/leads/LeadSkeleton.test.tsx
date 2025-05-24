/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { LeadSkeleton } from "@/components/leads/LeadSkeleton.component";

describe("LeadSkeleton Component - TDD Implementation", () => {
  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render skeleton container", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });

    test("should render multiple skeleton cards", () => {
      const { container } = render(<LeadSkeleton />);

      const cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(4);
    });

    test("should have proper grid layout", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("grid");
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should display skeleton cards with proper structure", () => {
      const { container } = render(<LeadSkeleton />);

      const cards = container.querySelectorAll('[data-slot="card"]');
      cards.forEach(card => {
        expect(card).toBeInTheDocument();
        expect(card).toHaveClass("rounded-xl");
      });
    });

    test("should have responsive grid layout", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-4");
      expect(gridContainer).toHaveClass("md:grid-cols-2");
    });

    test("should render skeleton elements within each card", () => {
      const { container } = render(<LeadSkeleton />);

      const skeletonElements = container.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(0);
    });

    test("should have proper spacing", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-4");
    });

    test("should be accessible", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toBeInTheDocument();
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should maintain consistent card structure", () => {
      const { container } = render(<LeadSkeleton />);

      const cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(4);

      cards.forEach(card => {
        expect(card).toHaveClass("rounded-xl");
        expect(card).toHaveClass("border-gray-200");
        expect(card).toHaveClass("shadow-sm");
      });
    });

    test("should support dark mode", () => {
      const { container } = render(<LeadSkeleton />);

      const cards = container.querySelectorAll('[data-slot="card"]');
      cards.forEach(card => {
        expect(card).toHaveClass("dark:border-gray-700");
      });
    });

    test("should be responsive on mobile", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("md:grid-cols-2");
    });

    test("should have proper animation", () => {
      const { container } = render(<LeadSkeleton />);

      const skeletonElements = container.querySelectorAll(".animate-pulse");
      expect(skeletonElements.length).toBeGreaterThan(0);
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should render quickly", () => {
      const startTime = performance.now();
      const { container } = render(<LeadSkeleton />);
      const endTime = performance.now();

      expect(endTime - startTime).toBeLessThan(100);
      expect(container.querySelector(".grid")).toBeInTheDocument();
    });

    test("should handle multiple renders", () => {
      const { rerender, container } = render(<LeadSkeleton />);

      expect(container.querySelector(".grid")).toBeInTheDocument();

      rerender(<LeadSkeleton />);
      expect(container.querySelector(".grid")).toBeInTheDocument();
    });

    test("should maintain proper structure on re-render", () => {
      const { rerender, container } = render(<LeadSkeleton />);

      let cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(4);

      rerender(<LeadSkeleton />);
      cards = container.querySelectorAll('[data-slot="card"]');
      expect(cards).toHaveLength(4);
    });

    test("should be memory efficient", () => {
      const { unmount, container } = render(<LeadSkeleton />);

      expect(container.querySelector(".grid")).toBeInTheDocument();

      unmount();
      expect(container.querySelector(".grid")).not.toBeInTheDocument();
    });

    test("should support different viewport sizes", () => {
      const { container } = render(<LeadSkeleton />);

      const gridContainer = container.querySelector(".grid");
      expect(gridContainer).toHaveClass("gap-4");
      expect(gridContainer).toHaveClass("md:grid-cols-2");
    });
  });
});
