import { EnvelopeOpen } from "@phosphor-icons/react";
import { DASHBOARD_LABELS } from "@/constants/dashboard.constants";

interface LeadEmptyStateProps {
  searchTerm?: string;
}

export const LeadEmptyState = ({ searchTerm }: LeadEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center py-12 px-6 text-center">
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-100 to-emerald-100 dark:from-blue-900/30 dark:to-emerald-900/30">
        <EnvelopeOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" weight="duotone" />
      </div>
      <h3 className="mb-3 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {searchTerm ? "No leads found" : DASHBOARD_LABELS.NO_LEADS_FOUND}
      </h3>
      <p className="max-w-md text-sm text-gray-500 dark:text-gray-400 leading-relaxed">
        {searchTerm
          ? `No leads match your search for "${searchTerm}". Try adjusting your search terms or filters.`
          : DASHBOARD_LABELS.NO_LEADS_HELP}
      </p>
      {searchTerm && (
        <div className="mt-4 text-xs text-gray-400 dark:text-gray-500">
          💡 Try searching for customer names, locations, services, or contact preferences
        </div>
      )}
    </div>
  );
};
