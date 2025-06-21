/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { Textarea } from "@/ui/Textarea.ui";
import * as React from "react";
import {
  render,
  renderWithTheme,
  checkA11y,
  checkA11yInDarkMode,
  generateLongString,
  specialCharacters,
} from "@/tests/test-utils";

describe("Textarea Component", () => {
  // Rendering tests
  test("renders textarea with default styling", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveClass("min-h-[80px]");
    expect(textarea).toHaveClass("rounded-md");
    expect(textarea).toHaveClass("border");
  });

  test("renders textarea with custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toHaveClass("custom-class");
  });

  test("renders textarea with placeholder", () => {
    render(<Textarea placeholder="Enter details" data-testid="textarea" />);
    const textarea = screen.getByPlaceholderText("Enter details");

    expect(textarea).toBeInTheDocument();
  });

  test("renders textarea in disabled state", () => {
    render(<Textarea disabled data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeDisabled();
    expect(textarea).toHaveClass("disabled:opacity-50");
    expect(textarea).toHaveClass("disabled:cursor-not-allowed");
  });

  test("renders textarea with correct rows and cols", () => {
    render(<Textarea rows={5} cols={40} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toHaveAttribute("rows", "5");
    expect(textarea).toHaveAttribute("cols", "40");
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Textarea data-testid="textarea" />, "dark");
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toBeInTheDocument();

    // Clean up
    cleanup();
  });

  // Interaction tests
  test("handles user input correctly", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    fireEvent.change(textarea, { target: { value: "test input" } });
    expect(textarea).toHaveValue("test input");
  });

  test("calls onChange handler when text is entered", () => {
    const handleChange = jest.fn();
    render(<Textarea onChange={handleChange} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    fireEvent.change(textarea, { target: { value: "test input" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("allows multiline text input", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    fireEvent.change(textarea, { target: { value: "Line 1\nLine 2\nLine 3" } });
    expect(textarea).toHaveValue("Line 1\nLine 2\nLine 3");
  });

  test("focuses textarea on tab", () => {
    render(<Textarea data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");

    // Initially not focused
    expect(textarea).not.toHaveFocus();

    // Focus using tab
    textarea.focus();
    expect(textarea).toHaveFocus();
  });

  // Accessibility tests
  test("has proper ARIA attributes", () => {
    render(<Textarea aria-label="Test textarea" data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveAttribute("aria-label", "Test textarea");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Textarea aria-label="Accessible textarea" />);
    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<Textarea aria-label="Dark mode textarea" />);
  });

  test("has no accessibility violations with error state", async () => {
    const { container } = render(
      <Textarea
        aria-invalid="true"
        aria-errormessage="Error message"
        aria-label="Textarea with error"
      />
    );
    await checkA11y(container);
  });

  // Edge cases
  test("handles very long input values", () => {
    const longValue = generateLongString();
    render(<Textarea defaultValue={longValue} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveValue(longValue);
  });

  test("handles special characters in input", () => {
    render(<Textarea defaultValue={specialCharacters} data-testid="textarea" />);
    const textarea = screen.getByTestId("textarea");
    expect(textarea).toHaveValue(specialCharacters);
  });

  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} data-testid="textarea" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId("textarea"));
  });

  test("renders with custom attributes", () => {
    render(
      <Textarea maxLength={100} required readOnly autoComplete="off" data-testid="textarea" />
    );
    const textarea = screen.getByTestId("textarea");

    expect(textarea).toHaveAttribute("maxLength", "100");
    expect(textarea).toHaveAttribute("required");
    expect(textarea).toHaveAttribute("readOnly");
    expect(textarea).toHaveAttribute("autoComplete", "off");
  });
});
