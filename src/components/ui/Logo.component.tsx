import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ className, size = "md" }: LogoProps) {
  const sizeClasses = {
    sm: "h-6 w-6",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex items-center justify-center rounded-md bg-primary text-primary-foreground font-bold",
          sizeClasses[size],
          className
        )}
      >
        <span>X</span>
      </div>
      <span
        className={cn("font-bold", {
          "text-sm": size === "sm",
          "text-base": size === "md",
          "text-xl": size === "lg",
        })}
      >
        Xpertly
      </span>
    </div>
  );
}
