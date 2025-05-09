import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { axe } from "jest-axe";
import { LoginForm } from "@/components/features/auth/LoginForm.component";
import { AuthProvider } from "@/store/context/Auth.provider";
import * as router from "next/navigation";

// Mock the useRouter hook
jest.mock("next/navigation", () => ({
  ...jest.requireActual("next/navigation"),
  useRouter: jest.fn(),
}));

// Create a custom render function that includes the AuthProvider
const renderWithAuth = (ui: React.ReactElement) => {
  return render(<AuthProvider>{ui}</AuthProvider>);
};

describe("LoginForm Component", () => {
  // Setup for router mocks
  const pushMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (router.useRouter as jest.Mock).mockReturnValue({
      push: pushMock,
    });
  });

  // Rendering tests
  test("renders login form with all fields", () => {
    renderWithAuth(<LoginForm />);

    // Check form elements
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: /remember me/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  test("renders form in loading state when isLoading is true", async () => {
    renderWithAuth(<LoginForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    // Submit form - this should trigger loading state
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Verify loading state (UI may vary based on implementation)
    expect(screen.getByRole("button", { name: /login/i })).toBeDisabled();
  });

  test("renders correctly in dark mode", () => {
    // Note: This would require setting up ThemeProvider with dark mode
    // Will be simplified here to demonstrate the approach
    renderWithAuth(<LoginForm />);

    // Check for dark mode specific classes (actual implementation will vary)
    const form = screen.getByRole("form");
    expect(form).toHaveClass("dark:bg-gray-900");
  });

  // Validation tests
  test("validates email format", async () => {
    renderWithAuth(<LoginForm />);

    // Enter invalid email
    const emailInput = screen.getByLabelText(/email/i);
    await userEvent.type(emailInput, "invalid-email");
    fireEvent.blur(emailInput);

    // Check for validation error
    expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();

    // Enter valid email
    await userEvent.clear(emailInput);
    await userEvent.type(emailInput, "valid@example.com");
    fireEvent.blur(emailInput);

    // Error message should be gone
    expect(screen.queryByText(/please enter a valid email/i)).not.toBeInTheDocument();
  });

  test("validates required fields", async () => {
    renderWithAuth(<LoginForm />);

    // Submit empty form
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check for validation errors
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });

  // Form submission tests
  test("submits form with valid data", async () => {
    // Mock the signIn function from AuthProvider
    const mockSignIn = jest.fn().mockResolvedValue({ success: true });
    jest.spyOn(AuthProvider, "useAuth").mockImplementation(() => ({
      user: null,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
      error: null,
    }));

    renderWithAuth(<LoginForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check that signIn was called with correct data
    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123", true);

    // Check redirection after successful login
    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith("/dashboard");
    });
  });

  test("shows error message for invalid credentials", async () => {
    // Mock the signIn function to return an error
    const mockSignIn = jest.fn().mockResolvedValue({
      success: false,
      error: "Invalid email or password",
    });

    jest.spyOn(AuthProvider, "useAuth").mockImplementation(() => ({
      user: null,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
      error: "Invalid email or password",
    }));

    renderWithAuth(<LoginForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "wrongpassword");

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check for error message
    expect(await screen.findByText(/invalid email or password/i)).toBeInTheDocument();

    // Check that redirect was not called
    expect(pushMock).not.toHaveBeenCalled();
  });

  // Navigation tests
  test("navigates to forgot password page when link is clicked", async () => {
    renderWithAuth(<LoginForm />);

    // Click forgot password link
    await userEvent.click(screen.getByText(/forgot password/i));

    // Check navigation
    expect(pushMock).toHaveBeenCalledWith("/login/forgot-password");
  });

  // Accessibility tests
  test("form is accessible", async () => {
    const { container } = renderWithAuth(<LoginForm />);

    // Run accessibility tests
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  test("supports keyboard navigation", async () => {
    renderWithAuth(<LoginForm />);

    // Tab through form elements
    const emailInput = screen.getByLabelText(/email/i);
    emailInput.focus();

    await userEvent.tab(); // Move to password
    expect(screen.getByLabelText(/password/i)).toHaveFocus();

    await userEvent.tab(); // Move to remember me
    expect(screen.getByRole("checkbox", { name: /remember me/i })).toHaveFocus();

    await userEvent.tab(); // Move to login button
    expect(screen.getByRole("button", { name: /login/i })).toHaveFocus();
  });

  // Edge cases
  test("handles form submission when Enter key is pressed", async () => {
    // Mock the signIn function
    const mockSignIn = jest.fn().mockResolvedValue({ success: true });
    jest.spyOn(AuthProvider, "useAuth").mockImplementation(() => ({
      user: null,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
      error: null,
    }));

    renderWithAuth(<LoginForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123{enter}");

    // Check that signIn was called
    expect(mockSignIn).toHaveBeenCalledWith("test@example.com", "password123", true);
  });

  test("handles API errors gracefully", async () => {
    // Mock signIn to throw an error
    const mockSignIn = jest.fn().mockImplementation(() => {
      throw new Error("Network error");
    });

    jest.spyOn(AuthProvider, "useAuth").mockImplementation(() => ({
      user: null,
      signIn: mockSignIn,
      signUp: jest.fn(),
      signOut: jest.fn(),
      isLoading: false,
      error: "Network error",
    }));

    renderWithAuth(<LoginForm />);

    // Fill form
    await userEvent.type(screen.getByLabelText(/email/i), "test@example.com");
    await userEvent.type(screen.getByLabelText(/password/i), "password123");

    // Submit form
    await userEvent.click(screen.getByRole("button", { name: /login/i }));

    // Check for error message
    expect(await screen.findByText(/network error/i)).toBeInTheDocument();
  });
});
