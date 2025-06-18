import React from "react";
import { Badge } from "@/ui/Badge.ui";
import { Button } from "@/ui/Button.ui";
import { X } from "@phosphor-icons/react";
import { cn } from "@/helper/tw.helper";
import {
  FilterChipType,
  BadgeVariant,
  UrgencyLevel,
  ContactPreference,
  getBadgeVariantForUrgency,
  getBadgeVariantForContactPreference,
  getBadgeVariantForStatus,
} from "@/types/common.type";

export interface FilterChip {
  id: string;
  label: string;
  value: string;
  type: FilterChipType;
  variant?: BadgeVariant;
}

interface FilterChipsProps {
  chips: FilterChip[];
  onRemoveChip: (chipId: string) => void;
  onClearAll?: () => void;
  className?: string;
  showClearAll?: boolean;
  maxVisible?: number;
}

export const FilterChips = React.forwardRef<HTMLDivElement, FilterChipsProps>(
  ({ chips, onRemoveChip, onClearAll, className, showClearAll = true, maxVisible = 5 }, ref) => {
    const [showAll, setShowAll] = React.useState(false);

    // Determine which chips to show
    const visibleChips = showAll ? chips : chips.slice(0, maxVisible);
    const hiddenCount = chips.length - maxVisible;

    // Don't render anything if no chips
    if (chips.length === 0) {
      return null;
    }

    // Get appropriate variant for chip type using enhanced Badge system
    const getChipVariant = (chip: FilterChip): BadgeVariant => {
      if (chip.variant) return chip.variant;

      switch (chip.type) {
        case FilterChipType.STATUS:
          return getBadgeVariantForStatus(chip.value);
        case FilterChipType.URGENCY:
          // Map string value back to enum for helper function
          const urgencyEnum =
            Object.values(UrgencyLevel).find(u => u === chip.value) || UrgencyLevel.FLEXIBLE;
          return getBadgeVariantForUrgency(urgencyEnum);
        case FilterChipType.CONTACT_PREFERENCE:
          // Map string value back to enum for helper function
          const prefEnum =
            Object.values(ContactPreference).find(p => p === chip.value) || ContactPreference.EMAIL;
          return getBadgeVariantForContactPreference(prefEnum);
        case FilterChipType.SERVICE:
          return "secondary";
        case FilterChipType.LOCATION:
          return "outline";
        case FilterChipType.SEARCH:
          return "default";
        case FilterChipType.DATE_RANGE:
          return "secondary";
        default:
          return "default";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200 dark:bg-gray-800/50 dark:border-gray-700",
          className
        )}
      >
        {/* Filter count indicator */}
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">
            {chips.length} filter{chips.length !== 1 ? "s" : ""} applied:
          </span>
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap items-center gap-1.5">
          {visibleChips.map(chip => (
            <div key={chip.id} className="flex items-center gap-1 group">
              <Badge
                variant={getChipVariant(chip)}
                className="pr-1 text-xs font-medium transition-all hover:shadow-sm"
              >
                <span className="mr-1">{chip.label}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent group-hover:bg-white/20 rounded-full"
                  onClick={() => onRemoveChip(chip.id)}
                  aria-label={`Remove ${chip.label} filter`}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            </div>
          ))}

          {/* Show more/less toggle */}
          {hiddenCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll ? "Show less" : `+${hiddenCount} more`}
            </Button>
          )}
        </div>

        {/* Clear all button */}
        {showClearAll && onClearAll && (
          <div className="ml-auto">
            <Button
              variant="outline"
              size="sm"
              className="h-7 px-3 text-xs border-gray-300 text-gray-600 hover:bg-gray-100 hover:text-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-200"
              onClick={onClearAll}
            >
              Clear all
            </Button>
          </div>
        )}
      </div>
    );
  }
);

FilterChips.displayName = "FilterChips";

export { type FilterChipsProps };
