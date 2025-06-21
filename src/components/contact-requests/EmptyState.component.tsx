import React from "react";
import { ChatCenteredText } from "@phosphor-icons/react";

interface ContactRequestEmptyStateProps {
  searchTerm?: string;
  hasActiveFilters?: boolean;
  className?: string;
}

export const ContactRequestEmptyState: React.FC<ContactRequestEmptyStateProps> = ({
  searchTerm,
  hasActiveFilters = false,
  className,
}) => {
  const getEmptyStateContent = () => {
    if (searchTerm || hasActiveFilters) {
      return {
        title: "No contact requests found",
        description: "Try adjusting your search or filters to find what you're looking for.",
        icon: (
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" className="h-12 w-12">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        ),
      };
    }

    return {
      title: "No contact requests yet",
      description:
        "When customers reach out to you, their requests will appear here. You'll be able to manage and respond to all inquiries from this dashboard.",
      icon: <ChatCenteredText className="h-12 w-12" />,
    };
  };

  const { title, description, icon } = getEmptyStateContent();

  return (
    <div className={`text-center py-12 ${className || ""}`}>
      <div className="mx-auto max-w-md">
        <div className="mx-auto text-gray-400 dark:text-gray-500 mb-4">{icon}</div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{description}</p>
        {searchTerm && (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
            Searched for: "{searchTerm}"
          </p>
        )}
      </div>
    </div>
  );
};
