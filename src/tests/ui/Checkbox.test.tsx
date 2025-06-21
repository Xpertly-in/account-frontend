/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { Checkbox } from "@/ui/Checkbox.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

describe("Checkbox Component", () => {
  // Rendering tests
  test("renders checkbox with default styling", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toBeInTheDocument();
    expect(checkbox).toHaveClass("h-4");
    expect(checkbox).toHaveClass("w-4");
    expect(checkbox).toHaveClass("rounded");
    expect(checkbox).toHaveClass("border-border");
    expect(checkbox).toHaveClass("text-primary");
  });

  test("renders checkbox with custom className", () => {
    render(<Checkbox className="custom-class" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveClass("custom-class");
  });

  test("renders checkbox with id", () => {
    render(<Checkbox id="test-checkbox" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveAttribute("id", "test-checkbox");
  });

  test("renders checkbox with defaultChecked", () => {
    render(<Checkbox defaultChecked data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toBeChecked();
  });

  test("renders checkbox in disabled state", () => {
    render(<Checkbox disabled data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toBeDisabled();
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Checkbox data-testid="checkbox" />, "dark");
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toBeInTheDocument();

    cleanup();
  });

  // Interaction tests
  test("checkbox can be checked and unchecked", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    // Initial state
    expect(checkbox).not.toBeChecked();

    // Check
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Uncheck
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  test("calls onCheckedChange handler when checked state changes", () => {
    const handleCheckedChange = jest.fn();
    render(<Checkbox onCheckedChange={handleCheckedChange} data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    fireEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledTimes(1);
    expect(handleCheckedChange).toHaveBeenCalledWith(true);

    fireEvent.click(checkbox);
    expect(handleCheckedChange).toHaveBeenCalledTimes(2);
    expect(handleCheckedChange).toHaveBeenCalledWith(false);
  });

  test("checkbox responds to label click when wrapped in label", () => {
    render(
      <label htmlFor="label-checkbox">
        <Checkbox id="label-checkbox" data-testid="checkbox" />
        Clickable Label
      </label>
    );
    const checkbox = screen.getByTestId("checkbox");
    const label = screen.getByText("Clickable Label");

    fireEvent.click(label);
    expect(checkbox).toBeChecked();
  });

  // Accessibility tests
  test("has proper focus states", () => {
    render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    // Focus the checkbox
    checkbox.focus();
    expect(checkbox).toHaveFocus();
    expect(checkbox).toHaveClass("focus-visible:ring-2");
    expect(checkbox).toHaveClass("focus-visible:ring-offset-2");
  });

  test("has proper ARIA attributes", () => {
    render(<Checkbox aria-label="Important option" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveAttribute("aria-label", "Important option");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="a11y-checkbox">Accessible checkbox</label>
        <Checkbox id="a11y-checkbox" />
      </div>
    );

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(
      <div>
        <label htmlFor="dark-checkbox">Dark mode checkbox</label>
        <Checkbox id="dark-checkbox" />
      </div>
    );
  });

  test("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <div>
        <label htmlFor="disabled-checkbox">Disabled checkbox</label>
        <Checkbox id="disabled-checkbox" disabled />
      </div>
    );

    await checkA11y(container);
  });

  // Edge cases
  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Checkbox ref={ref} data-testid="checkbox" />);

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId("checkbox"));
  });

  test("supports required attribute", () => {
    render(<Checkbox required data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveAttribute("required");
  });

  test("supports name attribute for form submission", () => {
    render(<Checkbox name="terms" data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    expect(checkbox).toHaveAttribute("name", "terms");
  });

  test("persists checked state after re-render", () => {
    const { rerender } = render(<Checkbox data-testid="checkbox" />);
    const checkbox = screen.getByTestId("checkbox");

    // Check the checkbox
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    // Re-render with same props
    rerender(<Checkbox data-testid="checkbox" />);
    expect(checkbox).toBeChecked();
  });
});
