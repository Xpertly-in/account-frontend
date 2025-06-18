import React from "react";
import { Badge } from "@/ui/Badge.ui";
import { ChatCenteredText, MapPin, Warning } from "@phosphor-icons/react";
import { ContactRequest } from "@/types/dashboard/contact-request.type";
import { UrgencyLevel } from "@/types/common.type";
import { getBadgeVariantForUrgency } from "@/types/common.type";

interface ContactRequestContentProps {
  contactRequest: ContactRequest;
}

export const ContactRequestContent: React.FC<ContactRequestContentProps> = ({ contactRequest }) => {
  return (
    <div className="space-y-3 sm:space-y-5">
      {/* Enhanced Message Section - Mobile Optimized */}
      <div className="space-y-2 sm:space-y-3">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200/30 dark:border-emerald-700/30">
            <ChatCenteredText
              className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 dark:text-emerald-400"
              weight="bold"
            />
          </div>
          <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
            Message
          </span>
        </div>
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-5 border border-gray-200/50 dark:border-gray-600/50">
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {contactRequest.message}
          </p>
        </div>
      </div>

      {/* Enhanced Tags and Info Row - Mobile Optimized */}
      <div className="flex flex-wrap items-center gap-2 sm:gap-3">
        {/* Enhanced Service Tag */}
        {contactRequest.service_needed && (
          <div className="flex items-center gap-1.5 sm:gap-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 border border-blue-200/40 dark:border-blue-700/40">
            <div className="h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-blue-500"></div>
            <span className="text-xs sm:text-sm font-semibold text-blue-700 dark:text-blue-300">
              {contactRequest.service_needed}
            </span>
          </div>
        )}

        {/* Enhanced Urgency Badge */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {contactRequest.urgency === UrgencyLevel.IMMEDIATELY && (
            <Warning className="h-3 w-3 sm:h-4 sm:w-4 text-red-500" weight="bold" />
          )}
          <Badge
            variant={getBadgeVariantForUrgency(contactRequest.urgency as UrgencyLevel)}
            className="text-xs sm:text-sm font-semibold px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-lg sm:rounded-xl"
          >
            {contactRequest.urgency === UrgencyLevel.WITHIN_A_WEEK
              ? "Within a week"
              : contactRequest.urgency === UrgencyLevel.THIS_MONTH
              ? "This month"
              : contactRequest.urgency === UrgencyLevel.IMMEDIATELY
              ? "Urgent"
              : "Flexible"}
          </Badge>
        </div>

        {/* Enhanced Location */}
        {contactRequest.location && (
          <div className="flex items-center gap-1.5 sm:gap-2 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl px-2.5 sm:px-4 py-1.5 sm:py-2.5 border border-gray-200/40 dark:border-gray-600/40">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="text-xs sm:text-sm font-medium">
              {contactRequest.location.city}, {contactRequest.location.state}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
