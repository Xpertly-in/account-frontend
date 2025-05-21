"use client";

import { ArrowLeft } from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { Button } from "@/ui/Button.ui";
import { cn } from "@/helper/tw.helper";

interface BackButtonProps {
  /**
   * The route to navigate to when clicked. If not provided, will go back in history.
   */
  to?: string;

  /**
   * The text to display next to the arrow.
   */
  label?: string;

  /**
   * Additional CSS classes to apply to the button.
   */
  className?: string;
}

/**
 * A reusable back button component with a left arrow icon.
 */
export const BackButton = ({ to, label = "Back", className }: BackButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    if (to) {
      router.push(to);
    } else {
      router.back();
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn("flex items-center gap-1", className)}
      onClick={handleClick}
      type="button"
      data-testid="back-button"
    >
      <ArrowLeft className="h-4 w-4" />
      {label}
    </Button>
  );
};
