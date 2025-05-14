# Xpertly – CA Listing Portal Product Requirements Document (PRD)

## 1. Overview

**Project Name:** Xpertly.in  
**Description:** A NoBroker-style platform where users can discover, filter, and contact Chartered Accountants (CAs).  
**Objective:** Build a mobile-first, modular, and maintainable CA listing portal from scratch. Every UI component must be kept under **200 lines of code** and all progress, context, and guidelines must be meticulously tracked via dedicated documents.

---

## 2. Goals & Objectives

- **User-Centric Design:**

  - Deliver a seamless experience focused on mobile devices first.
  - Ensure interactive elements (search, filters, buttons) are optimized for small screens.

- **Scalability & Maintainability:**

  - All UI components must be modular with a **maximum of 200 lines of code** per component.
  - Maintain rigorous progress tracking (via `progress.md`) after every task and sub-task.

- **Development Transparency & Context Management:**
  - Document every development step in `progress.md`.
  - Maintain and update a dedicated Cursor rules file (**cursor_rules.md** or a machine-readable equivalent like `.cursor_rules.json`) that guides the AI agent to stay context-aware, adhere to the mobile-first strategy, and enforce the 200-line rule.

---

## 3. Target Audience

- **Primary Users:** Users searching for verified Chartered Accountants.
- **Secondary Users:** Chartered Accountants promoting their services and managing inquiries.
- **Administrators:** Users responsible for verifying profiles and managing administrative tasks.

---

## 4. Tech Stack & Libraries

### Core Libraries & Frameworks

- **Next.js:** For server-side rendering and building the React-based application.
- **TailwindCSS:** For utility-first styling with a mobile-first design approach.
- **shadcn UI:** To provide a set of pre-built UI components following TailwindCSS design principles.
- **react-query:** For managing asynchronous data flows, caching, and error handling.
- **Prettier:** To maintain consistent code formatting.
- **@phosphor-icons/react:** For consistent, scalable and customizable icons throughout the application. This should be the ONLY icon library used.
- **Supabase:** Backend-as-a-Service for PostgreSQL, Authentication, and Storage.
- **Vercel:** For deployment.

### Recommended shadcn UI Components

- **Button:** For primary/secondary actions.
- **Card:** For CA listing cards and profile previews.
- **Input & Textarea:** For forms such as search fields and contact forms.
- **Select/Dropdown:** For filtering options (e.g., City, Services, Verified Only).
- **Modal/Dialog:** For pop-ups including the contact form.
- **Avatar:** For CA profile pictures (with a placeholder for the initial logo).

---

## 5. File Naming Conventions & Structure

### Naming Conventions

- **React Components in features/layout:** Files containing React components must be named using PascalCase with a `.component.tsx` extension.
  - Example: `Header.component.tsx`, `CACard.component.tsx`
- **UI Components:** Base UI components must be named using PascalCase with a `.ui.tsx` extension.
  - Example: `Button.ui.tsx`, `Card.ui.tsx`
- **Provider Components:** Provider components must be named using PascalCase with a `.provider.tsx` extension.
  - Example: `Auth.provider.tsx`, `Theme.provider.tsx`
- **Helper Functions:** Helper functions must be stored in the `/helper` directory with a `.helper.ts` extension.
  - Example: `tw.helper.ts`, `supabase.helper.ts`
- **Types/Interfaces:** Type definitions must be stored in the `/types` directory with a `.type.ts` extension.
  - Example: `ca.type.ts`
- **Constants:** Constant values must be stored in the `/constants` directory.

### Directory Structure

The project follows a structured approach to file organization:

```
src/
  ├── app/           # Next.js App Router pages
  ├── components/    # React components
  │   ├── layout/    # Layout components
  │   └── features/  # Feature-specific components
  ├── ui/            # Base UI components (buttons, inputs, etc.)
  ├── store/         # State management
  │   ├── context/   # Context-based state providers
  │   └── jotai/     # Jotai state management
  ├── helper/        # Helper functions and utilities
  ├── constants/     # Constants and configuration values
  ├── types/         # TypeScript interfaces and types
  └── mock/          # Mock data for development
```

---

## 6. Design & Technical Constraints

- **Mobile-First Design:**

  - All pages and components must be designed initially for mobile devices, then progressively enhanced for larger screens.
  - Define responsive breakpoints in the TailwindCSS configuration.
  - Ensure proper padding scales with screen size (more padding on larger screens).
  - Set appropriate max-width constraints to prevent content from stretching too wide on large screens.

- **Visual Design Requirements:**

  - **Vibrant and Bold Design:** Use gradients, shadows, and visual effects to create a visually appealing interface.
  - **Card Components:** Feature cards should have gradient headers, visual icons, and interactive hover effects.
  - **Depth and Dimension:** Utilize shadows, overlays, and subtle animations to add depth to the interface.
  - **Color Gradient Accents:** Use gradient backgrounds for section headers and CTA areas.
  - **Interactive Elements:** Add hover states that provide visual feedback through transforms, shadow changes, and color shifts.
  - **Visual Patterns:** Incorporate subtle background patterns and decorative elements to add texture without overwhelming.

- **Component Modularity:**

  - Every component should be **under 200 lines of code** to ensure modularity and maintainability.

- **TailwindCSS Theme Configuration:**

  - A Tailwind configuration file must be created, including our established color palette (see Section 7 below).
  - The theme should include the primary (deep blue), secondary (lighter blue), accent (emerald green), and neutral color styles.
  - Utilize TailwindCSS utility classes for consistent spacing, shadows, and interactive effects.

- **Iconography:**

  - Use **Phosphor Icons** exclusively for all icon needs throughout the application.
  - Maintain icon consistency in size, style, and color schemes.
  - Icons should be properly sized for touch targets on mobile devices.

- **Placeholder Assets:**

  - Use a placeholder component for the logo until the brand identity is finalized.

- **AI Agent Context Requirements:**
  - The AI agent (Cursor) must remain fully aware of the context through inline comments, `progress.md` updates, and a dedicated rules file.
  - The rules file (either `cursor_rules.md` or a JSON configuration) should lay out the mobile-first design approach, component size limits, and guidelines for updating progress.

---

## 7. TailwindCSS Configuration & Theme Colors

- **Task for Tailwind Configuration:**

  - Add a task to set up `tailwind.config.js` that includes our color palette:

    - **Primary:** Deep Blue (`#1E3A8A`)
    - **Secondary:** Lighter Blue (`#3B82F6`)
    - **Accent:** Emerald Green (`#10B981`)
    - **Neutrals:** White (`#FFFFFF`), Light Gray (`#F3F4F6`), Dark Slate (`#1F2937`), Muted Gray (`#6B7280`)

  - Ensure the configuration reflects mobile-first breakpoints and supports our design system.

## 7.1 Enhanced Visual Design System

The Xpertly platform must follow these visual design guidelines to create a premium, visually appealing experience:

### Hero Sections

- Use layered design with background gradients, subtle patterns, and decorative blur elements
- Include badge elements above headings for additional context
- Implement text highlighting with gradient backgrounds or underlines
- Ensure proper spacing and visual hierarchy

### Feature Cards

- Design with gradient headers in different colors (primary blue, secondary blue, accent green) for visual variety
- Include large, prominent icons in circular white containers
- Add hover effects including:
  - Slight lift/rise effect
  - Rotation animation on icons
  - Shadow deepening
- Use bottom border accents in coordinating colors
- Maintain consistent spacing and typography

### Call-to-Action Areas

- Implement rich gradient backgrounds with subtle pattern overlays
- Add horizontal gradient dividers at top and bottom
- Include badges or labels for context
- Ensure buttons have strong visual presence with hover effects
- Use larger text for higher impact

### Search Components

- Box-shadow for elevation effect
- Increased padding and rounded corners
- Clear visual hierarchy with properly sized inputs and buttons
- Pill-shaped secondary buttons for quick selection options

### Visual Patterns and Textures

- Add subtle pattern overlays (dots, lines, etc.) at 10-40% opacity
- Include decorative blur elements in complementary colors
- Use gradient dividers for visual separation
- Apply consistent border styles and shadow treatments

These enhanced visual elements must be implemented consistently while maintaining performance, accessibility, and the mobile-first approach. All visual enhancements should scale appropriately across device sizes.

## 7.2 Role Selection Screen

After signup, users must be presented with a modern, premium role selection screen that branches them into distinct onboarding paths based on their selection. This screen is a critical part of the user journey that sets expectations and personalizes the experience.

### Design Requirements

- **Layout:**

  - Mobile-first design with responsive behavior
  - Centered content with appropriate padding
  - Maximum width constraint for larger screens
  - Soft glassmorphism panels with subtle transparency
  - Decorative background elements (blurs, plus signs, dots)

- **Content Structure:**

  - Bold welcome heading ("Welcome to Xpertly")
  - Supportive subtext ("Let's get to know you a bit…")
  - Two large, visually distinct role selection cards
  - Generous spacing between elements

- **Role Selection Cards:**

  - Each card must have:
    - Gradient header in brand colors (primary for CA, accent for Customer)
    - Bold, prominent Phosphor icon (Briefcase for CA, Handshake for Customer)
    - Clear label ("I'm a CA", "I'm a Customer")
    - Brief description of the role
    - Rounded corners and elegant shadows
    - Interactive hover/tap states
    - Clear visual distinction between options

- **Visual Style:**

  - Vibrant gradients using brand colors
  - Subtle background decorations
  - Rounded corners (min 12px radius)
  - Elegant shadows for depth
  - Premium, clean aesthetic inspired by Hubble's Pluto gifting platform

- **Accessibility:**
  - High contrast text for readability
  - Large touch targets (minimum 44x44px)
  - Keyboard navigation support
  - Screen reader friendly labeling
  - Focus indicators for keyboard users

### Functionality Requirements

- **User Flow:**

  - Screen appears immediately after successful signup
  - Selection of "I'm a CA" routes to CA-specific onboarding
  - Selection of "I'm a Customer" routes to customer-specific onboarding
  - Role selection must be stored in user profile

- **State Management:**

  - User role must be stored in Jotai store
  - Role selection must persist across sessions
  - Role information must be saved to backend when available

- **Analytics:**
  - Track impressions of role selection screen
  - Track selection of each role type
  - Track time spent on decision
  - Track any abandonment at this step

### Implementation Guidelines

- Create `RoleSelection.component.tsx` in `/components/features/onboarding/`
- Keep component under 200 lines of code
- Use Card component from shadcn UI for role cards
- Use Phosphor icons exclusively
- Implement proper loading and error states
- Add appropriate animations for selection
- Ensure dark mode support

## 7.3 User Onboarding Flow

After selecting the "I'm a Customer" role, users must complete a customer-specific onboarding flow that captures essential information to connect them with relevant CAs and generate quality lead data.

### Objective

Collect additional details from users that will:

- Help match them with the most relevant Chartered Accountants
- Enable regional targeting and personalized recommendations
- Provide context for CAs reviewing potential client needs
- Generate actionable lead data for the platform

### Design Requirements

- **Layout:**

  - Mobile-first design with responsive behavior
  - Multi-step form with clear progress indication
  - Soft glassmorphism panels with subtle transparency
  - Decorative background elements consistent with the role selection screen
  - Generous whitespace and clear visual hierarchy

- **Visual Style:**

  - Maintain the premium, playful aesthetic inspired by Hubble's Pluto gifting platform
  - Use Xpertly's brand color palette with bold gradients
  - Incorporate smooth rounded cards and elegant shadow layers
  - Large, clear form elements with ample touch targets
  - Animated transitions between form sections
  - Vivid CTA buttons with hover/active states

- **Form Elements:**

  - Profile picture upload with preview
  - Phone number input with optional flag
  - WhatsApp toggle switch
  - City & State dropdown with search functionality
  - Multi-select component for services needed
  - Single-select dropdown for urgency/timeline
  - Textarea for additional notes
  - Clear, prominent action buttons

- **Accessibility:**
  - High contrast text and form elements
  - Proper labeling for screen readers
  - Keyboard navigation support
  - Error states with clear messaging
  - Focus indicators for keyboard users

### Field Specifications

1. **Profile Picture:**

   - Optional image upload
   - Preview functionality
   - Default avatar placeholder
   - Support for cropping/resizing

2. **Phone Number:**

   - Optional field
   - Input with validation
   - Format guidance

3. **WhatsApp Availability:**

   - Toggle switch (Yes/No)
   - Only enabled if phone number is provided

4. **City & State:**

   - Required field
   - Single-select dropdown with search
   - Prioritize major cities

5. **Type of Services Needed:**

   - Required field
   - Multi-select component
   - Use the same services list defined in CA onboarding
   - Grouped by category for easier selection

6. **Urgency / Timeline:**

   - Required field
   - Single-select dropdown with options:
     - Immediately
     - Within a week
     - This month
     - Just exploring

7. **Additional Notes:**
   - Optional textarea
   - Character limit with counter
   - Placeholder text suggesting useful information to share

### Functionality Requirements

- **User Flow:**

  - Form appears after role selection (if "I'm a Customer" is chosen)
  - Progress indication shows completion status
  - Form can be partially completed and resumed later
  - Skip option available for non-essential fields
  - Submission confirmation with next steps

- **Data Persistence:**

  - All fields must be persisted to the user's profile in Supabase
  - Data must be queryable for CA-side filtering
  - Form state must be saved during completion to prevent data loss

- **Validation:**

  - Client-side validation for all fields
  - Proper error handling and messaging
  - Prevent submission of invalid data

- **Analytics:**
  - Track form starts, completions, and abandonments
  - Measure time spent on each field
  - Track skip rates for optional fields
  - Monitor conversion funnel through the onboarding process

### Implementation Guidelines

- Create `UserOnboardingForm.component.tsx` in `/components/features/onboarding/`
- Keep component under 200 lines of code by extracting field components as needed
- Use shadcn UI components for consistent styling
- Implement form state management with Jotai
- Use Phosphor icons exclusively
- Add appropriate animations for transitions and feedback
- Ensure dark mode support
- Implement responsive design for all screen sizes
- Add comprehensive form validation
- Include loading and error states

## 8. State Management Guidelines

### 8.1 Jotai Implementation

The project uses Jotai for state management, following these strict guidelines:

- **File Organization:**

  - All store-related code MUST be in the `/store/jotai` directory
  - Store files must use the `.store.ts` extension (e.g., `analytics.store.ts`, `onboarding.store.ts`)
  - Type definitions MUST be in dedicated type files in the `/types` directory

- **Import Patterns:**

  - Use `jotai/vanilla` for atom creation
  - Use `jotai/react` for React-specific hooks
  - Import all Jotai functionality from centralized exports in `src/store/jotai/index.ts`

- **Critical Rules:**

  - NO new providers should be created
  - NO duplication of type definitions in store files
  - Store files should only contain atom definitions, not type definitions
  - Maintain correct separation between server and client components when using Jotai

- **Structuring Atoms:**

  - Group related atoms in the same file
  - Use meaningful, consistent naming with the `Atom` suffix (e.g., `userProfileAtom`)
  - Follow a standard organization: base atoms first, then derived atoms, then action atoms

- **Avoiding Common Issues:**
  - Always update imports when renaming files to prevent "module not found" errors
  - Do not create atom instances outside of store files
  - Maintain state tracking integrity when refactoring
  - Prevent "multiple Jotai instances" error through proper import patterns

These guidelines must be strictly followed to maintain code quality and prevent state management issues.

---

## 9. Development Environment & Contextual Awareness

- **Using Cursor IDE:**
  - **Context Management:** Every file should include inline comments that reference the mobile-first design philosophy and the 200-line rule.
  - **Progress Tracking:**
    - Create and continually update a `progress.md` file after each completed task or sub-task.
    - This file is critical for ensuring that work can be resumed seamlessly if interruptions occur.
- **Cursor Rules Storage:**
  - **Recommendation:**
    - After researching best practices, it is acceptable to store the Cursor rules in a dedicated Markdown file (`cursor_rules.md`) for human readability.
    - For enhanced machine parsing, consider also including a JSON configuration file (e.g., `.cursor_rules.json`) in the project root.
  - **Guidelines in the Rules File:**
    - Mobile-first design mandates.
    - Maximum of 200 lines per component.
    - Detailed instructions for updating `progress.md` after every task.
    - Consistent usage of Next.js, TailwindCSS, shadcn UI components, react-query, and phosphoricons.

_Example Entry in `cursor_rules.md` or `.cursor_rules.json`:_
Rule 1: All components must follow a mobile-first approach. Rule 2: No component should exceed 200 lines of code. Rule 3: Update progress.md after every task/sub-task with detailed context. Rule 4: Use Next.js, TailwindCSS (with the defined theme colors), shadcn UI components, react-query, and phosphoricons. ...

---

## 10. Detailed Task Breakdown

Every phase reaffirms the mobile-first design approach, component line limits, library usage, and thorough progress tracking. The tasks below cover every step from setup to deployment.

### Phase 1: Project Initialization & Setup

- **Task 1:** Initialize project repository and structure.
  - Create essential directories: `components`, `pages`, `styles`, etc.
  - Create initial files:
    - `prd.md` (this document)
    - `progress.md` – to track development updates.
    - `cursor_rules.md` (and optionally `.cursor_rules.json`) – to document project guidelines.
  - **Note:** Every file and component must follow the mobile-first approach and adhere to the 200-line rule.
- **Task 2:** Configure the Next.js project.
  - Install dependencies: Next.js, TailwindCSS, shadcn UI, react-query, phosphoricons, Prettier.
  - **Sub-Task:** Set up TailwindCSS:
    - Create and configure `tailwind.config.js` with mobile-first breakpoints.
    - Include our color palette:
      - Primary: `#1E3A8A`
      - Secondary: `#3B82F6`
      - Accent: `#10B981`
      - Neutrals: `#FFFFFF`, `#F3F4F6`, `#1F2937`, `#6B7280`
- **Task 3:** Establish project configuration and CI.
  - Create ESLint, Prettier, and other config files.
  - Set up Continuous Integration if applicable.
- **Progress Update:** Log completion of setup tasks in `progress.md`, specifying adherence to the mobile-first design and 200-line rules.

### Phase 2: UI/UX Design & Component Layout

- **Task 4:** Establish a design system and style guide.
  - Document the color palette, typography, spacing, and responsive breakpoints.
  - List all shadcn UI components to be used (Button, Card, Input, Dropdown, Modal, Avatar).
- **Task 5:** Create the Placeholder Logo Component.
  - Develop a simple placeholder component (less than 200 lines) that can be later replaced with the final logo.
- **Task 6:** Build foundational layout components.
  - Develop Header, Footer, and Container components.
  - Ensure these are mobile-first and modular (under 200 lines each).
- **Task 7:** Integrate and document progress tracking.
  - Clearly specify how every task and sub-task must be logged in `progress.md`.
- **Progress Update:** Update `progress.md` with UI/UX design tasks completion, ensuring context and design rules are followed.

### Phase 3: Authentication & User Management

- **Task 1:** Implement Core Authentication

  - [x] Set up Supabase client and authentication
  - [x] Create Auth provider for state management
  - [x] Develop login and signup forms
  - [x] Implement form validation
  - [x] Add error handling and notifications

- **Task 2:** Implement Google Authentication

  - **Google OAuth Setup:**

    - Configure Google OAuth provider in Supabase dashboard
    - Add Google OAuth credentials to environment variables
    - Set up proper redirect URIs in Google Cloud Console

  - **Component Development:**

    - **GoogleButton Component:**

      - Create `GoogleButton.ui.tsx` (under 200 lines)
        - Implement mobile-first design with TailwindCSS
        - Add Google logo using Phosphor icons
        - Include loading and error states
        - Add hover and focus effects
        - Ensure proper accessibility attributes
        - Support dark mode

    - **AuthDivider Component:**

      - Create `AuthDivider.ui.tsx` (under 200 lines)
        - Design "OR" divider with decorative elements
        - Implement responsive styling
        - Add subtle animations
        - Support dark mode

    - **GoogleAuthProvider Component:**

      - Create `GoogleAuth.provider.tsx` (under 200 lines)
        - Handle Google OAuth state management
        - Manage multiple account selection
        - Implement error handling
        - Add loading states
        - Handle authentication success/failure

    - **GoogleProfileExtractor Component:**
      - Create `GoogleProfileExtractor.helper.ts` (under 200 lines)
        - Extract user profile data from Google response
        - Map Google data to application profile structure
        - Handle missing or incomplete data
        - Add type safety with TypeScript

  - **Integration Tasks:**

    - **Login Form Integration:**

      - Update `LoginForm.component.tsx`
        - Add AuthDivider after existing login button
        - Integrate GoogleButton component
        - Handle Google authentication flow
        - Update form layout for mobile-first design

    - **Signup Form Integration:**

      - Update `SignUpForm.component.tsx`
        - Add AuthDivider after existing signup button
        - Integrate GoogleButton component
        - Handle Google authentication flow
        - Update form layout for mobile-first design

    - **Auth Provider Updates:**
      - Update `Auth.provider.tsx`
        - Add Google authentication methods
        - Implement profile check logic
        - Handle redirect logic
        - Add error handling for Google auth

  - **Profile Management:**

    - **Onboarding Integration:**

      - Update `DynamicForm.component.tsx`
        - Add auto-population logic for Google profile data
        - Handle partial profile data
        - Add validation for Google-provided data
        - Implement profile completion check

    - **Profile Check Logic:**
      - Create `ProfileCheck.helper.ts` (under 200 lines)
        - Check if user profile exists
        - Determine redirect destination
        - Handle edge cases

  - **Testing Implementation:**

    - **Component Testing:**

      - Test GoogleButton component
        - Mobile responsiveness
        - Dark mode support
        - Loading states
        - Error handling
        - Accessibility

    - **Flow Testing:**

      - Test Google sign-in flow
        - Multiple account selection
        - Success/failure scenarios
        - Error handling
        - Loading states

    - **Integration Testing:**
      - Test profile auto-population
      - Test redirect logic
      - Test error scenarios
      - Test mobile responsiveness

  - **Documentation:**
    - Update authentication documentation
    - Add Google auth setup guide
    - Document component usage
    - Add troubleshooting guide

- **Task 3:** Implement Role Selection Screen

  - **Component Development:**

    - Create `RoleSelection.component.tsx` (under 200 lines)
      - Implement mobile-first design with TailwindCSS
      - Add welcome heading and supportive subtext
      - Create two visually distinct role selection cards
      - Use Phosphor icons (Briefcase for CA, Handshake for Customer)
      - Add gradient headers and decorative elements
      - Implement hover/tap states and animations
      - Ensure proper accessibility
      - Support dark mode
      - Add decorative background elements

  - **State Management:**

    - Update `user.store.ts` to include role information
    - Create necessary types in `/types/user.type.ts`
    - Implement role persistence in localStorage

  - **Routing Logic:**

    - Update Auth provider to redirect to role selection after signup
    - Implement conditional routing based on role selection
    - Create route guards for role-specific pages

  - **Analytics Integration:**

    - Track role selection events
    - Measure conversion rates through the selection process

  - **Testing Implementation:**
    - Test component rendering and responsiveness
    - Test role selection functionality
    - Test routing logic
    - Test persistence of role selection
    - Test accessibility compliance

- **Task 4:** Implement User Onboarding Flow

  - **Component Development:**

    - Create `UserOnboardingForm.component.tsx` (under 200 lines)
      - Implement mobile-first design with TailwindCSS
      - Add form fields with proper validation:
        - Profile picture upload
        - Phone number input (optional)
        - WhatsApp availability toggle
        - City & State dropdown
        - Services needed multi-select
        - Urgency/timeline dropdown
        - Additional notes textarea
      - Create progress indicator
      - Add form navigation controls
      - Implement skip options for optional fields
      - Ensure proper accessibility
      - Support dark mode
      - Add decorative elements matching design spec

  - **State Management:**

    - Update `user.store.ts` to include customer profile information
    - Create necessary types in `/types/user.type.ts`
    - Implement form state persistence during completion
    - Connect form submission to Supabase user profile

  - **Field Components:**

    - Create reusable field components as needed:
      - `ProfilePictureUpload.component.tsx`
      - `PhoneNumberInput.component.tsx`
      - `LocationSelect.component.tsx`
      - `ServicesMultiSelect.component.tsx`
      - `UrgencySelect.component.tsx`

  - **Validation Logic:**

    - Implement client-side validation for all fields
    - Add proper error handling and messaging
    - Create validation helper functions

  - **Analytics Integration:**

    - Track form starts, completions, and abandonments
    - Measure time spent on each field
    - Track skip rates for optional fields
    - Monitor conversion funnel

  - **Testing Implementation:**
    - Test component rendering and responsiveness
    - Test form validation logic
    - Test data persistence
    - Test skip functionality
    - Test form submission
    - Test accessibility compliance

#### Home Page

- **Task 8:** Design and Build the Home Page.

  - Develop a mobile-first Home Page with a search bar (location, services, verified checkbox), featured CA listings, and the placeholder logo.
  - Redesign the homepage to feature:
    - Hero section with search functionality
    - Interactive Forum section with activity feed
    - Featured CA listings
  - Move "Why Choose Xpertly?" and "Are You a Chartered Accountant?" sections to the About page.
  - Use shadcn UI components such as Button, Input, and Card.
  - Implement vibrant design elements including gradients, decorative blurs, and subtle patterns.
  - Ensure all icons are from the Phosphor Icons library.
  - Add hover effects and transitions for interactive elements.

- **Task 9:** Test mobile responsiveness.
  - Verify components across multiple mobile devices.
  - Confirm each component meets the 200-line limit and context guidelines.
  - Ensure the design maintains visual appeal across all device sizes.
  - Test hover and interactive effects on both touch and pointer devices.

#### Forum Feature

- **Task 10:** Design and Implement the Forum Feature.

  - **Objective:**

    - Create an engaging, interactive community space for users to share questions, insights, and experiences
    - Facilitate connections between CAs and customers through topical discussions
    - Increase user retention and platform engagement through community features
    - Generate valuable user-generated content for the platform

  - **User Roles & Permissions:**

    - **All Users:**
      - View public forum posts and comments
      - Search and filter posts by various criteria
      - Follow topics via hashtags
    - **Logged-in Customers:**
      - Create new posts with text, images, and hashtags
      - React to posts with various reactions
      - Comment on posts and reply to comments
      - Edit and delete their own content
    - **Logged-in CAs:**
      - All customer permissions
      - Special "CA" badge displayed on their posts/comments
      - Option to mark answers as professional advice
      - Access to CA-specific topics and discussions
    - **Administrators:**
      - Moderate content (hide, remove, flag)
      - Pin important posts
      - Create and manage featured topics
      - Ban users who violate platform policies

  - **Data Model:**

    - **Post:**
      - Unique ID
      - Author (User reference)
      - Content (text, supports rich formatting)
      - Images (optional, maximum 5)
      - Hashtags (optional, maximum 5)
      - Created timestamp
      - Modified timestamp
      - Reaction counts (by reaction type)
      - Comment count
      - View count
      - Status (active, hidden, deleted)
    - **Comment:**
      - Unique ID
      - Post reference
      - Parent comment reference (for replies)
      - Author (User reference)
      - Content (text)
      - Created timestamp
      - Modified timestamp
      - Reaction counts
      - Status (active, hidden, deleted)
    - **Reaction:**
      - Unique ID
      - User reference
      - Target reference (post or comment)
      - Reaction type (like, love, insightful, etc.)
      - Created timestamp
    - **Hashtag:**
      - Name
      - Post count
      - Follower count

  - **UI/UX Design Goals:**

    - **Layout:**
      - Mobile-first, responsive design
      - Fast-loading post feed with infinite scroll
      - Clean, distraction-free reading experience
      - Intuitive navigation between posts, comments, and threads
      - Prominent UI elements for creating new content
    - **Visual Style:**
      - Consistent with Hubble's Pluto gifting platform aesthetic
      - Bold gradients for section headers and CTAs
      - Glassmorphism panels for post cards
      - Smooth rounded corners (min 12px radius)
      - Elegant shadow layering for depth
      - Animated transitions for interactions
      - Large, touch-friendly interactive elements
    - **User Experience:**
      - One-tap reactions for quick engagement
      - Seamless transition between browsing and creating content
      - Clear visual hierarchy for comments and replies
      - Intuitive search and filter controls
      - Prominent call-to-action for creating first post

  - **Component Requirements:**

    - **ForumFeed Component:**

      - Virtual scrolling for performance
      - Lazy loading of images
      - Sort controls (trending, recent, relevant)
      - Filter controls (by tags, by user type)
      - Empty state with prompt to create content
      - Loading and error states
      - Pagination or infinite scroll

    - **PostCard Component:**

      - Author information with avatar
      - Content display with proper text wrapping
      - Image carousel for multiple images
      - Reaction buttons with counts
      - Comment count and preview
      - Hashtag display with links
      - Timestamp with relative formatting
      - Options menu for post owner
      - Share functionality
      - Responsive layout for all screen sizes

    - **ReactionSystem Component:**

      - Multiple reaction types (thumbs up, heart, insightful, etc.)
      - Animated reaction selection
      - Count display for each reaction type
      - User's current reaction highlighted
      - One-tap to add/remove common reaction
      - Press-and-hold for reaction selection menu

    - **CommentThread Component:**

      - Nested replies with proper visual hierarchy
      - Collapsible thread sections
      - "Load more" functionality for long threads
      - Reply form with @mention support
      - Comment sorting options
      - Owner controls for editing/deleting
      - Reaction support for individual comments

    - **CreatePost Component:**

      - Rich text editor with basic formatting
      - Image upload with preview
      - Hashtag input with autocomplete
      - Character limit indicator
      - Draft saving functionality
      - Preview option before posting
      - Submit button with loading state
      - Error handling with user feedback

    - **SearchAndFilter Component:**
      - Keyword search with highlighting
      - Tag filtering with multi-select
      - User type filtering (CA/Customer)
      - Date range selection
      - Sort order controls
      - Filter combination logic
      - Save filter preferences option
      - Clear all filters button

  - **Interaction Guidelines:**

    - **Post Creation:**

      - Single-click "Create Post" button on feed
      - Expandable editor with rich formatting options
      - Image attachment via drag-drop or file picker
      - Hashtag creation with # prefix in content or dedicated field
      - Preview capability before submission
      - Draft auto-save every 30 seconds

    - **Reactions:**

      - One-tap on primary reaction button for quick like
      - Press-and-hold for reaction selection menu
      - Animated feedback when reaction is recorded
      - Tapping active reaction removes it

    - **Comments:**

      - Expandable comment section on post card
      - Reply button on each comment for threading
      - Nested replies with visual indentation
      - Collapse/expand for long threads
      - @mention support with username autocomplete

    - **Search & Discovery:**
      - Persistent search bar at top of feed
      - Tag cloud for popular/trending topics
      - Filter sidebar/modal accessible via button
      - "Followed Tags" section for personalized content
      - "Recommended" feed based on user interests

  - **Analytics & Metrics:**

    - Track post views, creation rates, and completion
    - Measure comment-to-view ratio for engagement
    - Monitor reaction distribution across post types
    - Track search queries and filter combinations
    - Measure content creation funnel (draft → publish)
    - Analyze hashtag popularity and growth trends

  - **Implementation Guidelines:**
    - Create all components under `/components/features/forum/`
    - Keep each component under 200 lines of code
    - Use Card component from shadcn UI for post cards
    - Use Phosphor icons exclusively
    - Implement proper loading and error states
    - Add appropriate animations for interactions
    - Ensure full dark mode support
    - Implement responsive design for all screen sizes
    - Add comprehensive accessibility features
    - Implement proper data caching for performance

#### CA Listings & Profile Pages

- **Task 14:** Develop the CA Listings Page.

  - Build filter components using shadcn's Dropdown/Select.
  - Create CA listing cards using shadcn's Card.
  - Ensure a mobile-first design and that each component is under 200 lines.
  - Apply the enhanced visual design principles to listing cards.

- **Task 15:** Develop the CA Profile Page.

  - Build a detailed profile view with:
    - CA photo (using Avatar),
    - Contact details,
    - Services offered,
    - "Contact This CA" call-to-action.
  - Keep code modular and under the line limit.
  - Implement rich visual elements like gradient sections and decorative accents.

- **Task 16:** Build the Contact Form.
  - Use shadcn's Input, Textarea, and Button components.
  - Implement success/error states and integrate with react-query.
  - Create a visually appealing form with proper spacing and interactive elements.

#### CA & Admin Dashboards

- **Task 17:** Build CA Authentication & Profile Creation.
  - Implement the signup/login flows via Supabase Auth.
  - Develop a multi-step form for profile creation using shadcn UI components.
  - Ensure every component is less than 200 lines.
- **Task 18:** Develop the CA Dashboard.
  - Build a dashboard to view leads, upload documents, and edit profiles.
  - Include a progress indicator for profile completion.
- **Task 19:** Develop the Admin Dashboard.
  - Create an interface for verifying CA profiles with search and action buttons.
  - Use shadcn UI components to ensure consistency and mobile-first design.

#### SEO Optimization

- **Task 20:** Implement SEO Best Practices
  - Configure proper meta tags for all pages
  - Add Open Graph tags for social media sharing
  - Implement dynamic meta descriptions based on page content
  - Add structured data (JSON-LD) for CA profiles
  - Ensure proper heading hierarchy (h1, h2, etc.)
  - Add sitemap.xml generation
  - Configure robots.txt
  - Implement canonical URLs
  - Add alt text for all images
  - Optimize page load performance
  - Implement proper URL structure and slugs for CA profiles
  - Add breadcrumb navigation

#### Dark Theme Implementation

- **Task 21:** Implement Dark Mode Support
  - Install and configure next-themes package
  - Create theme toggle component with smooth transitions
  - Update TailwindCSS configuration for dark mode
  - Implement dark mode color palette:
    - Background colors hierarchy
    - Text colors hierarchy
    - Border colors
    - Shadow adjustments
  - Update components for dark mode:
    - SearchBar component
    - CACard component
    - Header and Footer
    - Buttons and form elements
    - Modal/dialogs
  - Add dark mode support for:
    - Gradient backgrounds
    - Hover states and transitions
    - Icons and decorative elements
    - Form inputs and validation states
  - Ensure proper contrast ratios in dark mode
  - Add system preference detection
  - Implement theme persistence
  - Test across different browsers and devices
  - Document dark mode implementation guidelines

#### Authentication System

- **Task 10:** Implement User Authentication with Supabase.
  - Set up Supabase client with authentication services.
  - Create a robust authentication context provider for global state management.
  - Build mobile-first login, signup, and password recovery forms.
  - Implement form validation with descriptive error messages.
  - Design authentication pages with vibrant, consistent styling.
  - Add loading states and success/error handling.
  - Ensure full dark mode support for authentication flows.
  - Update header to include conditional authentication links.
  - Create dedicated routes for authentication using a specialized layout.
  - Test the complete authentication flow on multiple devices.

### Phase 4: CA Onboarding & Authentication

- **Task 4.1: Implement Mock Authentication**
  - **Requirement:** Provide a simple authentication mechanism using `localStorage` for development purposes while Supabase is unavailable.
  - **Sub-Tasks:**
    - [x] Update `Auth.provider.tsx` to use `localStorage` instead of Supabase calls.
    - [x] Modify `SignUpForm` to store mock user data in `localStorage` on successful signup.
    - [x] Modify `LoginForm` to check `localStorage` for mock user data.
    - [x] Ensure `signOut` clears `localStorage`.
- **Task 4.2: Create CA Onboarding Flow**
  - **Requirement:** Develop a multi-step onboarding process for new CA users after signup.
  - **User Experience:** Must be mobile-first, intuitive, and provide clear progress indication.
  - **Sub-Tasks:**
    - [x] Create `/ca/onboarding` page route.
    - [x] Implement route protection (redirect to login if not authenticated via mock auth).
    - [x] Develop `DynamicForm` component to manage onboarding steps.
    - [x] Define onboarding steps:
      - [x] Welcome step (greeting, brief explanation).
      - [x] Professional Details step (Years of Experience, Areas of Specialization).
      - [x] Document Verification step (CA Certificate, Profile Photo).
    - [x] Implement `FormProgressIndicator` component.
    - [x] Implement `FormStepTitle` component (hiding title/step count for welcome step).
    - [x] Implement `FormNavigation` component (sticky footer, hides Previous on first step).
    - [x] Use appropriate UI components (`Select`, `CheckboxGroup`, `FileUpload`) directly within `DynamicForm`.
    - [x] Ensure `DynamicForm`
