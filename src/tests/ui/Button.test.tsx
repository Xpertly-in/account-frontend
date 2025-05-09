/// <reference types="@testing-library/jest-dom" />
import { screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "@/ui/Button.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

describe("Button Component", () => {
  // Rendering tests
  test("renders default button with children", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("bg-primary"); // Default is primary
  });

  test("renders with different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    let button = screen.getByRole("button", { name: /default/i });
    expect(button).toHaveClass("bg-primary");

    rerender(<Button variant="destructive">Destructive</Button>);
    button = screen.getByRole("button", { name: /destructive/i });
    expect(button).toHaveClass("bg-destructive");

    rerender(<Button variant="outline">Outline</Button>);
    button = screen.getByRole("button", { name: /outline/i });
    expect(button).toHaveClass("border");
    expect(button).toHaveClass("bg-background");

    rerender(<Button variant="secondary">Secondary</Button>);
    button = screen.getByRole("button", { name: /secondary/i });
    expect(button).toHaveClass("bg-secondary");

    rerender(<Button variant="ghost">Ghost</Button>);
    button = screen.getByRole("button", { name: /ghost/i });
    expect(button).toHaveClass("hover:bg-accent");

    rerender(<Button variant="link">Link</Button>);
    button = screen.getByRole("button", { name: /link/i });
    expect(button).toHaveClass("text-primary");
    expect(button).toHaveClass("underline-offset-4");
  });

  test("renders with different sizes", () => {
    const { rerender } = render(<Button size="default">Default</Button>);
    let button = screen.getByRole("button", { name: /default/i });
    expect(button).toHaveClass("h-9");

    rerender(<Button size="sm">Small</Button>);
    button = screen.getByRole("button", { name: /small/i });
    expect(button).toHaveClass("h-8");

    rerender(<Button size="lg">Large</Button>);
    button = screen.getByRole("button", { name: /large/i });
    expect(button).toHaveClass("h-10");

    rerender(<Button size="icon">Icon</Button>);
    button = screen.getByRole("button", { name: /icon/i });
    expect(button).toHaveClass("size-9");
  });

  test("renders with icon", () => {
    render(
      <Button>
        <div data-testid="icon">Icon</div>
        Button with Icon
      </Button>
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /button with icon/i })).toBeInTheDocument();
  });

  test("renders as a different element when asChild is true", () => {
    const Wrapper = ({ children }: { children: React.ReactNode }) => {
      return <div>{children}</div>;
    };

    render(
      <Wrapper>
        <Button asChild>
          <a href="https://example.com">Link Button</a>
        </Button>
      </Wrapper>
    );

    const link = screen.getByRole("link", { name: /link button/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "https://example.com");
    expect(link).toHaveClass("bg-primary"); // Should inherit Button styles
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(
      <Button variant="destructive">Dark Mode Button</Button>,
      "dark"
    );

    const button = screen.getByRole("button", { name: /dark mode button/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass("dark:bg-destructive/60");

    // Clean up the document attribute
    cleanup();
  });

  test("renders with fullWidth class when className includes 'w-full'", () => {
    render(<Button className="w-full">Full Width</Button>);
    const button = screen.getByRole("button", { name: /full width/i });
    expect(button).toHaveClass("w-full");
  });

  // Interaction tests
  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("doesn't call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Accessibility tests
  test("has proper ARIA attributes when disabled", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  test("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(<Button>Dark Mode Accessible Button</Button>);
  });

  // Edge cases
  test("handles long text content properly", () => {
    render(
      <Button>
        This is a very long button text that should still render properly and not break the layout
      </Button>
    );
    const button = screen.getByRole("button");
    expect(button).toBeInTheDocument();
  });

  test("handles click events with preventDefault", () => {
    const handleClick = jest.fn();
    render(
      <Button
        onClick={e => {
          e.preventDefault();
          handleClick();
        }}
      >
        Prevent Default
      </Button>
    );
    const button = screen.getByRole("button", { name: /prevent default/i });
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
