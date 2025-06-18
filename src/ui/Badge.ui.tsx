import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/helper/tw.helper";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground border-border",
        // Urgency variants
        urgent:
          "border-transparent bg-red-100 text-red-800 dark:bg-red-900 dark:text-white dark:border-red-700",
        high: "border-transparent bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-white dark:border-orange-700",
        medium:
          "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-white dark:border-yellow-700",
        low: "border-transparent bg-green-100 text-green-800 dark:bg-green-900 dark:text-white dark:border-green-700",
        // Status variants
        new: "border-transparent bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-white dark:border-blue-700",
        replied:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white dark:border-emerald-700",
        ignored:
          "border-transparent bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-white dark:border-gray-600",
        contacted:
          "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-white dark:border-purple-700",
        closed:
          "border-transparent bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-white dark:border-slate-600",
        archived:
          "border-transparent bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-white dark:border-amber-700",
        // Contact preference variants
        phone:
          "border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-white dark:border-indigo-700",
        email:
          "border-transparent bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-white dark:border-cyan-700",
        whatsapp:
          "border-transparent bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-white dark:border-emerald-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
