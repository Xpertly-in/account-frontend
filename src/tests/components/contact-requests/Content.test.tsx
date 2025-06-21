/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { ContactRequestContent } from "@/components/contact-requests/Content.component";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { ContactPreference, UrgencyLevel } from "@/types/common.type";

describe("ContactRequestContent Component", () => {
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

  describe("Message Section", () => {
    test("should render message icon", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      // Check for the Message heading
      expect(screen.getByText("Message")).toBeInTheDocument();

      // Check for SVG icon
      const messageSection = screen.getByText("Message").parentElement;
      expect(messageSection?.querySelector("svg")).toBeInTheDocument();
    });

    test("should render message content", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      expect(screen.getByText(/I'm starting a new business/)).toBeInTheDocument();
    });

    test("should render message with proper styling", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      const messageText = screen.getByText(/I'm starting a new business/);
      expect(messageText).toHaveClass("text-sm", "text-gray-700", "dark:text-gray-300");
    });
  });

  describe("Service Tag", () => {
    test("should render service tag when service_needed is provided", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      expect(screen.getByText("GST Services")).toBeInTheDocument();
    });

    test("should not render service tag when service_needed is null", () => {
      const requestWithoutService = {
        ...mockContactRequest,
        service_needed: undefined,
      };

      render(<ContactRequestContent contactRequest={requestWithoutService} />);

      expect(screen.queryByText("GST Services")).not.toBeInTheDocument();
    });

    test("should render service tag with proper styling", () => {
      const { container } = render(<ContactRequestContent contactRequest={mockContactRequest} />);

      const serviceTag = screen.getByText("GST Services").parentElement;
      expect(serviceTag).toHaveClass("bg-blue-50", "dark:bg-blue-900/20");

      // Check for the blue dot indicator
      const blueDot = serviceTag?.querySelector(".bg-blue-500");
      expect(blueDot).toBeInTheDocument();
    });
  });

  describe("Urgency Badge", () => {
    test("should render urgency badge with correct text and variant", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      const urgencyBadge = screen.getByText("Within a week");
      expect(urgencyBadge).toBeInTheDocument();
      expect(urgencyBadge).toHaveClass("bg-orange-100"); // high variant
    });

    test("should render warning icon for urgent requests", () => {
      const urgentRequest = {
        ...mockContactRequest,
        urgency: UrgencyLevel.IMMEDIATELY,
      };

      render(<ContactRequestContent contactRequest={urgentRequest} />);

      // Check for Urgent text
      expect(screen.getByText("Urgent")).toBeInTheDocument();

      // Check for warning icon
      const urgencySection = screen.getByText("Urgent").parentElement;
      expect(urgencySection?.querySelector("svg")).toBeInTheDocument();
    });

    test("should render different urgency levels correctly", () => {
      const urgencyTests = [
        { urgency: UrgencyLevel.IMMEDIATELY, text: "Urgent", hasIcon: true },
        { urgency: UrgencyLevel.WITHIN_A_WEEK, text: "Within a week", hasIcon: false },
        { urgency: UrgencyLevel.THIS_MONTH, text: "This month", hasIcon: false },
        { urgency: UrgencyLevel.FLEXIBLE, text: "Flexible", hasIcon: false },
      ];

      urgencyTests.forEach(({ urgency, text, hasIcon }) => {
        const { rerender } = render(
          <ContactRequestContent contactRequest={{ ...mockContactRequest, urgency }} />
        );

        expect(screen.getByText(text)).toBeInTheDocument();

        const urgencySection = screen.getByText(text).parentElement;
        if (hasIcon) {
          expect(urgencySection?.querySelector("svg")).toBeInTheDocument();
        } else {
          expect(urgencySection?.querySelector("svg")).not.toBeInTheDocument();
        }

        rerender(<div />);
      });
    });
  });

  describe("Location", () => {
    test("should render location when provided", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      expect(screen.getByText("Mumbai, Maharashtra")).toBeInTheDocument();
    });

    test("should render location icon", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      const locationElement = screen.getByText("Mumbai, Maharashtra");
      const locationContainer = locationElement.parentElement;
      expect(locationContainer?.querySelector("svg")).toBeInTheDocument();
    });

    test("should not render location when not provided", () => {
      const requestWithoutLocation = {
        ...mockContactRequest,
        location: undefined,
      };

      render(<ContactRequestContent contactRequest={requestWithoutLocation} />);

      expect(screen.queryByText(/Mumbai/)).not.toBeInTheDocument();
    });

    test("should render location with proper styling", () => {
      render(<ContactRequestContent contactRequest={mockContactRequest} />);

      const locationElement = screen.getByText("Mumbai, Maharashtra").parentElement;
      expect(locationElement).toHaveClass("bg-gray-50", "dark:bg-gray-800/50");
    });
  });

  describe("Responsive Design", () => {
    test("should have mobile-first responsive classes", () => {
      const { container } = render(<ContactRequestContent contactRequest={mockContactRequest} />);

      // Check for responsive spacing
      const spacingElements = container.querySelectorAll(".space-y-3.sm\\:space-y-5");
      expect(spacingElements.length).toBeGreaterThan(0);

      // Check for responsive gap
      const gapElements = container.querySelectorAll(".gap-2.sm\\:gap-3");
      expect(gapElements.length).toBeGreaterThan(0);

      // Check for responsive padding
      const paddingElements = container.querySelectorAll(".p-3.sm\\:p-5");
      expect(paddingElements.length).toBeGreaterThan(0);
    });

    test("should have responsive text sizes", () => {
      const { container } = render(<ContactRequestContent contactRequest={mockContactRequest} />);

      // Check for responsive text
      const textElements = container.querySelectorAll(".text-sm.sm\\:text-base");
      expect(textElements.length).toBeGreaterThan(0);

      // Check for responsive badge text
      const badgeTextElements = container.querySelectorAll(".text-xs.sm\\:text-sm");
      expect(badgeTextElements.length).toBeGreaterThan(0);
    });
  });

  describe("Edge Cases", () => {
    test("should handle very long messages", () => {
      const longMessageRequest = {
        ...mockContactRequest,
        message:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
      };

      render(<ContactRequestContent contactRequest={longMessageRequest} />);

      expect(screen.getByText(/Lorem ipsum dolor sit amet/)).toBeInTheDocument();
    });

    test("should handle empty message", () => {
      const emptyMessageRequest = {
        ...mockContactRequest,
        message: "",
      };

      render(<ContactRequestContent contactRequest={emptyMessageRequest} />);

      // Message section should still render, just empty
      expect(screen.getByText("Message")).toBeInTheDocument();
    });

    test("should handle all optional fields missing", () => {
      const minimalRequest: ContactRequest = {
        ...mockContactRequest,
        service_needed: undefined,
        location: undefined,
      };

      render(<ContactRequestContent contactRequest={minimalRequest} />);

      // Should still render message and urgency
      expect(screen.getByText("Message")).toBeInTheDocument();
      expect(screen.getByText("Within a week")).toBeInTheDocument();

      // Should not render optional fields
      expect(screen.queryByText("GST Services")).not.toBeInTheDocument();
      expect(screen.queryByText(/Mumbai/)).not.toBeInTheDocument();
    });
  });
});
