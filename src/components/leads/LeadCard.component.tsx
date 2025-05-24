import { useState, useEffect } from "react";
import { Lead } from "@/types/dashboard/lead.type";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { useCreateEngagement, useHideLead } from "@/services/leads.service";
import { useAuth } from "@/store/context/Auth.provider";
import { Avatar } from "@/ui/Avatar.ui";

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

  // Helper to get urgency badge color
  const getUrgencyColor = (urgency: Lead["urgency"]) => {
    switch (urgency) {
      case "Immediately":
        return "bg-red-500 text-white";
      case "Within a week":
        return "bg-orange-500 text-white";
      case "This month":
        return "bg-blue-500 text-white";
      case "Just exploring":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-500 text-white";
    }
  };

  // Helper to get status badge style
  const getStatusStyle = (status: Lead["status"]) => {
    switch (status) {
      case "new":
        return "inline-flex items-center rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-400";
      case "contacted":
        return "inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
      case "closed":
        return "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
      case "archived":
        return "inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-800 dark:bg-amber-900/20 dark:text-amber-400";
      default:
        return "inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
          <Badge
            className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${getUrgencyColor(
              lead.urgency
            )}`}
          >
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
                <div className="font-medium text-gray-700 dark:text-gray-300">
                  {lead.contactPreference}
                </div>
                {showContactInfo ? (
                  <div className="mt-1 font-medium text-gray-900 dark:text-gray-200">
                    {contactInfo || lead.contactInfo}
                  </div>
                ) : (
                  <div className="mt-1 text-gray-500 dark:text-gray-400">
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
            {/* Status Badge */}
            <div className={getStatusStyle(lead.status)}>
              {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
            </div>
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
