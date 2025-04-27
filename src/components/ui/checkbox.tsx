import * as React from "react";
import { cn } from "@/lib/utils";

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  id?: string;
  onCheckedChange?: (checked: boolean) => void;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, id, onCheckedChange, ...props }, ref) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(event.target.checked);
      }
    };

    return (
      <div className="flex items-center justify-center">
        <input
          type="checkbox"
          id={id}
          ref={ref}
          onChange={handleChange}
          className={cn(
            "h-4 w-4 rounded border-border text-primary focus:ring-primary/30 focus-visible:ring-2 focus-visible:ring-offset-2 data-[state=checked]:bg-primary data-[state=checked]:text-white",
            className
          )}
          {...props}
        />
      </div>
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
