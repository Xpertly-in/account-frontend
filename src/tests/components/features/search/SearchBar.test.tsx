import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { SearchBar } from "@/components/features/search/SearchBar.component";
import * as router from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
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
  test("renders search input", () => {
    render(<SearchBar />);

    // Check for search input
    expect(screen.getByPlaceholderText(/search for ca/i)).toBeInTheDocument();
  });

  test("renders location dropdown", () => {
    render(<SearchBar />);

    // Check for location dropdown
    expect(screen.getByText(/location/i)).toBeInTheDocument();
  });

  test("renders verified checkbox", () => {
    render(<SearchBar />);

    // Check for verified checkbox
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toBeInTheDocument();
  });

  test("renders search button", () => {
    render(<SearchBar />);

    // Check for search button
    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  test("renders in mobile view with collapsed filters", () => {
    // Mock window width for mobile view
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    window.dispatchEvent(new Event("resize"));

    render(<SearchBar />);

    // In mobile view, filters are collapsed by default
    expect(screen.getByText(/filters/i)).toBeInTheDocument();

    // Filters should not be visible initially
    expect(screen.queryByText(/location/i)).not.toBeVisible();
    expect(screen.queryByRole("checkbox", { name: /verified only/i })).not.toBeVisible();
  });

  test("expands filters in mobile view when filters button is clicked", async () => {
    // Mock window width for mobile view
    Object.defineProperty(window, "innerWidth", { value: 375, writable: true });
    window.dispatchEvent(new Event("resize"));

    render(<SearchBar />);

    // Click filters button
    await userEvent.click(screen.getByText(/filters/i));

    // Filters should now be visible
    expect(screen.getByText(/location/i)).toBeVisible();
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toBeVisible();
  });

  test("renders in desktop view with expanded filters", () => {
    // Mock window width for desktop view
    Object.defineProperty(window, "innerWidth", { value: 1024, writable: true });
    window.dispatchEvent(new Event("resize"));

    render(<SearchBar />);

    // In desktop view, filters should be visible by default
    expect(screen.getByText(/location/i)).toBeVisible();
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toBeVisible();

    // Filters button should not be present
    expect(screen.queryByText(/filters/i)).not.toBeInTheDocument();
  });

  test("renders correctly in dark mode", () => {
    render(<SearchBar />);

    // Check for dark mode specific classes
    const searchContainer = screen.getByTestId("search-container");
    expect(searchContainer).toHaveClass("dark:bg-gray-800");
  });

  // Interaction tests
  test("updates search text on input", async () => {
    render(<SearchBar />);

    // Type in search input
    const searchInput = screen.getByPlaceholderText(/search for ca/i);
    await userEvent.type(searchInput, "tax specialist");

    // Check input value
    expect(searchInput).toHaveValue("tax specialist");
  });

  test("selects location from dropdown", async () => {
    render(<SearchBar />);

    // Open location dropdown
    const locationDropdown = screen.getByText(/location/i);
    await userEvent.click(locationDropdown);

    // Select option - Mumbai in this case
    const mumbaiOption = screen.getByText(/mumbai/i);
    await userEvent.click(mumbaiOption);

    // Dropdown should now show Mumbai
    expect(locationDropdown).toHaveTextContent(/mumbai/i);
  });

  test("toggles verified checkbox", async () => {
    render(<SearchBar />);

    // Get checkbox
    const verifiedCheckbox = screen.getByRole("checkbox", { name: /verified only/i });

    // Initially unchecked
    expect(verifiedCheckbox).not.toBeChecked();

    // Click checkbox
    await userEvent.click(verifiedCheckbox);

    // Should now be checked
    expect(verifiedCheckbox).toBeChecked();

    // Click again to uncheck
    await userEvent.click(verifiedCheckbox);

    // Should now be unchecked again
    expect(verifiedCheckbox).not.toBeChecked();
  });

  test("calls onSearch handler when search button is clicked", async () => {
    const onSearchMock = jest.fn();
    render(<SearchBar onSearch={onSearchMock} />);

    // Fill search form
    await userEvent.type(screen.getByPlaceholderText(/search for ca/i), "tax specialist");

    // Select location
    const locationDropdown = screen.getByText(/location/i);
    await userEvent.click(locationDropdown);
    const mumbaiOption = screen.getByText(/mumbai/i);
    await userEvent.click(mumbaiOption);

    // Check verified checkbox
    await userEvent.click(screen.getByRole("checkbox", { name: /verified only/i }));

    // Click search button
    await userEvent.click(screen.getByRole("button", { name: /search/i }));

    // Check that onSearch was called with correct data
    expect(onSearchMock).toHaveBeenCalledWith({
      query: "tax specialist",
      location: "Mumbai",
      verifiedOnly: true,
    });
  });

  // Form submission tests
  test("submits search query with valid data", async () => {
    render(<SearchBar />);

    // Fill search form
    await userEvent.type(screen.getByPlaceholderText(/search for ca/i), "tax specialist");

    // Select location
    const locationDropdown = screen.getByText(/location/i);
    await userEvent.click(locationDropdown);
    const mumbaiOption = screen.getByText(/mumbai/i);
    await userEvent.click(mumbaiOption);

    // Check verified checkbox
    await userEvent.click(screen.getByRole("checkbox", { name: /verified only/i }));

    // Click search button
    await userEvent.click(screen.getByRole("button", { name: /search/i }));

    // Check router was called with correct URL
    expect(pushMock).toHaveBeenCalledWith(
      "/search?query=tax+specialist&location=Mumbai&verified=true"
    );
  });

  test("submits search query when Enter key is pressed in search input", async () => {
    render(<SearchBar />);

    // Type in search input and press Enter
    const searchInput = screen.getByPlaceholderText(/search for ca/i);
    await userEvent.type(searchInput, "tax specialist{enter}");

    // Check router was called with correct URL
    expect(pushMock).toHaveBeenCalledWith("/search?query=tax+specialist&location=&verified=false");
  });

  // Accessibility tests
  test("has proper ARIA attributes", () => {
    render(<SearchBar />);

    // Check for proper ARIA attributes
    expect(screen.getByPlaceholderText(/search for ca/i)).toHaveAttribute("aria-label", "Search");
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toHaveAttribute(
      "aria-checked"
    );
  });

  test("supports keyboard navigation", async () => {
    render(<SearchBar />);

    // Tab through form elements
    const searchInput = screen.getByPlaceholderText(/search for ca/i);
    searchInput.focus();

    await userEvent.tab(); // Move to location dropdown
    expect(screen.getByText(/location/i)).toHaveFocus();

    await userEvent.tab(); // Move to verified checkbox
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toHaveFocus();

    await userEvent.tab(); // Move to search button
    expect(screen.getByRole("button", { name: /search/i })).toHaveFocus();
  });

  test("is accessible to screen readers", async () => {
    const { container } = render(<SearchBar />);

    // Check accessibility
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Edge cases
  test("handles empty search query", async () => {
    render(<SearchBar />);

    // Click search with empty query
    await userEvent.click(screen.getByRole("button", { name: /search/i }));

    // Should still navigate but with empty query
    expect(pushMock).toHaveBeenCalledWith("/search?query=&location=&verified=false");
  });

  test("provides visual feedback on hover and focus", async () => {
    render(<SearchBar />);

    // Check for hover styles on search button
    const searchButton = screen.getByRole("button", { name: /search/i });
    fireEvent.mouseOver(searchButton);

    // Button should have hover class
    expect(searchButton).toHaveClass("hover:bg-primary-600");

    // Check for focus styles on search input
    const searchInput = screen.getByPlaceholderText(/search for ca/i);
    searchInput.focus();

    // Input should have focus ring
    expect(searchInput).toHaveClass("focus:ring-2");
    expect(searchInput).toHaveClass("focus:ring-primary-500");
  });

  test("persists filter state across re-renders", async () => {
    const { rerender } = render(<SearchBar />);

    // Set filters
    await userEvent.type(screen.getByPlaceholderText(/search for ca/i), "tax specialist");

    // Select location
    const locationDropdown = screen.getByText(/location/i);
    await userEvent.click(locationDropdown);
    const mumbaiOption = screen.getByText(/mumbai/i);
    await userEvent.click(mumbaiOption);

    // Check verified checkbox
    await userEvent.click(screen.getByRole("checkbox", { name: /verified only/i }));

    // Rerender component
    rerender(<SearchBar />);

    // Check that filter values are preserved
    expect(screen.getByPlaceholderText(/search for ca/i)).toHaveValue("tax specialist");
    expect(screen.getByText(/mumbai/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /verified only/i })).toBeChecked();
  });
});
