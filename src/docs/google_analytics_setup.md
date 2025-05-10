# Google Analytics 4 Setup Guide for Xpertly

This guide will help you set up and configure Google Analytics 4 (GA4) for the Xpertly CA Listing Portal.

## Creating a Google Analytics 4 Property

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

## Configuring Your Google Analytics Dashboard

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

## Setting Up Alerts

1. **Create Engagement Drop Alert**:

   - Go to "Admin" > "Custom Alerts"
   - Click "Create custom alert"
   - Name: "Engagement Drop Alert"
   - Apply to: Your property
   - Alert Trigger: "Event count drops below X"
   - Set threshold of 80% compared to previous day
   - Set to receive email notifications
   - Click "Save"

2. **Create Error Rate Alert**:
   - Create another custom alert
   - Name: "Form Error Alert"
   - Alert Trigger: "login_form" events with "error" parameter increase by 50%
   - Set to receive email notifications
   - Click "Save"

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

## Testing Your Implementation

1. **Use GA4 DebugView**:

   - In GA4, go to "Configure" > "DebugView"
   - Enable debug mode in your application:
     ```javascript
     // In your browser console
     localStorage.setItem("debug_mode", "true");
     ```
   - Perform actions on your site and verify they appear in DebugView

2. **Check Real-Time Reports**:

   - Go to "Reports" > "Realtime" in GA4
   - Interact with your site and verify the events appear

3. **Validate with Google Tag Assistant**:
   - Install the [Tag Assistant](https://chrome.google.com/webstore/detail/tag-assistant-by-google/kejbdjndbnbjgmefkgdddjlbokphdefk) Chrome extension
   - Visit your site and verify the GA4 tag is firing correctly

## Interpreting Analytics Data

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

### Creating a Dashboard

1. **Set up a GA4 Dashboard**:
   - Go to "Customization" > "Dashboards"
   - Click "Create Dashboard"
   - Add cards for key metrics:
     - User engagement summary
     - CA profile views by location
     - Form submission success/failure rate
     - Conversion funnel visualization
   - Save and share with your team

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
