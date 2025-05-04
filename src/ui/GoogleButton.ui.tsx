"use client";

import { Button } from "./Button.ui";
import { SpinnerGap } from "@phosphor-icons/react";
import Image from "next/image";

interface GoogleButtonProps {
  onClick: () => void;
  isLoading?: boolean;
  error?: string;
  children?: React.ReactNode;
}

export function GoogleButton({
  onClick,
  isLoading = false,
  error,
  children = "Continue with Google",
}: GoogleButtonProps) {
  return (
    <Button
      type="button"
      variant="outline"
      className="w-full border-border/50 bg-white text-foreground hover:bg-gray-50 dark:border-blue-800/30 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 hover:shadow-md transition-shadow duration-300"
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <SpinnerGap className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        <Image
          src="https://www.google.com/favicon.ico"
          alt="Google"
          width={18}
          height={18}
          className="mr-2"
        />
      )}
      {children}
    </Button>
  );
} 