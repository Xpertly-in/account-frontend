/// <reference types="@testing-library/jest-dom" />
import { fireEvent, screen } from "@testing-library/react";
import { render } from "@/tests/test-utils";
import { BackButton } from "@/ui/BackButton.ui";

// Mock the router functions
const mockPush = jest.fn();
const mockBack = jest.fn();

// Mock the navigation hooks
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    back: mockBack,
  }),
}));

// Mock the phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  ArrowLeft: () => <div data-testid="arrow-left-icon" />,
}));

describe("BackButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders with default props", () => {
    render(<BackButton />);

    expect(screen.getByTestId("back-button")).toBeInTheDocument();
    expect(screen.getByTestId("arrow-left-icon")).toBeInTheDocument();
    expect(screen.getByText("Back")).toBeInTheDocument();
  });

  it("renders with custom label", () => {
    render(<BackButton label="Go Back" />);

    expect(screen.getByText("Go Back")).toBeInTheDocument();
  });

  it("applies custom class name", () => {
    render(<BackButton className="test-class" />);

    const button = screen.getByTestId("back-button");
    expect(button).toHaveClass("test-class");
  });

  it("calls router.back when clicked without 'to' prop", () => {
    render(<BackButton />);

    fireEvent.click(screen.getByTestId("back-button"));
    expect(mockBack).toHaveBeenCalled();
  });

  it("calls router.push with correct path when clicked with 'to' prop", () => {
    render(<BackButton to="/dashboard" />);

    fireEvent.click(screen.getByTestId("back-button"));
    expect(mockPush).toHaveBeenCalledWith("/dashboard");
  });

  it("has proper button type attribute", () => {
    render(<BackButton />);

    const button = screen.getByTestId("back-button");
    expect(button).toHaveAttribute("type", "button");
  });

  it("renders with ghost variant", () => {
    render(<BackButton />);

    const button = screen.getByTestId("back-button");
    expect(button).toHaveClass("flex items-center gap-1");
  });
});
