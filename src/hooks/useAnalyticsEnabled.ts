import { useEffect, useState } from "react";

// Local storage key for analytics preference
const ANALYTICS_OPT_OUT_KEY = "xpertly_analytics_opt_out";

/**
 * Custom hook to check if analytics tracking is enabled
 * @returns boolean indicating if analytics are enabled
 */
export const useAnalyticsEnabled = (): boolean => {
  const [isEnabled, setIsEnabled] = useState<boolean>(true);

  useEffect(() => {
    // Check for analytics opt-out in localStorage
    const optOutValue = localStorage.getItem(ANALYTICS_OPT_OUT_KEY);
    if (optOutValue === "true") {
      setIsEnabled(false);
      return;
    }

    // Check for analytics opt-out in cookies
    const cookies = document.cookie.split(";");
    const hasOptOutCookie = cookies.some(cookie => cookie.trim().startsWith("ga-opt-out=true"));

    if (hasOptOutCookie) {
      setIsEnabled(false);
      return;
    }

    // Check for do-not-track browser settings
    if (
      navigator.doNotTrack === "1" ||
      navigator.doNotTrack === "yes" ||
      (window as any).doNotTrack === "1" ||
      (navigator as any).globalPrivacyControl === true
    ) {
      setIsEnabled(false);
      return;
    }

    setIsEnabled(true);
  }, []);

  return isEnabled;
};
