import { atom, atomWithStorage } from "@/store/jotai";
import {
  AnalyticsState,
  GA4Event,
  PageViewEvent,
  UserInteractionEvent,
} from "@/types/analytics.type";

// Base atoms - using atomWithStorage for persistence
export const analyticsStateAtom = atomWithStorage<AnalyticsState>("xpertly_analytics_state", {
  isInitialized: false,
  lastPageView: "",
  lastEvent: null,
});

export const pageViewHistoryAtom = atomWithStorage<PageViewEvent[]>(
  "xpertly_page_view_history",
  []
);
export const userInteractionHistoryAtom = atomWithStorage<UserInteractionEvent[]>(
  "xpertly_user_interaction_history",
  []
);

// Derived atoms
export const isAnalyticsInitializedAtom = atom(get => get(analyticsStateAtom).isInitialized);

export const lastPageViewAtom = atom(get => get(analyticsStateAtom).lastPageView);

export const lastEventAtom = atom(get => get(analyticsStateAtom).lastEvent);

// Action atoms
export const trackPageViewAtom = atom(null, (get, set, event: PageViewEvent) => {
  const currentState = get(analyticsStateAtom);
  set(analyticsStateAtom, {
    ...currentState,
    lastPageView: event.url,
  });
  set(pageViewHistoryAtom, [...get(pageViewHistoryAtom), event]);
});

export const trackUserInteractionAtom = atom(null, (get, set, event: UserInteractionEvent) => {
  set(userInteractionHistoryAtom, [...get(userInteractionHistoryAtom), event]);
});

export const trackEventAtom = atom(null, (get, set, event: GA4Event) => {
  const currentState = get(analyticsStateAtom);
  set(analyticsStateAtom, {
    ...currentState,
    lastEvent: event,
  });
});

export const initializeAnalyticsAtom = atom(null, (get, set) => {
  const currentState = get(analyticsStateAtom);
  set(analyticsStateAtom, {
    ...currentState,
    isInitialized: true,
  });
});
