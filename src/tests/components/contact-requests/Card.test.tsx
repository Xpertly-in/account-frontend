/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ContactRequestCard } from "@/components/contact-requests/Card.component";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { ContactPreference, UrgencyLevel } from "@/types/common.type";

// Mock the Toast UI component
jest.mock("@/ui/Toast.ui", () => ({
  Toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

describe("ContactRequestCard Component - TDD Implementation", () => {
  const mockContactRequest: ContactRequest = {
    id: "1",
    ca_id: "ca-123",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+919876543210",
    subject: "Need help with GST Registration",
    message:
      "I'm starting a new business and need help with GST registration. Can you guide me through the process?",
    service_needed: "GST Services",
    urgency: UrgencyLevel.WITHIN_A_WEEK,
    contact_preference: ContactPreference.EMAIL,
    contact_detail: "john@example.com",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    status: ContactRequestStatus.NEW,
    ca_private_notes: "",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
  };

  const mockOnStatusUpdate = jest.fn();
  const mockOnNotesUpdate = jest.fn();

  const defaultProps = {
    contactRequest: mockContactRequest,
    onStatusUpdate: mockOnStatusUpdate,
    onNotesUpdate: mockOnNotesUpdate,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // RED PHASE: Write failing tests first
  // ============================================================================

  describe("RED PHASE: Initial failing tests", () => {
    test("should render customer name", () => {
      render(<ContactRequestCard {...defaultProps} />);

      const name = screen.getByText("John Doe");
      expect(name).toBeInTheDocument();
    });

    test("should render subject", () => {
      render(<ContactRequestCard {...defaultProps} />);

      const subject = screen.getByText("Need help with GST Registration");
      expect(subject).toBeInTheDocument();
    });

    test("should render message", () => {
      render(<ContactRequestCard {...defaultProps} />);

      const message = screen.getByText(/I'm starting a new business/);
      expect(message).toBeInTheDocument();
    });
  });

  // ============================================================================
  // GREEN PHASE: Basic implementation tests
  // ============================================================================

  describe("GREEN PHASE: Basic functionality tests", () => {
    test("should render service needed badge", () => {
      render(<ContactRequestCard {...defaultProps} />);

      expect(screen.getByText("GST Services")).toBeInTheDocument();
    });

    test("should render urgency badge with correct variant", () => {
      render(<ContactRequestCard {...defaultProps} />);

      const urgencyBadge = screen.getByText("Within a week");
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge).toHaveClass("bg-orange-100"); // "high" variant is orange
    });

    test("should render location information", () => {
      render(<ContactRequestCard {...defaultProps} />);

      expect(screen.getByText("Mumbai, Maharashtra")).toBeInTheDocument();
    });

    test("should render contact preference with icon", () => {
      render(<ContactRequestCard {...defaultProps} />);

      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("should render status dropdown with current status", () => {
      render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");
      expect(statusSelect).toBeInTheDocument();
      expect(statusSelect).toHaveValue("new");
    });

    test("should render relative time", () => {
      // Mock Date constructor to return our mock date
      const RealDate = Date;
      const mockDate = new Date("2024-01-15T12:30:00Z");

      global.Date = jest.fn((...args) => {
        if (args.length) {
          return new RealDate(...args);
        }
        return mockDate;
      }) as any;

      // Also mock Date.now()
      global.Date.now = () => mockDate.getTime();

      // Add other Date static methods
      Object.setPrototypeOf(global.Date, RealDate);

      render(<ContactRequestCard {...defaultProps} />);

      // Should show "2h ago" for 2 hours difference
      expect(screen.getByText("2h ago")).toBeInTheDocument();

      // Restore Date
      global.Date = RealDate;
    });

    test("should render status indicator bar", () => {
      const { container } = render(<ContactRequestCard {...defaultProps} />);

      const statusBar = container.querySelector(".bg-gradient-to-r.from-blue-500");
      expect(statusBar).toBeInTheDocument();
    });
  });

  // ============================================================================
  // REFACTOR PHASE: Advanced functionality tests
  // ============================================================================

  describe("REFACTOR PHASE: Advanced functionality tests", () => {
    test("should handle status change", async () => {
      render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "replied" } });

      await waitFor(() => {
        expect(mockOnStatusUpdate).toHaveBeenCalledWith("1", ContactRequestStatus.REPLIED);
      });
    });

    test("should show success toast on status update", async () => {
      const { Toast } = require("@/ui/Toast.ui");
      render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "replied" } });

      await waitFor(() => {
        expect(Toast.success).toHaveBeenCalledWith({
          title: "Status updated",
          description: "Contact request marked as replied",
        });
      });
    });

    test("should handle status update error", async () => {
      const { Toast } = require("@/ui/Toast.ui");
      const errorProps = {
        ...defaultProps,
        onStatusUpdate: jest.fn().mockRejectedValue(new Error("Update failed")),
      };

      render(<ContactRequestCard {...errorProps} />);

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "replied" } });

      await waitFor(() => {
        expect(Toast.error).toHaveBeenCalledWith({
          title: "Failed to update status",
          description: "Please try again or contact support if the problem persists.",
        });
      });
    });

    test("should disable status dropdown while updating", async () => {
      render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "replied" } });

      // Status select should be disabled during update
      expect(statusSelect).toBeDisabled();

      await waitFor(() => {
        expect(statusSelect).not.toBeDisabled();
      });
    });

    test("should render different urgency levels correctly", () => {
      const urgencyLevels = [
        { urgency: UrgencyLevel.IMMEDIATELY, text: "Urgent", class: "bg-red-100" },
        { urgency: UrgencyLevel.WITHIN_A_WEEK, text: "Within a week", class: "bg-orange-100" }, // high variant
        { urgency: UrgencyLevel.THIS_MONTH, text: "This month", class: "bg-yellow-100" }, // medium variant
        { urgency: UrgencyLevel.FLEXIBLE, text: "Flexible", class: "bg-green-100" }, // low variant
      ];

      urgencyLevels.forEach(({ urgency, text, class: className }) => {
        const { rerender } = render(
          <ContactRequestCard
            {...defaultProps}
            contactRequest={{ ...mockContactRequest, urgency }}
          />
        );

        const urgencyBadge = screen.getByText(text);
        expect(urgencyBadge).toBeInTheDocument();
        expect(urgencyBadge).toHaveClass(className);

        rerender(<div />);
      });
    });

    test("should render different contact preferences correctly", () => {
      const preferences = [
        { preference: ContactPreference.PHONE, text: "Phone", class: "bg-indigo-100" },
        { preference: ContactPreference.EMAIL, text: "Email", class: "bg-cyan-100" },
        { preference: ContactPreference.WHATSAPP, text: "WhatsApp", class: "bg-emerald-100" },
      ];

      preferences.forEach(({ preference, text, class: className }) => {
        const { rerender } = render(
          <ContactRequestCard
            {...defaultProps}
            contactRequest={{
              ...mockContactRequest,
              contact_preference: preference,
              contact_detail:
                preference === ContactPreference.PHONE ? "+919876543210" : "test@example.com",
            }}
          />
        );

        const preferenceBadge = screen.getByText(text);
        expect(preferenceBadge).toBeInTheDocument();

        rerender(<div />);
      });
    });

    test("should render different status colors correctly", () => {
      const statuses = [
        { status: ContactRequestStatus.NEW, class: "from-blue-500" },
        { status: ContactRequestStatus.REPLIED, class: "from-emerald-500" },
        { status: ContactRequestStatus.IGNORED, class: "from-gray-400" },
      ];

      statuses.forEach(({ status, class: className }) => {
        const { container, rerender } = render(
          <ContactRequestCard
            {...defaultProps}
            contactRequest={{ ...mockContactRequest, status }}
          />
        );

        const statusBar = container.querySelector(`.bg-gradient-to-r.${className}`);
        expect(statusBar).toBeInTheDocument();

        rerender(<div />);
      });
    });

    test("should handle missing optional fields gracefully", () => {
      const minimalRequest: ContactRequest = {
        ...mockContactRequest,
        customer_phone: undefined,
        service_needed: undefined,
        location: undefined,
        ca_private_notes: undefined,
      };

      render(<ContactRequestCard {...defaultProps} contactRequest={minimalRequest} />);

      // Should still render without errors
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Need help with GST Registration")).toBeInTheDocument();

      // Should not show location if not provided
      expect(screen.queryByText(/Mumbai/)).not.toBeInTheDocument();
    });

    test("should show warning icon for urgent requests", () => {
      render(
        <ContactRequestCard
          {...defaultProps}
          contactRequest={{ ...mockContactRequest, urgency: UrgencyLevel.IMMEDIATELY }}
        />
      );

      // Check for warning icon presence (it's rendered as an SVG)
      // The warning icon is in the parent div of the badge
      const urgentBadge = screen.getByText("Urgent");
      const parentDiv = urgentBadge.closest("div")?.parentElement;
      expect(parentDiv?.querySelector("svg")).toBeInTheDocument();
    });
  });

  // ============================================================================
  // PERFORMANCE & EDGE CASES
  // ============================================================================

  describe("Performance and Edge Cases", () => {
    test("should handle very long customer names", () => {
      const longNameRequest = {
        ...mockContactRequest,
        customer_name: "Very Long Customer Name That Should Be Truncated Properly",
      };

      render(<ContactRequestCard {...defaultProps} contactRequest={longNameRequest} />);

      const nameElement = screen.getByText(
        "Very Long Customer Name That Should Be Truncated Properly"
      );
      expect(nameElement).toHaveClass("truncate");
    });

    test("should handle very long subjects", () => {
      const longSubjectRequest = {
        ...mockContactRequest,
        subject:
          "This is a very long subject line that should be truncated properly to fit in the card header without breaking the layout",
      };

      render(<ContactRequestCard {...defaultProps} contactRequest={longSubjectRequest} />);

      const subjectElement = screen.getByText(/This is a very long subject line/);
      expect(subjectElement).toHaveClass("truncate");
    });

    test("should handle empty notes field", () => {
      render(<ContactRequestCard {...defaultProps} />);

      // Should show "No private notes yet" message
      expect(screen.getByText("No private notes yet")).toBeInTheDocument();
    });

    test("should handle notes with existing content", () => {
      const requestWithNotes = {
        ...mockContactRequest,
        ca_private_notes: "This customer seems very interested. Follow up tomorrow.",
      };

      render(<ContactRequestCard {...defaultProps} contactRequest={requestWithNotes} />);

      expect(
        screen.getByText("This customer seems very interested. Follow up tomorrow.")
      ).toBeInTheDocument();
    });

    test("should maintain status state during updates", async () => {
      const { rerender } = render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");
      fireEvent.change(statusSelect, { target: { value: "replied" } });

      // Should show optimistic update immediately
      expect(statusSelect).toHaveValue("replied");

      // Rerender with same props
      rerender(<ContactRequestCard {...defaultProps} />);

      // Should maintain the updated status
      await waitFor(() => {
        expect(statusSelect).toHaveValue("replied");
      });
    });

    test("should handle rapid status changes", async () => {
      render(<ContactRequestCard {...defaultProps} />);

      const statusSelect = screen.getByRole("combobox");

      // Rapid changes
      fireEvent.change(statusSelect, { target: { value: "replied" } });
      fireEvent.change(statusSelect, { target: { value: "ignored" } });
      fireEvent.change(statusSelect, { target: { value: "new" } });

      await waitFor(() => {
        // Should only call with the last value
        expect(mockOnStatusUpdate).toHaveBeenLastCalledWith("1", ContactRequestStatus.NEW);
      });
    });

    test("should render responsive classes correctly", () => {
      const { container } = render(<ContactRequestCard {...defaultProps} />);

      // Check for mobile-first responsive classes
      const cardContainer = container.querySelector(".rounded-xl.sm\\:rounded-2xl");
      expect(cardContainer).toBeInTheDocument();

      const padding = container.querySelector(".p-4.sm\\:p-6");
      expect(padding).toBeInTheDocument();
    });

    test("should handle missing contact detail gracefully", () => {
      const requestWithoutDetail = {
        ...mockContactRequest,
        contact_detail: "",
      };

      render(<ContactRequestCard {...defaultProps} contactRequest={requestWithoutDetail} />);

      // Should still render without errors
      expect(screen.getByText("Email")).toBeInTheDocument();
    });

    test("should apply correct hover styles", () => {
      const { container } = render(<ContactRequestCard {...defaultProps} />);

      const card = container.querySelector(".hover\\:shadow-md");
      expect(card).toBeInTheDocument();
    });

    test("should handle dark mode classes", () => {
      const { container } = render(<ContactRequestCard {...defaultProps} />);

      const darkModeElements = container.querySelectorAll("[class*='dark:']");
      expect(darkModeElements.length).toBeGreaterThan(0);
    });
  });
});
