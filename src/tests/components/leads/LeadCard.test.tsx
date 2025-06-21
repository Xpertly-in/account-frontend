/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LeadCard } from "@/components/leads/LeadCard.component";
import { Lead, LeadUrgency, LeadStatus } from "@/types/dashboard/lead.type";
import { ContactPreference } from "@/types/common.type";

// Mock the services
jest.mock("@/services/leads.service", () => ({
  useCreateEngagement: jest.fn(),
  useHideLead: jest.fn(),
}));

// Mock the Auth provider
jest.mock("@/store/context/Auth.provider", () => ({
  useAuth: jest.fn(),
}));

// Mock the phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  EnvelopeOpen: () => <div data-testid="envelope-icon" />,
}));

describe("LeadCard Component - TDD Implementation", () => {
  const mockLead: Lead = {
    id: "1",
    customerId: "customer-1",
    customerName: "John Doe",
    services: ["Tax Preparation", "Bookkeeping"],
    urgency: "Immediately",
    location: {
      city: "Toronto",
      state: "ON",
    },
    contactPreference: "Email",
    contactInfo: "john@example.com",
    notes: "I need help with my taxes",
    timestamp: "2024-01-15T10:30:00Z",
    status: "new",
    hasEngagement: false,
    engagementCount: 0,
  };

  const mockOnLeadUpdate = jest.fn();

  const defaultProps = {
    lead: mockLead,
    onLeadUpdate: mockOnLeadUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock authenticated user
    const mockUseAuth = require("@/store/context/Auth.provider").useAuth;
    mockUseAuth.mockReturnValue({
      auth: {
        user: { id: "test-ca-id", email: "test@example.com" },
        isAuthenticated: true,
        isLoading: false,
        error: null,
      },
    });

    // Mock TanStack Query hooks
    const mockUseCreateEngagement = require("@/services/leads.service").useCreateEngagement;
    const mockUseHideLead = require("@/services/leads.service").useHideLead;

    mockUseCreateEngagement.mockReturnValue({
      createEngagement: jest.fn(),
      isLoading: false,
      isSuccess: false,
      isError: false,
      error: null,
    });

    mockUseHideLead.mockReturnValue({
      hideLead: jest.fn(),
      unhideLead: jest.fn(),
      isHiding: false,
      isUnhiding: false,
      hideError: null,
      unhideError: null,
    });
  });

  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render lead name", () => {
      render(<LeadCard {...defaultProps} />);

      const name = screen.getByText("John Doe");
      expect(name).toBeInTheDocument();
    });

    test("should render lead location", () => {
      render(<LeadCard {...defaultProps} />);

      const location = screen.getByText(/Toronto, ON/);
      expect(location).toBeInTheDocument();
    });

    test("should render urgency badge", () => {
      render(<LeadCard {...defaultProps} />);

      const urgency = screen.getByText("Immediately");
      expect(urgency).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should render services", () => {
      render(<LeadCard {...defaultProps} />);

      expect(screen.getByText("Tax Preparation")).toBeInTheDocument();
      expect(screen.getByText("Bookkeeping")).toBeInTheDocument();
    });

    test("should render contact preference", () => {
      render(<LeadCard {...defaultProps} />);

      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    test("should render notes when present", () => {
      render(<LeadCard {...defaultProps} />);

      expect(screen.getByText("I need help with my taxes")).toBeInTheDocument();
    });

    test("should render View Contact button when not engaged", () => {
      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      expect(viewContactButton).toBeInTheDocument();
    });

    test("should render Archive button", () => {
      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      expect(archiveButton).toBeInTheDocument();
    });

    test("should render status badge", () => {
      render(<LeadCard {...defaultProps} />);

      const status = screen.getByText("New");
      expect(status).toBeInTheDocument();
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should handle different urgency levels", () => {
      const urgencyLevels = ["Immediately", "Within a week", "This month", "Just exploring"];

      urgencyLevels.forEach(urgency => {
        const leadWithUrgency = { ...mockLead, urgency: urgency as Lead["urgency"] };
        const { rerender } = render(<LeadCard {...defaultProps} lead={leadWithUrgency} />);

        expect(screen.getByText(urgency)).toBeInTheDocument();

        rerender(<div />); // Clear for next iteration
      });
    });

    test("should handle different status types", () => {
      const statuses = ["new", "contacted", "closed", "archived"];

      statuses.forEach(status => {
        const leadWithStatus = { ...mockLead, status: status as Lead["status"] };
        const { rerender } = render(<LeadCard {...defaultProps} lead={leadWithStatus} />);

        const expectedText = status.charAt(0).toUpperCase() + status.slice(1);
        expect(screen.getByText(expectedText)).toBeInTheDocument();

        rerender(<div />); // Clear for next iteration
      });
    });

    test("should show archived indicator for archived leads", () => {
      const archivedLead = { ...mockLead, hiddenAt: "2024-01-16T10:30:00Z" };
      render(<LeadCard {...defaultProps} lead={archivedLead} />);

      expect(screen.getByText("(Archived)")).toBeInTheDocument();
      expect(screen.getByText("Unarchive")).toBeInTheDocument();
    });

    test("should show engagement count when present", () => {
      const leadWithEngagements = { ...mockLead, engagementCount: 3 };
      render(<LeadCard {...defaultProps} lead={leadWithEngagements} />);

      expect(screen.getByText("3 CAs viewed")).toBeInTheDocument();
    });

    test("should not show View Contact button for archived leads", () => {
      const archivedLead = { ...mockLead, hiddenAt: "2024-01-16T10:30:00Z" };
      render(<LeadCard {...defaultProps} lead={archivedLead} />);

      expect(screen.queryByText("View Contact")).not.toBeInTheDocument();
    });

    test("should handle leads without notes", () => {
      const leadWithoutNotes = { ...mockLead, notes: undefined };
      render(<LeadCard {...defaultProps} lead={leadWithoutNotes} />);

      expect(screen.queryByText("Notes:")).not.toBeInTheDocument();
    });

    test("should format date correctly", () => {
      render(<LeadCard {...defaultProps} />);

      // Should show formatted date
      expect(screen.getByText(/Jan 15, 2024/)).toBeInTheDocument();
    });

    test("should render enhanced badge variants correctly", () => {
      render(<LeadCard {...defaultProps} />);

      // Test urgency badge uses enhanced Badge component
      const urgencyBadge = screen.getByText("Immediately");
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge.closest("div")).toHaveClass("bg-red-500"); // urgent variant

      // Test status badge uses enhanced Badge component
      const statusBadge = screen.getByText("New");
      expect(statusBadge).toBeInTheDocument();
      expect(statusBadge.closest("div")).toHaveClass("bg-blue-500"); // new variant

      // Test contact preference badge uses enhanced Badge component
      const contactBadge = screen.getByText("Email");
      expect(contactBadge).toBeInTheDocument();
      expect(contactBadge.closest("div")).toHaveClass("bg-cyan-100"); // email variant
    });

    test("should handle different contact preferences with correct badge variants", () => {
      const contactPreferences = ["Phone", "Email", "WhatsApp"];
      const expectedClasses = ["bg-indigo-100", "bg-cyan-100", "bg-emerald-100"];

      contactPreferences.forEach((preference, index) => {
        const leadWithPreference = {
          ...mockLead,
          contactPreference: preference as Lead["contactPreference"],
        };
        const { rerender } = render(<LeadCard {...defaultProps} lead={leadWithPreference} />);

        const contactBadge = screen.getByText(preference);
        expect(contactBadge).toBeInTheDocument();
        expect(contactBadge.closest("div")).toHaveClass(expectedClasses[index]);

        rerender(<div />); // Clear for next iteration
      });
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should handle View Contact button click", async () => {
      const mockCreateEngagement = jest.fn();
      const mockUseCreateEngagement = require("@/services/leads.service").useCreateEngagement;

      mockUseCreateEngagement.mockReturnValue({
        createEngagement: mockCreateEngagement,
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      fireEvent.click(viewContactButton);

      await waitFor(() => {
        expect(mockCreateEngagement).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle Archive button click", async () => {
      const mockHideLead = jest.fn();
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: mockHideLead,
        unhideLead: jest.fn(),
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: null,
      });

      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockHideLead).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle Unarchive button click", async () => {
      const mockUnhideLead = jest.fn();
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: jest.fn(),
        unhideLead: mockUnhideLead,
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: null,
      });

      const archivedLead = { ...mockLead, hiddenAt: "2024-01-16T10:30:00Z" };
      render(<LeadCard {...defaultProps} lead={archivedLead} />);

      const unarchiveButton = screen.getByText("Unarchive");
      fireEvent.click(unarchiveButton);

      await waitFor(() => {
        expect(mockUnhideLead).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle engagement creation error", async () => {
      const mockCreateEngagement = jest.fn();
      const mockUseCreateEngagement = require("@/services/leads.service").useCreateEngagement;

      mockUseCreateEngagement.mockReturnValue({
        createEngagement: mockCreateEngagement,
        isLoading: false,
        isSuccess: false,
        isError: true,
        error: new Error("Network error"),
      });

      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      fireEvent.click(viewContactButton);

      await waitFor(() => {
        expect(mockCreateEngagement).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle existing engagement", async () => {
      const leadWithEngagement = { ...mockLead, hasEngagement: true };
      render(<LeadCard {...defaultProps} lead={leadWithEngagement} />);

      // Should show contact info immediately for existing engagement
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("should handle unauthenticated user for View Contact", async () => {
      const mockUseAuth = require("@/store/context/Auth.provider").useAuth;
      mockUseAuth.mockReturnValue({
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      });

      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      fireEvent.click(viewContactButton);

      // Should not call any services when user is not authenticated
      const mockCreateEngagement = jest.fn();
      expect(mockCreateEngagement).not.toHaveBeenCalled();
    });

    test("should handle unauthenticated user for Archive", async () => {
      const mockUseAuth = require("@/store/context/Auth.provider").useAuth;
      mockUseAuth.mockReturnValue({
        auth: {
          user: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        },
      });

      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      fireEvent.click(archiveButton);

      // Should not call any services when user is not authenticated
      const mockHideLead = jest.fn();
      expect(mockHideLead).not.toHaveBeenCalled();
    });

    test("should show contact info when already engaged", () => {
      const engagedLead = { ...mockLead, hasEngagement: true };
      render(<LeadCard {...defaultProps} lead={engagedLead} />);

      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.queryByText("View Contact")).not.toBeInTheDocument();
    });

    test("should handle archive error", async () => {
      const mockHideLead = jest.fn();
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: mockHideLead,
        unhideLead: jest.fn(),
        isHiding: false,
        isUnhiding: false,
        hideError: new Error("Archive failed"),
        unhideError: null,
      });

      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockHideLead).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle unarchive error", async () => {
      const mockUnhideLead = jest.fn();
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: jest.fn(),
        unhideLead: mockUnhideLead,
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: new Error("Unarchive failed"),
      });

      const archivedLead = { ...mockLead, hiddenAt: "2024-01-16T10:30:00Z" };
      render(<LeadCard {...defaultProps} lead={archivedLead} />);

      const unarchiveButton = screen.getByText("Unarchive");
      fireEvent.click(unarchiveButton);

      await waitFor(() => {
        expect(mockUnhideLead).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle exception in View Contact", async () => {
      const mockCreateEngagement = jest.fn();
      const mockUseCreateEngagement = require("@/services/leads.service").useCreateEngagement;

      mockUseCreateEngagement.mockReturnValue({
        createEngagement: mockCreateEngagement,
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      fireEvent.click(viewContactButton);

      await waitFor(() => {
        expect(mockCreateEngagement).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should handle exception in Archive", async () => {
      const mockHideLead = jest.fn();
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: mockHideLead,
        unhideLead: jest.fn(),
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: null,
      });

      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockHideLead).toHaveBeenCalledWith("1", expect.any(Object));
      });
    });

    test("should call onLeadUpdate after successful engagement creation", async () => {
      const mockCreateEngagement = jest.fn((leadId, options) => {
        // Simulate successful creation by calling onSuccess
        options.onSuccess();
      });
      const mockUseCreateEngagement = require("@/services/leads.service").useCreateEngagement;

      mockUseCreateEngagement.mockReturnValue({
        createEngagement: mockCreateEngagement,
        isLoading: false,
        isSuccess: false,
        isError: false,
        error: null,
      });

      render(<LeadCard {...defaultProps} />);

      const viewContactButton = screen.getByText("View Contact");
      fireEvent.click(viewContactButton);

      await waitFor(() => {
        expect(mockOnLeadUpdate).toHaveBeenCalled();
      });
    });

    test("should call onLeadUpdate after successful archive", async () => {
      const mockHideLead = jest.fn((leadId, options) => {
        // Simulate successful archive by calling onSuccess
        options.onSuccess();
      });
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: mockHideLead,
        unhideLead: jest.fn(),
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: null,
      });

      render(<LeadCard {...defaultProps} />);

      const archiveButton = screen.getByText("Archive");
      fireEvent.click(archiveButton);

      await waitFor(() => {
        expect(mockOnLeadUpdate).toHaveBeenCalled();
      });
    });

    test("should call onLeadUpdate after successful unarchive", async () => {
      const mockUnhideLead = jest.fn((leadId, options) => {
        // Simulate successful unarchive by calling onSuccess
        options.onSuccess();
      });
      const mockUseHideLead = require("@/services/leads.service").useHideLead;

      mockUseHideLead.mockReturnValue({
        hideLead: jest.fn(),
        unhideLead: mockUnhideLead,
        isHiding: false,
        isUnhiding: false,
        hideError: null,
        unhideError: null,
      });

      const archivedLead = { ...mockLead, hiddenAt: "2024-01-16T10:30:00Z" };
      render(<LeadCard {...defaultProps} lead={archivedLead} />);

      const unarchiveButton = screen.getByText("Unarchive");
      fireEvent.click(unarchiveButton);

      await waitFor(() => {
        expect(mockOnLeadUpdate).toHaveBeenCalled();
      });
    });
  });
});
