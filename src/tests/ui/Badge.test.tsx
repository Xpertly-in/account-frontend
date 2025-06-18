import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { Badge } from "@/ui/Badge.ui";
import {
  getBadgeVariantForUrgency,
  getBadgeVariantForContactPreference,
  getBadgeVariantForStatus,
  UrgencyLevel,
  ContactPreference,
} from "@/types/common.type";

describe("Badge Component", () => {
  describe("Core Variants", () => {
    test("renders default variant correctly", () => {
      render(<Badge>Default Badge</Badge>);
      const badge = screen.getByText("Default Badge");
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveClass("bg-primary");
    });

    test("renders secondary variant correctly", () => {
      render(<Badge variant="secondary">Secondary Badge</Badge>);
      const badge = screen.getByText("Secondary Badge");
      expect(badge).toHaveClass("bg-secondary");
    });

    test("renders destructive variant correctly", () => {
      render(<Badge variant="destructive">Destructive Badge</Badge>);
      const badge = screen.getByText("Destructive Badge");
      expect(badge).toHaveClass("bg-destructive");
    });

    test("renders outline variant correctly", () => {
      render(<Badge variant="outline">Outline Badge</Badge>);
      const badge = screen.getByText("Outline Badge");
      expect(badge).toHaveClass("text-foreground");
    });
  });

  describe("Urgency Variants", () => {
    test("renders urgent variant correctly", () => {
      render(<Badge variant="urgent">Urgent</Badge>);
      const badge = screen.getByText("Urgent");
      expect(badge).toHaveClass("bg-red-500");
    });

    test("renders high urgency variant correctly", () => {
      render(<Badge variant="high">High Priority</Badge>);
      const badge = screen.getByText("High Priority");
      expect(badge).toHaveClass("bg-orange-500");
    });

    test("renders medium urgency variant correctly", () => {
      render(<Badge variant="medium">Medium Priority</Badge>);
      const badge = screen.getByText("Medium Priority");
      expect(badge).toHaveClass("bg-yellow-500");
    });

    test("renders low urgency variant correctly", () => {
      render(<Badge variant="low">Low Priority</Badge>);
      const badge = screen.getByText("Low Priority");
      expect(badge).toHaveClass("bg-green-500");
    });
  });

  describe("Status Variants", () => {
    test("renders new status variant correctly", () => {
      render(<Badge variant="new">New</Badge>);
      const badge = screen.getByText("New");
      expect(badge).toHaveClass("bg-blue-500");
    });

    test("renders replied status variant correctly", () => {
      render(<Badge variant="replied">Replied</Badge>);
      const badge = screen.getByText("Replied");
      expect(badge).toHaveClass("bg-emerald-500");
    });

    test("renders ignored status variant correctly", () => {
      render(<Badge variant="ignored">Ignored</Badge>);
      const badge = screen.getByText("Ignored");
      expect(badge).toHaveClass("bg-gray-500");
    });

    test("renders contacted status variant correctly", () => {
      render(<Badge variant="contacted">Contacted</Badge>);
      const badge = screen.getByText("Contacted");
      expect(badge).toHaveClass("bg-purple-500");
    });

    test("renders closed status variant correctly", () => {
      render(<Badge variant="closed">Closed</Badge>);
      const badge = screen.getByText("Closed");
      expect(badge).toHaveClass("bg-slate-500");
    });

    test("renders archived status variant correctly", () => {
      render(<Badge variant="archived">Archived</Badge>);
      const badge = screen.getByText("Archived");
      expect(badge).toHaveClass("bg-amber-500");
    });
  });

  describe("Contact Preference Variants", () => {
    test("renders phone variant correctly", () => {
      render(<Badge variant="phone">Phone</Badge>);
      const badge = screen.getByText("Phone");
      expect(badge).toHaveClass("bg-indigo-100");
    });

    test("renders email variant correctly", () => {
      render(<Badge variant="email">Email</Badge>);
      const badge = screen.getByText("Email");
      expect(badge).toHaveClass("bg-cyan-100");
    });

    test("renders whatsapp variant correctly", () => {
      render(<Badge variant="whatsapp">WhatsApp</Badge>);
      const badge = screen.getByText("WhatsApp");
      expect(badge).toHaveClass("bg-emerald-100");
    });
  });

  describe("Helper Functions", () => {
    test("getBadgeVariantForUrgency maps correctly", () => {
      expect(getBadgeVariantForUrgency(UrgencyLevel.IMMEDIATELY)).toBe("urgent");
      expect(getBadgeVariantForUrgency(UrgencyLevel.WITHIN_A_WEEK)).toBe("high");
      expect(getBadgeVariantForUrgency(UrgencyLevel.THIS_MONTH)).toBe("medium");
      expect(getBadgeVariantForUrgency(UrgencyLevel.FLEXIBLE)).toBe("low");
    });

    test("getBadgeVariantForContactPreference maps correctly", () => {
      expect(getBadgeVariantForContactPreference(ContactPreference.PHONE)).toBe("phone");
      expect(getBadgeVariantForContactPreference(ContactPreference.EMAIL)).toBe("email");
      expect(getBadgeVariantForContactPreference(ContactPreference.WHATSAPP)).toBe("whatsapp");
    });

    test("getBadgeVariantForStatus maps correctly", () => {
      expect(getBadgeVariantForStatus("new")).toBe("new");
      expect(getBadgeVariantForStatus("NEW")).toBe("new"); // Case insensitive
      expect(getBadgeVariantForStatus("replied")).toBe("replied");
      expect(getBadgeVariantForStatus("ignored")).toBe("ignored");
      expect(getBadgeVariantForStatus("contacted")).toBe("contacted");
      expect(getBadgeVariantForStatus("closed")).toBe("closed");
      expect(getBadgeVariantForStatus("archived")).toBe("archived");
      expect(getBadgeVariantForStatus("unknown")).toBe("default");
    });
  });

  describe("Integration with Helper Functions", () => {
    test("renders urgency badge using helper function", () => {
      const variant = getBadgeVariantForUrgency(UrgencyLevel.IMMEDIATELY);
      render(<Badge variant={variant}>Immediately</Badge>);
      const badge = screen.getByText("Immediately");
      expect(badge).toHaveClass("bg-red-500");
    });

    test("renders contact preference badge using helper function", () => {
      const variant = getBadgeVariantForContactPreference(ContactPreference.PHONE);
      render(<Badge variant={variant}>Phone</Badge>);
      const badge = screen.getByText("Phone");
      expect(badge).toHaveClass("bg-indigo-100");
    });

    test("renders status badge using helper function", () => {
      const variant = getBadgeVariantForStatus("new");
      render(<Badge variant={variant}>New</Badge>);
      const badge = screen.getByText("New");
      expect(badge).toHaveClass("bg-blue-500");
    });
  });

  describe("Accessibility", () => {
    test("supports custom className", () => {
      render(<Badge className="custom-class">Test</Badge>);
      const badge = screen.getByText("Test");
      expect(badge).toHaveClass("custom-class");
    });

    test("supports additional props", () => {
      render(<Badge data-testid="test-badge">Test</Badge>);
      const badge = screen.getByTestId("test-badge");
      expect(badge).toBeInTheDocument();
    });
  });
});
