import { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { LeadFilter, LeadSort } from "@/types/dashboard/lead.type";
import { useLeads } from "@/services/leads.service";
import { LeadCard } from "./LeadCard.component";
import { LeadSkeleton } from "./LeadSkeleton.component";
import { LeadEmptyState } from "./LeadEmptyState.component";
import { Pagination } from "./Pagination.component";
import { LeadsHeader } from "./LeadsHeader.component";
import { Lead } from "@/types/dashboard/lead.type";

export const LeadsComponent = () => {
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
  const filterWithSearch = {
    ...currentFilter,
    search: debouncedSearchTerm,
  };

  const paginationParams = {
    page: currentPage,
    pageSize: pageSize,
  };

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
  } = useLeads(filterWithSearch, paginationParams);

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

  // Handle search changes
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on search
  }, []);

  // Handle filter changes
  const handleFilterChange = useCallback((newFilter: LeadFilter) => {
    setCurrentFilter(newFilter);
    setCurrentPage(1); // Reset to first page on filter
  }, []);

  // Handle sort changes
  const handleSortChange = useCallback((newSort: LeadSort) => {
    setCurrentSort(newSort);
    setCurrentPage(1); // Reset to first page on sort
  }, []);

  // Function to refresh leads data (for manual refresh)
  const handleLeadUpdate = useCallback(() => {
    refetch();
  }, [refetch]);

  if (isError) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            Error loading leads
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {error?.message || "An error occurred"}
          </p>
          <button
            onClick={handleLeadUpdate}
            className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with search and filters */}
      <LeadsHeader
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        currentFilter={currentFilter}
        onFilterChange={handleFilterChange}
        currentSort={currentSort}
        onSortChange={handleSortChange}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      {/* Leads content */}
      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: pageSize }).map((_, index) => (
            <LeadSkeleton key={index} />
          ))}
        </div>
      ) : leads.length === 0 ? (
        <LeadEmptyState searchTerm={searchTerm} />
      ) : (
        <>
          {/* Single column layout for better focus */}
          <div className="space-y-4">
            {leads.map((lead: Lead) => (
              <LeadCard key={lead.id} lead={lead} onLeadUpdate={handleLeadUpdate} />
            ))}
          </div>

          {/* Prominent Pagination - Show when there are leads */}
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
};
