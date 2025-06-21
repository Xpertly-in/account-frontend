/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { Input } from "@/ui/Input.ui";
import * as React from "react";
import {
  render,
  renderWithTheme,
  checkA11y,
  checkA11yInDarkMode,
  generateLongString,
  specialCharacters,
} from "@/tests/test-utils";

describe("Input Component", () => {
  // Rendering tests
  test("renders default input", () => {
    render(<Input />);
    const input = screen.getByRole("textbox");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("h-11");
    expect(input).toHaveClass("rounded-lg");
  });

  test("renders input with placeholder", () => {
    render(<Input placeholder="Enter text" />);
    const input = screen.getByPlaceholderText("Enter text");
    expect(input).toBeInTheDocument();
  });

  test("renders with different input types", () => {
    const { rerender } = render(<Input type="text" data-testid="input" />);
    let input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "text");

    rerender(<Input type="email" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "email");

    rerender(<Input type="password" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "password");

    rerender(<Input type="number" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "number");

    rerender(<Input type="file" data-testid="input" />);
    input = screen.getByTestId("input");
    expect(input).toHaveAttribute("type", "file");
  });

  test("renders with additional className", () => {
    render(<Input className="custom-class" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveClass("custom-class");
  });

  test("renders input in disabled state", () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
  });

  test("renders input with error state", () => {
    render(<Input aria-invalid="true" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("aria-invalid:border-destructive");
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Input data-testid="input" />, "dark");

    const input = screen.getByTestId("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("dark:bg-gray-900/50");
    expect(input).toHaveClass("dark:border-gray-700");

    // Clean up
    cleanup();
  });

  // Interaction tests
  test("handles user input correctly", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");

    fireEvent.change(input, { target: { value: "test input" } });
    expect(input).toHaveValue("test input");
  });

  test("calls onChange handler when text is entered", () => {
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} data-testid="input" />);
    const input = screen.getByTestId("input");

    fireEvent.change(input, { target: { value: "test input" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("focuses input on tab", () => {
    render(<Input data-testid="input" />);
    const input = screen.getByTestId("input");

    // Initially not focused
    expect(input).not.toHaveFocus();

    // Focus using tab
    input.focus();
    expect(input).toHaveFocus();
  });

  test("disabled inputs have 'disabled' attribute and styling", () => {
    render(<Input disabled data-testid="input" />);
    const input = screen.getByTestId("input");

    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:opacity-50");
    expect(input).toHaveClass("disabled:cursor-not-allowed");
  });

  // Accessibility tests
  test("has proper ARIA attributes", () => {
    render(<Input aria-label="Test input" data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveAttribute("aria-label", "Test input");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Input aria-label="Accessible input" />);
    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<Input aria-label="Dark mode input" />);
  });

  test("has no accessibility violations with error state", async () => {
    const { container } = render(
      <Input aria-invalid="true" aria-errormessage="Error message" aria-label="Input with error" />
    );
    await checkA11y(container);
  });

  // Edge cases
  test("handles very long input values", () => {
    const longValue = generateLongString();
    render(<Input defaultValue={longValue} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveValue(longValue);
  });

  test("handles special characters in input", () => {
    render(<Input defaultValue={specialCharacters} data-testid="input" />);
    const input = screen.getByTestId("input");
    expect(input).toHaveValue(specialCharacters);
  });
});
