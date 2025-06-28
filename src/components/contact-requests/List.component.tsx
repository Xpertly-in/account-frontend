import React from "react";
import { ContactRequest, ContactRequestStatus } from "@/types/dashboard/contact-request.type";
import { ContactRequestCard } from "./Card.component";

interface ContactRequestsListProps {
  contactRequests: ContactRequest[];
  onStatusUpdate?: (id: string, status: ContactRequestStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => void;
  isLoading?: boolean;
  className?: string;
}

export const ContactRequestsList: React.FC<ContactRequestsListProps> = ({
  contactRequests,
  onStatusUpdate,
  onNotesUpdate,
  isLoading = false,
  className,
}) => {
  if (isLoading) {
    return (
      <div className={`space-y-4 ${className || ""}`}>
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-48" />
        ))}
      </div>
    );
  }

  if (contactRequests.length === 0) {
    return null; // Let parent handle empty state
  }

  return (
    <div className={`space-y-4 ${className || ""}`}>
      {contactRequests.map(contactRequest => (
        <ContactRequestCard
          key={contactRequest.id}
          contactRequest={contactRequest}
          onStatusUpdate={onStatusUpdate}
          onNotesUpdate={onNotesUpdate}
        />
      ))}
    </div>
  );
};
