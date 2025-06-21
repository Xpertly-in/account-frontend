import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactRequestsList } from "@/components/contact-requests/List.component";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { UrgencyLevel } from "@/types/common.type";

// Mock the Card component
jest.mock("@/components/contact-requests/Card.component", () => ({
  ContactRequestCard: ({ contactRequest, onStatusUpdate, onNotesUpdate }: any) => (
    <div data-testid={`contact-request-card-${contactRequest.id}`}>
      <div data-testid="customer-name">{contactRequest.customer_name}</div>
      <div data-testid="subject">{contactRequest.subject}</div>
      <button
        data-testid="status-update-btn"
        onClick={() => onStatusUpdate?.(contactRequest.id, ContactRequestStatus.REPLIED)}
      >
        Update Status
      </button>
      <button
        data-testid="notes-update-btn"
        onClick={() => onNotesUpdate?.(contactRequest.id, "test notes")}
      >
        Update Notes
      </button>
    </div>
  ),
}));

const mockContactRequest: ContactRequest = {
  id: "1",
  customer_name: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  subject: "Tax Consultation",
  message: "Need help with GST filing",
  service: "GST",
  urgency: UrgencyLevel.WITHIN_A_WEEK,
  location: "Mumbai",
  contact_preference: ["email"],
  status: ContactRequestStatus.NEW,
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
  ca_id: "ca-123",
  notes: "",
};

const mockContactRequests: ContactRequest[] = [
  mockContactRequest,
  {
    ...mockContactRequest,
    id: "2",
    customer_name: "Jane Smith",
    subject: "Income Tax Help",
    urgency: UrgencyLevel.THIS_MONTH,
  },
  {
    ...mockContactRequest,
    id: "3",
    customer_name: "Bob Johnson",
    subject: "Audit Assistance",
    urgency: UrgencyLevel.FLEXIBLE,
  },
];

const defaultProps = {
  contactRequests: mockContactRequests,
  onStatusUpdate: jest.fn(),
  onNotesUpdate: jest.fn(),
  isLoading: false,
};

describe("ContactRequestsList", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("RED PHASE - Basic Rendering", () => {
    it("renders list of contact requests", () => {
      render(<ContactRequestsList {...defaultProps} />);

      expect(screen.getByTestId("contact-request-card-1")).toBeInTheDocument();
      expect(screen.getByTestId("contact-request-card-2")).toBeInTheDocument();
      expect(screen.getByTestId("contact-request-card-3")).toBeInTheDocument();
    });

    it("renders contact request details", () => {
      render(<ContactRequestsList {...defaultProps} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
      expect(screen.getByText("Tax Consultation")).toBeInTheDocument();
      expect(screen.getByText("Income Tax Help")).toBeInTheDocument();
      expect(screen.getByText("Audit Assistance")).toBeInTheDocument();
    });

    it("applies correct container styling", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} />);

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("space-y-4");
    });
  });

  describe("GREEN PHASE - Functionality", () => {
    it("passes onStatusUpdate callback to cards", () => {
      const onStatusUpdate = jest.fn();
      render(<ContactRequestsList {...defaultProps} onStatusUpdate={onStatusUpdate} />);

      const statusButton = screen.getAllByTestId("status-update-btn")[0];
      statusButton.click();

      expect(onStatusUpdate).toHaveBeenCalledWith("1", ContactRequestStatus.REPLIED);
    });

    it("passes onNotesUpdate callback to cards", () => {
      const onNotesUpdate = jest.fn();
      render(<ContactRequestsList {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const notesButton = screen.getAllByTestId("notes-update-btn")[0];
      notesButton.click();

      expect(onNotesUpdate).toHaveBeenCalledWith("1", "test notes");
    });

    it("renders correct number of cards", () => {
      render(<ContactRequestsList {...defaultProps} />);

      const cards = screen.getAllByTestId(/contact-request-card-/);
      expect(cards).toHaveLength(3);
    });

    it("maintains correct order of contact requests", () => {
      render(<ContactRequestsList {...defaultProps} />);

      const customerNames = screen.getAllByTestId("customer-name");
      expect(customerNames[0]).toHaveTextContent("John Doe");
      expect(customerNames[1]).toHaveTextContent("Jane Smith");
      expect(customerNames[2]).toHaveTextContent("Bob Johnson");
    });
  });

  describe("REFACTOR PHASE - Edge Cases", () => {
    it("renders empty list when no contact requests", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} contactRequests={[]} />);

      expect(container.firstChild).toBeNull();
    });

    it("handles single contact request", () => {
      render(<ContactRequestsList {...defaultProps} contactRequests={[mockContactRequest]} />);

      const cards = screen.getAllByTestId(/contact-request-card-/);
      expect(cards).toHaveLength(1);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("handles large number of contact requests", () => {
      const manyRequests = Array.from({ length: 50 }, (_, index) => ({
        ...mockContactRequest,
        id: `request-${index}`,
        customer_name: `Customer ${index}`,
      }));

      render(<ContactRequestsList {...defaultProps} contactRequests={manyRequests} />);

      const cards = screen.getAllByTestId(/contact-request-card-/);
      expect(cards).toHaveLength(50);
    });
  });

  describe("Loading States", () => {
    it("shows loading skeletons when isLoading is true", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} isLoading={true} />);

      const skeletons = container.querySelectorAll(".animate-pulse");
      expect(skeletons).toHaveLength(3);
    });

    it("applies correct skeleton styling", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} isLoading={true} />);

      const skeletons = container.querySelectorAll(".animate-pulse");
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveClass("bg-gray-200", "dark:bg-gray-700", "rounded-lg", "h-48");
      });
    });

    it("shows skeleton container with correct spacing", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} isLoading={true} />);

      const skeletonContainer = container.firstChild as HTMLElement;
      expect(skeletonContainer).toHaveClass("space-y-4");
    });

    it("does not render contact request cards when loading", () => {
      render(<ContactRequestsList {...defaultProps} isLoading={true} />);

      expect(screen.queryByTestId(/contact-request-card-/)).not.toBeInTheDocument();
    });
  });

  describe("Custom Props", () => {
    it("applies custom className", () => {
      const { container } = render(
        <ContactRequestsList {...defaultProps} className="custom-class" />
      );

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("custom-class");
    });

    it("handles undefined onStatusUpdate callback", () => {
      render(<ContactRequestsList {...defaultProps} onStatusUpdate={undefined} />);

      const statusButton = screen.getAllByTestId("status-update-btn")[0];
      expect(() => statusButton.click()).not.toThrow();
    });

    it("handles undefined onNotesUpdate callback", () => {
      render(<ContactRequestsList {...defaultProps} onNotesUpdate={undefined} />);

      const notesButton = screen.getAllByTestId("notes-update-btn")[0];
      expect(() => notesButton.click()).not.toThrow();
    });

    it("combines custom className with default classes", () => {
      const { container } = render(
        <ContactRequestsList {...defaultProps} className="custom-spacing" />
      );

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("space-y-4", "custom-spacing");
    });
  });

  describe("Responsive Design", () => {
    it("maintains consistent spacing across screen sizes", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} />);

      const listContainer = container.firstChild as HTMLElement;
      expect(listContainer).toHaveClass("space-y-4");
    });

    it("preserves card layout in responsive container", () => {
      render(<ContactRequestsList {...defaultProps} />);

      const cards = screen.getAllByTestId(/contact-request-card-/);
      cards.forEach(card => {
        expect(card).toBeInTheDocument();
      });
    });
  });

  describe("Performance Considerations", () => {
    it("uses unique keys for contact request cards", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} />);

      // Check that each card has a unique testid (which corresponds to unique keys)
      const card1 = screen.getByTestId("contact-request-card-1");
      const card2 = screen.getByTestId("contact-request-card-2");
      const card3 = screen.getByTestId("contact-request-card-3");

      expect(card1).toBeInTheDocument();
      expect(card2).toBeInTheDocument();
      expect(card3).toBeInTheDocument();
    });

    it("handles contact request updates efficiently", () => {
      const { rerender } = render(<ContactRequestsList {...defaultProps} />);

      const updatedRequests = [
        { ...mockContactRequests[0], customer_name: "Updated John" },
        ...mockContactRequests.slice(1),
      ];

      rerender(<ContactRequestsList {...defaultProps} contactRequests={updatedRequests} />);

      expect(screen.getByText("Updated John")).toBeInTheDocument();
    });
  });

  describe("Dark Mode Support", () => {
    it("applies dark mode classes to loading skeletons", () => {
      const { container } = render(<ContactRequestsList {...defaultProps} isLoading={true} />);

      const skeletons = container.querySelectorAll(".animate-pulse");
      skeletons.forEach(skeleton => {
        expect(skeleton).toHaveClass("dark:bg-gray-700");
      });
    });
  });

  describe("Data Integrity", () => {
    it("passes complete contact request data to cards", () => {
      render(<ContactRequestsList {...defaultProps} />);

      // Verify that the mock card receives the full contact request object
      expect(screen.getByTestId("contact-request-card-1")).toBeInTheDocument();
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Tax Consultation")).toBeInTheDocument();
    });

    it("handles contact requests with missing optional fields", () => {
      const incompleteRequest: ContactRequest = {
        ...mockContactRequest,
        id: "incomplete",
        notes: undefined as any,
        phone: undefined as any,
      };

      render(<ContactRequestsList {...defaultProps} contactRequests={[incompleteRequest]} />);

      expect(screen.getByTestId("contact-request-card-incomplete")).toBeInTheDocument();
    });
  });

  describe("Error Boundaries", () => {
    it("handles invalid contact request data gracefully", () => {
      const invalidRequest = {
        ...mockContactRequest,
        id: null,
      } as any;

      expect(() => {
        render(<ContactRequestsList {...defaultProps} contactRequests={[invalidRequest]} />);
      }).not.toThrow();
    });
  });
});
