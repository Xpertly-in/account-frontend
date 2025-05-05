"use client";

import * as React from "react";
import { cn } from "@/helper/tw.helper";

interface AuthDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  text?: string;
}

const AuthDivider = React.forwardRef<HTMLDivElement, AuthDividerProps>(
  ({ className, text = "OR", ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-center gap-3",
          className
        )}
        {...props}
      >
    
        <div className="w-full border-t border-gray-100 dark:border-blue-800" />
        <span className="px-2 text-sm text-muted-foreground dark:text-blue-100/70 whitespace-nowrap">
          {text}
        </span>
        <div className="w-full border-t border-gray-100 dark:border-blue-800" />
      </div>
    );
  }
);

AuthDivider.displayName = "AuthDivider";

export { AuthDivider }; 