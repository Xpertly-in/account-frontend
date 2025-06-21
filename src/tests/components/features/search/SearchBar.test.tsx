import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SearchBar } from "@/components/features/search/SearchBar.component";
import * as router from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

// Mock useAnalytics to avoid Jotai dependency
jest.mock("@/hooks/useAnalytics", () => ({
  useAnalytics: () => ({
    trackEvent: jest.fn(),
    trackUserInteraction: jest.fn(),
  }),
}));

describe("SearchBar Component", () => {
  // Setup for router mocks
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (router.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  // Rendering tests
  test("renders location input", () => {
    render(<SearchBar />);

    // Check for location input
    expect(screen.getByPlaceholderText(/enter location/i)).toBeInTheDocument();
  });

  test("renders search button", () => {
    render(<SearchBar />);

    // Check for search button
    expect(screen.getByRole("button", { name: /find ca/i })).toBeInTheDocument();
  });

  test("renders quick location buttons", () => {
    render(<SearchBar />);

    // Check for quick location buttons
    expect(screen.getByRole("button", { name: /mumbai/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /delhi/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /chennai/i })).toBeInTheDocument();
  });

  test("renders with proper styling", () => {
    render(<SearchBar />);

    // Check for main container by finding the div that contains the form
    const container = screen
      .getByPlaceholderText(/enter location/i)
      .closest('div[class*="w-full"]');
    expect(container).toBeInTheDocument();
  });

  // Interaction tests
  test("updates location input on typing", async () => {
    render(<SearchBar />);

    // Type in location input
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    await userEvent.type(locationInput, "Bangalore");

    // Check input value
    expect(locationInput).toHaveValue("Bangalore");
  });

  test("calls onSearch handler when search button is clicked", async () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    // Fill location input
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    await userEvent.type(locationInput, "Mumbai");

    // Click search button
    await userEvent.click(screen.getByRole("button", { name: /find ca/i }));

    // Check that onSearch was called with correct location
    expect(onSearchMock).toHaveBeenCalledWith("Mumbai");
  });

  test("navigates to search page when no onSearch handler provided", async () => {
    render(<SearchBar />);

    // Fill location input
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    await userEvent.type(locationInput, "Delhi");

    // Click search button
    await userEvent.click(screen.getByRole("button", { name: /find ca/i }));

    // Check that router.push was called with correct URL
    expect(pushMock).toHaveBeenCalledWith("/search?location=Delhi");
  });

  test("handles quick location button clicks", async () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    // Click Mumbai quick location button
    await userEvent.click(screen.getByRole("button", { name: /mumbai/i }));

    // Check that onSearch was called with Mumbai
    expect(onSearchMock).toHaveBeenCalledWith("Mumbai");
  });

  test("navigates to search page on quick location click without handler", async () => {
    render(<SearchBar />);

    // Click Delhi quick location button
    await userEvent.click(screen.getByRole("button", { name: /delhi/i }));

    // Check that router.push was called with correct URL
    expect(pushMock).toHaveBeenCalledWith("/search?location=Delhi");
  });

  test("submits form on Enter key press", async () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    // Type in location input and press Enter
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    await userEvent.type(locationInput, "Chennai");
    await userEvent.keyboard("{Enter}");

    // Check that onSearch was called
    expect(onSearchMock).toHaveBeenCalledWith("Chennai");
  });

  test("handles empty location submission", async () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    // Click search button without entering location
    await userEvent.click(screen.getByRole("button", { name: /find ca/i }));

    // Should still call onSearch with empty string
    expect(onSearchMock).toHaveBeenCalledWith("");
  });

  test("updates input value when quick location is selected", async () => {
    render(<SearchBar />);

    // Click Mumbai quick location button
    await userEvent.click(screen.getByRole("button", { name: /mumbai/i }));

    // Check that input value is updated
    const locationInput = screen.getByPlaceholderText(/enter location/i);
    expect(locationInput).toHaveValue("Mumbai");
  });

  test("renders with responsive design classes", () => {
    render(<SearchBar />);

    // Check for responsive classes on the search button
    const searchButton = screen.getByRole("button", { name: /find ca/i });
    expect(searchButton).toHaveClass("md:w-auto");
    expect(searchButton).toHaveClass("w-full");
  });
});
