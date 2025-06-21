/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "@/ui/Avatar.ui";
import * as React from "react";
import { render, checkA11y } from "@/tests/test-utils";

// Mock the Radix Avatar primitives
jest.mock("@radix-ui/react-avatar", () => ({
  Root: ({ children, className, ...props }: React.ComponentProps<"span">) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
  Image: ({ src, alt, className, ...props }: React.ComponentProps<"img">) => (
    <img src={src} alt={alt} className={className} {...props} />
  ),
  Fallback: ({ children, className, ...props }: React.ComponentProps<"span">) => (
    <span className={className} {...props}>
      {children}
    </span>
  ),
}));

describe("Avatar Component", () => {
  // Basic rendering tests
  test("renders Avatar with default styling", () => {
    render(<Avatar data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("h-10"); // default md size
    expect(avatar).toHaveClass("w-10");
    expect(avatar).toHaveClass("rounded-full");
  });

  test("renders Avatar with custom className", () => {
    render(<Avatar className="custom-class" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("custom-class");
  });

  // Size prop tests
  test("renders Avatar with xs size", () => {
    render(<Avatar size="xs" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-6");
    expect(avatar).toHaveClass("w-6");
  });

  test("renders Avatar with sm size", () => {
    render(<Avatar size="sm" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-8");
    expect(avatar).toHaveClass("w-8");
  });

  test("renders Avatar with lg size", () => {
    render(<Avatar size="lg" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-12");
    expect(avatar).toHaveClass("w-12");
  });

  test("renders Avatar with xl size", () => {
    render(<Avatar size="xl" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-16");
    expect(avatar).toHaveClass("w-16");
  });

  test("renders Avatar with 2xl size", () => {
    render(<Avatar size="2xl" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-20");
    expect(avatar).toHaveClass("w-20");
  });

  // New built-in functionality tests
  test("renders Avatar with name prop and generates initials", () => {
    render(<Avatar name="John Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveTextContent("JD");
  });

  test("renders Avatar with single name and generates single initial", () => {
    render(<Avatar name="John" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("J");
  });

  test("renders Avatar with three names and generates two initials", () => {
    render(<Avatar name="John Michael Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("JD"); // First and last name initials
  });

  test("renders Avatar with src and name props", () => {
    render(<Avatar src="/test-image.jpg" alt="Test User" name="John Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    const image = screen.getByRole("img");

    expect(avatar).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test User");
    expect(avatar).toHaveTextContent("JD"); // Fallback should still be rendered
  });

  test("generates consistent colors for same name", () => {
    const { rerender } = render(<Avatar name="John Doe" data-testid="avatar-1" />);
    const avatar1 = screen.getByTestId("avatar-1");
    const fallback1 = avatar1.querySelector('[data-slot="avatar-fallback"]');
    const className1 = fallback1?.className;

    rerender(<Avatar name="John Doe" data-testid="avatar-2" />);
    const avatar2 = screen.getByTestId("avatar-2");
    const fallback2 = avatar2.querySelector('[data-slot="avatar-fallback"]');
    const className2 = fallback2?.className;

    expect(className1).toBe(className2);
  });

  test("generates different colors for different names", () => {
    const { rerender } = render(<Avatar name="John Doe" data-testid="avatar-1" />);
    const avatar1 = screen.getByTestId("avatar-1");
    const fallback1 = avatar1.querySelector('[data-slot="avatar-fallback"]');
    const className1 = fallback1?.className;

    rerender(<Avatar name="Jane Smith" data-testid="avatar-2" />);
    const avatar2 = screen.getByTestId("avatar-2");
    const fallback2 = avatar2.querySelector('[data-slot="avatar-fallback"]');
    const className2 = fallback2?.className;

    expect(className1).not.toBe(className2);
  });

  // Enhanced styling tests
  test("applies hover and focus styles", () => {
    render(<Avatar name="John Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("hover:ring-blue-500/30");
    expect(avatar).toHaveClass("hover:scale-105");
    expect(avatar).toHaveClass("focus-visible:ring-blue-500");
  });

  test("applies proper ring styling", () => {
    render(<Avatar name="John Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("ring-2"); // default md size ring
    expect(avatar).toHaveClass("ring-white/20");
    expect(avatar).toHaveClass("ring-offset-2");
  });

  test("applies proper text sizing based on avatar size", () => {
    const { rerender } = render(<Avatar name="John Doe" size="xs" data-testid="avatar" />);
    let avatar = screen.getByTestId("avatar");
    let fallback = avatar.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toHaveClass("text-xs");

    rerender(<Avatar name="John Doe" size="lg" data-testid="avatar" />);
    avatar = screen.getByTestId("avatar");
    fallback = avatar.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toHaveClass("text-lg");

    rerender(<Avatar name="John Doe" size="2xl" data-testid="avatar" />);
    avatar = screen.getByTestId("avatar");
    fallback = avatar.querySelector('[data-slot="avatar-fallback"]');
    expect(fallback).toHaveClass("text-2xl");
  });

  // Legacy component usage tests
  test("renders Avatar with AvatarImage component", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/test-image.jpg" alt="Test User" data-testid="avatar-image" />
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const image = screen.getByTestId("avatar-image");

    expect(avatar).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test User");
  });

  test("renders Avatar with AvatarFallback component", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">TU</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar).toBeInTheDocument();
    expect(fallback).toBeInTheDocument();
    expect(fallback).toHaveTextContent("TU");
    expect(fallback).toHaveClass("bg-gradient-to-br");
  });

  test("renders Avatar with both AvatarImage and AvatarFallback components", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarImage src="/test-image.jpg" alt="Test User" data-testid="avatar-image" />
        <AvatarFallback data-testid="avatar-fallback">TU</AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const image = screen.getByTestId("avatar-image");
    const fallback = screen.getByTestId("avatar-fallback");

    expect(avatar).toBeInTheDocument();
    expect(image).toBeInTheDocument();
    expect(fallback).toBeInTheDocument();
  });

  // Custom styling tests
  test("AvatarImage accepts custom className", () => {
    render(
      <Avatar>
        <AvatarImage
          src="/test-image.jpg"
          alt="Test User"
          className="custom-image-class"
          data-testid="avatar-image"
        />
      </Avatar>
    );

    const image = screen.getByTestId("avatar-image");
    expect(image).toHaveClass("custom-image-class");
  });

  test("AvatarFallback accepts custom className", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback-class" data-testid="avatar-fallback">
          TU
        </AvatarFallback>
      </Avatar>
    );

    const fallback = screen.getByTestId("avatar-fallback");
    expect(fallback).toHaveClass("custom-fallback-class");
  });

  test("renders Avatar with custom size through className override", () => {
    render(<Avatar className="h-16 w-16" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("h-16");
    expect(avatar).toHaveClass("w-16");
  });

  // Accessibility tests
  test("has proper accessibility attributes", async () => {
    const { container } = render(<Avatar src="/test-image.jpg" alt="Test User" name="John Doe" />);

    await checkA11y(container);
  });

  test("AvatarImage has alt text for accessibility", () => {
    render(
      <Avatar>
        <AvatarImage src="/test-image.jpg" alt="Test User" data-testid="avatar-image" />
      </Avatar>
    );

    const image = screen.getByTestId("avatar-image");
    expect(image).toHaveAttribute("alt", "Test User");
  });

  test("Avatar with name prop uses name as alt text when no alt provided", () => {
    render(<Avatar src="/test-image.jpg" name="John Doe" data-testid="avatar" />);
    const image = screen.getByRole("img");
    expect(image).toHaveAttribute("alt", "John Doe");
  });

  // Edge cases
  test("renders Avatar with nested elements", () => {
    render(
      <Avatar data-testid="avatar">
        <div data-testid="nested-div">
          <AvatarImage src="/test-image.jpg" alt="Test User" data-testid="avatar-image" />
        </div>
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const nestedDiv = screen.getByTestId("nested-div");
    const image = screen.getByTestId("avatar-image");

    expect(avatar).toBeInTheDocument();
    expect(nestedDiv).toBeInTheDocument();
    expect(image).toBeInTheDocument();
  });

  test("renders with complex content in fallback", () => {
    render(
      <Avatar data-testid="avatar">
        <AvatarFallback data-testid="avatar-fallback">
          <div data-testid="fallback-content">
            <span>Test</span>
            <span>User</span>
          </div>
        </AvatarFallback>
      </Avatar>
    );

    const avatar = screen.getByTestId("avatar");
    const fallback = screen.getByTestId("avatar-fallback");
    const content = screen.getByTestId("fallback-content");

    expect(avatar).toBeInTheDocument();
    expect(fallback).toBeInTheDocument();
    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("TestUser");
  });

  test("handles empty name gracefully", () => {
    render(<Avatar name="" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    // Should not render fallback for empty name
    expect(avatar).not.toHaveTextContent(/[A-Z]/);
  });

  test("handles name with special characters", () => {
    render(<Avatar name="Jean-Pierre O'Connor" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("JC"); // Jean-Pierre -> J, O'Connor -> C (after cleaning)
  });

  test("handles whitespace in names properly", () => {
    render(<Avatar name="  John   Doe  " data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("JD");
  });

  test("handles names with multiple middle names", () => {
    render(<Avatar name="John Michael Robert Doe" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveTextContent("JD"); // First (John) and Last (Doe)
  });
});
