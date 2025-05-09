/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { Select } from "@/ui/Select.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

// Mock Phosphor-icons - needed for testing
jest.mock("@phosphor-icons/react", () => ({
  CaretDown: () => <div data-testid="caret-down-icon" />,
}));

describe("Select Component", () => {
  // Rendering tests
  test("renders select with default styling", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toBeInTheDocument();
    expect(select).toHaveClass("rounded-md");
    expect(select).toHaveClass("border");
    expect(select).toHaveClass("appearance-none");
    expect(select).toHaveStyle({ appearance: "none" });
  });

  test("renders select with custom className", () => {
    render(
      <Select className="custom-class" data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toHaveClass("custom-class");
  });

  test("renders select with options", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
    const select = screen.getByTestId("select");
    const options = screen.getAllByRole("option");

    expect(options).toHaveLength(3);
    expect(options[0]).toHaveTextContent("Option 1");
    expect(options[1]).toHaveTextContent("Option 2");
    expect(options[2]).toHaveTextContent("Option 3");
  });

  test("renders with caret down icon by default", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );

    const icon = screen.getByTestId("caret-down-icon");
    expect(icon).toBeInTheDocument();
  });

  test("does not render caret icon with multiple select", () => {
    render(
      <Select multiple data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );

    expect(screen.queryByTestId("caret-down-icon")).not.toBeInTheDocument();
  });

  test("renders in disabled state", () => {
    render(
      <Select disabled data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toBeDisabled();
    expect(select).toHaveClass("disabled:cursor-not-allowed");
    expect(select).toHaveClass("disabled:opacity-50");
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(
      <Select data-testid="select">
        <option value="1">Option 1</option>
      </Select>,
      "dark"
    );

    const select = screen.getByTestId("select");
    expect(select).toBeInTheDocument();

    cleanup();
  });

  // Interaction tests
  test("selects option on change", () => {
    render(
      <Select data-testid="select" defaultValue="1">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    // Change selection
    fireEvent.change(select, { target: { value: "2" } });
    expect(select).toHaveValue("2");
  });

  test("calls onChange handler when selection changes", () => {
    const handleChange = jest.fn();
    render(
      <Select onChange={handleChange} data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    fireEvent.change(select, { target: { value: "2" } });
    expect(handleChange).toHaveBeenCalledTimes(1);
  });

  test("supports multiple attribute", () => {
    render(
      <Select multiple data-testid="select">
        <option value="1">Option 1</option>
        <option value="2">Option 2</option>
        <option value="3">Option 3</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    // Verify multiple attribute is set
    expect(select).toHaveAttribute("multiple");
    // Verify padding-right is adjusted for multiple select
    expect(select).toHaveClass("pr-3");
    expect(select).not.toHaveClass("pr-8");
  });

  // Accessibility tests
  test("has proper focus states", () => {
    render(
      <Select data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    // Focus the select
    select.focus();
    expect(select).toHaveFocus();
    expect(select).toHaveClass("focus:outline-none");
    expect(select).toHaveClass("focus:ring-2");
    expect(select).toHaveClass("focus:ring-ring");
  });

  test("has proper ARIA attributes", () => {
    render(
      <Select aria-label="Choose an option" data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toHaveAttribute("aria-label", "Choose an option");
  });

  test("has no accessibility violations", async () => {
    const { container } = render(
      <div>
        <label htmlFor="a11y-select">Select an option</label>
        <Select id="a11y-select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </div>
    );

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(
      <div>
        <label htmlFor="dark-select">Select an option</label>
        <Select id="dark-select">
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
        </Select>
      </div>
    );
  });

  test("has no accessibility violations when disabled", async () => {
    const { container } = render(
      <div>
        <label htmlFor="disabled-select">Disabled select</label>
        <Select id="disabled-select" disabled>
          <option value="1">Option 1</option>
        </Select>
      </div>
    );

    await checkA11y(container);
  });

  // Edge cases
  test("forwards ref correctly", () => {
    const ref = React.createRef<HTMLSelectElement>();
    render(
      <Select ref={ref} data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );

    expect(ref.current).not.toBeNull();
    expect(ref.current).toBe(screen.getByTestId("select"));
  });

  test("supports custom style prop", () => {
    render(
      <Select style={{ color: "red" }} data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toHaveStyle({ color: "red" });
    // Should still have the appearance overrides
    expect(select).toHaveStyle({ appearance: "none" });
  });

  test("renders with no options", () => {
    render(<Select data-testid="select" />);
    const select = screen.getByTestId("select");

    expect(select).toBeInTheDocument();
    expect(screen.queryAllByRole("option")).toHaveLength(0);
  });

  test("handles required attribute correctly", () => {
    render(
      <Select required data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toHaveAttribute("required");
  });

  test("supports custom data attributes", () => {
    render(
      <Select data-custom="test-value" data-testid="select">
        <option value="1">Option 1</option>
      </Select>
    );
    const select = screen.getByTestId("select");

    expect(select).toHaveAttribute("data-custom", "test-value");
  });
});
