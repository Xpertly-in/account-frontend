/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { DecorativeElements, AnimationStyles } from "@/ui/DecorativeElements.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

describe("DecorativeElements Component", () => {
  // Basic rendering tests
  test("renders without errors", () => {
    render(<DecorativeElements />);

    // The component should render at least one decorative element
    const decorativeContainer = document.querySelector(".fixed.inset-0");
    expect(decorativeContainer).toBeInTheDocument();
  });

  test("renders three gradient elements", () => {
    render(<DecorativeElements />);

    // Should render three gradient divs
    const gradientElements = document.querySelectorAll(
      ".bg-gradient-to-bl, .bg-gradient-to-tr, .bg-gradient-to-br"
    );
    expect(gradientElements.length).toBe(3);
  });

  // Styling tests
  test("elements have correct positioning", () => {
    render(<DecorativeElements />);

    // Check positioning of the first element (top-right)
    const topRightElement = document.querySelector(".bg-gradient-to-bl");
    expect(topRightElement).toHaveClass("absolute");
    expect(topRightElement).toHaveClass("top-0");
    expect(topRightElement).toHaveClass("right-0");

    // Check positioning of the second element (bottom-left)
    const bottomLeftElement = document.querySelector(".bg-gradient-to-tr");
    expect(bottomLeftElement).toHaveClass("absolute");
    expect(bottomLeftElement).toHaveClass("bottom-0");
    expect(bottomLeftElement).toHaveClass("left-0");

    // Check positioning of the third element (middle)
    const middleElement = document.querySelector(".bg-gradient-to-br");
    expect(middleElement).toHaveClass("absolute");
    expect(middleElement).toHaveClass("top-1/3");
    expect(middleElement).toHaveClass("left-1/4");
  });

  test("elements have correct size", () => {
    render(<DecorativeElements />);

    // Large elements
    const largeElements = document.querySelectorAll(".w-\\[600px\\]");
    expect(largeElements.length).toBe(2);

    // Medium element
    const mediumElement = document.querySelector(".w-\\[300px\\]");
    expect(mediumElement).toBeInTheDocument();
  });

  test("elements have blur effect", () => {
    render(<DecorativeElements />);

    // All elements should have blur effect
    const blurredElements = document.querySelectorAll(".blur-3xl");
    expect(blurredElements.length).toBe(3);
  });

  test("elements have proper opacity", () => {
    render(<DecorativeElements />);

    // Large elements should have the same opacity
    const opacityElements = document.querySelectorAll(".opacity-50");
    expect(opacityElements.length).toBe(2);

    // Middle element has different opacity
    const middleElement = document.querySelector(".opacity-40");
    expect(middleElement).toBeInTheDocument();
  });

  test("elements have animation classes", () => {
    render(<DecorativeElements />);

    // All elements should have pulse animation
    const animatedElements = document.querySelectorAll(".animate-pulse-slow");
    expect(animatedElements.length).toBe(3);

    // Check for animation delays
    const delay1000 = document.querySelector(".animation-delay-1000");
    expect(delay1000).toBeInTheDocument();

    const delay2000 = document.querySelector(".animation-delay-2000");
    expect(delay2000).toBeInTheDocument();
  });

  test("component has pointer-events-none to not interfere with user interaction", () => {
    render(<DecorativeElements />);

    const container = document.querySelector(".fixed.inset-0");
    expect(container).toHaveClass("pointer-events-none");
  });

  // Dark mode tests
  test("has dark mode specific classes", () => {
    render(<DecorativeElements />);

    // Should have dark mode specific gradient colors
    const darkModeElements = document.querySelectorAll("[class*='dark:from-']");
    expect(darkModeElements.length).toBe(3);

    // Check specific dark mode classes
    expect(document.querySelector(".dark\\:from-blue-500\\/20")).toBeInTheDocument();
    expect(document.querySelector(".dark\\:from-blue-600\\/20")).toBeInTheDocument();
    expect(document.querySelector(".dark\\:from-teal-500\\/10")).toBeInTheDocument();
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<DecorativeElements />, "dark");

    // Verify the component renders in dark mode
    expect(document.querySelector(".fixed.inset-0")).toBeInTheDocument();

    cleanup();
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<DecorativeElements />);

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<DecorativeElements />);
  });
});

describe("AnimationStyles Component", () => {
  // Basic rendering tests
  test("renders style tag", () => {
    render(<AnimationStyles />);

    // Should render a style tag
    const styleTag = document.querySelector("style");
    expect(styleTag).toBeInTheDocument();
  });

  test("style tag contains expected animations", () => {
    render(<AnimationStyles />);

    // Get the style tag content
    const styleTag = document.querySelector("style");
    const styleContent = styleTag?.textContent || "";

    // Check for important animation definitions
    expect(styleContent).toContain("@keyframes fadeSlideIn");
    expect(styleContent).toContain("animate-pulse-slow");
    expect(styleContent).toContain("animation-delay-1000");
    expect(styleContent).toContain("animation-delay-2000");
  });

  test("fadeSlideIn animation has proper keyframes", () => {
    render(<AnimationStyles />);

    const styleTag = document.querySelector("style");
    const styleContent = styleTag?.textContent || "";

    // Check for opacity and transform properties in minified CSS
    expect(styleContent).toContain("opacity:0");
    expect(styleContent).toContain("transform:translatey(10px)");
    expect(styleContent).toContain("opacity:1");
    expect(styleContent).toContain("transform:translatey(0)");
  });

  test("pulse animation has proper timing function", () => {
    render(<AnimationStyles />);

    const styleTag = document.querySelector("style");
    const styleContent = styleTag?.textContent || "";

    // Check for animation in minified CSS
    expect(styleContent).toContain("animation:pulse 6s cubic-bezier");
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<AnimationStyles />);

    await checkA11y(container);
  });
});
