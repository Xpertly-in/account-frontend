/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { GoogleButton } from "@/ui/GoogleButton.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

// Mock Next/Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ src, alt, className }: { src: string; alt: string; className?: string }) => (
    <img src={src} alt={alt} className={className} data-testid="google-icon" />
  ),
}));

// Mock Phosphor-icons
jest.mock("@phosphor-icons/react", () => ({
  SpinnerGap: () => <div data-testid="spinner-icon" className="animate-spin mr-2" />,
}));

// Mock Button component
jest.mock("@/ui/Button.ui", () => ({
  Button: ({
    children,
    onClick,
    disabled,
    className,
    variant,
    type,
  }: React.PropsWithChildren<{
    onClick?: () => void;
    disabled?: boolean;
    className?: string;
    variant?: string;
    type?: "button" | "submit" | "reset";
  }>) => (
    <button
      onClick={onClick}
      disabled={disabled}
      className={className}
      data-variant={variant}
      type={type}
      data-testid="button"
    >
      {children}
    </button>
  ),
}));

describe("GoogleButton Component", () => {
  // Basic rendering tests
  test("renders button with Google icon", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const button = screen.getByTestId("button");
    const icon = screen.getByTestId("google-icon");

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveAttribute("alt", "Google");
    expect(icon).toHaveAttribute("src", "https://www.google.com/favicon.ico");
    expect(button).toHaveTextContent("Continue with Google");
  });

  test("renders with custom text", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick}>Sign in with Google</GoogleButton>);

    const button = screen.getByTestId("button");
    expect(button).toHaveTextContent("Sign in with Google");
  });

  test("applies correct styling", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const button = screen.getByTestId("button");

    expect(button).toHaveAttribute("data-variant", "outline");
    expect(button).toHaveClass("w-full");
    expect(button).toHaveClass("border-border/50");
    expect(button).toHaveClass("bg-white");
    expect(button).toHaveClass("text-foreground");
    expect(button).toHaveClass("hover:bg-gray-50");
    expect(button).toHaveClass("transition-shadow");
    expect(button).toHaveClass("duration-300");
  });

  // Dark mode tests
  test("has proper dark mode styling", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const button = screen.getByTestId("button");

    expect(button).toHaveClass("dark:border-blue-800/30");
    expect(button).toHaveClass("dark:bg-gray-900");
    expect(button).toHaveClass("dark:text-white");
    expect(button).toHaveClass("dark:hover:bg-gray-800");
  });

  test("renders correctly in dark mode", () => {
    const onClick = jest.fn();
    const { cleanup } = renderWithTheme(<GoogleButton onClick={onClick} />, "dark");

    const button = screen.getByTestId("button");
    expect(button).toBeInTheDocument();

    cleanup();
  });

  // Loading state tests
  test("shows spinner when loading", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} isLoading />);

    const spinner = screen.getByTestId("spinner-icon");
    expect(spinner).toBeInTheDocument();
    expect(spinner).toHaveClass("animate-spin");

    // Google icon should not be present
    expect(screen.queryByTestId("google-icon")).not.toBeInTheDocument();
  });

  test("disables button when loading", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} isLoading />);

    const button = screen.getByTestId("button");
    expect(button).toBeDisabled();

    // Clicking should not trigger onClick
    fireEvent.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  // Interaction tests
  test("calls onClick when clicked", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const button = screen.getByTestId("button");
    fireEvent.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const onClick = jest.fn();
    const { container } = render(<GoogleButton onClick={onClick} />);

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    const onClick = jest.fn();
    await checkA11yInDarkMode(<GoogleButton onClick={onClick} />);
  });

  test("has no accessibility violations when loading", async () => {
    const onClick = jest.fn();
    const { container } = render(<GoogleButton onClick={onClick} isLoading />);

    await checkA11y(container);
  });

  // Edge cases
  test("renders with empty text", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick}>{""}</GoogleButton>);

    const button = screen.getByTestId("button");
    const icon = screen.getByTestId("google-icon");

    expect(button).toBeInTheDocument();
    expect(icon).toBeInTheDocument();
    expect(button).toHaveTextContent("");
  });

  test("applies type button correctly", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const button = screen.getByTestId("button");
    expect(button).toHaveAttribute("type", "button");
  });

  test("icon has proper spacing", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} />);

    const icon = screen.getByTestId("google-icon");
    expect(icon).toHaveClass("mr-2");
  });

  test("spinner has proper spacing", () => {
    const onClick = jest.fn();
    render(<GoogleButton onClick={onClick} isLoading />);

    const spinner = screen.getByTestId("spinner-icon");
    expect(spinner).toHaveClass("mr-2");
  });
});
