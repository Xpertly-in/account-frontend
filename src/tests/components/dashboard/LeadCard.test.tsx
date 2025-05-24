/// <reference types="@testing-library/jest-dom" />
import { render, screen, fireEvent, waitFor } from "@/tests/test-utils";
import { LeadCard } from "@/components/leads/LeadCard.component";
import { LeadStatus, LeadUrgency, ContactPreference } from "@/types/dashboard/lead.type";

// Mock the leads service
jest.mock("@/services/leads.service", () => ({
  createLeadEngagement: jest.fn(),
}));

// Mock the phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  EnvelopeOpen: () => <div data-testid="envelope-icon" />,
}));

import { createLeadEngagement } from "@/services/leads.service";

describe("LeadCard", () => {
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

    // Check contact info
    expect(screen.getByText(/EMAIL:/i)).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();

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
      expect(mockCreateEngagement).toHaveBeenCalledWith("1", "mock-ca-id");
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
      expect(mockCreateEngagement).toHaveBeenCalledWith("1", "mock-ca-id");
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
});
