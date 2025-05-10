"use client";

import { useEffect, useState } from "react";
import { Switch } from "@/ui/Switch.ui";
import { Button } from "@/ui/Button.ui";
import { X } from "@phosphor-icons/react";
import { GA_MEASUREMENT_ID } from "@/helper/googleAnalytics.helper";

// Local storage key for analytics preference
const ANALYTICS_OPT_OUT_KEY = "xpertly_analytics_opt_out";

export const AnalyticsOptOut = () => {
  const [isOptedOut, setIsOptedOut] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  // Read opt-out preference from localStorage on component mount
  useEffect(() => {
    const storedPreference = localStorage.getItem(ANALYTICS_OPT_OUT_KEY);
    if (storedPreference !== null) {
      setIsOptedOut(storedPreference === "true");
    }
  }, []);

  // Update localStorage when preference changes
  const handleToggleOptOut = (checked: boolean) => {
    const optOut = !checked;
    setIsOptedOut(optOut);
    localStorage.setItem(ANALYTICS_OPT_OUT_KEY, optOut.toString());

    // Disable GA tracking if opted out
    if (optOut && window.gtag) {
      // Disable GA tracking
      window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: false,
        anonymize_ip: true,
      });

      // Create cookie to store opt-out preference
      document.cookie = `ga-opt-out=true; max-age=${60 * 60 * 24 * 365}; path=/`;
    } else if (!optOut && window.gtag) {
      // Re-enable GA tracking
      window.gtag("config", GA_MEASUREMENT_ID, {
        send_page_view: true,
      });

      // Remove opt-out cookie
      document.cookie = "ga-opt-out=; max-age=0; path=/";
    }
  };

  // Show/hide the opt-out panel
  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {isOpen ? (
        <div className="relative rounded-lg bg-white p-4 shadow-md dark:bg-gray-800">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-6 w-6 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            onClick={togglePanel}
          >
            <X size={16} />
          </Button>

          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-900 dark:text-white">
              Analytics Preferences
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              We use cookies to analyze website traffic and optimize your experience.
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Allow analytics tracking
            </span>
            <Switch
              checked={!isOptedOut}
              onCheckedChange={handleToggleOptOut}
              aria-label="Toggle analytics tracking"
            />
          </div>

          <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
            You can change your preference at any time in our Privacy Settings.
          </p>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="rounded-full bg-white text-xs shadow-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
          onClick={togglePanel}
        >
          Privacy Settings
        </Button>
      )}
    </div>
  );
};
