"use client";

import React, { useState, useCallback } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ContactRequestFilter,
  ContactRequestSort,
  ContactRequest,
  ContactRequestStatus,
} from "@/types/dashboard/contact-request.type";
import { UrgencyLevel, ContactPreference, SortDirection } from "@/types/common.type";
import { ContactRequestCard } from "@/components/contact-requests/ContactRequestCard.component";
import { ContactRequestEmptyState } from "@/components/contact-requests/ContactRequestEmptyState.component";
import { FilterChips } from "@/ui/FilterChips.ui";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Badge } from "@/ui/Badge.ui";
import {
  createContactRequestFilterChips,
  removeFilterChip,
  clearAllFilters,
} from "@/helper/contact-request.helper";
import {
  MagnifyingGlass,
  FunnelSimple,
  X,
  ChatCenteredText,
  Clock,
  CheckCircle,
  ArrowLeft,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";

// Mock data for development - replace with actual service later
const mockContactRequests: ContactRequest[] = [
  {
    id: "1",
    ca_id: "ca-1",
    customer_id: "customer-1",
    customer_name: "John Smith",
    customer_email: "john.smith@email.com",
    customer_phone: "+1234567890",
    subject: "Tax Filing Assistance",
    message:
      "I need help with my annual tax filing. I have a small business and need guidance on deductions and compliance requirements.",
    service_needed: "Tax Preparation",
    urgency: UrgencyLevel.WITHIN_A_WEEK,
    contact_preference: ContactPreference.EMAIL,
    contact_detail: "john.smith@email.com",
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    status: ContactRequestStatus.NEW,
    ca_private_notes: "",
    created_at: "2024-01-15T10:30:00Z",
    updated_at: "2024-01-15T10:30:00Z",
    replied_at: undefined,
  },
  {
    id: "2",
    ca_id: "ca-1",
    customer_id: undefined,
    customer_name: "Sarah Johnson",
    customer_email: "sarah.j@email.com",
    customer_phone: "+1987654321",
    subject: "GST Registration Query",
    message:
      "I'm starting a new business and need help with GST registration. Can you guide me through the process and requirements?",
    service_needed: "GST Services",
    urgency: UrgencyLevel.IMMEDIATELY,
    contact_preference: ContactPreference.PHONE,
    contact_detail: "+1987654321",
    location: {
      city: "Delhi",
      state: "Delhi",
    },
    status: ContactRequestStatus.REPLIED,
    ca_private_notes: "Called customer, scheduled follow-up meeting",
    created_at: "2024-01-14T14:20:00Z",
    updated_at: "2024-01-14T16:45:00Z",
    replied_at: "2024-01-14T16:45:00Z",
  },
  {
    id: "3",
    ca_id: "ca-1",
    customer_id: "customer-3",
    customer_name: "Michael Brown",
    customer_email: "m.brown@email.com",
    customer_phone: undefined,
    subject: "Audit Services Inquiry",
    message:
      "Our company needs an external audit for the financial year. Please let me know your availability and charges.",
    service_needed: "Audit Services",
    urgency: UrgencyLevel.THIS_MONTH,
    contact_preference: ContactPreference.EMAIL,
    contact_detail: "m.brown@email.com",
    location: {
      city: "Bangalore",
      state: "Karnataka",
    },
    status: ContactRequestStatus.NEW,
    ca_private_notes: "",
    created_at: "2024-01-13T09:15:00Z",
    updated_at: "2024-01-13T09:15:00Z",
    replied_at: undefined,
  },
];

export default function ContactRequestsPage() {
  const router = useRouter();

  // Filter and sort state
  const [currentFilter, setCurrentFilter] = useState<ContactRequestFilter>({});
  const [currentSort, setCurrentSort] = useState<ContactRequestSort>({
    field: "created_at",
    direction: SortDirection.DESC,
  });

  // UI state
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilter, setShowFilter] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Mock data filtering
  const filteredContactRequests = mockContactRequests.filter(request => {
    if (debouncedSearchTerm) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      const matchesSearch =
        request.customer_name.toLowerCase().includes(searchLower) ||
        request.subject.toLowerCase().includes(searchLower) ||
        request.message.toLowerCase().includes(searchLower) ||
        (request.service_needed && request.service_needed.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    if (currentFilter.status && currentFilter.status.length > 0) {
      if (!currentFilter.status.includes(request.status)) return false;
    }

    if (currentFilter.urgency && currentFilter.urgency.length > 0) {
      if (!currentFilter.urgency.includes(request.urgency)) return false;
    }

    if (currentFilter.contact_preference && currentFilter.contact_preference.length > 0) {
      if (!currentFilter.contact_preference.includes(request.contact_preference)) return false;
    }

    if (currentFilter.service_needed && currentFilter.service_needed.length > 0) {
      if (!request.service_needed || !currentFilter.service_needed.includes(request.service_needed))
        return false;
    }

    if (currentFilter.dateRange) {
      const requestDate = new Date(request.created_at);
      if (currentFilter.dateRange.from && requestDate < new Date(currentFilter.dateRange.from))
        return false;
      if (currentFilter.dateRange.to && requestDate > new Date(currentFilter.dateRange.to))
        return false;
    }

    return true;
  });

  // Sort filtered results
  const sortedContactRequests = [...filteredContactRequests].sort((a, b) => {
    const direction = currentSort.direction === SortDirection.ASC ? 1 : -1;

    switch (currentSort.field) {
      case "created_at":
        return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
      case "customer_name":
        return direction * a.customer_name.localeCompare(b.customer_name);
      case "status":
        return direction * a.status.localeCompare(b.status);
      case "urgency":
        const urgencyOrder = [
          UrgencyLevel.IMMEDIATELY,
          UrgencyLevel.WITHIN_A_WEEK,
          UrgencyLevel.THIS_MONTH,
          UrgencyLevel.FLEXIBLE,
        ];
        return direction * (urgencyOrder.indexOf(a.urgency) - urgencyOrder.indexOf(b.urgency));
      default:
        return 0;
    }
  });

  // Filter chips
  const filterChips = createContactRequestFilterChips(currentFilter);
  const hasActiveFilters = filterChips.length > 0;

  // Stats
  const newCount = sortedContactRequests.filter(r => r.status === ContactRequestStatus.NEW).length;
  const repliedCount = sortedContactRequests.filter(
    r => r.status === ContactRequestStatus.REPLIED
  ).length;
  const totalCount = sortedContactRequests.length;

  // Event handlers
  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleFilterToggle = useCallback(() => {
    setShowFilter(!showFilter);
  }, [showFilter]);

  const handleStatusUpdate = useCallback((id: string, status: ContactRequestStatus) => {
    console.log("Update status:", id, status);
  }, []);

  const handleNotesUpdate = useCallback((id: string, notes: string) => {
    console.log("Update notes:", id, notes);
  }, []);

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
      {/* Balanced Compact Header */}
      <div className="bg-gradient-to-r from-emerald-500 to-blue-500 dark:from-emerald-600 dark:to-blue-600 sticky top-0 z-10 shadow-sm">
        <div className="px-4 py-3 sm:px-6 sm:py-4">
          {/* Header Row with Better Spacing */}
          <div className="flex items-center gap-3 mb-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.push("/ca/dashboard")}
              className="p-2 text-white hover:bg-white/10 lg:hidden"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm sm:h-9 sm:w-9">
              <ChatCenteredText className="h-4 w-4 text-white sm:h-5 sm:w-5" weight="bold" />
            </div>
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-bold text-white sm:text-xl">Contact Requests</h1>
              <p className="text-emerald-100 text-xs sm:text-sm hidden sm:block">
                Manage customer inquiries
              </p>
            </div>
            {/* Elegant Inline Stats for Mobile */}
            <div className="flex items-center gap-2 text-white/90 text-xs sm:hidden">
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                <Clock className="h-3 w-3" />
                <span>{newCount}</span>
              </div>
              <div className="flex items-center gap-1 bg-white/20 rounded-full px-2 py-1">
                <CheckCircle className="h-3 w-3" />
                <span>{totalCount}</span>
              </div>
            </div>
          </div>

          {/* Desktop Stats - More Elegant */}
          <div className="hidden sm:grid sm:grid-cols-3 sm:gap-4 sm:mb-4">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className="h-4 w-4 text-orange-200" />
                <span className="text-xl font-bold text-white">{newCount}</span>
              </div>
              <p className="text-xs text-emerald-100">New Requests</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle className="h-4 w-4 text-green-200" />
                <span className="text-xl font-bold text-white">{repliedCount}</span>
              </div>
              <p className="text-xs text-emerald-100">Replied</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 text-center hover:bg-white/15 transition-colors">
              <div className="flex items-center justify-center gap-2 mb-1">
                <ChatCenteredText className="h-4 w-4 text-blue-200" />
                <span className="text-xl font-bold text-white">{totalCount}</span>
              </div>
              <p className="text-xs text-emerald-100">Total</p>
            </div>
          </div>

          {/* Refined Search Bar */}
          <div className="flex gap-3">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlass className="h-4 w-4 text-white/60" />
              </div>
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={e => handleSearchChange(e.target.value)}
                className="pl-10 pr-10 h-10 bg-white/10 backdrop-blur-sm border-white/20 text-white placeholder:text-white/60 focus:bg-white/20 focus:border-white/40 text-sm rounded-xl"
                disabled={isLoading}
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-white/60 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
            <Button
              variant="outline"
              onClick={handleFilterToggle}
              disabled={isLoading}
              className="h-10 px-4 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 hover:border-white/40 rounded-xl transition-all"
            >
              <FunnelSimple className="h-4 w-4" />
              {hasActiveFilters && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-orange-500 text-white text-xs px-2 py-0.5"
                >
                  {filterChips.length}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content with Better Spacing */}
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

        {/* Contact Requests List - Balanced Spacing */}
        {sortedContactRequests.length > 0 ? (
          <div className="space-y-4">
            {sortedContactRequests.map(request => (
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
