import { useState, useEffect, useRef, useMemo, memo } from "react";
import {
  FunnelSimple,
  MagnifyingGlass,
  X,
  Clock,
  CheckCircle,
  EnvelopeSimple,
  Archive,
} from "@phosphor-icons/react";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Badge } from "@/ui/Badge.ui";
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
  // Add stats props for better dashboard experience
  newCount?: number;
  contactedCount?: number;
  archivedCount?: number;
}

const LeadsHeader = memo(
  ({
    searchTerm,
    onSearchChange,
    currentFilter,
    onFilterChange,
    currentSort,
    onSortChange,
    totalCount,
    isLoading,
    newCount = 0,
    contactedCount = 0,
    archivedCount = 0,
  }: LeadsHeaderProps) => {
    const [showFilterMenu, setShowFilterMenu] = useState(false);
    const searchInputRef = useRef<HTMLInputElement>(null);
    const [wasFocused, setWasFocused] = useState(false);

    // Memoize active filters count to prevent unnecessary re-renders
    const activeFiltersCount = useMemo(() => {
      return Object.values(currentFilter).filter(value =>
        Array.isArray(value) ? value.length > 0 : value !== undefined && value !== null
      ).length;
    }, [currentFilter]);

    // Preserve focus when component re-renders due to search changes
    useEffect(() => {
      if (
        wasFocused &&
        searchInputRef.current &&
        document.activeElement !== searchInputRef.current
      ) {
        searchInputRef.current.focus();
        // Restore cursor position to end of input
        const length = searchInputRef.current.value.length;
        searchInputRef.current.setSelectionRange(length, length);
      }
    }, [totalCount, wasFocused]); // Re-run when totalCount changes (indicating search results updated)

    const handleSearchChange = (value: string) => {
      setWasFocused(true);
      onSearchChange(value);
    };

    const handleSearchFocus = () => {
      setWasFocused(true);
    };

    const handleSearchBlur = () => {
      setWasFocused(false);
    };

    const clearSearch = () => {
      onSearchChange("");
      setWasFocused(true);
      // Maintain focus after clearing
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 0);
    };

    return (
      <>
        {/* Stats Dashboard */}
        <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{newCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">New Leads</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {contactedCount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Contacted</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <EnvelopeSimple className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{totalCount}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-700">
                <Archive className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {archivedCount}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Archived</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 mb-4">
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlass className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search leads by name, location, services..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                onFocus={handleSearchFocus}
                onBlur={handleSearchBlur}
                className="pl-10 pr-10 h-10 bg-gray-50 border-gray-200 text-gray-900 placeholder:text-gray-500 focus:bg-white focus:border-blue-500 text-sm rounded-xl dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100 dark:placeholder:text-gray-400"
                disabled={isLoading}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors dark:hover:text-gray-300"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
              disabled={isLoading}
              className="h-10 px-4 bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100 hover:border-gray-300 rounded-xl transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-600"
            >
              <FunnelSimple className="h-4 w-4" />
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-blue-500 text-white text-xs px-2 py-0.5"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Search Results Summary */}
          {!isLoading && (
            <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {searchTerm ? (
                  <div className="flex flex-col gap-1">
                    <div>
                      Showing{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {totalCount}
                      </span>{" "}
                      leads{" "}
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
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
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
        </div>

        {/* Filter Panel */}
        {showFilterMenu && (
          <div className="mb-4">
            <div className="rounded-xl bg-white shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
              <LeadFilterComponent
                currentFilter={currentFilter}
                setCurrentFilter={onFilterChange}
                currentSort={currentSort}
                setCurrentSort={onSortChange}
                onClose={() => setShowFilterMenu(false)}
              />
            </div>
          </div>
        )}
      </>
    );
  }
);

LeadsHeader.displayName = "LeadsHeader";

export { LeadsHeader };
