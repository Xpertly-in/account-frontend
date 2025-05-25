import { useState, useEffect, useRef } from "react";
import { FunnelSimple, MagnifyingGlass, X, Info } from "@phosphor-icons/react";
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
  const [showSearchHelp, setShowSearchHelp] = useState(false);
  const searchHelpRef = useRef<HTMLDivElement>(null);

  // Close search help when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchHelpRef.current && !searchHelpRef.current.contains(event.target as Node)) {
        setShowSearchHelp(false);
      }
    };

    if (showSearchHelp) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showSearchHelp]);

  // Search examples for different scenarios
  const searchExamples = [
    { category: "Customer Name", examples: ["John Smith", "Sarah", "Johnson"] },
    { category: "Location", examples: ["Toronto", "ON", "M5V 3A8", "Vancouver"] },
    { category: "Services", examples: ["tax preparation", "bookkeeping", "payroll", "audit"] },
    { category: "Contact Info", examples: ["john@email.com", "416-555-0123"] },
    { category: "Status/Urgency", examples: ["new", "urgent", "immediately", "this month"] },
  ];

  const getSearchPlaceholder = () => {
    const placeholders = [
      "Search by name, location, services...",
      "Try: John Smith, Toronto, tax prep...",
      "Search: customer name, city, email...",
      "Find: bookkeeping, urgent, new leads...",
    ];
    return placeholders[Math.floor(Math.random() * placeholders.length)];
  };

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
                placeholder={getSearchPlaceholder()}
                value={searchTerm}
                onChange={e => onSearchChange(e.target.value)}
                className="h-10 rounded-lg border-gray-200 pl-9 pr-16 text-sm shadow-sm dark:border-gray-700 dark:bg-gray-800"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 gap-1">
                {searchTerm && (
                  <button
                    onClick={() => onSearchChange("")}
                    className="flex items-center justify-center"
                  >
                    <X className="h-4 w-4 text-gray-400 hover:text-gray-500" />
                  </button>
                )}
                <button
                  onClick={() => setShowSearchHelp(!showSearchHelp)}
                  className="flex items-center justify-center"
                  title="Search help"
                >
                  <Info className="h-4 w-4 text-gray-400 hover:text-blue-500" />
                </button>
              </div>

              {/* Search Help Tooltip */}
              {showSearchHelp && (
                <div
                  ref={searchHelpRef}
                  className="absolute top-12 left-0 z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-lg dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-gray-100">Search Tips</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      You can search across multiple fields to find leads quickly
                    </p>
                  </div>
                  <div className="space-y-3">
                    {searchExamples.map((category, index) => (
                      <div key={index}>
                        <div className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {category.category}:
                        </div>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {category.examples.map((example, exampleIndex) => (
                            <button
                              key={exampleIndex}
                              onClick={() => {
                                onSearchChange(example);
                                setShowSearchHelp(false);
                              }}
                              className="rounded bg-gray-100 px-2 py-1 text-xs text-gray-600 hover:bg-blue-100 hover:text-blue-700 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-blue-900 dark:hover:text-blue-300"
                            >
                              {example}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      💡 <strong>Pro tip:</strong> Search works across customer names, locations,
                      services, contact info, and more!
                    </p>
                  </div>
                </div>
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

      {/* Results count with enhanced search context */}
      {!isLoading && (
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? (
              <div className="flex flex-col gap-1">
                <div>
                  Showing{" "}
                  <span className="font-medium text-gray-700 dark:text-gray-300">{totalCount}</span>{" "}
                  leads
                  <span className="ml-1">
                    for "
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {searchTerm}
                    </span>
                    "
                  </span>
                </div>
                {totalCount > 0 && (
                  <div className="text-xs text-gray-400 dark:text-gray-500">
                    💡 Searched across names, locations, services, contact info, and more
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span>{totalCount} total leads</span>
                {totalCount > 0 && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    • Use search to find specific leads quickly
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Quick search suggestions when no results */}
          {searchTerm && totalCount === 0 && (
            <div className="text-xs text-gray-500 dark:text-gray-400">
              <span>Try: </span>
              {["new leads", "Toronto", "tax", "urgent"].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => onSearchChange(suggestion)}
                  className="ml-1 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  {suggestion}
                  {index < 3 ? "," : ""}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
};
