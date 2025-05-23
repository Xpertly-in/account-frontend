import { useState } from "react";
import { Lead } from "@/types/dashboard/lead.type";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/ui/Card.ui";
import { createLeadEngagement } from "@/services/leads.service";

interface LeadCardProps {
  lead: Lead;
}

export const LeadCard = ({ lead }: LeadCardProps) => {
  const [isCreatingEngagement, setIsCreatingEngagement] = useState(false);

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
        return "inline-flex rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800";
      case "contacted":
        return "inline-flex rounded-full bg-purple-100 px-2.5 py-1 text-xs font-medium text-purple-800";
      case "closed":
        return "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800";
      case "archived":
        return "inline-flex rounded-full bg-yellow-100 px-2.5 py-1 text-xs font-medium text-yellow-800";
      default:
        return "inline-flex rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800";
    }
  };

  // Handle View Contact button click
  const handleViewContact = async () => {
    setIsCreatingEngagement(true);
    try {
      // TODO: Get actual CA ID from auth context
      const caId = "mock-ca-id";
      const { error } = await createLeadEngagement(lead.id, caId);

      if (error) {
        console.error("Error creating engagement:", error);
      } else {
        // TODO: Optionally refresh leads data or show success message
        console.log("Engagement created successfully");
      }
    } catch (error) {
      console.error("Error creating engagement:", error);
    } finally {
      setIsCreatingEngagement(false);
    }
  };

  return (
    <Card className="flex min-h-[280px] flex-col overflow-hidden rounded-xl border-gray-200 bg-white shadow-sm transition-all hover:shadow-md dark:border-gray-700 dark:bg-gray-800">
      <CardHeader className="border-b border-gray-100 pb-3 pt-4 dark:border-gray-700">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              {lead.customerName}
            </CardTitle>
            <CardDescription className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {lead.location.city}, {lead.location.state} • {formatDate(lead.timestamp)}
            </CardDescription>
          </div>
          <Badge
            className={`rounded-full px-3 py-1 text-xs font-medium ${getUrgencyColor(
              lead.urgency
            )}`}
          >
            {lead.urgency}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 pt-4">
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
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
          <div>
            <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
              Preferred Contact:
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {lead.contactPreference}:{" "}
              <span className="font-medium text-gray-900 dark:text-gray-200">
                {lead.contactInfo}
              </span>
            </div>
          </div>
          {lead.notes && (
            <div>
              <div className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Notes:
              </div>
              <div className="text-sm italic text-gray-600 dark:text-gray-400">{lead.notes}</div>
            </div>
          )}
          {lead.engagementCount !== undefined && lead.engagementCount > 0 && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {lead.engagementCount} CAs viewed
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="mt-auto flex h-[60px] items-center justify-between border-t border-gray-100 bg-gray-50 px-6 dark:border-gray-700 dark:bg-gray-800/50">
        <div className={getStatusStyle(lead.status)}>
          {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
        </div>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="outline"
            className="h-9 rounded-lg border-gray-200 text-sm dark:border-gray-700"
          >
            Archive
          </Button>
          <Button
            size="sm"
            className="h-9 rounded-lg bg-blue-600 text-sm hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
            onClick={handleViewContact}
            disabled={isCreatingEngagement}
          >
            {isCreatingEngagement ? "Loading..." : "View Contact"}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};
