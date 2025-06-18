import React, { useState } from "react";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { cn } from "@/helper/tw.helper";
import { Toast } from "@/ui/Toast.ui";
import { ContactRequestContent } from "./ContactRequestContent.component";
import { ContactRequestContactInfo } from "./ContactRequestContactInfo.component";
import { ContactRequestNotes } from "./ContactRequestNotes.component";

interface ContactRequestCardProps {
  contactRequest: ContactRequest;
  onStatusUpdate?: (id: string, status: ContactRequestStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => void;
  className?: string;
}

export const ContactRequestCard: React.FC<ContactRequestCardProps> = ({
  contactRequest,
  onStatusUpdate,
  onNotesUpdate,
  className,
}) => {
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [currentStatus, setCurrentStatus] = useState(contactRequest.status);

  // Handle status change
  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as ContactRequestStatus;
    const previousStatus = currentStatus;

    setIsUpdatingStatus(true);
    setCurrentStatus(newStatus); // Optimistic update

    try {
      if (onStatusUpdate) {
        await onStatusUpdate(contactRequest.id, newStatus);
        Toast.success({
          title: "Status updated",
          description: `Contact request marked as ${newStatus.toLowerCase()}`,
        });
      }
    } catch (error) {
      console.error("Failed to update status:", error);
      // Revert on error
      setCurrentStatus(previousStatus);
      Toast.error({
        title: "Failed to update status",
        description: "Please try again or contact support if the problem persists.",
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Get relative time
  const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return `${Math.floor(diffInDays / 7)}w ago`;
  };

  return (
    <div className={cn("group relative mb-4 sm:mb-6", className)}>
      {/* Enhanced Card Container with Mobile-First Design */}
      <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700 overflow-hidden">
        {/* Status Indicator Bar */}
        <div
          className={cn(
            "h-1 w-full transition-all duration-300",
            currentStatus === ContactRequestStatus.NEW &&
              "bg-gradient-to-r from-blue-500 to-blue-600",
            currentStatus === ContactRequestStatus.REPLIED &&
              "bg-gradient-to-r from-emerald-500 to-emerald-600",
            currentStatus === ContactRequestStatus.IGNORED &&
              "bg-gradient-to-r from-gray-400 to-gray-500"
          )}
        />

        {/* Card Content with Mobile-Optimized Spacing */}
        <div className="p-4 space-y-4 sm:p-6 sm:space-y-6">
          {/* Header Section */}

          {/* Content Section */}
          <ContactRequestContent contactRequest={contactRequest} />

          {/* Contact Information Section */}
          <ContactRequestContactInfo contactRequest={contactRequest} />

          {/* Notes Section */}
          <ContactRequestNotes contactRequest={contactRequest} onNotesUpdate={onNotesUpdate} />
        </div>
      </div>
    </div>
  );
};
