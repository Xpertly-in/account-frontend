import React from "react";
import DatePicker from "react-datepicker";
import { Button } from "@/ui/Button.ui";
import { Badge } from "@/ui/Badge.ui";
import { Calendar, X } from "@phosphor-icons/react";
import { cn } from "@/helper/tw.helper";
import { DateRangePresetLabel, DateRangePresetVariant } from "@/types/common.type";
import "react-datepicker/dist/react-datepicker.css";

export interface DateRange {
  from: Date | null;
  to: Date | null;
}

export interface DateRangePreset {
  label: DateRangePresetLabel;
  value: DateRange;
  variant?: DateRangePresetVariant;
}

interface DateRangePickerProps {
  value?: DateRange;
  onChange: (dateRange: DateRange | undefined) => void;
  placeholder?: {
    from?: string;
    to?: string;
  };
  presets?: DateRangePreset[];
  showPresets?: boolean;
  className?: string;
  disabled?: boolean;
  error?: string;
  minDate?: Date;
  maxDate?: Date;
}

// Default preset date ranges using enums
const DEFAULT_PRESETS: DateRangePreset[] = [
  {
    label: DateRangePresetLabel.TODAY,
    value: {
      from: new Date(),
      to: new Date(),
    },
    variant: DateRangePresetVariant.SECONDARY,
  },
  {
    label: DateRangePresetLabel.THIS_WEEK,
    value: {
      from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    variant: DateRangePresetVariant.SECONDARY,
  },
  {
    label: DateRangePresetLabel.THIS_MONTH,
    value: {
      from: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      to: new Date(),
    },
    variant: DateRangePresetVariant.SECONDARY,
  },
  {
    label: DateRangePresetLabel.LAST_30_DAYS,
    value: {
      from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      to: new Date(),
    },
    variant: DateRangePresetVariant.SECONDARY,
  },
];

export const DateRangePicker = React.forwardRef<HTMLDivElement, DateRangePickerProps>(
  (
    {
      value,
      onChange,
      placeholder = { from: "From date", to: "To date" },
      presets = DEFAULT_PRESETS,
      showPresets = true,
      className,
      disabled = false,
      error,
      minDate,
      maxDate,
    },
    ref
  ) => {
    const [startDate, setStartDate] = React.useState<Date | null>(value?.from || null);
    const [endDate, setEndDate] = React.useState<Date | null>(value?.to || null);

    // Update local state when value prop changes
    React.useEffect(() => {
      setStartDate(value?.from || null);
      setEndDate(value?.to || null);
    }, [value]);

    // Handle date range change
    const handleDateChange = (dates: [Date | null, Date | null]) => {
      const [start, end] = dates;
      setStartDate(start);
      setEndDate(end);

      if (start || end) {
        onChange({ from: start, to: end });
      } else {
        onChange(undefined);
      }
    };

    // Handle preset selection
    const handlePresetSelect = (preset: DateRangePreset) => {
      setStartDate(preset.value.from);
      setEndDate(preset.value.to);
      onChange(preset.value);
    };

    // Clear date range
    const handleClear = () => {
      setStartDate(null);
      setEndDate(null);
      onChange(undefined);
    };

    const hasValue = startDate || endDate;

    return (
      <div ref={ref} className={cn("space-y-3", className)}>
        {/* Date Range Picker */}
        <div className="relative">
          <DatePicker
            selected={startDate}
            onChange={handleDateChange}
            startDate={startDate}
            endDate={endDate}
            selectsRange
            inline={false}
            disabled={disabled}
            minDate={minDate}
            maxDate={maxDate}
            placeholderText={`${placeholder.from} - ${placeholder.to}`}
            className={cn(
              "w-full px-4 py-2 pl-10 border border-gray-300 rounded-md shadow-sm",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "dark:bg-gray-800 dark:border-gray-600 dark:text-white",
              "disabled:bg-gray-100 disabled:cursor-not-allowed",
              error && "border-red-500 focus:border-red-500 focus:ring-red-500"
            )}
            wrapperClassName="w-full"
            calendarClassName="shadow-lg border border-gray-200 dark:border-gray-700"
            dayClassName={date =>
              cn(
                "hover:bg-blue-100 dark:hover:bg-blue-900",
                "focus:bg-blue-200 dark:focus:bg-blue-800"
              )
            }
            monthClassName={() => "text-gray-900 dark:text-gray-100"}
            weekDayClassName={() => "text-gray-600 dark:text-gray-400"}
          />
          <Calendar
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none"
            aria-hidden="true"
          />
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-sm text-red-600 dark:text-red-400" role="alert">
            {error}
          </p>
        )}

        {/* Preset Buttons and Clear */}
        {showPresets && (
          <div className="flex flex-wrap items-center gap-2">
            {presets.map(preset => (
              <Badge
                key={preset.label}
                variant={preset.variant || DateRangePresetVariant.OUTLINE}
                className="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                onClick={() => !disabled && handlePresetSelect(preset)}
                role="button"
                tabIndex={disabled ? -1 : 0}
                onKeyDown={e => {
                  if ((e.key === "Enter" || e.key === " ") && !disabled) {
                    e.preventDefault();
                    handlePresetSelect(preset);
                  }
                }}
                aria-label={`Set date range to ${preset.label}`}
              >
                {preset.label}
              </Badge>
            ))}

            {/* Clear Button */}
            {hasValue && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClear}
                disabled={disabled}
                className="h-6 px-2 text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                aria-label="Clear date range"
              >
                <X className="h-3 w-3 mr-1" />
                Clear
              </Button>
            )}
          </div>
        )}
      </div>
    );
  }
);

DateRangePicker.displayName = "DateRangePicker";

export { type DateRangePickerProps };
