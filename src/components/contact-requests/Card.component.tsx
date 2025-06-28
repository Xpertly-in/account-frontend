import React, { useState } from "react";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { cn } from "@/helper/tw.helper";
import { Toast } from "@/ui/Toast.ui";
import { ContactRequestContent } from "./Content.component";
import { ContactRequestContactInfo } from "./ContactInfo.component";
import { ContactRequestNotes } from "./Notes.component";

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
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 mb-1">
                <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white truncate">
                  {contactRequest.customer_name}
                </h3>
                <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  <span>•</span>
                  <span>{getRelativeTime(contactRequest.created_at)}</span>
                </div>
              </div>
              <p className="text-sm sm:text-base font-semibold text-gray-700 dark:text-gray-300 truncate">
                {contactRequest.subject}
              </p>
            </div>
            <div className="flex items-center gap-2 ml-4">
              <select
                value={currentStatus}
                onChange={handleStatusChange}
                disabled={isUpdatingStatus}
                className={cn(
                  "text-xs sm:text-sm font-medium rounded-lg border px-2 py-1 sm:px-3 sm:py-1.5 transition-colors",
                  currentStatus === ContactRequestStatus.NEW &&
                    "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900/20 dark:border-blue-700 dark:text-blue-300",
                  currentStatus === ContactRequestStatus.REPLIED &&
                    "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-700 dark:text-emerald-300",
                  currentStatus === ContactRequestStatus.IGNORED &&
                    "bg-gray-50 border-gray-200 text-gray-700 dark:bg-gray-900/20 dark:border-gray-700 dark:text-gray-300"
                )}
              >
                <option value={ContactRequestStatus.NEW}>New</option>
                <option value={ContactRequestStatus.REPLIED}>Replied</option>
                <option value={ContactRequestStatus.IGNORED}>Ignored</option>
              </select>
            </div>
          </div>

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
