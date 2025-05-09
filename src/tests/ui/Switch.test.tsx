/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { Switch } from "@/ui/Switch.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

// We need to mock the Radix primitives module before we import the component
jest.mock("@radix-ui/react-switch", () => ({
  Root: ({
    children,
    className,
    onCheckedChange,
    checked,
    defaultChecked,
    ...props
  }: {
    children?: React.ReactNode;
    className?: string;
    onCheckedChange?: (checked: boolean) => void;
    checked?: boolean;
    defaultChecked?: boolean;
    [key: string]: any;
  }) => (
    <button
      type="button"
      className={className}
      data-state={checked ? "checked" : "unchecked"}
      data-testid="switch"
      onClick={() => onCheckedChange?.(!checked)}
      {...props}
    >
      {children}
    </button>
  ),
  Thumb: ({ className }: { className?: string }) => (
    <span className={className} data-testid="switch-thumb" />
  ),
}));

describe("Switch Component", () => {
  // Rendering tests
  test("renders switch with default styling", () => {
    render(<Switch />);
    const switchElement = screen.getByTestId("switch");
    const thumb = screen.getByTestId("switch-thumb");

    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveClass("h-6 w-11");
    expect(switchElement).toHaveClass("rounded-full");
    expect(switchElement).toHaveClass("cursor-pointer");
    expect(thumb).toBeInTheDocument();
  });

  test("renders switch with custom className", () => {
    render(<Switch className="custom-class" />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toHaveClass("custom-class");
  });

  test("renders switch in checked state", () => {
    render(<Switch checked={true} />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toHaveAttribute("data-state", "checked");
    expect(switchElement).toHaveClass("data-[state=checked]:bg-primary");
  });

  test("renders switch in unchecked state", () => {
    render(<Switch checked={false} />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toHaveAttribute("data-state", "unchecked");
    expect(switchElement).toHaveClass("data-[state=unchecked]:bg-input");
  });

  test("renders switch in disabled state", () => {
    render(<Switch disabled />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toBeDisabled();
    expect(switchElement).toHaveClass("disabled:cursor-not-allowed");
    expect(switchElement).toHaveClass("disabled:opacity-50");
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Switch />, "dark");
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toBeInTheDocument();

    // Clean up
    cleanup();
  });

  // Interaction tests
  test("calls onChange handler when clicked", () => {
    const handleChange = jest.fn();
    render(<Switch onCheckedChange={handleChange} />);
    const switchElement = screen.getByTestId("switch");

    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("does not call onChange when disabled", () => {
    const handleChange = jest.fn();
    render(<Switch disabled onCheckedChange={handleChange} />);
    const switchElement = screen.getByTestId("switch");

    fireEvent.click(switchElement);
    expect(handleChange).not.toHaveBeenCalled();
  });

  // Accessibility tests
  test("has proper focus states", () => {
    render(<Switch />);
    const switchElement = screen.getByTestId("switch");

    // Check that focus states are applied
    expect(switchElement).toHaveClass("focus-visible:outline-none");
    expect(switchElement).toHaveClass("focus-visible:ring-2");
    expect(switchElement).toHaveClass("focus-visible:ring-ring");
  });

  test("has proper ARIA attributes", () => {
    render(<Switch aria-label="Toggle theme" />);
    const switchElement = screen.getByTestId("switch");

    expect(switchElement).toHaveAttribute("aria-label", "Toggle theme");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Switch aria-label="Toggle feature" />);
    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<Switch aria-label="Toggle feature" />);
  });
});
