"use client";

import * as React from "react";
import { Check, CaretDown, MagnifyingGlass } from "@phosphor-icons/react";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import { Command as CommandPrimitive } from "cmdk";
import { cn } from "@/helper/tw.helper";

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={cn(
      "flex h-full w-full flex-col overflow-hidden rounded-md bg-white text-gray-900 dark:bg-gray-800 dark:text-gray-100",
      className
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div
    className="flex items-center border-b border-gray-200 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800"
    cmdk-input-wrapper=""
  >
    <CommandPrimitive.Input
      ref={ref}
      className={cn(
        "flex h-8 w-full bg-transparent px-2 text-sm outline-none placeholder:text-gray-500 disabled:cursor-not-allowed disabled:opacity-50 dark:placeholder:text-gray-400",
        className
      )}
      {...props}
    />
    <div className="ml-2 flex h-6 w-6 items-center justify-center rounded ">
      <MagnifyingGlass size={16} weight="bold" className=" text-gray-700 dark:text-gray-300" />
    </div>
  </div>
));
CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={cn("max-h-[300px] overflow-y-auto overflow-x-hidden", className)}
    {...props}
  />
));
CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className={cn("py-6 text-center text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
));
CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={cn(
      "overflow-hidden p-1 text-gray-900 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-gray-500 dark:text-gray-100 dark:[&_[cmdk-group-heading]]:text-gray-400",
      className
    )}
    {...props}
  />
));
CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={cn(
      "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none aria-selected:bg-gray-100 aria-selected:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 dark:aria-selected:bg-gray-700 dark:aria-selected:text-gray-100",
      className
    )}
    {...props}
  />
));
CommandItem.displayName = CommandPrimitive.Item.displayName;

// Popover components
const Popover = PopoverPrimitive.Root;
const PopoverTrigger = PopoverPrimitive.Trigger;

const PopoverContent = React.forwardRef<
  React.ElementRef<typeof PopoverPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ className, align = "start", sideOffset = 4, ...props }, ref) => (
  <PopoverPrimitive.Portal>
    <PopoverPrimitive.Content
      ref={ref}
      align={align}
      sideOffset={sideOffset}
      className={cn(
        "z-50 w-72 rounded-md border border-gray-200 bg-white p-0 text-gray-900 shadow-lg outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100",
        className
      )}
      {...props}
    />
  </PopoverPrimitive.Portal>
));
PopoverContent.displayName = PopoverPrimitive.Content.displayName;

// Main Combobox component
interface ComboboxOption {
  value: string;
  label: string;
  count?: number;
}

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  disabled?: boolean;
  className?: string;
  multiple?: boolean;
  maxSelectedDisplay?: number;
}

const Combobox = React.forwardRef<HTMLButtonElement, ComboboxProps>(
  (
    {
      options,
      value,
      onValueChange,
      placeholder = "Select option...",
      searchPlaceholder = "Search...",
      emptyMessage = "No options found.",
      disabled = false,
      className,
      multiple = false,
      maxSelectedDisplay = 2,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [searchValue, setSearchValue] = React.useState("");

    // Handle both single and multi-select values
    const selectedValues = multiple
      ? Array.isArray(value)
        ? value
        : []
      : value
      ? [value as string]
      : [];

    const selectedOptions = options.filter(option => selectedValues.includes(option.value));

    const filteredOptions = options.filter(option =>
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    );

    const handleSelect = (selectedValue: string) => {
      if (multiple) {
        const currentValues = Array.isArray(value) ? value : [];
        const newValues = currentValues.includes(selectedValue)
          ? currentValues.filter(v => v !== selectedValue)
          : [...currentValues, selectedValue];
        onValueChange?.(newValues);
        // Don't close dropdown in multi-select mode
        // Don't clear search in multi-select mode to allow continued searching
      } else {
        const newValue = selectedValue === value ? "" : selectedValue;
        onValueChange?.(newValue);
        setOpen(false);
        setSearchValue("");
      }
    };

    const isSelected = (optionValue: string) => selectedValues.includes(optionValue);

    // Generate display text for selected items
    const getDisplayText = () => {
      if (selectedOptions.length === 0) return placeholder;

      if (multiple) {
        if (selectedOptions.length <= maxSelectedDisplay) {
          return selectedOptions.map(opt => opt.label).join(", ");
        } else {
          const displayed = selectedOptions
            .slice(0, maxSelectedDisplay)
            .map(opt => opt.label)
            .join(", ");
          const remaining = selectedOptions.length - maxSelectedDisplay;
          return `${displayed} +${remaining} more`;
        }
      } else {
        return selectedOptions[0]?.label || placeholder;
      }
    };

    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <button
            ref={ref}
            type="button"
            role="combobox"
            aria-expanded={open}
            aria-haspopup="listbox"
            disabled={disabled}
            className={cn(
              "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
          >
            <span
              className={cn("truncate", selectedOptions.length === 0 && "text-muted-foreground")}
            >
              {getDisplayText()}
            </span>
            <CaretDown className="h-4 w-4 shrink-0 opacity-50" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command>
            <CommandInput
              placeholder={searchPlaceholder}
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>{emptyMessage}</CommandEmpty>
              <CommandGroup>
                {multiple && selectedValues.length > 0 && (
                  <div className="border-b border-gray-200 p-2 dark:border-gray-700">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {selectedValues.length} selected
                      </span>
                      <button
                        onClick={() => setOpen(false)}
                        className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
                {filteredOptions.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.value}
                    onSelect={handleSelect}
                    onMouseDown={multiple ? e => e.preventDefault() : undefined}
                    className="cursor-pointer"
                  >
                    {multiple ? (
                      <div
                        className={cn(
                          "mr-2 flex h-4 w-4 items-center justify-center rounded border-2",
                          isSelected(option.value)
                            ? "border-blue-600 bg-blue-600 text-white dark:border-blue-500 dark:bg-blue-500"
                            : "border-gray-300 dark:border-gray-600"
                        )}
                      >
                        {isSelected(option.value) && <Check className="h-3 w-3" />}
                      </div>
                    ) : (
                      <Check
                        data-testid="check-icon"
                        className={cn(
                          "mr-2 h-4 w-4",
                          isSelected(option.value) ? "opacity-100" : "opacity-0"
                        )}
                      />
                    )}
                    <span className="flex-1 truncate">{option.label}</span>
                    {option.count !== undefined && (
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">
                        ({option.count})
                      </span>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    );
  }
);

Combobox.displayName = "Combobox";

export { Combobox, type ComboboxOption };
export {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  Popover,
  PopoverTrigger,
  PopoverContent,
};
