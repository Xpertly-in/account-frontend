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
  // Rendering tests
  test("renders Avatar with default styling", () => {
    render(<Avatar data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveClass("size-8");
    expect(avatar).toHaveClass("rounded-full");
  });

  test("renders Avatar with custom className", () => {
    render(<Avatar className="custom-class" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("custom-class");
  });

  test("renders Avatar with AvatarImage", () => {
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

  test("renders Avatar with AvatarFallback", () => {
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
    expect(fallback).toHaveClass("bg-muted");
  });

  test("renders Avatar with both AvatarImage and AvatarFallback", () => {
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

  test("renders Avatar with custom size through className", () => {
    render(<Avatar className="size-16" data-testid="avatar" />);
    const avatar = screen.getByTestId("avatar");
    expect(avatar).toHaveClass("size-16");
  });

  // Accessibility tests
  test("has proper accessibility attributes", async () => {
    const { container } = render(
      <Avatar>
        <AvatarImage src="/test-image.jpg" alt="Test User" />
        <AvatarFallback>TU</AvatarFallback>
      </Avatar>
    );

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
});
