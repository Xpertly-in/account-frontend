"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_MEASUREMENT_ID, trackPageView } from "@/helper/googleAnalytics.helper";
import { useAtom, initializeAnalyticsAtom, trackPageViewAtom } from "@/store/jotai";
import { useAnalyticsEnabled } from "@/hooks/useAnalyticsEnabled";

// This component ensures that search params are used safely for static export
function AnalyticsPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [, trackPageViewState] = useAtom(trackPageViewAtom);
  const isAnalyticsEnabled = useAnalyticsEnabled();

  useEffect(() => {
    // Track page views in Jotai state (always)
    let url = pathname || "";
    if (searchParams) {
      url += `?${searchParams.toString()}`;
    }
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

  return null;
}

export const GoogleAnalytics = () => {
  const [, initializeAnalytics] = useAtom(initializeAnalyticsAtom);
  const isAnalyticsEnabled = useAnalyticsEnabled();

  useEffect(() => {
    // Initialize analytics state
    initializeAnalytics();
  }, [initializeAnalytics]);

  // Don't render analytics scripts if analytics are disabled
  if (!isAnalyticsEnabled) {
    return null;
  }

  return (
    <>
      {/* Wrap the component that uses search params in Suspense */}
      <Suspense fallback={null}>
        <AnalyticsPageTracker />
      </Suspense>

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

export default GoogleAnalytics;
