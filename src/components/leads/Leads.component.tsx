import { useState, useCallback, useMemo, memo } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { useLeads } from "@/services/leads.service";
import { LeadCard } from "./LeadCard.component";
import { LeadSkeleton } from "./LeadSkeleton.component";
import { LeadEmptyState } from "./LeadEmptyState.component";
import { Pagination } from "./Pagination.component";
import { LeadsHeader } from "./LeadsHeader.component";
import { Lead } from "@/types/dashboard/lead.type";

const LeadsComponent = memo(() => {
  // Local state for search and filters
  const [searchTerm, setSearchTerm] = useState("");
  const [currentFilter, setCurrentFilter] = useState<LeadFilter>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5); // Set to 5 leads per page
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Local state
  const [currentSort, setCurrentSort] = useState<LeadSort>({
    field: "timestamp",
    direction: "desc",
  });

  // Prepare filter and pagination for TanStack Query
  const filterWithSearch = useMemo(
    () => ({
      ...currentFilter,
      search: debouncedSearchTerm,
    }),
    [currentFilter, debouncedSearchTerm]
  );

  const paginationParams = useMemo(
    () => ({
      page: currentPage,
      pageSize: pageSize,
    }),
    [currentPage, pageSize]
  );

  // Use TanStack Query hooks for leads data
  const {
    leads,
    totalCount,
    hasNextPage,
    hasPreviousPage,
    totalPages,
    isLoading,
    isError,
    error,
    refetch,
  } = useLeads(filterWithSearch, paginationParams, currentSort);

  // Memoize stats calculation to prevent unnecessary re-renders
  // Only calculate stats from current page leads to avoid performance issues
  const { newCount, contactedCount, archivedCount } = useMemo(() => {
    // For stats, we want to show stats from all leads, not just current page
    // But since we only have current page data, we'll use totalCount for total
    // and calculate percentages from current page for new/contacted
    const currentPageStats = {
      newCount: leads.filter(lead => lead.status === "new").length,
      contactedCount: leads.filter(lead => lead.status === "contacted").length,
      archivedCount: leads.filter(lead => lead.hiddenAt).length,
    };

    // If we have a small dataset (less than pageSize), use actual counts
    // Otherwise, extrapolate from current page
    if (totalCount <= pageSize) {
      return currentPageStats;
    }

    // For larger datasets, show current page stats but indicate they're partial
    return {
      newCount: currentPageStats.newCount,
      contactedCount: currentPageStats.contactedCount,
      archivedCount: currentPageStats.archivedCount,
    };
  }, [leads, totalCount, pageSize]);

  // Handle pagination actions
  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handlePageSizeChange = useCallback((newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page
  }, []);

  const handleNextPage = useCallback(() => {
    if (hasNextPage) {
      setCurrentPage(currentPage + 1);
    }
  }, [hasNextPage, currentPage]);

  const handlePreviousPage = useCallback(() => {
    if (hasPreviousPage) {
      setCurrentPage(currentPage - 1);
    }
  }, [hasPreviousPage, currentPage]);

  // Handle search change - memoized to prevent unnecessary re-renders
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  }, []);

  // Handle filter change
  const handleFilterChange = useCallback((filter: LeadFilter) => {
    setCurrentFilter(filter);
    setCurrentPage(1); // Reset to first page when filtering
  }, []);

  // Handle sort change
  const handleSortChange = useCallback((sort: LeadSort) => {
    setCurrentSort(sort);
    setCurrentPage(1); // Reset to first page when sorting
  }, []);

  // Handle lead update (for refreshing data after actions)
  const handleLeadUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  // Handle error state
  if (isError) {
    return (
      <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-8 text-center">
        <div className="text-red-600 dark:text-red-400 mb-2">Error loading leads</div>
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {error?.message || "Something went wrong"}
        </div>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search, filters, and stats */}
      <LeadsHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        totalCount={totalCount}
        isLoading={isLoading}
        newCount={newCount}
        contactedCount={contactedCount}
        archivedCount={archivedCount}
      />

      {/* Leads content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: pageSize }).map((_, index) => (
            <LeadSkeleton key={index} />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
          <LeadEmptyState searchTerm={searchTerm} />
        </div>
      ) : (
        <>
          {/* Single column layout for better focus */}
          <div className="space-y-4">
            {leads.map((lead: Lead) => (
              <div
                key={lead.id}
                className="rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
              >
                <LeadCard lead={lead} onLeadUpdate={handleLeadUpdate} />
              </div>
            ))}
          </div>

          {/* Pagination - Show when there are leads */}
          {leads.length > 0 && (
            <div className="mt-8 border-t border-gray-200 pt-6 dark:border-gray-700">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageSize={pageSize}
                totalCount={totalCount}
                hasNextPage={hasNextPage}
                hasPreviousPage={hasPreviousPage}
                onPageChange={handlePageChange}
                onPageSizeChange={handlePageSizeChange}
                onNextPage={handleNextPage}
                onPreviousPage={handlePreviousPage}
                isLoading={isLoading}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
});

LeadsComponent.displayName = "LeadsComponent";

export { LeadsComponent };
