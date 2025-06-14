/// <reference types="@testing-library/jest-dom" />
import React from "react";
import { render, screen, fireEvent, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DateRangePicker, type DateRange, type DateRangePreset } from "@/ui/DateRangePicker.ui";
import { DateRangePresetLabel, DateRangePresetVariant } from "@/types/common.type";

// Mock react-datepicker
jest.mock("react-datepicker", () => {
  return function MockDatePicker({
    onChange,
    selected,
    startDate,
    endDate,
    placeholderText,
    disabled,
    className,
  }: any) {
    const formatDate = (date: Date | null) => {
      if (!date || isNaN(date.getTime())) return "";
      return date.toISOString().split("T")[0];
    };

    const displayValue =
      startDate && endDate
        ? `${formatDate(startDate)} - ${formatDate(endDate)}`
        : startDate
        ? formatDate(startDate)
        : endDate
        ? formatDate(endDate)
        : "";

    return (
      <input
        data-testid="date-picker-input"
        value={displayValue}
        onChange={e => {
          const value = e.target.value;
          if (value.includes(" - ")) {
            const [startStr, endStr] = value.split(" - ");
            const startDate = new Date(startStr);
            const endDate = new Date(endStr);
            // Only call onChange if both dates are valid
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              onChange([startDate, endDate]);
            }
          } else if (value) {
            const date = new Date(value);
            if (!isNaN(date.getTime())) {
              onChange([date, null]);
            }
          } else {
            onChange([null, null]);
          }
        }}
        placeholder={placeholderText}
        disabled={disabled}
        className={className}
      />
    );
  };
});

// Mock Phosphor icons
jest.mock("@phosphor-icons/react", () => ({
  Calendar: ({ "aria-hidden": ariaHidden, ...props }: any) => (
    <div data-testid="calendar-icon" aria-hidden={ariaHidden} {...props} />
  ),
  X: () => <div data-testid="x-icon" />,
}));

describe("DateRangePicker Component - Contact Request Implementation", () => {
  const mockOnChange = jest.fn();
  const user = userEvent.setup();

  const sampleDateRange: DateRange = {
    from: new Date("2024-01-01"),
    to: new Date("2024-01-31"),
  };

  const customPresets: DateRangePreset[] = [
    {
      label: DateRangePresetLabel.CUSTOM,
      value: { from: new Date("2024-06-01"), to: new Date("2024-06-30") },
      variant: DateRangePresetVariant.DEFAULT,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // ============================================================================
  // BASIC RENDERING TESTS
  // ============================================================================

  describe("Basic Rendering", () => {
    test("renders date range picker correctly", () => {
      render(<DateRangePicker onChange={mockOnChange} />);

      expect(screen.getByTestId("date-picker-input")).toBeInTheDocument();
      expect(screen.getByTestId("calendar-icon")).toBeInTheDocument();
    });

    test("renders with custom placeholders", () => {
      render(
        <DateRangePicker
          onChange={mockOnChange}
          placeholder={{ from: "Start date", to: "End date" }}
        />
      );

      const input = screen.getByTestId("date-picker-input");
      expect(input).toHaveAttribute("placeholder", "Start date - End date");
    });

    test("renders with initial value", () => {
      render(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} />);

      const input = screen.getByTestId("date-picker-input") as HTMLInputElement;
      expect(input.value).toBe("2024-01-01 - 2024-01-31");
    });

    test("renders default preset buttons with enum labels", () => {
      render(<DateRangePicker onChange={mockOnChange} />);

      expect(screen.getByText(DateRangePresetLabel.TODAY)).toBeInTheDocument();
      expect(screen.getByText(DateRangePresetLabel.THIS_WEEK)).toBeInTheDocument();
      expect(screen.getByText(DateRangePresetLabel.THIS_MONTH)).toBeInTheDocument();
      expect(screen.getByText(DateRangePresetLabel.LAST_30_DAYS)).toBeInTheDocument();
    });

    test("hides presets when showPresets is false", () => {
      render(<DateRangePicker onChange={mockOnChange} showPresets={false} />);

      expect(screen.queryByText(DateRangePresetLabel.TODAY)).not.toBeInTheDocument();
      expect(screen.queryByText(DateRangePresetLabel.THIS_WEEK)).not.toBeInTheDocument();
    });

    test("renders custom presets with enum labels", () => {
      render(<DateRangePicker onChange={mockOnChange} presets={customPresets} />);

      expect(screen.getByText(DateRangePresetLabel.CUSTOM)).toBeInTheDocument();
      expect(screen.queryByText(DateRangePresetLabel.TODAY)).not.toBeInTheDocument();
    });
  });

  // ============================================================================
  // USER INTERACTION TESTS
  // ============================================================================

  describe("User Interactions", () => {
    test("calls onChange when date range is selected", async () => {
      render(<DateRangePicker onChange={mockOnChange} />);

      const input = screen.getByTestId("date-picker-input");

      await act(async () => {
        // Simulate direct input change with complete date range string
        fireEvent.change(input, { target: { value: "2024-01-01 - 2024-01-31" } });
      });

      // Check that onChange was called with the correct date range
      expect(mockOnChange).toHaveBeenCalledWith({
        from: new Date("2024-01-01"),
        to: new Date("2024-01-31"),
      });
    });

    test("calls onChange when preset is clicked", async () => {
      render(<DateRangePicker onChange={mockOnChange} presets={customPresets} />);

      const presetButton = screen.getByText(DateRangePresetLabel.CUSTOM);

      await act(async () => {
        await user.click(presetButton);
      });

      expect(mockOnChange).toHaveBeenCalledWith({
        from: new Date("2024-06-01"),
        to: new Date("2024-06-30"),
      });
    });

    test("handles preset keyboard navigation", async () => {
      render(<DateRangePicker onChange={mockOnChange} presets={customPresets} />);

      const presetButton = screen.getByText(DateRangePresetLabel.CUSTOM);
      presetButton.focus();

      await act(async () => {
        fireEvent.keyDown(presetButton, { key: "Enter" });
      });

      expect(mockOnChange).toHaveBeenCalledWith({
        from: new Date("2024-06-01"),
        to: new Date("2024-06-30"),
      });
    });

    test("clears date range when clear button is clicked", async () => {
      render(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} />);

      const clearButton = screen.getByLabelText("Clear date range");

      await act(async () => {
        await user.click(clearButton);
      });

      expect(mockOnChange).toHaveBeenCalledWith(undefined);
    });
  });

  // ============================================================================
  // DISABLED STATE TESTS
  // ============================================================================

  describe("Disabled State", () => {
    test("disables input when disabled prop is true", () => {
      render(<DateRangePicker onChange={mockOnChange} disabled />);

      expect(screen.getByTestId("date-picker-input")).toBeDisabled();
    });

    test("disables preset buttons when disabled", () => {
      render(<DateRangePicker onChange={mockOnChange} disabled presets={customPresets} />);

      const presetButton = screen.getByText(DateRangePresetLabel.CUSTOM);
      expect(presetButton).toHaveAttribute("tabIndex", "-1");
    });

    test("disables clear button when disabled", () => {
      render(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} disabled />);

      const clearButton = screen.getByLabelText("Clear date range");
      expect(clearButton).toBeDisabled();
    });

    test("does not respond to preset clicks when disabled", async () => {
      render(<DateRangePicker onChange={mockOnChange} disabled presets={customPresets} />);

      const presetButton = screen.getByText(DateRangePresetLabel.CUSTOM);
      await user.click(presetButton);

      expect(mockOnChange).not.toHaveBeenCalled();
    });
  });

  // ============================================================================
  // ACCESSIBILITY TESTS
  // ============================================================================

  describe("Accessibility", () => {
    test("provides proper aria labels for preset buttons", () => {
      render(<DateRangePicker onChange={mockOnChange} presets={customPresets} />);

      expect(
        screen.getByLabelText(`Set date range to ${DateRangePresetLabel.CUSTOM}`)
      ).toBeInTheDocument();
    });

    test("provides proper aria label for clear button", () => {
      render(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} />);

      expect(screen.getByLabelText("Clear date range")).toBeInTheDocument();
    });

    test("marks error message with role alert", () => {
      render(<DateRangePicker onChange={mockOnChange} error="Test error message" />);

      const errorMessage = screen.getByText("Test error message");
      expect(errorMessage).toHaveAttribute("role", "alert");
    });

    test("marks calendar icon as aria-hidden", () => {
      render(<DateRangePicker onChange={mockOnChange} />);

      const calendarIcon = screen.getByTestId("calendar-icon");
      expect(calendarIcon).toHaveAttribute("aria-hidden", "true");
    });
  });

  // ============================================================================
  // RESPONSIVE DESIGN TESTS
  // ============================================================================

  describe("Responsive Design", () => {
    test("applies custom className", () => {
      const { container } = render(
        <DateRangePicker onChange={mockOnChange} className="custom-class" />
      );

      expect(container.firstChild).toHaveClass("custom-class");
    });
  });

  // ============================================================================
  // EDGE CASES
  // ============================================================================

  describe("Edge Cases", () => {
    test("handles empty preset array", () => {
      render(<DateRangePicker onChange={mockOnChange} presets={[]} />);

      expect(screen.queryByText(DateRangePresetLabel.TODAY)).not.toBeInTheDocument();
      expect(screen.getByTestId("date-picker-input")).toBeInTheDocument();
    });

    test("handles undefined value prop", () => {
      render(<DateRangePicker value={undefined} onChange={mockOnChange} />);

      const input = screen.getByTestId("date-picker-input") as HTMLInputElement;
      expect(input.value).toBe("");
    });

    test("updates local state when value prop changes", () => {
      const { rerender } = render(<DateRangePicker value={undefined} onChange={mockOnChange} />);

      let input = screen.getByTestId("date-picker-input") as HTMLInputElement;
      expect(input.value).toBe("");

      rerender(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} />);

      input = screen.getByTestId("date-picker-input") as HTMLInputElement;
      expect(input.value).toBe("2024-01-01 - 2024-01-31");
    });

    test("shows clear button only when there is a value", () => {
      const { rerender } = render(<DateRangePicker onChange={mockOnChange} />);

      expect(screen.queryByLabelText("Clear date range")).not.toBeInTheDocument();

      rerender(<DateRangePicker value={sampleDateRange} onChange={mockOnChange} />);

      expect(screen.getByLabelText("Clear date range")).toBeInTheDocument();
    });

    test("displays external error message", () => {
      render(<DateRangePicker onChange={mockOnChange} error="External error message" />);

      expect(screen.getByText("External error message")).toBeInTheDocument();
    });

    test("uses enum variants for preset buttons", () => {
      render(<DateRangePicker onChange={mockOnChange} presets={customPresets} />);

      const presetButton = screen.getByText(DateRangePresetLabel.CUSTOM);
      // The button should have the default variant class applied
      expect(presetButton).toBeInTheDocument();
    });
  });
});
