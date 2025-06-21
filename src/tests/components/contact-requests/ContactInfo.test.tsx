/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen } from "@testing-library/react";
import { ContactRequestContactInfo } from "@/components/contact-requests/ContactInfo.component";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { ContactPreference, UrgencyLevel } from "@/types/common.type";

describe("ContactRequestContactInfo Component", () => {
  const mockContactRequest: ContactRequest = {
    id: "1",
    ca_id: "ca-123",
    customer_name: "John Doe",
    customer_email: "john@example.com",
    customer_phone: "+919876543210",
    subject: "Need help with GST Registration",
    message: "I'm starting a new business and need help with GST registration.",
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

  describe("Email Contact Preference", () => {
    test("should render email contact preference with icon and badge", () => {
      render(<ContactRequestContactInfo contactRequest={mockContactRequest} />);

      // Check for email badge
      expect(screen.getByText("Email")).toBeInTheDocument();

      // Check for email address
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
    });

    test("should render email badge with correct styling", () => {
      render(<ContactRequestContactInfo contactRequest={mockContactRequest} />);

      const emailBadge = screen.getByText("Email");
      expect(emailBadge).toHaveClass("text-xs", "sm:text-sm", "font-semibold", "text-purple-700");
    });

    test("should render email icon", () => {
      render(<ContactRequestContactInfo contactRequest={mockContactRequest} />);

      // Check for Contact Method header
      expect(screen.getByText("Contact Method")).toBeInTheDocument();

      // Icons are in the component
      const { container } = render(
        <ContactRequestContactInfo contactRequest={mockContactRequest} />
      );
      const icons = container.querySelectorAll("svg");
      expect(icons.length).toBeGreaterThan(0);
    });
  });

  describe("Phone Contact Preference", () => {
    test("should render phone contact preference with icon and badge", () => {
      const phoneRequest = {
        ...mockContactRequest,
        contact_preference: ContactPreference.PHONE,
        contact_detail: "+919876543210",
      };

      render(<ContactRequestContactInfo contactRequest={phoneRequest} />);

      // Check for phone badge
      expect(screen.getByText("Phone")).toBeInTheDocument();

      // Check for phone number
      expect(screen.getByText("+919876543210")).toBeInTheDocument();
    });

    test("should render phone badge with correct styling", () => {
      const phoneRequest = {
        ...mockContactRequest,
        contact_preference: ContactPreference.PHONE,
        contact_detail: "+919876543210",
      };

      render(<ContactRequestContactInfo contactRequest={phoneRequest} />);

      const phoneBadge = screen.getByText("Phone");
      expect(phoneBadge).toHaveClass("text-xs", "sm:text-sm", "font-semibold", "text-purple-700");
    });
  });

  describe("WhatsApp Contact Preference", () => {
    test("should render WhatsApp contact preference with icon and badge", () => {
      const whatsappRequest = {
        ...mockContactRequest,
        contact_preference: ContactPreference.WHATSAPP,
        contact_detail: "+919876543210",
      };

      render(<ContactRequestContactInfo contactRequest={whatsappRequest} />);

      // Check for WhatsApp badge
      expect(screen.getByText("WhatsApp")).toBeInTheDocument();

      // Check for phone number
      expect(screen.getByText("+919876543210")).toBeInTheDocument();
    });

    test("should render WhatsApp badge with correct styling", () => {
      const whatsappRequest = {
        ...mockContactRequest,
        contact_preference: ContactPreference.WHATSAPP,
        contact_detail: "+919876543210",
      };

      render(<ContactRequestContactInfo contactRequest={whatsappRequest} />);

      const whatsappBadge = screen.getByText("WhatsApp");
      expect(whatsappBadge).toHaveClass(
        "text-xs",
        "sm:text-sm",
        "font-semibold",
        "text-purple-700"
      );
    });
  });

  describe("Contact Details Display", () => {
    test("should render contact detail text with proper styling", () => {
      render(<ContactRequestContactInfo contactRequest={mockContactRequest} />);

      const contactDetail = screen.getByText("john@example.com");
      expect(contactDetail).toHaveClass(
        "text-xs",
        "sm:text-sm",
        "text-purple-600",
        "dark:text-purple-400"
      );
    });

    test("should handle empty contact detail", () => {
      const emptyDetailRequest = {
        ...mockContactRequest,
        contact_detail: "",
      };

      render(<ContactRequestContactInfo contactRequest={emptyDetailRequest} />);

      // Should still render the preference badge
      expect(screen.getByText("Email")).toBeInTheDocument();

      // Should render empty string for contact detail
      const detailElements = screen.getAllByText("");
      expect(detailElements.length).toBeGreaterThan(0);
    });

    test("should handle very long contact details", () => {
      const longEmailRequest = {
        ...mockContactRequest,
        contact_detail: "verylongemailaddress.thatmightcauselayoutissues@example.com",
      };

      render(<ContactRequestContactInfo contactRequest={longEmailRequest} />);

      expect(
        screen.getByText("verylongemailaddress.thatmightcauselayoutissues@example.com")
      ).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    test("should have mobile-first responsive classes", () => {
      const { container } = render(
        <ContactRequestContactInfo contactRequest={mockContactRequest} />
      );

      // Check for responsive gap
      const gapElements = container.querySelectorAll(".gap-2.sm\\:gap-3");
      expect(gapElements.length).toBeGreaterThan(0);

      // Check for responsive padding
      const paddingElements = container.querySelectorAll(".p-3.sm\\:p-4");
      expect(paddingElements.length).toBeGreaterThan(0);

      // Check for responsive text size
      const textElements = container.querySelectorAll(".text-xs.sm\\:text-sm");
      expect(textElements.length).toBeGreaterThan(0);
    });

    test("should render responsive border radius", () => {
      const { container } = render(
        <ContactRequestContactInfo contactRequest={mockContactRequest} />
      );

      const roundedElements = container.querySelectorAll(".rounded-lg.sm\\:rounded-xl");
      expect(roundedElements.length).toBeGreaterThan(0);
    });
  });

  describe("Icon Rendering", () => {
    test("should render correct icon for each contact preference", () => {
      const preferences = [
        { preference: ContactPreference.EMAIL, detail: "test@example.com" },
        { preference: ContactPreference.PHONE, detail: "+919876543210" },
        { preference: ContactPreference.WHATSAPP, detail: "+919876543210" },
      ];

      preferences.forEach(({ preference, detail }) => {
        const { container, rerender } = render(
          <ContactRequestContactInfo
            contactRequest={{
              ...mockContactRequest,
              contact_preference: preference,
              contact_detail: detail,
            }}
          />
        );

        // Each preference should have an icon
        const icon = container.querySelector("svg");
        expect(icon).toBeInTheDocument();

        rerender(<div />);
      });
    });
  });

  describe("Edge Cases", () => {
    test("should handle special characters in contact details", () => {
      const specialCharRequest = {
        ...mockContactRequest,
        contact_detail: "test+special@example.com",
      };

      render(<ContactRequestContactInfo contactRequest={specialCharRequest} />);

      expect(screen.getByText("test+special@example.com")).toBeInTheDocument();
    });

    test("should handle international phone numbers", () => {
      const internationalPhoneRequest = {
        ...mockContactRequest,
        contact_preference: ContactPreference.PHONE,
        contact_detail: "+1-555-123-4567",
      };

      render(<ContactRequestContactInfo contactRequest={internationalPhoneRequest} />);

      expect(screen.getByText("+1-555-123-4567")).toBeInTheDocument();
    });
  });
});
