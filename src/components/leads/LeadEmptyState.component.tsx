import { EnvelopeOpen } from "@phosphor-icons/react";
import { DASHBOARD_LABELS } from "@/constants/dashboard.constants";

interface LeadEmptyStateProps {
  searchTerm: string;
}

export const LeadEmptyState = ({ searchTerm }: LeadEmptyStateProps) => {
  return (
    <div className="flex flex-col items-center rounded-xl border border-gray-200 bg-white py-12 text-center shadow-sm dark:border-gray-700 dark:bg-gray-800">
      <div className="mb-4 rounded-full bg-blue-100 p-4 dark:bg-blue-900/30">
        <EnvelopeOpen className="h-8 w-8 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-gray-100">
        {DASHBOARD_LABELS.NO_LEADS_FOUND}
      </h3>
      <p className="max-w-md px-6 text-sm text-gray-500 dark:text-gray-400">
        {searchTerm ? DASHBOARD_LABELS.SEARCH_HELP : DASHBOARD_LABELS.NO_LEADS_HELP}
      </p>
    </div>
  );
};
