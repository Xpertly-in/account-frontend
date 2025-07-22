"use client";

import React, { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ContactRequestFilter,
  ContactRequestSort,
  ContactRequestStatus,
} from "@/types/dashboard/contact-request.type";
import { SortDirection } from "@/types/common.type";
import { Header } from "@/components/contact-requests/Header.component";
import { ContactRequestCard } from "@/components/contact-requests/Card.component";
import { ContactRequestEmptyState } from "@/components/contact-requests/EmptyState.component";
import { FilterChips } from "@/ui/FilterChips.ui";
import { Button } from "@/ui/Button.ui";
import { X } from "@phosphor-icons/react";
import {
  createContactRequestFilterChips,
  removeFilterChip,
  clearAllFilters,
} from "@/helper/contact-request.helper";
import {
  useContactRequests,
  useUpdateContactRequestStatus,
  useUpdateContactRequestNotes,
} from "@/services/contact-requests.service";

export default function ContactRequestsPage() {
  // Filter and sort state
  const [currentFilter, setCurrentFilter] = useState<ContactRequestFilter>({});
  const [currentSort, setCurrentSort] = useState<ContactRequestSort>({
    field: "created_at",
    direction: SortDirection.DESC,
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Create filter with search term
  const activeFilter = {
    ...currentFilter,
    search: debouncedSearchTerm || undefined,
  };

  // Service hooks
  const { contactRequests, totalCount, isLoading, isError, error, refetch } = useContactRequests(
    activeFilter,
    undefined,
    currentSort
  );

  const { updateStatus } = useUpdateContactRequestStatus();
  const { updateNotes } = useUpdateContactRequestNotes();

  // Filter chips
  const filterChips = createContactRequestFilterChips(currentFilter);
  const hasActiveFilters = filterChips.length > 0;

  // Stats
  const newCount = contactRequests.filter(r => r.status === ContactRequestStatus.NEW).length;
  const repliedCount = contactRequests.filter(
    r => r.status === ContactRequestStatus.REPLIED
  ).length;

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  const handleStatusUpdate = useCallback(
    (id: string, status: ContactRequestStatus) => {
      updateStatus({ requestId: id, status });
    },
    [updateStatus]
  );

  const handleNotesUpdate = useCallback(
    (id: string, notes: string) => {
      updateNotes({ requestId: id, notes });
    },
    [updateNotes]
  );

  const handleRemoveChip = useCallback(
    (chipId: string) => {
      const updatedFilter = removeFilterChip(currentFilter, chipId);
      setCurrentFilter(updatedFilter);
    },
    [currentFilter]
  );

  const handleClearAllFilters = useCallback(() => {
    const clearedFilter = clearAllFilters();
    setCurrentFilter(clearedFilter);
    setSearchTerm("");
  }, []);

  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header
        searchTerm={searchTerm}
        onSearchChange={handleSearchChange}
        onFilterToggle={handleFilterToggle}
        onClearSearch={clearSearch}
        hasActiveFilters={hasActiveFilters}
        filterCount={filterChips.length}
        newCount={newCount}
        repliedCount={repliedCount}
        totalCount={totalCount}
        isLoading={isLoading}
      />

      <div className="px-4 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Active Filter Chips */}
        {hasActiveFilters && (
          <div className="mb-4">
            <FilterChips
              chips={filterChips}
              onRemoveChip={handleRemoveChip}
              onClearAll={handleClearAllFilters}
              maxVisible={3}
            />
          </div>
        )}

        {/* Filter Panel - Temporarily disabled until filter component is rebuilt */}
        {showFilter && (
          <div className="mb-6">
            <div className="rounded-xl bg-white shadow-lg border border-gray-200 dark:bg-gray-800 dark:border-gray-700 p-4">
              <p className="text-gray-600 dark:text-gray-400 text-sm">
                Filter panel coming soon - using existing filter chips for now
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowFilter(false)}
                className="mt-2"
              >
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Contact Requests List */}
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl h-48"
              />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden p-8 text-center">
            <div className="text-red-500 mb-4">
              <X className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Failed to load contact requests
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {error?.message || "An unexpected error occurred"}
            </p>
            <Button onClick={() => refetch()} variant="outline">
              Try Again
            </Button>
          </div>
        ) : contactRequests.length > 0 ? (
          <div className="space-y-4">
            {contactRequests.map(request => (
              <div
                key={request.id}
                className="rounded-xl bg-white shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden"
              >
                <ContactRequestCard
                  contactRequest={request}
                  onStatusUpdate={handleStatusUpdate}
                  onNotesUpdate={handleNotesUpdate}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl bg-white shadow-sm border border-gray-200 dark:bg-gray-800 dark:border-gray-700 overflow-hidden">
            <ContactRequestEmptyState
              searchTerm={debouncedSearchTerm}
              hasActiveFilters={hasActiveFilters}
            />
          </div>
        )}
      </div>
    </div>
  );
}
