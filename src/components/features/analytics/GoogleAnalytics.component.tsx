"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackPageView } from "@/helper/googleAnalytics.helper";
import { useAtom, initializeAnalyticsAtom, trackPageViewAtom } from "@/store/jotai";
import { useAnalyticsEnabled } from "@/hooks/useAnalyticsEnabled";

export const GoogleAnalytics = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, initializeAnalytics] = useAtom(initializeAnalyticsAtom);
  const [, trackPageViewState] = useAtom(trackPageViewAtom);
  const isAnalyticsEnabled = useAnalyticsEnabled();

  useEffect(() => {
    // Initialize analytics state
    initializeAnalytics();
  }, [initializeAnalytics]);

  useEffect(() => {
    // Track page views in Jotai state (always)
    const url = pathname + searchParams.toString();
    const title = document.title;

    trackPageViewState({
      url,
      title,
      timestamp: Date.now(),
    });

    // Track in GA4 only if analytics are enabled
    if (isAnalyticsEnabled) {
      trackPageView(url, title);
    }
  }, [pathname, searchParams, trackPageViewState, isAnalyticsEnabled]);

  // Don't render analytics scripts if analytics are disabled
  if (!isAnalyticsEnabled) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
            });
          `,
        }}
      />
    </>
  );
};
