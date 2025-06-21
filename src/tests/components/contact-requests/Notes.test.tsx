import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { ContactRequestNotes } from "@/components/contact-requests/Notes.component";
import { Toast } from "@/ui/Toast.ui";
import { ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { UrgencyLevel, ContactPreference } from "@/types/common.type";

// Mock Phosphor Icons
jest.mock("@phosphor-icons/react", () => ({
  NotePencil: ({ className }: { className?: string }) => (
    <div data-testid="note-pencil-icon" className={className} />
  ),
  CheckCircle: ({ className }: { className?: string }) => (
    <div data-testid="check-circle-icon" className={className} />
  ),
}));

// Mock the Toast component
jest.mock("@/ui/Toast.ui", () => ({
  Toast: {
    success: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
  },
}));

const mockContactRequest = {
  id: "test-request-1",
  ca_id: "ca-123",
  customer_name: "John Doe",
  customer_email: "john@example.com",
  customer_phone: "+1234567890",
  subject: "Test Subject",
  message: "Test message",
  service_needed: "GST",
  urgency: UrgencyLevel.WITHIN_A_WEEK,
  contact_preference: ContactPreference.EMAIL,
  contact_detail: "john@example.com",
  status: ContactRequestStatus.NEW,
  ca_private_notes: "Initial notes content",
  created_at: "2024-01-15T10:00:00Z",
  updated_at: "2024-01-15T10:00:00Z",
};

const defaultProps = {
  contactRequest: mockContactRequest,
  onNotesUpdate: jest.fn(),
};

describe("ContactRequestNotes", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("RED PHASE - Basic Rendering", () => {
    it("renders notes section with initial content", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      expect(screen.getByText("Private Notes")).toBeInTheDocument();
      expect(screen.getByText("Initial notes content")).toBeInTheDocument();
      expect(screen.getByText("Only visible to you")).toBeInTheDocument();
    });

    it("renders edit button when not in edit mode", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      // There are two pencil icons - one in header, one in button
      const pencilIcons = screen.getAllByTestId("note-pencil-icon");
      expect(pencilIcons).toHaveLength(2);
      expect(screen.getByRole("button", { name: /edit/i })).toBeInTheDocument();
    });

    it("renders empty state when no initial notes", () => {
      const emptyContactRequest = { ...mockContactRequest, ca_private_notes: "" };
      render(<ContactRequestNotes {...defaultProps} contactRequest={emptyContactRequest} />);

      expect(screen.getByText("No private notes yet")).toBeInTheDocument();
      expect(screen.getByText("Add confidential notes that only you can see")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /add/i })).toBeInTheDocument();
    });

    it("applies correct styling to notes container", () => {
      const { container } = render(<ContactRequestNotes {...defaultProps} />);

      const notesContainer = container.querySelector(".border-t");
      expect(notesContainer).toHaveClass("border-gray-200");
      expect(notesContainer).toHaveClass("dark:border-gray-700");
      expect(notesContainer).toHaveClass("pt-4");
      expect(notesContainer).toHaveClass("sm:pt-6");
    });
  });

  describe("GREEN PHASE - Functionality", () => {
    it("enters edit mode when edit button is clicked", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      expect(screen.getByRole("textbox")).toBeInTheDocument();
      expect(screen.getByTestId("check-circle-icon")).toBeInTheDocument();
      expect(screen.getByText("Cancel")).toBeInTheDocument();
    });

    it("shows textarea with current notes when editing", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("Initial notes content");
    });

    it("saves notes when save button is clicked", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(onNotesUpdate).toHaveBeenCalledWith("test-request-1", "Updated notes content");
      });
    });

    it("exits edit mode after successful save", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      });
    });

    it("cancels edit mode when cancel button is clicked", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Changed content" } });

      const cancelButton = screen.getByText("Cancel");
      fireEvent.click(cancelButton);

      expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      expect(screen.getByText("Initial notes content")).toBeInTheDocument();
    });

    it("shows success toast after successful save", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Change the notes content to trigger an update
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(Toast.success).toHaveBeenCalledWith({
          title: "Private note updated",
          description: "Your changes have been saved successfully.",
        });
      });
    });
  });

  describe("REFACTOR PHASE - Error Handling", () => {
    it("shows error toast when save fails", async () => {
      const onNotesUpdate = jest.fn().mockRejectedValue(new Error("Save failed"));
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Change the notes content to trigger an update
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(Toast.error).toHaveBeenCalledWith({
          title: "Failed to save note",
          description: "Please try again or contact support if the problem persists.",
        });
      });
    });

    it("remains in edit mode when save fails", async () => {
      const onNotesUpdate = jest.fn().mockRejectedValue(new Error("Save failed"));
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Change the notes content to trigger an update
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      // The component should remain in edit mode when save fails
      await waitFor(() => {
        expect(Toast.error).toHaveBeenCalled();
      });

      // Check that we're still in edit mode
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });
  });

  describe("Loading States", () => {
    it("disables save button when saving", async () => {
      const onNotesUpdate = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Change the notes content to trigger an update
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen
        .getByTestId("check-circle-icon")
        .closest("button") as HTMLButtonElement;
      fireEvent.click(saveButton);

      expect(saveButton).toBeDisabled();
    });

    it("disables cancel button when saving", async () => {
      const onNotesUpdate = jest.fn(() => new Promise(resolve => setTimeout(resolve, 100)));
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Change the notes content to trigger an update
      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "Updated notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      const cancelButton = screen.getByText("Cancel").closest("button") as HTMLButtonElement;
      expect(cancelButton).toBeDisabled();
    });
  });

  describe("Textarea Behavior", () => {
    it("applies correct styling to textarea", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveClass("min-h-[80px]");
      expect(textarea).toHaveClass("sm:min-h-[100px]");
    });

    it("handles empty textarea content", () => {
      const emptyContactRequest = { ...mockContactRequest, ca_private_notes: "" };
      render(<ContactRequestNotes {...defaultProps} contactRequest={emptyContactRequest} />);

      const editButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveValue("");
    });

    it("shows placeholder text", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      expect(textarea).toHaveAttribute(
        "placeholder",
        "Add private notes... (Only you can see this)"
      );
    });
  });

  describe("Edge Cases", () => {
    it("handles very long notes content", () => {
      const longNotes = "A".repeat(1000);
      const longNotesRequest = { ...mockContactRequest, ca_private_notes: longNotes };
      render(<ContactRequestNotes {...defaultProps} contactRequest={longNotesRequest} />);

      expect(screen.getByText(longNotes)).toBeInTheDocument();
    });

    it("trims whitespace from saved notes", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "  Trimmed notes  " } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(onNotesUpdate).toHaveBeenCalledWith("test-request-1", "Trimmed notes");
      });
    });

    it("doesn't save if notes haven't changed", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Don't change the textarea content
      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(onNotesUpdate).not.toHaveBeenCalled();
        expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
      });
    });

    it("handles component without onNotesUpdate prop", () => {
      render(<ContactRequestNotes contactRequest={mockContactRequest} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "New notes content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      // Should not crash and should remain in edit mode since save does nothing
      expect(screen.getByRole("textbox")).toBeInTheDocument();
    });

    it("shows 'Private note added' toast when adding note to empty contact request", async () => {
      const emptyContactRequest = { ...mockContactRequest, ca_private_notes: "" };
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(
        <ContactRequestNotes contactRequest={emptyContactRequest} onNotesUpdate={onNotesUpdate} />
      );

      const editButton = screen.getByRole("button", { name: /add/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "New note content" } });

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(Toast.success).toHaveBeenCalledWith({
          title: "Private note added",
          description: "Your confidential note has been saved successfully.",
        });
      });
    });

    it("shows 'Private note removed' toast when deleting existing notes", async () => {
      const onNotesUpdate = jest.fn().mockResolvedValue(undefined);
      render(<ContactRequestNotes {...defaultProps} onNotesUpdate={onNotesUpdate} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      const textarea = screen.getByRole("textbox");
      fireEvent.change(textarea, { target: { value: "   " } }); // Only whitespace, will be trimmed to empty

      const saveButton = screen.getByTestId("check-circle-icon").closest("button");
      fireEvent.click(saveButton!);

      await waitFor(() => {
        expect(Toast.success).toHaveBeenCalledWith({
          title: "Private note removed",
          description: "The note has been deleted successfully.",
        });
      });
    });

    it("doesn't show toast when canceling without changes", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      // Don't change anything, just cancel
      const cancelButton = screen.getByText("Cancel").closest("button");
      fireEvent.click(cancelButton!);

      // Should not show any toast since no changes were made
      expect(Toast.info).not.toHaveBeenCalled();
    });

    it("handles contact request with undefined ca_private_notes", () => {
      const undefinedNotesRequest = { ...mockContactRequest, ca_private_notes: undefined };
      render(<ContactRequestNotes contactRequest={undefinedNotesRequest} />);

      expect(screen.getByText("No private notes yet")).toBeInTheDocument();
      expect(screen.getByText("Add confidential notes that only you can see")).toBeInTheDocument();
    });
  });

  describe("Responsive Design", () => {
    it("applies responsive styling to container", () => {
      const { container } = render(<ContactRequestNotes {...defaultProps} />);

      const notesContainer = container.querySelector(".space-y-3");
      expect(notesContainer).toHaveClass("sm:space-y-4");
    });

    it("maintains proper button sizing on different screens", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      expect(editButton).toHaveClass("h-8");
      expect(editButton).toHaveClass("sm:h-9");
    });
  });

  describe("Privacy Indicators", () => {
    it("shows private note indicators", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      expect(screen.getByText("Only visible to you")).toBeInTheDocument();
      expect(screen.getByText("Private")).toBeInTheDocument();
    });

    it("shows privacy warning in edit mode", () => {
      render(<ContactRequestNotes {...defaultProps} />);

      const editButton = screen.getByRole("button", { name: /edit/i });
      fireEvent.click(editButton);

      expect(screen.getByText("Customer cannot see these notes")).toBeInTheDocument();
    });
  });
});
