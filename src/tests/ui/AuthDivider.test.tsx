/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { AuthDivider } from "@/ui/AuthDivider.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

describe("AuthDivider Component", () => {
  // Basic rendering tests
  test("renders divider with default text", () => {
    render(<AuthDivider data-testid="divider" />);
    const divider = screen.getByTestId("divider");
    const dividerText = screen.getByText("OR");

    expect(divider).toBeInTheDocument();
    expect(dividerText).toBeInTheDocument();
    expect(divider).toHaveClass("flex");
    expect(divider).toHaveClass("items-center");
    expect(divider).toHaveClass("justify-center");
    expect(divider).toHaveClass("gap-3");
  });

  test("renders with custom text", () => {
    render(<AuthDivider text="Continue with" data-testid="divider" />);
    const divider = screen.getByTestId("divider");
    const dividerText = screen.getByText("Continue with");

    expect(divider).toBeInTheDocument();
    expect(dividerText).toBeInTheDocument();
  });

  test("renders with custom className", () => {
    render(<AuthDivider className="custom-class" data-testid="divider" />);
    const divider = screen.getByTestId("divider");

    expect(divider).toHaveClass("custom-class");
    // Should also maintain the default classes
    expect(divider).toHaveClass("flex");
    expect(divider).toHaveClass("items-center");
  });

  test("renders divider lines", () => {
    const { container } = render(<AuthDivider data-testid="divider" />);

    // There should be two divider lines (borders)
    const dividerLines = container.querySelectorAll('div[class*="border-t"]');

    expect(dividerLines.length).toBe(2);
    expect(dividerLines[0]).toHaveClass("w-full");
    expect(dividerLines[0]).toHaveClass("border-t");
    expect(dividerLines[0]).toHaveClass("border-gray-100");
    expect(dividerLines[1]).toHaveClass("w-full");
    expect(dividerLines[1]).toHaveClass("border-t");
    expect(dividerLines[1]).toHaveClass("border-gray-100");
  });

  test("renders text with proper styling", () => {
    render(<AuthDivider data-testid="divider" />);
    const dividerText = screen.getByText("OR");

    expect(dividerText).toHaveClass("px-2");
    expect(dividerText).toHaveClass("text-sm");
    expect(dividerText).toHaveClass("text-muted-foreground");
    expect(dividerText).toHaveClass("whitespace-nowrap");
  });

  // Dark mode tests
  test("renders correctly in dark mode", () => {
    const { cleanup, container } = renderWithTheme(<AuthDivider data-testid="divider" />, "dark");

    const divider = screen.getByTestId("divider");
    expect(divider).toBeInTheDocument();

    // Get the divider lines
    const dividerLines = container.querySelectorAll('div[class*="border-t"]');

    // Check dark mode classes
    expect(dividerLines[0]).toHaveClass("dark:border-blue-800");
    expect(dividerLines[1]).toHaveClass("dark:border-blue-800");

    // Check text dark mode styling
    const dividerText = screen.getByText("OR");
    expect(dividerText).toHaveClass("dark:text-blue-100/70");

    cleanup();
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<AuthDivider />);
    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<AuthDivider />);
  });

  // Edge cases
  test("handles empty text", () => {
    render(<AuthDivider text="" data-testid="divider" />);
    const divider = screen.getByTestId("divider");

    expect(divider).toBeInTheDocument();
    // Should have an empty span
    const span = divider.querySelector("span");
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent("");
  });

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<AuthDivider ref={ref} data-testid="divider" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId("divider"));
  });

  test("passes additional props to the div element", () => {
    render(<AuthDivider data-testid="divider" aria-label="Divider" id="auth-divider" />);

    const divider = screen.getByTestId("divider");
    expect(divider).toHaveAttribute("aria-label", "Divider");
    expect(divider).toHaveAttribute("id", "auth-divider");
  });
});
