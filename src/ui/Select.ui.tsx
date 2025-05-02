import * as React from "react";
import { cn } from "@/helper/tw.helper";
import { CaretDown } from "@phosphor-icons/react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, children, multiple, style, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <select
          ref={ref}
          className={cn(
            // Base styles
            "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            // Explicitly ensure appearance-none is applied via class
            "appearance-none",
            // Specific styles for multiple select to prevent overlap with icon
            multiple ? "pr-3" : "pr-8",
            className
          )}
          // Force appearance override via inline style
          style={{ ...style, appearance: "none", WebkitAppearance: "none", MozAppearance: "none" }}
          multiple={multiple}
          {...props}
        >
          {children}
        </select>
        {/* Conditionally render the custom chevron icon only if not multiple */}
        {!multiple && (
          <CaretDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50"
            aria-hidden="true"
          />
        )}
      </div>
    );
  }
);
Select.displayName = "Select";

export { Select };
