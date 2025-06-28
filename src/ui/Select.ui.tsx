"use client";

import React from "react";
import Select from "react-select";

export interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value?: SelectOption | null;
  onChange: (option: SelectOption | null) => void;
  placeholder?: string;
  isSearchable?: boolean;
  isClearable?: boolean;
  isMulti?: boolean;
  className?: string;
  icon?: React.ReactNode;
  isLoading?: boolean;
  noOptionsMessage?: (obj: { inputValue: string }) => string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  isSearchable = true,
  isClearable = true,
  isMulti = false,
  className = "",
  icon,
  isLoading = false,
  noOptionsMessage = () => "No options found"
}) => {
  const customStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      minHeight: "48px",
      backgroundColor: "var(--background)",
      border: state.isFocused 
        ? "2px solid #3b82f6" 
        : "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: state.isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.1)" : "none",
      "&:hover": {
        borderColor: "#3b82f6"
      },
      paddingLeft: icon ? "40px" : "12px",
      transition: "all 0.2s ease",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#3b82f6" 
        : state.isFocused 
        ? "#f3f4f6" 
        : "transparent",
      color: state.isSelected ? "white" : "var(--foreground)",
      padding: "12px 16px",
      cursor: "pointer",
      "&:hover": {
        backgroundColor: state.isSelected ? "#3b82f6" : "#f3f4f6"
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "var(--background)",
      border: "1px solid #e5e7eb",
      borderRadius: "8px",
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
      zIndex: 1000,
    }),
    menuList: (provided: any) => ({
      ...provided,
      padding: "4px",
      maxHeight: "200px",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "var(--foreground)",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "var(--foreground)",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    multiValue: (provided: any) => ({
      ...provided,
      backgroundColor: "#3b82f6",
      borderRadius: "6px",
    }),
    multiValueLabel: (provided: any) => ({
      ...provided,
      color: "white",
      fontWeight: "500",
    }),
    multiValueRemove: (provided: any) => ({
      ...provided,
      color: "white",
      "&:hover": {
        backgroundColor: "#ef4444",
        color: "white",
      },
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "#e5e7eb",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        color: "#3b82f6",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#6b7280",
      "&:hover": {
        color: "#ef4444",
      },
    }),
  };

  // Dark mode styles
  const darkModeStyles = {
    control: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: "#1f2937",
      border: state.isFocused 
        ? "2px solid #60a5fa" 
        : "1px solid #374151",
      "&:hover": {
        borderColor: "#60a5fa"
      },
      boxShadow: state.isFocused ? "0 0 0 3px rgba(96, 165, 250, 0.1)" : "none",
    }),
    option: (provided: any, state: any) => ({
      ...provided,
      backgroundColor: state.isSelected 
        ? "#60a5fa" 
        : state.isFocused 
        ? "#374151" 
        : "transparent",
      color: state.isSelected ? "white" : "#f9fafb",
      "&:hover": {
        backgroundColor: state.isSelected ? "#60a5fa" : "#374151"
      }
    }),
    menu: (provided: any) => ({
      ...provided,
      backgroundColor: "#1f2937",
      border: "1px solid #374151",
    }),
    singleValue: (provided: any) => ({
      ...provided,
      color: "#f9fafb",
    }),
    input: (provided: any) => ({
      ...provided,
      color: "#f9fafb",
    }),
    placeholder: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
    }),
    indicatorSeparator: (provided: any) => ({
      ...provided,
      backgroundColor: "#374151",
    }),
    dropdownIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#60a5fa",
      },
    }),
    clearIndicator: (provided: any) => ({
      ...provided,
      color: "#9ca3af",
      "&:hover": {
        color: "#ef4444",
      },
    }),
  };

  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 text-gray-400">
          {icon}
        </div>
      )}
      <Select
        options={options}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        isSearchable={isSearchable}
        isClearable={isClearable}
        isMulti={isMulti}
        isLoading={isLoading}
        noOptionsMessage={noOptionsMessage}
        styles={{
          ...customStyles,
          ...(typeof window !== 'undefined' && document.documentElement.classList.contains('dark') ? darkModeStyles : {})
        }}
        classNamePrefix="react-select"
        theme={(theme) => ({
          ...theme,
          colors: {
            ...theme.colors,
            primary: '#3b82f6',
            primary75: '#60a5fa',
            primary50: '#93c5fd',
            primary25: '#dbeafe',
          },
        })}
      />
    </div>
  );
};

export { CustomSelect };
