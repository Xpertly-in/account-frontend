import React from "react";
import { Phone, EnvelopeSimple, WhatsappLogo } from "@phosphor-icons/react";
import { ContactRequest } from "@/types/dashboard/contact-request.type";
import { ContactPreference } from "@/types/common.type";

interface ContactRequestContactInfoProps {
  contactRequest: ContactRequest;
}

export const ContactRequestContactInfo: React.FC<ContactRequestContactInfoProps> = ({
  contactRequest,
}) => {
  // Helper to get contact preference icon
  const getContactPreferenceIcon = (preference: ContactPreference) => {
    switch (preference) {
      case ContactPreference.PHONE:
        return <Phone className="h-3 w-3 sm:h-4 sm:w-4" weight="bold" />;
      case ContactPreference.EMAIL:
        return <EnvelopeSimple className="h-3 w-3 sm:h-4 sm:w-4" weight="bold" />;
      case ContactPreference.WHATSAPP:
        return <WhatsappLogo className="h-3 w-3 sm:h-4 sm:w-4" weight="bold" />;
      default:
        return <EnvelopeSimple className="h-3 w-3 sm:h-4 sm:w-4" weight="bold" />;
    }
  };

  return (
    <div className="space-y-2 sm:space-y-4">
      {/* Enhanced Section Header - Mobile Optimized */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-200/30 dark:border-purple-700/30">
          {getContactPreferenceIcon(contactRequest.contact_preference as ContactPreference)}
        </div>
        <span className="text-sm sm:text-base font-semibold text-gray-900 dark:text-white">
          Contact Method
        </span>
      </div>

      {/* Enhanced Contact Details - Mobile Optimized */}
      <div className="flex items-center gap-3 sm:gap-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-purple-200/40 dark:border-purple-700/40">
        <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-lg sm:rounded-xl bg-purple-100 dark:bg-purple-800/50 border border-purple-200/50 dark:border-purple-600/50">
          {getContactPreferenceIcon(contactRequest.contact_preference as ContactPreference)}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-300 mb-0.5 sm:mb-1">
            {contactRequest.contact_preference}
          </p>
          <p className="text-xs sm:text-sm text-purple-600 dark:text-purple-400 truncate font-medium">
            {contactRequest.contact_detail}
          </p>
        </div>
      </div>
    </div>
  );
};
