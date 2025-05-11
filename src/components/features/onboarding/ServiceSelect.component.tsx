import { useState, useEffect } from "react";
import AsyncSelect from "react-select/async";
import { supabase } from "@/lib/supabase";

interface ServiceOption {
  value: string;
  label: string;
}

interface ServiceSelectProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}

const DEFAULT_SERVICES = [
  "Income Tax Filing",
  "GST Filing",
  "Company Incorporation",
  "Accounting Services",
  "Audit Services",
  "Compliance Services",
  "Financial Consulting",
];

export function ServiceSelect({ value, onChange, onBlur, error, disabled }: ServiceSelectProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Load existing services from the database
  const loadExistingServices = async () => {
    const { data } = await supabase
      .from("ca_services")
      .select("service_name")
      .eq("is_active", true);
    
    if (data) {
      return data.map(service => ({
        value: service.service_name,
        label: service.service_name,
      }));
    }
    return [];
  };

  // Load options for the select
  const loadOptions = async (inputValue: string) => {
    setIsLoading(true);
    
    try {
      // Combine default services with existing services
      const existingServices = await loadExistingServices();
      const allServices = [...DEFAULT_SERVICES, ...existingServices.map(s => s.value)];
      
      // Filter and format options
      const filteredOptions = allServices
        .filter(service => 
          service.toLowerCase().includes(inputValue.toLowerCase())
        )
        .map(service => ({
          value: service,
          label: service,
        }));

      // Add the input value as an option if it's not empty and not in the list
      if (inputValue && !allServices.includes(inputValue)) {
        filteredOptions.unshift({
          value: inputValue,
          label: `Add "${inputValue}"`,
        });
      }

      return filteredOptions;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full">
      <AsyncSelect
        cacheOptions
        defaultOptions
        loadOptions={loadOptions}
        value={{ value, label: value }}
        onChange={(option) => onChange(option?.value || "")}
        onBlur={onBlur}
        isLoading={isLoading}
        isDisabled={disabled}
        placeholder="Search or add a service..."
        className="react-select-container"
        classNamePrefix="react-select"
        noOptionsMessage={() => "Type to add a new service"}
        components={{
          DropdownIndicator: () => null,
        }}
        styles={{
          control: (base, state) => ({
            ...base,
            backgroundColor: 'var(--background)',
            borderColor: error ? 'rgb(239, 68, 68)' : state.isFocused ? 'var(--primary)' : 'var(--border)',
            boxShadow: state.isFocused ? '0 0 0 2px var(--primary/20)' : 'none',
            '&:hover': {
              borderColor: error ? 'rgb(239, 68, 68)' : 'var(--primary)',
            },
          }),
          menu: (base) => ({
            ...base,
            backgroundColor: 'var(--background)',
            border: '1px solid var(--border)',
            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
          }),
          option: (base, state) => ({
            ...base,
            backgroundColor: state.isFocused ? 'var(--primary/10)' : 'transparent',
            color: 'var(--foreground)',
            '&:active': {
              backgroundColor: 'var(--primary/20)',
            },
          }),
          singleValue: (base) => ({
            ...base,
            color: 'var(--foreground)',
          }),
          input: (base) => ({
            ...base,
            color: 'var(--foreground)',
          }),
          placeholder: (base) => ({
            ...base,
            color: 'var(--muted-foreground)',
          }),
          noOptionsMessage: (base) => ({
            ...base,
            color: 'var(--muted-foreground)',
          }),
          loadingMessage: (base) => ({
            ...base,
            color: 'var(--muted-foreground)',
          }),
        }}
      />
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );
} 