/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { Logo } from "@/ui/Logo.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

// Improved mock for the tw.helper
jest.mock("@/helper/tw.helper", () => ({
  cn: (...inputs: any[]) => {
    // Handle objects with conditional classes
    return inputs
      .filter(Boolean)
      .map(input => {
        if (typeof input === "string") return input;
        if (typeof input === "object") {
          return Object.entries(input)
            .filter(([_, value]) => Boolean(value))
            .map(([key]) => key);
        }
        return "";
      })
      .flat()
      .join(" ");
  },
}));

describe("Logo Component", () => {
  // Basic rendering tests
  test("renders logo with text", () => {
    render(<Logo />);

    // Should render the logo mark (X) and the text (Xpertly)
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Xpertly")).toBeInTheDocument();
  });

  // Size tests
  test("renders with default (md) size", () => {
    render(<Logo />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("h-8 w-8");

    const logoText = screen.getByText("Xpertly");
    expect(logoText.className).toContain("font-bold");
    expect(logoText.className).toContain("text-base");
  });

  test("renders with sm size", () => {
    render(<Logo size="sm" />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("h-6 w-6");

    const logoText = screen.getByText("Xpertly");
    expect(logoText.className).toContain("font-bold");
    expect(logoText.className).toContain("text-sm");
  });

  test("renders with lg size", () => {
    render(<Logo size="lg" />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("h-12 w-12");

    const logoText = screen.getByText("Xpertly");
    expect(logoText.className).toContain("font-bold");
    expect(logoText.className).toContain("text-xl");
  });

  // Style tests
  test("logo mark has primary background color", () => {
    render(<Logo />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("bg-primary");
    expect(logoMark).toHaveClass("text-primary-foreground");
  });

  test("logo mark is rounded", () => {
    render(<Logo />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("rounded-md");
  });

  test("logo text is bold", () => {
    render(<Logo />);

    const logoText = screen.getByText("Xpertly");
    expect(logoText.className).toContain("font-bold");
  });

  test("logo container has proper layout", () => {
    render(<Logo />);

    const container = screen.getByText("Xpertly").closest("div");
    expect(container).toHaveClass("flex");
    expect(container).toHaveClass("items-center");
    expect(container).toHaveClass("gap-2");
  });

  // Custom class tests
  test("accepts and applies custom className to logo mark", () => {
    render(<Logo className="custom-class" />);

    const logoMark = screen.getByText("X").closest("div");
    expect(logoMark).toHaveClass("custom-class");
  });

  // Dark mode tests
  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Logo />, "dark");

    // Simple check that component renders in dark mode
    expect(screen.getByText("X")).toBeInTheDocument();
    expect(screen.getByText("Xpertly")).toBeInTheDocument();

    cleanup();
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<Logo />);

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<Logo />);
  });

  test("has no accessibility violations with different sizes", async () => {
    const { container: containerSm } = render(<Logo size="sm" />);
    await checkA11y(containerSm);

    const { container: containerLg } = render(<Logo size="lg" />);
    await checkA11y(containerLg);
  });
});
