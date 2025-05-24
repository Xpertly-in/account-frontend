/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@/tests/test-utils";
import { LeadCard } from "@/components/leads/LeadCard.component";
import { LeadStatus, LeadUrgency, ContactPreference } from "@/types/dashboard/lead.type";

// Mock the leads service
jest.mock("@/services/leads.service", () => ({
  createLeadEngagement: jest.fn(),
  fetchLeadContactInfo: jest.fn(),
}));

// Mock the auth provider
jest.mock("@/store/context/Auth.provider", () => ({
  useAuth: jest.fn(),
}));

// Mock the phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  EnvelopeOpen: () => <div data-testid="envelope-icon" />,
}));

import { createLeadEngagement, checkExistingEngagement } from "@/services/leads.service";
import { useAuth } from "@/store/context/Auth.provider";

describe("LeadCard", () => {
  const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;
  const mockCheckExistingEngagement = checkExistingEngagement as jest.MockedFunction<
    typeof checkExistingEngagement
  >;
  const mockLead = {
    id: "1",
    customerId: "customer1",
    customerName: "John Doe",
    services: ["Tax Filing", "GST Registration"],
    urgency: LeadUrgency.IMMEDIATELY,
    timestamp: new Date().toISOString(),
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    status: LeadStatus.NEW,
    contactPreference: ContactPreference.EMAIL,
    contactInfo: "john.doe@example.com",
    notes: "Test notes",
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authenticated user
    mockUseAuth.mockReturnValue({
      auth: {
        user: {
          id: "test-ca-id",
          email: "test@example.com",
          app_metadata: {},
          user_metadata: {},
          aud: "authenticated",
          created_at: "2023-01-01T00:00:00Z",
        } as any,
        isLoading: false,
        isAuthenticated: true,
      },
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
    });

    // Mock no existing engagement by default
    mockCheckExistingEngagement.mockResolvedValue({
      exists: false,
      error: null,
    });
  });

  it("should render the lead card with correct data", () => {
    render(<LeadCard lead={mockLead} />);

    // Check customer name
    expect(screen.getByText("John Doe")).toBeInTheDocument();

    // Check location and date
    expect(screen.getByText(/Mumbai, Maharashtra/)).toBeInTheDocument();

    // Check urgency badge
    expect(screen.getByText("Immediately")).toBeInTheDocument();

    // Check services
    expect(screen.getByText("Tax Filing")).toBeInTheDocument();
    expect(screen.getByText("GST Registration")).toBeInTheDocument();

    // Check contact info (should be hidden initially)
    expect(screen.getByText(/EMAIL:/i)).toBeInTheDocument();
    expect(screen.getByText('Click "View Contact" to see details')).toBeInTheDocument();

    // Check notes
    expect(screen.getByText("Test notes")).toBeInTheDocument();

    // Check status badge
    expect(screen.getByText("New")).toBeInTheDocument();

    // Check action buttons
    expect(screen.getByText("Archive")).toBeInTheDocument();
    expect(screen.getByText("View Contact")).toBeInTheDocument();
  });

  it("should not display notes section when no notes are provided", () => {
    const leadWithoutNotes = {
      ...mockLead,
      notes: undefined,
    };

    render(<LeadCard lead={leadWithoutNotes} />);

    // The "Notes:" label should not be present
    expect(screen.queryByText("Notes:")).not.toBeInTheDocument();
  });

  it("should apply the correct color for urgency badges", () => {
    render(<LeadCard lead={mockLead} />);

    // Immediately urgency should have red bg color
    const urgencyBadge = screen.getByText("Immediately");
    expect(urgencyBadge).toHaveClass("bg-red-500");
  });

  it("should apply the correct style for status badges", () => {
    render(<LeadCard lead={mockLead} />);

    // New status should have blue bg color
    const statusBadge = screen.getByText("New");
    expect(statusBadge).toHaveClass("bg-blue-100");
    expect(statusBadge).toHaveClass("text-blue-800");
  });

  it("should handle View Contact button click and create engagement", async () => {
    // Arrange
    const mockCreateEngagement = createLeadEngagement as jest.MockedFunction<
      typeof createLeadEngagement
    >;
    mockCreateEngagement.mockResolvedValue({
      data: {
        id: "engagement-1",
        leadId: "1",
        caId: "ca-1",
        viewedAt: new Date().toISOString(),
      },
      error: null,
    });

    render(<LeadCard lead={mockLead} />);

    // Act
    const viewContactButton = screen.getByText("View Contact");
    fireEvent.click(viewContactButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateEngagement).toHaveBeenCalledWith("1", "test-ca-id");
    });
  });

  it("should handle View Contact button click error", async () => {
    // Arrange
    const mockCreateEngagement = createLeadEngagement as jest.MockedFunction<
      typeof createLeadEngagement
    >;
    mockCreateEngagement.mockResolvedValue({
      data: null,
      error: new Error("Failed to create engagement"),
    });

    // Mock console.error to avoid test output noise
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<LeadCard lead={mockLead} />);

    // Act
    const viewContactButton = screen.getByText("View Contact");
    fireEvent.click(viewContactButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateEngagement).toHaveBeenCalledWith("1", "test-ca-id");
      expect(consoleSpy).toHaveBeenCalledWith(
        "Error creating engagement:",
        new Error("Failed to create engagement")
      );
    });

    consoleSpy.mockRestore();
  });

  it("should show engagement count when provided", () => {
    const leadWithEngagements = {
      ...mockLead,
      engagementCount: 3,
    };

    render(<LeadCard lead={leadWithEngagements} />);

    expect(screen.getByText("3 CAs viewed")).toBeInTheDocument();
  });

  it("should not create engagement when user is not authenticated", async () => {
    // Mock unauthenticated user
    mockUseAuth.mockReturnValue({
      auth: {
        user: null,
        isLoading: false,
        isAuthenticated: false,
      },
      signIn: jest.fn(),
      signUp: jest.fn(),
      signOut: jest.fn(),
      resetPassword: jest.fn(),
    });

    const mockCreateEngagement = createLeadEngagement as jest.MockedFunction<
      typeof createLeadEngagement
    >;
    const consoleSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(<LeadCard lead={mockLead} />);

    // Act
    const viewContactButton = screen.getByText("View Contact");
    fireEvent.click(viewContactButton);

    // Assert
    await waitFor(() => {
      expect(mockCreateEngagement).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith("User not authenticated");
    });

    consoleSpy.mockRestore();
  });

  it("should show contact info when engagement already exists", async () => {
    // Mock existing engagement
    mockCheckExistingEngagement.mockResolvedValue({
      exists: true,
      error: null,
    });

    render(<LeadCard lead={mockLead} />);

    // Wait for useEffect to complete
    await waitFor(() => {
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });

    // Contact info should be visible
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    expect(screen.queryByText('Click "View Contact" to see details')).not.toBeInTheDocument();
  });

  it("should handle duplicate engagement creation gracefully", async () => {
    const mockCreateEngagement = createLeadEngagement as jest.MockedFunction<
      typeof createLeadEngagement
    >;
    mockCreateEngagement.mockResolvedValue({
      data: null,
      error: { message: "Engagement already exists for this CA and lead" },
    });

    render(<LeadCard lead={mockLead} />);

    // Act
    const viewContactButton = screen.getByText("View Contact");
    fireEvent.click(viewContactButton);

    // Assert - should handle duplicate gracefully and show contact info
    await waitFor(() => {
      expect(mockCreateEngagement).toHaveBeenCalledWith("1", "test-ca-id");
      expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
    });
  });
});
