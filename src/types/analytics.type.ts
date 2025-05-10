export interface GA4Event {
  name: string;
  category: string;
  action: string;
  label: string;
  value?: number;
  params?: Record<string, any>;
}

export interface AnalyticsState {
  isInitialized: boolean;
  lastPageView: string;
  lastEvent: GA4Event | null;
}

export interface PageViewEvent {
  url: string;
  title?: string;
  timestamp: number;
}

export interface UserInteractionEvent {
  action: string;
  label: string;
  value?: number;
  params?: Record<string, any>;
  timestamp: number;
}
