import { useState } from "react";
import { FunnelSimple, MagnifyingGlass, X } from "@phosphor-icons/react";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { LeadFilterComponent } from "./LeadFilter.component";

interface LeadsHeaderProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  currentFilter: LeadFilter;
  onFilterChange: (filter: LeadFilter) => void;
  currentSort: LeadSort;
  onSortChange: (sort: LeadSort) => void;
  totalCount: number;
  isLoading: boolean;
}

export const LeadsHeader = ({
  searchTerm,
  onSearchChange,
  currentFilter,
  onFilterChange,
  currentSort,
  onSortChange,
  totalCount,
  isLoading,
}: LeadsHeaderProps) => {
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  return (
    <>
      {/* Header with title and search */}
      <div className="rounded-xl bg-blue-50/80 p-4 shadow-sm dark:bg-blue-900/20">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold text-blue-900 dark:text-blue-100">Leads Management</h2>
          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="relative flex-1 sm:w-64">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <MagnifyingGlass className="h-4 w-4 text-gray-500" />
              </div>
              <Input
                placeholder="Search leads..."
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="h-10 rounded-lg border-gray-200 pl-9 pr-9 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
              />
              {searchTerm && (
                <button
                  onClick={() => onSearchChange("")}
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                >
                  <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              className="h-10 gap-1 rounded-lg border-gray-200 bg-white px-3 shadow-sm dark:border-gray-700 dark:bg-gray-800"
            >
              <FunnelSimple className="h-4 w-4" />
              <span className="sr-only sm:not-sr-only sm:inline">Filter</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Filter section */}
      {showFilterMenu && (
        <LeadFilterComponent
          currentFilter={currentFilter}
          setCurrentFilter={onFilterChange}
          currentSort={currentSort}
          setCurrentSort={onSortChange}
          onClose={() => setShowFilterMenu(false)}
        />
      )}

      {/* Results count */}
      {!isLoading && (
        <div className="text-sm text-gray-500 dark:text-gray-400">
          {searchTerm ? (
            <>
              Showing {totalCount} leads
              <span className="ml-1">for "{searchTerm}"</span>
            </>
          ) : (
            `${totalCount} total leads`
          )}
        </div>
      )}
    </>
  );
};
