/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { FileUpload } from "@/ui/FileUpload.ui";
import * as React from "react";
import {
  render,
  renderWithTheme,
  checkA11y,
  checkA11yInDarkMode,
  createMockFile,
} from "@/tests/test-utils";

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  X: () => <div data-testid="x-icon" aria-hidden="true" />,
  File: () => <div data-testid="file-icon" aria-hidden="true" />,
}));

// Mock Button component
jest.mock("@/ui/Button.ui", () => ({
  Button: ({
    children,
    onClick,
    variant,
    size,
    className,
    type,
  }: React.PropsWithChildren<{
    onClick?: () => void;
    variant?: string;
    size?: string;
    className?: string;
    type?: "button" | "submit" | "reset";
  }>) => (
    <button
      onClick={onClick}
      data-variant={variant}
      data-size={size}
      className={className}
      type={type}
      data-testid="select-button"
    >
      {children}
    </button>
  ),
}));

describe("FileUpload Component", () => {
  // Test data
  const defaultProps = {
    id: "document",
    label: "Upload Document",
    onChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Basic rendering tests
  test("renders with label", () => {
    render(<FileUpload {...defaultProps} />);

    expect(screen.getByText("Upload Document")).toBeInTheDocument();
  });

  test("renders with required indicator", () => {
    render(<FileUpload {...defaultProps} required />);

    const requiredIndicator = screen.getByText("*");
    expect(requiredIndicator).toBeInTheDocument();
    expect(requiredIndicator).toHaveClass("text-red-500");
  });

  test("renders with error message", () => {
    render(<FileUpload {...defaultProps} error="File is too large" />);

    const errorMessage = screen.getByText("File is too large");
    expect(errorMessage).toBeInTheDocument();
    expect(errorMessage).toHaveClass("text-red-500");
  });

  test("renders with accept prop", () => {
    render(<FileUpload {...defaultProps} accept=".jpg,.png" />);

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    expect(input).toHaveAttribute("accept", ".jpg,.png");

    // Should also display the accepted formats
    expect(screen.getByText(".jpg, .png")).toBeInTheDocument();
  });

  test("renders default text when no accept prop is provided", () => {
    render(<FileUpload {...defaultProps} />);

    expect(screen.getByText("Any file format")).toBeInTheDocument();
  });

  // UI State tests
  test("renders empty state correctly", () => {
    render(<FileUpload {...defaultProps} />);

    // Should show the empty state UI
    expect(screen.getByText("Click to upload")).toBeInTheDocument();
    expect(screen.getByText("or drag and drop")).toBeInTheDocument();
    expect(screen.getByTestId("file-icon")).toBeInTheDocument();
    expect(screen.getByTestId("select-button")).toBeInTheDocument();
    expect(screen.getByText("Select File")).toBeInTheDocument();

    // No file info should be visible
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  test("clicking 'Select File' triggers file input click", () => {
    render(<FileUpload {...defaultProps} />);

    // Create a spy on the click method of the input
    const inputEl = document.querySelector('input[type="file"]') as HTMLInputElement;
    const clickSpy = jest.spyOn(inputEl, "click");

    // Click the button
    fireEvent.click(screen.getByTestId("select-button"));

    // Verify the input's click method was called
    expect(clickSpy).toHaveBeenCalledTimes(1);
  });

  // File selection tests
  test("selecting a file updates the UI and calls onChange", () => {
    render(<FileUpload {...defaultProps} />);

    // Create a mock file
    const file = createMockFile("document.pdf", 1024 * 1024, "application/pdf");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;

    // Simulate file selection
    fireEvent.change(input, { target: { files: [file] } });

    // UI should update
    expect(screen.getByText("document.pdf")).toBeInTheDocument();
    expect(screen.getByText("1.00 MB")).toBeInTheDocument();
    expect(screen.getByTestId("x-icon")).toBeInTheDocument();

    // Empty state elements should be removed
    expect(screen.queryByText("Click to upload")).not.toBeInTheDocument();
    expect(screen.queryByTestId("select-button")).not.toBeInTheDocument();

    // onChange should be called with the file
    expect(defaultProps.onChange).toHaveBeenCalledWith(file);
  });

  test("removing a file updates the UI and calls onChange with null", () => {
    render(<FileUpload {...defaultProps} />);

    // First add a file
    const file = createMockFile("document.pdf", 1024 * 1024, "application/pdf");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // Then remove it
    fireEvent.click(screen.getByRole("button", { name: "Remove file" }));

    // UI should revert to empty state
    expect(screen.queryByText("document.pdf")).not.toBeInTheDocument();
    expect(screen.getByText("Click to upload")).toBeInTheDocument();
    expect(screen.getByTestId("select-button")).toBeInTheDocument();

    // onChange should be called with null
    expect(defaultProps.onChange).toHaveBeenCalledWith(null);

    // Input value should be cleared
    expect(input.value).toBe("");
  });

  // Drag and drop tests
  test("drag over changes border styling", () => {
    render(<FileUpload {...defaultProps} />);

    const dropzone = document.querySelector(".border-dashed");

    // Initial state
    expect(dropzone).toHaveClass("border-border");
    expect(dropzone).not.toHaveClass("border-primary");

    // Drag over
    fireEvent.dragOver(dropzone!);

    // Dragging state
    expect(dropzone).toHaveClass("border-primary");
    expect(dropzone).toHaveClass("bg-primary/5");
  });

  test("drag leave reverts border styling", () => {
    render(<FileUpload {...defaultProps} />);

    const dropzone = document.querySelector(".border-dashed");

    // First drag over
    fireEvent.dragOver(dropzone!);
    expect(dropzone).toHaveClass("border-primary");

    // Then drag leave
    fireEvent.dragLeave(dropzone!);

    // Should revert to initial state
    expect(dropzone).toHaveClass("border-border");
    expect(dropzone).not.toHaveClass("border-primary");
  });

  test("dropping a file updates the UI and calls onChange", () => {
    render(<FileUpload {...defaultProps} />);

    const dropzone = document.querySelector(".border-dashed");
    const file = createMockFile("dropped.pdf", 2048 * 1024, "application/pdf");

    // Simulate drop event with files
    fireEvent.drop(dropzone!, {
      dataTransfer: {
        files: [file],
      },
    });

    // UI should update
    expect(screen.getByText("dropped.pdf")).toBeInTheDocument();
    expect(screen.getByText("2.00 MB")).toBeInTheDocument();

    // onChange should be called with the file
    expect(defaultProps.onChange).toHaveBeenCalledWith(file);
  });

  // Error state tests
  test("error state applies correct styling", () => {
    render(<FileUpload {...defaultProps} error="Invalid file type" />);

    const dropzone = document.querySelector(".border-dashed");

    expect(dropzone).toHaveClass("border-red-500");
    expect(dropzone).toHaveClass("bg-red-50");
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<FileUpload {...defaultProps} />);

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<FileUpload {...defaultProps} />);
  });

  test("has no accessibility violations with error state", async () => {
    const { container } = render(<FileUpload {...defaultProps} error="Invalid file" />);

    await checkA11y(container);
  });

  test("has no accessibility violations with file selected", async () => {
    const { container } = render(<FileUpload {...defaultProps} />);

    // Add a file
    const file = createMockFile("document.pdf", 1024 * 1024, "application/pdf");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    await checkA11y(container);
  });

  // Dark mode tests
  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<FileUpload {...defaultProps} />, "dark");

    // Check that the component renders in dark mode
    expect(screen.getByText("Upload Document")).toBeInTheDocument();

    cleanup();
  });

  // Edge cases
  test("handles very long filenames by truncating in UI", () => {
    render(<FileUpload {...defaultProps} />);

    // Create a mock file with a very long name
    const longFilename = "a".repeat(100) + ".pdf";
    const file = createMockFile(longFilename, 1024 * 1024, "application/pdf");

    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [file] } });

    // The container should have truncate class
    const filenameContainer = screen.getByText(longFilename).closest("div");
    expect(filenameContainer).toHaveClass("truncate");
  });

  test("displays file size correctly for different units", () => {
    render(<FileUpload {...defaultProps} />);

    // Test KB
    const smallFile = createMockFile("small.txt", 500, "text/plain");
    const input = document.querySelector('input[type="file"]') as HTMLInputElement;
    fireEvent.change(input, { target: { files: [smallFile] } });
    expect(screen.getByText("0.00 MB")).toBeInTheDocument();

    // Remove and test MB
    fireEvent.click(screen.getByRole("button", { name: "Remove file" }));
    const mediumFile = createMockFile("medium.pdf", 1.5 * 1024 * 1024, "application/pdf");
    fireEvent.change(input, { target: { files: [mediumFile] } });
    expect(screen.getByText("1.50 MB")).toBeInTheDocument();
  });
});
