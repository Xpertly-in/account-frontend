"use client";

import { Checkbox } from "@/ui/Checkbox.ui";

interface Option {
  value: string;
  label: string;
}

export interface CheckboxGroupProps {
  id: string;
  label: string;
  options: Option[];
  value: string[]; // Expect an array of selected values
  onChange: (value: string[]) => void;
  required?: boolean;
  error?: string;
  description?: string; // Added description prop
}

export function CheckboxGroup({
  id,
  label,
  options,
  value = [], // Default to empty array
  onChange,
  required = false,
  error,
  description,
}: CheckboxGroupProps) {
  const handleCheckboxChange = (checked: boolean, optionValue: string) => {
    let newValue: string[];
    if (checked) {
      // Add the value to the array if it's not already there
      newValue = [...new Set([...value, optionValue])];
    } else {
      // Remove the value from the array
      newValue = value.filter(v => v !== optionValue);
    }
    onChange(newValue);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label className="text-sm font-medium text-foreground">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        {error && <p className="text-xs text-red-500">{error}</p>}
      </div>
      <div className="grid grid-cols-1 gap-3 rounded-md border border-input bg-background p-4 sm:grid-cols-2">
        {options.map(option => (
          <div key={option.value} className="flex items-center space-x-2">
            <Checkbox
              id={`${id}-${option.value}`}
              checked={value.includes(option.value)}
              onCheckedChange={checked => handleCheckboxChange(Boolean(checked), option.value)}
            />
            <label
              htmlFor={`${id}-${option.value}`}
              className="cursor-pointer text-sm font-normal text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
      {/* Add hidden input for potential form library integration/validation if needed */}
      <input
        type="hidden"
        name={id}
        value={value.join(",")}
        required={required && value.length === 0} // Basic required validation
      />
    </div>
  );
}
