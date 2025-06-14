import { useState, useEffect } from "react";
import { Lead } from "@/types/dashboard/lead.type";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
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
    <Card
      className={`overflow-hidden rounded-xl border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800 ${
        isArchived ? "opacity-75" : ""
      }`}
    >
      <div className="p-6">
        {/* Header with customer info, avatar, and urgency */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-4">
              {/* Customer Avatar */}
              <Avatar
                size="lg"
                src={lead.profilePicture}
                alt={lead.customerName}
                name={lead.customerName}
              />

              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {lead.customerName}
                    {isArchived && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        (Archived)
                      </span>
                    )}
                  </h3>
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lead.location.city}, {lead.location.state} • {formatDate(lead.timestamp)}
                </p>
              </div>
            </div>
          </div>
          {/* Enhanced Badge for urgency */}
          <Badge variant={getBadgeVariantForUrgency(mapUrgencyToEnum(lead.urgency))}>
            {lead.urgency}
          </Badge>
        </div>

        {/* Content in horizontal layout */}
        <div className="mt-6 space-y-4">
          {/* Services */}
          <div>
            <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
              Services Needed:
            </div>
            <div className="flex flex-wrap gap-1">
              {lead.services?.map((service, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="rounded-md border-blue-200 bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
                >
                  {service}
                </Badge>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Preferred Contact:
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-2">
                  {/* Enhanced Badge for contact preference */}
                  <Badge
                    variant={getBadgeVariantForContactPreference(
                      mapContactPreferenceToEnum(lead.contactPreference)
                    )}
                  >
                    {lead.contactPreference}
                  </Badge>
                </div>
                {showContactInfo ? (
                  <div className="mt-2 font-medium text-gray-900 dark:text-gray-200">
                    {contactInfo || lead.contactInfo}
                  </div>
                ) : (
                  <div className="mt-2 text-gray-500 dark:text-gray-400">
                    Click "View Contact" to see details
                  </div>
                )}
              </div>
            </div>

            {/* Engagement Count */}
            {lead.engagementCount !== undefined && lead.engagementCount > 0 && (
              <div>
                <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                  Interest Level:
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {lead.engagementCount} CAs viewed
                </div>
              </div>
            )}
          </div>

          {/* Notes - Expanded section for 200-250 characters */}
          {lead.notes && (
            <div>
              <div className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Customer Notes:
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800/50">
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed min-h-[60px]">
                  {lead.notes}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer with actions */}
        <div className="mt-6 flex items-center justify-between border-t border-gray-100 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-4">
            {/* Enhanced Badge for status */}
            <Badge variant={getBadgeVariantForStatus(lead.status)}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              className="h-9 rounded-lg border-gray-200 text-sm dark:border-gray-700"
              onClick={handleArchiveToggle}
              disabled={isHiding || isUnhiding}
            >
              {isHiding || isUnhiding ? "Loading..." : isArchived ? "Unarchive" : "Archive"}
            </Button>
            {!showContactInfo && !isArchived && (
              <Button
                size="sm"
                className="h-9 rounded-lg bg-blue-600 text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                onClick={handleViewContact}
                disabled={isCreatingEngagement}
              >
                {isCreatingEngagement ? "Loading..." : "View Contact"}
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
