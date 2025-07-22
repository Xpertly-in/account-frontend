// LocationPicker Component - Simple state and district selection
// Mobile-first design, under 200 lines, follows project standards

"use client";

import { useState, useEffect } from "react";
import { useStates, useDistrictsByState } from "@/services/location.service";
import { Select } from "@/ui/Select.ui";

interface LocationPickerProps {
  selectedState?: number;
  selectedDistrict?: number;
  onStateChange: (stateId: number | undefined) => void;
  onDistrictChange: (districtId: number | undefined) => void;
  disabled?: boolean;
  className?: string;
}

export function LocationPicker({
  selectedState,
  selectedDistrict,
  onStateChange,
  onDistrictChange,
  disabled = false,
  className = "",
}: LocationPickerProps) {
  const { data: states = [], isLoading: statesLoading } = useStates();
  const { data: districts = [], isLoading: districtsLoading } = useDistrictsByState(selectedState);

  // Reset district when state changes
  useEffect(() => {
    if (selectedState && selectedDistrict) {
      const districtExists = districts.some(d => d.id === selectedDistrict);
      if (!districtExists) {
        onDistrictChange(undefined);
      }
    }
  }, [selectedState, districts, selectedDistrict, onDistrictChange]);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const stateId = value ? parseInt(value) : undefined;
    onStateChange(stateId);
    onDistrictChange(undefined); // Reset district when state changes
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    const districtId = value ? parseInt(value) : undefined;
    onDistrictChange(districtId);
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* State Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          State *
        </label>
        <Select
          value={selectedState?.toString() || ""}
          onChange={handleStateChange}
          disabled={disabled || statesLoading}
          className="w-full"
        >
          <option value="">{statesLoading ? "Loading states..." : "Select state"}</option>
          {states.map(state => (
            <option key={state.id} value={state.id.toString()}>
              {state.name}
            </option>
          ))}
        </Select>
      </div>

      {/* District Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          District *
        </label>
        <Select
          value={selectedDistrict?.toString() || ""}
          onChange={handleDistrictChange}
          disabled={disabled || !selectedState || districtsLoading}
          className="w-full"
        >
          <option value="">
            {!selectedState
              ? "Select state first"
              : districtsLoading
              ? "Loading districts..."
              : "Select district"}
          </option>
          {districts.map(district => (
            <option key={district.id} value={district.id.toString()}>
              {district.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}
