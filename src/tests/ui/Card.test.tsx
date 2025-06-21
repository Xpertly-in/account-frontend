/// <reference types="@testing-library/jest-dom" />
import { screen } from "@testing-library/react";
import {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardAction,
  CardDescription,
  CardContent,
} from "@/ui/Card.ui";
import * as React from "react";
import { render, renderWithTheme, checkA11y, checkA11yInDarkMode } from "@/tests/test-utils";

describe("Card Component", () => {
  // Basic rendering tests
  test("renders card with default styling", () => {
    render(<Card data-testid="card">Card Content</Card>);
    const card = screen.getByTestId("card");

    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Card Content");
    expect(card).toHaveClass("rounded-xl");
    expect(card).toHaveClass("border");
    expect(card).toHaveClass("shadow-sm");
  });

  test("renders with custom className", () => {
    render(<Card className="custom-class" data-testid="card" />);
    const card = screen.getByTestId("card");

    expect(card).toHaveClass("custom-class");
  });

  test("renders with custom attributes", () => {
    render(<Card data-testid="card" aria-label="Test Card" id="test-card" />);
    const card = screen.getByTestId("card");

    expect(card).toHaveAttribute("aria-label", "Test Card");
    expect(card).toHaveAttribute("id", "test-card");
  });

  test("renders correctly in dark mode", () => {
    const { cleanup } = renderWithTheme(<Card data-testid="card">Dark Mode Card</Card>, "dark");

    const card = screen.getByTestId("card");
    expect(card).toBeInTheDocument();
    expect(card).toHaveTextContent("Dark Mode Card");

    cleanup();
  });

  // Subcomponent tests: CardHeader
  test("renders CardHeader with default styling", () => {
    render(<CardHeader data-testid="card-header">Header Content</CardHeader>);
    const header = screen.getByTestId("card-header");

    expect(header).toBeInTheDocument();
    expect(header).toHaveTextContent("Header Content");
    expect(header).toHaveAttribute("data-slot", "card-header");
  });

  test("renders CardHeader with custom className", () => {
    render(<CardHeader className="custom-header" data-testid="card-header" />);
    const header = screen.getByTestId("card-header");

    expect(header).toHaveClass("custom-header");
  });

  // Subcomponent tests: CardTitle
  test("renders CardTitle with default styling", () => {
    render(<CardTitle data-testid="card-title">Card Title</CardTitle>);
    const title = screen.getByTestId("card-title");

    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("Card Title");
    expect(title).toHaveClass("font-semibold");
    expect(title).toHaveAttribute("data-slot", "card-title");
  });

  test("renders CardTitle with custom className", () => {
    render(<CardTitle className="custom-title" data-testid="card-title" />);
    const title = screen.getByTestId("card-title");

    expect(title).toHaveClass("custom-title");
  });

  // Subcomponent tests: CardDescription
  test("renders CardDescription with default styling", () => {
    render(<CardDescription data-testid="card-description">Card Description</CardDescription>);
    const description = screen.getByTestId("card-description");

    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("Card Description");
    expect(description).toHaveClass("text-sm");
    expect(description).toHaveClass("text-muted-foreground");
    expect(description).toHaveAttribute("data-slot", "card-description");
  });

  test("renders CardDescription with custom className", () => {
    render(<CardDescription className="custom-description" data-testid="card-description" />);
    const description = screen.getByTestId("card-description");

    expect(description).toHaveClass("custom-description");
  });

  // Subcomponent tests: CardAction
  test("renders CardAction with default styling", () => {
    render(<CardAction data-testid="card-action">Action Button</CardAction>);
    const action = screen.getByTestId("card-action");

    expect(action).toBeInTheDocument();
    expect(action).toHaveTextContent("Action Button");
    expect(action).toHaveClass("self-start");
    expect(action).toHaveClass("justify-self-end");
    expect(action).toHaveAttribute("data-slot", "card-action");
  });

  test("renders CardAction with custom className", () => {
    render(<CardAction className="custom-action" data-testid="card-action" />);
    const action = screen.getByTestId("card-action");

    expect(action).toHaveClass("custom-action");
  });

  // Subcomponent tests: CardContent
  test("renders CardContent with default styling", () => {
    render(<CardContent data-testid="card-content">Content Area</CardContent>);
    const content = screen.getByTestId("card-content");

    expect(content).toBeInTheDocument();
    expect(content).toHaveTextContent("Content Area");
    expect(content).toHaveClass("px-6");
    expect(content).toHaveAttribute("data-slot", "card-content");
  });

  test("renders CardContent with custom className", () => {
    render(<CardContent className="custom-content" data-testid="card-content" />);
    const content = screen.getByTestId("card-content");

    expect(content).toHaveClass("custom-content");
  });

  // Subcomponent tests: CardFooter
  test("renders CardFooter with default styling", () => {
    render(<CardFooter data-testid="card-footer">Footer Content</CardFooter>);
    const footer = screen.getByTestId("card-footer");

    expect(footer).toBeInTheDocument();
    expect(footer).toHaveTextContent("Footer Content");
    expect(footer).toHaveClass("flex");
    expect(footer).toHaveClass("px-6");
    expect(footer).toHaveAttribute("data-slot", "card-footer");
  });

  test("renders CardFooter with custom className", () => {
    render(<CardFooter className="custom-footer" data-testid="card-footer" />);
    const footer = screen.getByTestId("card-footer");

    expect(footer).toHaveClass("custom-footer");
  });

  // Component composition tests
  test("renders full card with all subcomponents", () => {
    render(
      <Card data-testid="full-card">
        <CardHeader data-testid="header">
          <CardTitle data-testid="title">Card Title</CardTitle>
          <CardDescription data-testid="description">Card Description</CardDescription>
          <CardAction data-testid="action">
            <button>Action</button>
          </CardAction>
        </CardHeader>
        <CardContent data-testid="content">Main content goes here</CardContent>
        <CardFooter data-testid="footer">Footer content</CardFooter>
      </Card>
    );

    expect(screen.getByTestId("full-card")).toBeInTheDocument();
    expect(screen.getByTestId("header")).toBeInTheDocument();
    expect(screen.getByTestId("title")).toBeInTheDocument();
    expect(screen.getByTestId("description")).toBeInTheDocument();
    expect(screen.getByTestId("action")).toBeInTheDocument();
    expect(screen.getByTestId("content")).toBeInTheDocument();
    expect(screen.getByTestId("footer")).toBeInTheDocument();

    expect(screen.getByTestId("title")).toHaveTextContent("Card Title");
    expect(screen.getByTestId("description")).toHaveTextContent("Card Description");
    expect(screen.getByTestId("content")).toHaveTextContent("Main content goes here");
    expect(screen.getByTestId("footer")).toHaveTextContent("Footer content");
    expect(screen.getByRole("button")).toHaveTextContent("Action");
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(
      <Card>
        <CardHeader>
          <CardTitle>Accessible Card</CardTitle>
          <CardDescription>This is an accessible card component</CardDescription>
        </CardHeader>
        <CardContent>Card content</CardContent>
        <CardFooter>Card footer</CardFooter>
      </Card>
    );

    await checkA11y(container);
  });

  test("has no accessibility violations in dark mode", async () => {
    await checkA11yInDarkMode(
      <Card>
        <CardHeader>
          <CardTitle>Dark Mode Card</CardTitle>
          <CardDescription>This card supports dark mode</CardDescription>
        </CardHeader>
        <CardContent>Card content in dark mode</CardContent>
        <CardFooter>Card footer in dark mode</CardFooter>
      </Card>
    );
  });

  // Edge cases
  test("renders empty card correctly", () => {
    render(<Card data-testid="empty-card" />);
    expect(screen.getByTestId("empty-card")).toBeInTheDocument();
  });

  test("renders nested cards correctly", () => {
    render(
      <Card data-testid="outer-card">
        <CardContent>
          Outer Card Content
          <Card data-testid="inner-card">
            <CardContent data-testid="inner-content">Inner Card Content</CardContent>
          </Card>
        </CardContent>
      </Card>
    );

    expect(screen.getByTestId("outer-card")).toBeInTheDocument();
    expect(screen.getByTestId("inner-card")).toBeInTheDocument();
    expect(screen.getByTestId("inner-content")).toHaveTextContent("Inner Card Content");
  });
});
