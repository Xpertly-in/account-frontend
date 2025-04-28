"use client";

import { useTheme } from "next-themes";
import { Button } from "@/ui/Button.ui";
import { Moon, Sun } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering the toggle after mounting
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="rounded-full w-9 h-9 hover:bg-slate-200 dark:hover:bg-slate-700"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <Moon weight="fill" className="h-5 w-5 text-yellow-300" />
      ) : (
        <Sun weight="fill" className="h-5 w-5 text-yellow-500" />
      )}
    </Button>
  );
}
