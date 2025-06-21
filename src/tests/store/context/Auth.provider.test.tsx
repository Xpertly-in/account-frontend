import { render, screen, waitFor, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "@/store/context/Auth.provider";

// Mock the localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    clear: jest.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Create a test component that uses the auth context
const TestComponent = () => {
  const { user, signIn, signUp, signOut, isLoading, error } = useAuth();
  return (
    <div>
      {user ? (
        <div>
          <div data-testid="user-email">{user.email}</div>
          <button onClick={() => signOut()}>Sign Out</button>
        </div>
      ) : (
        <div>
          <div>Not logged in</div>
          <div data-testid="loading">{isLoading ? "Loading..." : ""}</div>
          <div data-testid="error">{error}</div>
          <button onClick={() => signIn("test@example.com", "password", true)}>Sign In</button>
          <button onClick={() => signUp("test@example.com", "password", true)}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

describe("Auth Provider", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockLocalStorage.clear();
  });

  // Rendering tests
  test("renders children components", () => {
    render(
      <AuthProvider>
        <div data-testid="child">Test Child</div>
      </AuthProvider>
    );
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });

  // Authentication flow tests
  test("provides authentication state to children", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });

  test("handles sign up flow", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signUpButton = screen.getByText(/sign up/i);
    await userEvent.click(signUpButton);

    // Should show loading state
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");

    // After signup completes, user should be set in local storage
    await waitFor(() => {
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith("xpertly_user", expect.any(String));
    });

    // Mock data should be stored in localStorage
    const userDataString = mockLocalStorage.setItem.mock.calls.find(
      call => call[0] === "xpertly_user"
    )?.[1];

    expect(userDataString).toBeDefined();
    if (userDataString) {
      const userData = JSON.parse(userDataString);
      expect(userData.email).toBe("test@example.com");
    }
  });

  test("handles login flow", async () => {
    // Set up mock user in localStorage
    const mockUser = { email: "test@example.com", role: "user" };
    mockLocalStorage.setItem("xpertly_user", JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    const signInButton = screen.getByText(/sign in/i);
    await userEvent.click(signInButton);

    // Should show loading state
    expect(screen.getByTestId("loading")).toHaveTextContent("Loading...");

    // After login completes, user should be displayed
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });
  });

  test("handles sign out flow", async () => {
    // Set up mock user in localStorage
    const mockUser = { email: "test@example.com", role: "user" };
    mockLocalStorage.setItem("xpertly_user", JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // User should be logged in initially
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });

    // Click sign out
    const signOutButton = screen.getByText(/sign out/i);
    await userEvent.click(signOutButton);

    // User should be logged out
    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });

    // Check that localStorage item was removed
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("xpertly_user");
  });

  test("updates auth state correctly after login", async () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Initially not logged in
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();

    // Simulate login
    const signInButton = screen.getByText(/sign in/i);
    await userEvent.click(signInButton);

    // After login completes, user should be displayed
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });
  });

  test("updates auth state correctly after logout", async () => {
    // Set up mock user in localStorage
    const mockUser = { email: "test@example.com", role: "user" };
    mockLocalStorage.setItem("xpertly_user", JSON.stringify(mockUser));

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // User should be logged in initially
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });

    // Click sign out
    const signOutButton = screen.getByText(/sign out/i);
    await userEvent.click(signOutButton);

    // User should be logged out
    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });

  // Error handling tests
  test("handles authentication errors", async () => {
    // Mock localStorage.getItem to throw an error
    mockLocalStorage.getItem.mockImplementationOnce(() => {
      throw new Error("Failed to read from localStorage");
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should handle error gracefully
    expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
  });

  // Edge cases
  test("preserves auth state on page reload (localStorage)", async () => {
    // Set up mock user in localStorage
    const mockUser = { email: "test@example.com", role: "user" };
    mockLocalStorage.setItem("xpertly_user", JSON.stringify(mockUser));

    // Initial render - should load user from localStorage
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // User should be logged in
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });

    // Unmount and remount to simulate page reload
    act(() => {
      screen.unmount();
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // User should still be logged in
    await waitFor(() => {
      expect(screen.getByTestId("user-email")).toHaveTextContent("test@example.com");
    });
  });

  test("handles malformed data in localStorage", async () => {
    // Set invalid JSON in localStorage
    mockLocalStorage.setItem("xpertly_user", "not valid json");

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    // Should handle error gracefully and user should not be logged in
    await waitFor(() => {
      expect(screen.getByText(/not logged in/i)).toBeInTheDocument();
    });
  });
});
