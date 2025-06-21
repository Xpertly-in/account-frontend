# Xpertly Analytics Documentation

This document serves as the single source of truth for all analytics implementation in the Xpertly CA Listing Portal.

## Table of Contents

1. [Analytics Events](#analytics-events)
2. [Google Analytics 4 Setup](#google-analytics-4-setup)
3. [Analytics Implementation Status](#analytics-implementation-status)
4. [Privacy Compliance](#privacy-compliance)
5. [Dashboard & Reporting](#dashboard--reporting)
6. [Troubleshooting](#troubleshooting)

## Analytics Events

### Event Categories

We use the following event categories to organize our analytics:

- `page_view`: Page view events
- `user_interaction`: User interaction events (clicks, hovers, etc.)
- `form_submission`: Form submission events
- `profile_view`: CA profile view events
- `contact`: Contact-related events

### Page View Events

| Event Name  | Description                        | Parameters                |
| ----------- | ---------------------------------- | ------------------------- |
| `page_view` | Tracked when a user views any page | `page_path`, `page_title` |

### User Interaction Events

| Event Name         | Description                  | Parameters                              |
| ------------------ | ---------------------------- | --------------------------------------- |
| `user_interaction` | Generic user interaction     | `action`, `label`, `value`, `timestamp` |
| `search`           | Search query execution       | `location`                              |
| `quick_location`   | Quick location selection     | `location`                              |
| `view_profile`     | CA profile view button click | `ca_id`, `ca_name`, `ca_location`       |
| `contact_ca`       | Contact CA button click      | `ca_id`, `ca_name`, `ca_location`       |
| `google_sign_in`   | Google sign-in button click  | `method`                                |

### Form Submission Events

| Event Name        | Description                   | Parameters                                                |
| ----------------- | ----------------------------- | --------------------------------------------------------- |
| `form_submission` | Generic form submission       | `form_name`, `success`                                    |
| `login_attempt`   | Login form submission attempt | `method`, `email_domain`                                  |
| `login_form`      | Login form submission result  | `method`, `error` (if failed), `redirect` (if successful) |

### Profile View Events

| Event Name     | Description          | Parameters                   |
| -------------- | -------------------- | ---------------------------- |
| `profile_view` | CA profile page view | `profile_id`, `profile_type` |

### Contact Events

| Event Name     | Description              | Parameters             |
| -------------- | ------------------------ | ---------------------- |
| `contact_form` | Contact form interaction | `form_type`, `success` |

## Implementing Event Tracking

### Using the useAnalytics Hook

To track events in your components, use the `useAnalytics` hook:

```typescript
import { useAnalytics } from '@/hooks/useAnalytics';

const YourComponent = () => {
  const {
    trackEvent,
    trackPageView,
    trackUserInteraction,
    trackFormSubmission,
    trackProfileView,
    trackContact
  } = useAnalytics();

  // Example: Track a button click
  const handleClick = () => {
    trackUserInteraction({
      action: 'click',
      label: 'button_name',
      timestamp: Date.now(),
      params: { additional_data: 'value' }
    });
  };

  // Example: Track a form submission
  const handleSubmit = (success: boolean) => {
    trackFormSubmission('form_name', success, {
      additional_data: 'value'
    });
  };

  return (
    // Your component JSX
  );
};
```

## Google Analytics 4 Setup

### Creating a Google Analytics 4 Property

1. **Go to Google Analytics**: Visit [analytics.google.com](https://analytics.google.com/) and sign in with your Google account.

2. **Create a new GA4 property**:

   - Click on "Admin" in the bottom left corner
   - In the "Account" column, select "Create Account" if you don't have one
   - Once you have an account, click "Create Property"
   - Select "Web" as the platform
   - Fill in your website details (Name, URL, Industry, etc.)
   - Choose "Create a Universal Analytics property" as No
   - Click "Create"

3. **Get your Measurement ID**:

   - Once your property is created, go to "Data Streams" under the property column
   - Click on your web stream
   - Note the "Measurement ID" (it starts with "G-")

4. **Add the Measurement ID to your environment**:
   - Add the following to your `.env.local` file:
     ```
     NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
     ```
   - Replace `G-XXXXXXXXXX` with your actual Measurement ID
   - Also add this to your deployment environment variables

### User Opt-Out

The application respects user privacy preferences:

1. Users can opt out via the Privacy Settings button in the bottom-right corner
2. The application respects Do Not Track browser settings
3. Opt-out preferences are stored in localStorage and cookies

When a user opts out:

- The GA4 script is not loaded
- No data is sent to Google Analytics
- Events are still tracked in the local Jotai state for debugging

## Analytics Implementation Status

### Currently Implemented Analytics

The following components have analytics tracking implemented:

1. **Core Components**:

   - `GoogleAnalytics.component.tsx` - Handles page view tracking across the site
   - `AnalyticsOptOut.component.tsx` - Manages user opt-out preferences

2. **Feature Components**:
   - `SearchBar.component.tsx` - Tracks search queries and quick location selections
   - `CACard.component.tsx` - Tracks profile view clicks and contact clicks
   - `LoginForm.component.tsx` - Tracks login attempts, successes, and failures

### Components & Pages Needing Analytics Implementation

The following components and pages still need analytics tracking:

1. **Auth Components**:

   - `SignUpForm.component.tsx` - Need to track signup attempts and completions
   - `SignUpFormContent.component.tsx` - Need to track form field interactions
   - `SignUpFormFields.component.tsx` - Need to track field validations
   - `SignUpFormTerms.component.tsx` - Need to track terms acceptance
   - `SignUpFormButton.component.tsx` - Need to track button interactions
   - `ForgotPasswordForm.component.tsx` - Need to track password reset attempts
   - `CAAuthTabs.component.tsx` - Need to track tab switching
   - `AuthTabs.component.tsx` - Need to track tab switching on standard auth
   - `CALoginContent.tsx` - Need to track CA-specific login interactions
   - `GoogleAuth.provider.tsx` - Need to enhance Google auth tracking

2. **Profile Components**:

   - `CAProfileHero.component.tsx` - Need to track interactions with hero section
   - `CAContactInfo.component.tsx` - Need to track contact information views
   - `CAProfessionalDetails.component.tsx` - Need to track detail expansions
   - `CAServicesSection.component.tsx` - Need to track service views
   - `CAReviewsSection.component.tsx` - Need to track review interactions

3. **Onboarding Components**:

   - `DynamicForm.component.tsx` - Need to track form step completion
   - `FormNavigation.component.tsx` - Need to track navigation between steps

4. **Pages (App Router)**:
   - `app/page.tsx` (Homepage) - Need to track additional homepage interactions
   - `app/search/page.tsx` - Need to track search page results and filtering
   - `app/ca/[id]/page.tsx` - Need to enhance profile page tracking
   - `app/ca/onboarding/page.tsx` - Need to track onboarding flow
   - `app/ca/dashboard/page.tsx` - Need to track dashboard interactions
   - `app/auth/page.tsx` - Need to track auth page interactions

### Analytics Implementation Plan

1. **Phase 1 (High Priority - Critical User Flows)**:

   - **SignUp Flow Tracking**:
     - `SignUpForm.component.tsx` - Track signup attempts and completions
     - `SignUpFormTerms.component.tsx` - Track terms acceptance
     - `GoogleAuth.provider.tsx` - Track Google authentication flow
   - **Profile Engagement Tracking**:
     - `CAProfileHero.component.tsx` - Track profile hero interactions
     - `CAContactInfo.component.tsx` - Track contact information views and clicks
   - **Onboarding Funnel Tracking**:
     - `DynamicForm.component.tsx` - Track form step completion
     - `FormNavigation.component.tsx` - Track step navigation (back/next)
   - **Estimated Effort**: 1-2 days

2. **Phase 2 (Medium Priority - Enhanced User Experience)**:

   - **Detailed Auth Tracking**:
     - `CAAuthTabs.component.tsx` / `AuthTabs.component.tsx` - Track tab switches
     - `ForgotPasswordForm.component.tsx` - Track password reset flow
   - **Profile Component Tracking**:
     - `CAProfessionalDetails.component.tsx` - Track expanded section views
     - `CAServicesSection.component.tsx` - Track service clicks and impressions
     - `CAReviewsSection.component.tsx` - Track review interactions
   - **Page-level Enhancements**:
     - `app/page.tsx` (Homepage) - Track CTA clicks and section views
     - `app/search/page.tsx` - Track advanced filter usage
   - **Estimated Effort**: 2-3 days

3. **Phase 3 (Lower Priority - Complete Coverage)**:

   - **Detailed Form Interactions**:
     - `SignUpFormFields.component.tsx` - Track field validation errors
     - `SignUpFormButton.component.tsx` - Track button states (disabled/enabled)
     - `LoginFormFields.component.tsx` - Track field focus/blur events
   - **Edge Case Handling**:
     - Add tracking for error states throughout the application
     - Track browser-specific behaviors
   - **Additional App Pages**:
     - `app/ca/dashboard/page.tsx` - Track dashboard interactions
     - `app/auth/page.tsx` - Track auth page entry points
   - **Estimated Effort**: 1-2 days

4. **Phase 4 (Optimization)**:
   - Review analytics data quality
   - Optimize event parameters for better reporting
   - Add custom dimensions for enhanced segmentation
   - Implement enhanced e-commerce tracking if applicable
   - **Estimated Effort**: 1 day

Total Implementation Effort: 5-8 days

## Privacy Compliance

Ensure your website complies with privacy regulations:

1. **Update Privacy Policy**:

   - Disclose the use of Google Analytics
   - Explain what data is collected and how it's used
   - Mention the user's ability to opt-out

2. **Cookie Consent**:

   - The application already includes an opt-out mechanism
   - Consider implementing a cookie consent banner as a first layer of consent
   - Respect Do Not Track (DNT) browser settings (already implemented)

3. **Data Retention**:
   - In GA4, go to "Admin" > "Data Settings" > "Data Retention"
   - Set the data retention period to comply with relevant regulations (e.g., 14 months for GDPR)

## Dashboard & Reporting

### Creating Custom Reports

1. **Create a User Behavior Report**:

   - Go to "Reports" > "Explore" in your GA4 property
   - Click "Blank" to create a new exploration
   - Add dimensions: "Page path and screen class", "Event name", "Device category"
   - Add metrics: "Event count", "Engagement rate", "User engagement duration"
   - Save the report as "User Behavior Analysis"

2. **Create a Form Interaction Report**:

   - Create another exploration
   - Add dimensions: "Event name", "Form name", "Success status"
   - Add metrics: "Event count", "User engagement duration"
   - Apply a filter: Event name contains "form"
   - Save the report as "Form Interactions"

3. **Create a CA Profile Engagement Report**:
   - Create another exploration
   - Add dimensions: "Profile ID", "Profile type", "Event name"
   - Add metrics: "Event count", "Users", "New users"
   - Apply filter: Event name contains "profile"
   - Save the report as "CA Profile Engagement"

### Setting Up Funnel Analysis

1. **Create a Conversion Funnel**:
   - Go to "Explore" > "Funnel exploration"
   - Add funnel steps:
     - Step 1: "page_view" (Homepage)
     - Step 2: "search" (Search query)
     - Step 3: "view_profile" (Profile view)
     - Step 4: "contact_ca" (Contact form)
   - Save as "CA Contact Conversion Funnel"

### Key Metrics to Monitor

1. **Engagement Metrics**:

   - User engagement duration
   - Average engagement time per session
   - Engaged sessions per user

2. **Conversion Metrics**:

   - Search to profile view rate
   - Profile view to contact rate
   - Overall conversion rate (search to contact)

3. **User Behavior Metrics**:
   - Most viewed CA profiles
   - Most searched locations
   - Most common user paths

## Troubleshooting

If you encounter issues with your GA4 implementation:

1. **Events Not Tracking**:

   - Check that the Measurement ID is correct
   - Verify that analytics are not being blocked by browser extensions
   - Ensure the user hasn't opted out via the privacy settings

2. **Data Discrepancies**:

   - Cross-reference with server logs if available
   - Check for duplicate events in DebugView
   - Verify that the events are configured correctly

3. **Performance Issues**:
   - GA4 is designed to be lightweight, but monitor for any impact
   - Ensure the scripts are loaded with the correct strategy (afterInteractive)
   - Consider implementing a throttling mechanism for high-volume events

## Additional Resources

- [GA4 Developer Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Event Reference](https://support.google.com/analytics/answer/9322688)
- [GA4 Reporting API](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Tag Manager](https://marketingplatform.google.com/about/tag-manager/) (for more complex tracking needs)
