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

---

## 8. Development Environment & Contextual Awareness

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

## 9. Detailed Task Breakdown

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

#### Home Page

- **Task 8:** Design and Build the Home Page.

  - Develop a mobile-first Home Page with a search bar (location, services, verified checkbox), featured CA listings, and the placeholder logo.
  - Use shadcn UI components such as Button, Input, and Card.
  - Implement vibrant design elements including gradients, decorative blurs, and subtle patterns.
  - Ensure all icons are from the Phosphor Icons library.
  - Add hover effects and transitions for interactive elements.

- **Task 9:** Test mobile responsiveness.
  - Verify components across multiple mobile devices.
  - Confirm each component meets the 200-line limit and context guidelines.
  - Ensure the design maintains visual appeal across all device sizes.
  - Test hover and interactive effects on both touch and pointer devices.

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
    - [x] Ensure `DynamicForm` adheres to the 200-line limit.
- **Task 4.3: Refine UI & Structure**
  - **Requirement:** Ensure components adhere to project guidelines (naming, location, line limits).
  - **Sub-Tasks:**
    - [x] Move onboarding interfaces to `src/types/onboarding.type.ts`.
    - [x] Move auth interfaces (`MockUser`, `AuthState`) to `src/types/auth.type.ts`.
    - [x] Move `CheckboxGroupField` to `src/ui` and rename to `CheckboxGroup.ui.tsx`.
    - [x] Delete unused field wrapper components (`TextField.component.tsx`, `SelectField.component.tsx`).
    - [x] Replace non-Phosphor icons in `FileUpload.ui.tsx`.
    - [x] Fix UI glitches (e.g., double chevron on Select).

### Phase 5: Testing, Integration & Deployment (Previously Phase 4)

- [ ] Integration Testing
- [ ] Finalize Progress & Cursor Rules
- [ ] Deployment

---

## 12. Unit Testing Strategy

### 12.1 Testing Overview

The Xpertly CA Listing Portal implements a comprehensive testing strategy to ensure high-quality, maintainable code and a reliable user experience. Our approach focuses on thorough unit testing combined with component-level integration testing.

### 12.2 Testing Framework

- **Primary Testing Tools**:
  - Jest: Core testing framework for running tests
  - React Testing Library: For testing React components with a user-centric approach
  - jest-dom: For enhanced DOM assertions
  - jest-axe: For accessibility testing
  - MSW (Mock Service Worker): For mocking API calls to Supabase and external services

### 12.3 Test Organization

Tests are organized to mirror the source code structure:

```
src/
  └── tests/
      ├── ui/                  # Tests for UI components
      ├── components/          # Tests for components
      │   ├── layout/          # Tests for layout components
      │   └── features/        # Tests for feature components
      │       ├── auth/
      │       ├── search/
      │       ├── profile/
      │       ├── common/
      │       └── onboarding/
      ├── store/               # Tests for state management
      │   └── context/
      ├── helper/              # Tests for helper functions
      └── mocks/               # Mock data and services
          ├── handlers.ts
          ├── server.ts
          └── data/
```

Each test file follows the naming convention of `[ComponentName].test.tsx` for components and `[helperName].test.ts` for helper functions.

### 12.4 Test Coverage Targets

The project aims for the following test coverage targets:

| Component Type     | Coverage Target |
| ------------------ | --------------- |
| UI Components      | 100%            |
| Feature Components | ≥90%            |
| Layout Components  | ≥95%            |
| Providers          | ≥95%            |
| Helper Functions   | 100%            |
| Pages              | ≥85%            |

### 12.5 Testing Approach

#### 12.5.1 Mobile-First Design Testing

Testing focuses first on mobile viewports, then progressively tests larger screen sizes. This ensures our mobile-first design approach is properly implemented.

Specific tests include:

- Rendering tests at multiple viewport sizes (starting with mobile: 320px-375px)
- Touch target size verification (minimum 44px × 44px)
- UI element stacking and layout changes across breakpoints
- Proper functioning of responsive TailwindCSS classes

#### 12.5.2 Dark Mode Testing

Each component is tested in both light and dark modes using a custom render function that wraps components in a ThemeProvider. Tests verify that:

- Color schemes change appropriately
- Contrast ratios meet WCAG AA standards in both modes
- Text remains readable in dark mode
- UI elements maintain visual hierarchy

#### 12.5.3 Component Size Constraint Testing

Automated tests verify that each component adheres to the 200-line limit established in the project guidelines. This ensures component modularity and maintainability.

#### 12.5.4 Accessibility Testing

Each component undergoes accessibility testing with jest-axe to verify:

- ARIA attributes are properly applied
- Color contrast meets WCAG AA standards
- Keyboard navigation is supported
- Screen reader compatibility

### 12.6 Common Test Cases

Every component undergoes the following standard test cases:

#### Rendering Tests

1. Default rendering with default props
2. Rendering with different prop variations
3. Mobile-first responsive rendering
4. Dark mode rendering
5. Loading/placeholder state rendering

#### Interaction Tests

1. User events (click, hover, input)
2. Form interactions (validation, submission)
3. State change responses
4. Keyboard navigation

#### Error State Tests

1. Handling of empty/missing data
2. Handling of error states
3. Boundary condition handling
4. Network error handling

### 12.7 Mock Data & Services

Mock data is provided for all external dependencies:

- Supabase authentication calls
- CA profile data
- Search requests and responses
- File uploads
- Google authentication

MSW intercepts network requests to provide consistent, predictable responses during testing.

### 12.8 Test Implementation

All components have detailed test files with the following structure:

1. **Import and Setup**: Import component, testing utilities, and set up mocks
2. **Rendering Tests**: Verify component renders correctly in various states
3. **Interaction Tests**: Verify component responds correctly to user interactions
4. **Integration Tests**: Verify component works correctly with other components
5. **Edge Case Tests**: Verify component handles boundary conditions

### 12.9 Continuous Integration

Tests are integrated into the CI pipeline to:

- Run on every pull request
- Block merges if tests fail
- Track coverage metrics over time
- Ensure all code meets quality standards

### 12.10 Performance Testing

In addition to functional tests, components are tested for performance:

- Render time measurement
- Re-render efficiency
- Bundle size impact

This comprehensive testing strategy ensures the Xpertly CA Listing Portal maintains high quality, accessibility, and mobile-first responsive design throughout development.

## 13. Analytics Integration

### Overview

The Xpertly CA Listing Portal implements Google Analytics 4 (GA4) for comprehensive user behavior tracking and analytics. The implementation uses Jotai for state management and follows a mobile-first approach.

### Events to Track

1. Page Views

   - All page navigations
   - Search result pages
   - Profile pages

2. User Interactions

   - Button clicks
   - Form submissions
   - Search queries
   - Filter applications

3. Profile Views

   - CA profile views
   - Contact form submissions
   - Profile interactions

4. Form Submissions
   - Contact form completions
   - Search form submissions
   - Filter form submissions

### Privacy Considerations

- All analytics data is anonymized
- No personal information is collected
- Users can opt-out of analytics tracking
- Compliance with GDPR and CCPA requirements

### Developer Setup

1. Add GA4 Measurement ID to environment variables:

   ```
   NEXT_PUBLIC_GA_MEASUREMENT_ID=G-DP11JWRL6V
   ```

2. Import and use analytics hooks:

   ```typescript
   import { useAnalytics } from "@/hooks/useAnalytics";

   const { trackEvent } = useAnalytics();
   ```

3. Track events:
   ```typescript
   trackEvent({
     name: "button_click",
     category: "user_interaction",
     action: "click",
     label: "search_button",
   });
   ```

## 14. State Management with Jotai

### Overview

The application uses Jotai for state management, providing a lightweight and flexible solution for managing application state.

### Benefits

- Atomic state management
- No context providers needed
- Better performance than Context API
- Simpler testing and debugging
- TypeScript support out of the box

### Guidelines

1. Atom Creation

   - Create atoms in dedicated files under `src/store/jotai`
   - Use descriptive names for atoms
   - Include proper TypeScript types

2. Usage Patterns

   ```typescript
   // Create atom
   const countAtom = atom(0);

   // Use atom
   const [count, setCount] = useAtom(countAtom);

   // Derived atom
   const doubledAtom = atom(get => get(countAtom) * 2);
   ```

3. Server-Side Rendering

   - Use `useHydrateAtoms` for SSR
   - Initialize atoms with default values
   - Handle hydration mismatches

4. Best Practices
   - Keep atoms focused and small
   - Use derived atoms for computed values
   - Implement proper error handling
   - Follow TypeScript best practices

### Migration from Context

- Replace Context providers with Jotai atoms
- Update components to use `useAtom` hook
- Remove unnecessary wrapper components
- Update tests to use Jotai utilities
