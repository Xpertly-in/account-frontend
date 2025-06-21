import { FilterChip } from "@/ui/FilterChips.ui";
import { FilterChipType } from "@/types/common.type";
import { ContactRequestFilter } from "@/types/dashboard/contact-request.type";

/**
 * Helper function to create filter chips from Contact Request filter state
 * Converts ContactRequestFilter object into an array of FilterChip objects
 * for display in the FilterChips UI component
 */
export const createContactRequestFilterChips = (filter: ContactRequestFilter): FilterChip[] => {
  const chips: FilterChip[] = [];

  // Status chips
  filter.status?.forEach((status, index) => {
    chips.push({
      id: `status-${index}`,
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: status,
      type: FilterChipType.STATUS,
    });
  });

  // Urgency chips
  filter.urgency?.forEach((urgency, index) => {
    chips.push({
      id: `urgency-${index}`,
      label: urgency,
      value: urgency,
      type: FilterChipType.URGENCY,
    });
  });

  // Service chips
  filter.service_needed?.forEach((service, index) => {
    chips.push({
      id: `service-${index}`,
      label: service,
      value: service,
      type: FilterChipType.SERVICE,
    });
  });

  // Contact preference chips
  filter.contact_preference?.forEach((preference, index) => {
    chips.push({
      id: `contact_preference-${index}`,
      label: preference,
      value: preference,
      type: FilterChipType.CONTACT_PREFERENCE,
    });
  });

  // Search chip
  if (filter.search && filter.search.trim()) {
    chips.push({
      id: "search",
      label: `"${filter.search}"`,
      value: filter.search,
      type: FilterChipType.SEARCH,
    });
  }

  // Date range chip
  if (filter.dateRange?.from || filter.dateRange?.to) {
    const fromDate = filter.dateRange.from
      ? new Date(filter.dateRange.from).toLocaleDateString()
      : "";
    const toDate = filter.dateRange.to ? new Date(filter.dateRange.to).toLocaleDateString() : "";

    let dateLabel = "";
    if (fromDate && toDate) {
      dateLabel = `${fromDate} - ${toDate}`;
    } else if (fromDate) {
      dateLabel = `From ${fromDate}`;
    } else if (toDate) {
      dateLabel = `Until ${toDate}`;
    }

    if (dateLabel) {
      chips.push({
        id: "dateRange",
        label: dateLabel,
        value: `${filter.dateRange.from || ""}-${filter.dateRange.to || ""}`,
        type: FilterChipType.DATE_RANGE,
      });
    }
  }

  return chips;
};

/**
 * Helper function to remove a specific filter chip from ContactRequestFilter
 * Returns updated filter object with the specified chip removed
 */
export const removeFilterChip = (
  filter: ContactRequestFilter,
  chipId: string
): ContactRequestFilter => {
  const updatedFilter = { ...filter };

  // Parse chip ID to determine type and index
  if (chipId.startsWith("status-")) {
    const index = parseInt(chipId.split("-")[1]);
    if (updatedFilter.status && index >= 0 && index < updatedFilter.status.length) {
      updatedFilter.status = updatedFilter.status.filter((_, i) => i !== index);
      if (updatedFilter.status.length === 0) {
        delete updatedFilter.status;
      }
    }
  } else if (chipId.startsWith("urgency-")) {
    const index = parseInt(chipId.split("-")[1]);
    if (updatedFilter.urgency && index >= 0 && index < updatedFilter.urgency.length) {
      updatedFilter.urgency = updatedFilter.urgency.filter((_, i) => i !== index);
      if (updatedFilter.urgency.length === 0) {
        delete updatedFilter.urgency;
      }
    }
  } else if (chipId.startsWith("service-")) {
    const index = parseInt(chipId.split("-")[1]);
    if (updatedFilter.service_needed && index >= 0 && index < updatedFilter.service_needed.length) {
      updatedFilter.service_needed = updatedFilter.service_needed.filter((_, i) => i !== index);
      if (updatedFilter.service_needed.length === 0) {
        delete updatedFilter.service_needed;
      }
    }
  } else if (chipId.startsWith("contact_preference-")) {
    const index = parseInt(chipId.split("-")[1]);
    if (
      updatedFilter.contact_preference &&
      index >= 0 &&
      index < updatedFilter.contact_preference.length
    ) {
      updatedFilter.contact_preference = updatedFilter.contact_preference.filter(
        (_, i) => i !== index
      );
      if (updatedFilter.contact_preference.length === 0) {
        delete updatedFilter.contact_preference;
      }
    }
  } else if (chipId === "search") {
    delete updatedFilter.search;
  } else if (chipId === "dateRange") {
    delete updatedFilter.dateRange;
  }

  return updatedFilter;
};

/**
 * Helper function to clear all filters from ContactRequestFilter
 * Returns empty filter object
 */
export const clearAllFilters = (): ContactRequestFilter => {
  return {};
};
