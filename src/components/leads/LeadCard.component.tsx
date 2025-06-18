import { useState, useEffect } from "react";
import { Lead } from "@/types/dashboard/lead.type";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import { useCreateEngagement, useHideLead } from "@/services/leads.service";
import { useAuth } from "@/store/context/Auth.provider";
import { Avatar } from "@/ui/Avatar.ui";
import {
  getBadgeVariantForUrgency,
  getBadgeVariantForContactPreference,
  getBadgeVariantForStatus,
  UrgencyLevel,
  ContactPreference,
} from "@/types/common.type";

interface LeadCardProps {
  lead: Lead;
  onLeadUpdate?: () => void; // Callback to refresh leads data
}

export const LeadCard = ({ lead, onLeadUpdate }: LeadCardProps) => {
  const { auth } = useAuth();
  const { createEngagement, isLoading: isCreatingEngagement } = useCreateEngagement();
  const { hideLead, unhideLead, isHiding, isUnhiding } = useHideLead();
  const [contactInfo, setContactInfo] = useState<string>("");
  const [showContactInfo, setShowContactInfo] = useState(false);

  // Check if current user has already engaged with this lead
  useEffect(() => {
    const checkEngagement = async () => {
      if (!auth.user) return;

      // Use the hasEngagement field from the lead data
      const hasEngagement = lead.hasEngagement || false;
      setShowContactInfo(hasEngagement);

      // If already engaged, show contact info from lead data
      if (hasEngagement && lead.contactInfo) {
        setContactInfo(lead.contactInfo);
      }
    };

    checkEngagement();
  }, [auth.user, lead.id, lead.hasEngagement, lead.contactInfo]);

  // Helper to format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  // Helper to get relative time
  const getRelativeTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return "Yesterday";
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    return formatDate(dateString);
  };

  // Helper to map urgency string to UrgencyLevel enum
  const mapUrgencyToEnum = (urgency: Lead["urgency"]): UrgencyLevel => {
    switch (urgency) {
      case "Immediately":
        return UrgencyLevel.IMMEDIATELY;
      case "Within a week":
        return UrgencyLevel.WITHIN_A_WEEK;
      case "This month":
        return UrgencyLevel.THIS_MONTH;
      case "Just exploring":
        return UrgencyLevel.FLEXIBLE;
      default:
        return UrgencyLevel.FLEXIBLE;
    }
  };

  // Helper to map contact preference string to ContactPreference enum
  const mapContactPreferenceToEnum = (preference: string): ContactPreference => {
    switch (preference) {
      case "Phone":
        return ContactPreference.PHONE;
      case "Email":
        return ContactPreference.EMAIL;
      case "WhatsApp":
        return ContactPreference.WHATSAPP;
      default:
        return ContactPreference.EMAIL;
    }
  };

  // Handle View Contact button click
  const handleViewContact = async () => {
    if (!auth.user) {
      console.error("User not authenticated");
      return;
    }

    const hasEngagement = lead.hasEngagement || false;

    if (hasEngagement) {
      // If already engaged, just show contact info
      setShowContactInfo(true);
      return;
    }

    try {
      // Use the mutation to create engagement
      createEngagement(lead.id, {
        onSuccess: () => {
          // Show contact info from lead data
          if (lead.contactInfo) {
            setContactInfo(lead.contactInfo);
            setShowContactInfo(true);
          }

          // Refresh leads data to show updated status
          if (onLeadUpdate) {
            onLeadUpdate();
          }

          console.log("Engagement created successfully");
        },
        onError: (error: any) => {
          if (error.message?.includes("already exists")) {
            // Engagement already exists, show contact info
            if (lead.contactInfo) {
              setContactInfo(lead.contactInfo);
              setShowContactInfo(true);
            }
          } else {
            console.error("Error creating engagement:", error);
          }
        },
      });
    } catch (error) {
      console.error("Error creating engagement:", error);
    }
  };

  // Handle Archive/Unarchive button click
  const handleArchiveToggle = async () => {
    if (!auth.user) {
      console.error("User not authenticated");
      return;
    }

    try {
      const isArchived = !!lead.hiddenAt;

      if (isArchived) {
        // Unarchive the lead
        unhideLead(lead.id, {
          onSuccess: () => {
            console.log("Lead unarchived successfully");
            if (onLeadUpdate) {
              onLeadUpdate();
            }
          },
          onError: error => {
            console.error("Error unarchiving lead:", error);
          },
        });
      } else {
        // Archive the lead
        hideLead(lead.id, {
          onSuccess: () => {
            console.log("Lead archived successfully");
            if (onLeadUpdate) {
              onLeadUpdate();
            }
          },
          onError: error => {
            console.error("Error archiving lead:", error);
          },
        });
      }
    } catch (error) {
      console.error("Error toggling archive status:", error);
    }
  };

  const isArchived = !!lead.hiddenAt;

  return (
    <div className={`${isArchived ? "opacity-75" : ""}`}>
      {/* Status Indicator Bar */}
      <div className="h-1 w-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full" />
      <div className="p-4 sm:p-6">
        {/* Header Section */}
        <div className="pb-4 sm:pb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-center gap-3 sm:gap-4 flex-1">
            <Avatar
              size="lg"
              src={lead.profilePicture}
              alt={lead.customerName}
              name={lead.customerName}
              className="h-12 w-12 sm:h-14 sm:w-14"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">
                  {lead.customerName}
                  {isArchived && (
                    <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                      (Archived)
                    </span>
                  )}
                </h3>
              </div>
              <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                <span>
                  {lead.location.city}, {lead.location.state}
                </span>
                <span>•</span>
                <span>{getRelativeTime(lead.timestamp)}</span>
              </div>
            </div>
          </div>
          <Badge
            variant={getBadgeVariantForUrgency(mapUrgencyToEnum(lead.urgency))}
            className="shrink-0"
          >
            {lead.urgency}
          </Badge>
        </div>

        {/* Content Section */}
        <div className="space-y-4 sm:space-y-5">
          {/* Services */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/30 dark:to-blue-800/30">
                <span className="text-xs sm:text-sm">🔧</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                Services Needed
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {lead.services?.map((service, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div>
            <div className="flex items-center gap-2 mb-2 sm:mb-3">
              <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-emerald-200 dark:from-emerald-900/30 dark:to-emerald-800/30">
                <span className="text-xs sm:text-sm">📞</span>
              </div>
              <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                Contact Preference
              </h4>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant={getBadgeVariantForContactPreference(
                  mapContactPreferenceToEnum(lead.contactPreference)
                )}
                className="text-xs sm:text-sm"
              >
                {lead.contactPreference}
              </Badge>
              {showContactInfo ? (
                <div className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-200">
                  {contactInfo || lead.contactInfo}
                </div>
              ) : (
                <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                  Click "View Contact" to see details
                </div>
              )}
            </div>
          </div>

          {/* Customer Notes */}
          {lead.notes && (
            <div>
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 dark:from-amber-900/30 dark:to-amber-800/30">
                  <span className="text-xs sm:text-sm">💬</span>
                </div>
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                  Customer Notes
                </h4>
              </div>
              <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 sm:p-4">
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed">
                  {lead.notes}
                </p>
              </div>
            </div>
          )}

          {/* Engagement Count */}
          {lead.engagementCount !== undefined && lead.engagementCount > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-6 w-6 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/30 dark:to-purple-800/30">
                  <span className="text-xs sm:text-sm">👥</span>
                </div>
                <h4 className="text-sm sm:text-base font-medium text-gray-900 dark:text-gray-100">
                  Interest Level
                </h4>
              </div>
              <div className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
                {lead.engagementCount} CAs viewed
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-gray-100 dark:border-gray-700">
          <Badge variant={getBadgeVariantForStatus(lead.status)} className="text-xs sm:text-sm">
            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
          </Badge>
          <div className="flex gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="outline"
              className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm rounded-xl border-gray-200 dark:border-gray-700"
              onClick={handleArchiveToggle}
              disabled={isHiding || isUnhiding}
            >
              {isHiding || isUnhiding ? "Loading..." : isArchived ? "Unarchive" : "Archive"}
            </Button>
            {!showContactInfo && !isArchived && (
              <Button
                size="sm"
                className="h-8 sm:h-9 px-3 sm:px-4 text-xs sm:text-sm rounded-xl bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleViewContact}
                disabled={isCreatingEngagement}
              >
                {isCreatingEngagement ? "Loading..." : "View Contact"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
