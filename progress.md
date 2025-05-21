# Xpertly Development Progress

## Phase 1: Project Initialization & Setup

### Task 1: Initialize project repository and structure

- [x] Create progress.md (this file)
- [x] Create cursor_rules.md
- [x] Create essential directories (components, pages, styles, etc.)

### Task 2: Configure Next.js project

- [x] Install dependencies
- [x] Set up TailwindCSS configuration
- [x] Configure color palette

### Task 3: Establish project configuration

- [x] Create ESLint configuration
- [x] Set up Prettier
- [ ] Configure CI if applicable

### Task 4: Implement file naming conventions

- [x] Set up component naming convention (ComponentName.component.tsx)
- [x] Set up types directory and naming convention
- [x] Set up helper directory and naming convention (name.helper.ts)
- [x] Update PRD and cursor_rules.md with file naming conventions
- [x] Clean up redundant files and organize project structure

### Task 5: Code quality improvements

- [x] Standardize quotes across all files (use double quotes)
- [x] Fix formatting inconsistencies
- [x] Ensure proper component structure
- [x] Improve type declarations

### Task 6: Codebase restructuring

- [x] Set up proper directory structure
  - [x] Created store/context directory for providers
  - [x] Created ui directory for base UI components
  - [x] Created helper directory for utility functions
  - [x] Created constants directory for constants and configuration
  - [x] Created mock directory for mock data
- [x] Standardize naming conventions
  - [x] UI components use `.ui.tsx` extension
  - [x] Provider components use `.provider.tsx` extension
  - [x] Helper functions use `.helper.ts` extension
- [x] Update imports across the codebase for new directory structure
- [x] Update PRD with new file naming conventions and directory structure

## Phase 2: UI/UX Design & Component Layout

- [x] Establish design system
- [x] Create placeholder logo component
- [x] Build foundational layout components
  - [x] Header component
  - [x] Footer component
  - [x] Container component

## Phase 3: Page & Feature Development

- [x] Home Page (Basic structure)
  - [x] Hero section with search
  - [x] Feature highlights
  - [x] CA registration call-to-action
- [x] CA Listings Page
  - [x] Search functionality
  - [x] CA card component
  - [x] Mock data for demonstration
- [x] Visual Enhancements
  - [x] Enhanced card components with gradients and animations
  - [x] Improved CTA sections with gradient backgrounds and decorative elements
  - [x] Responsive container with proper padding and max-width
  - [x] Decorative blur elements and pattern overlays
  - [x] Hover effects and transitions
  - [x] Replace SVG with Phosphor icons
- [x] CA Profile Page

  - [x] Hero section with CA details and photo
  - [x] Contact information section
  - [x] Professional details section
  - [x] About and services offered sections
  - [x] Reviews preview section
  - [x] Mobile-first responsive design
  - [x] Dark mode support
  - [x] Enhanced animations and transitions
  - [x] Premium styling with gradients and visual effects
  - [x] Improved typography and spacing
  - [x] Interactive hover states and feedback

- [ ] Homepage Redesign

  - [x] Move "Why Choose Xpertly?" section to About page
  - [x] Move "Are You a Chartered Accountant?" section to About page
  - [x] Update hero section with search
  - [x] Integrate Forum feed section
  - [ ] Redesign featured CA listings
  - [ ] Ensure mobile-first responsive design
  - [ ] Support dark mode
  - [ ] Apply premium visual styling
  - [ ] Test responsive behavior

- [ ] Forum Feature

  - [ ] Core Components
    - [ ] ForumFeed component
      - [x] Implement virtual scrolling
      - [x] Add sort controls (trending, recent, relevant)
      - [x] Add filter controls
      - [x] Create empty and loading states
      - [x] Implement infinite scroll
    - [ ] PostCard component
      - [ ] Create author header with avatar
      - [ ] Implement content display
      - [ ] Add image carousel for multiple images
      - [ ] Add hashtag display with links
      - [ ] Add timestamp with relative formatting
      - [ ] Implement responsive layout
    - [ ] ReactionSystem component
      - [ ] Create multiple reaction types
      - [ ] Add animated reaction selection
      - [ ] Implement reaction count display
      - [ ] Add user's current reaction highlighting
    - [ ] CommentThread component
      - [ ] Create nested replies with proper hierarchy
      - [ ] Add collapsible thread sections
      - [ ] Implement "Load more" for long threads
      - [ ] Add reply form with @mention support
    - [ ] CreatePost component
      - [ ] Implement rich text editor
      - [ ] Add image upload with preview
      - [ ] Create hashtag input with autocomplete
      - [ ] Add character limit indicator
      - [ ] Implement draft saving
    - [ ] SearchAndFilter component
      - [ ] Create keyword search with highlighting
      - [ ] Implement tag filtering with multi-select
      - [ ] Add user type filtering
      - [ ] Implement sort order controls
  - [ ] Integration
    - [ ] Connect components into cohesive forum experience
    - [ ] Implement data fetching and state management
    - [ ] Add authentication integration
    - [ ] Create permissions system
  - [ ] Analytics
    - [ ] Track post views and engagement
    - [ ] Monitor content creation metrics
    - [ ] Analyze user interaction patterns
  - [ ] Styling

    - [x] Apply premium visual design to all components
    - [x] Implement animations and transitions
    - [x] Ensure dark mode support
    - [ ] Test responsive behavior across devices

  - [ ] **Forum Components**

    - [ ] Track post views and engagement metrics
    - [ ] Monitor reaction usage patterns
    - [ ] Track comment creation and threading
    - [ ] Measure search and filter usage
    - [ ] Analyze content creation patterns
    - [ ] Track post sharing and virality
    - [ ] Monitor hashtag popularity and growth

  - [ ] **CA Dashboard Components**
    - [ ] Track lead interaction metrics
    - [ ] Measure contact request response times
    - [ ] Monitor forum post creation from dashboard
    - [ ] Track dashboard section usage patterns
    - [ ] Analyze lead-to-client conversion rates
    - [ ] Measure time spent on different dashboard areas
    - [ ] Track bulk actions and efficiency metrics

- [x] Authentication

  - [x] Set up Supabase client
  - [x] Create Auth provider
  - [x] Develop LoginForm component
  - [x] Develop SignUpForm component
  - [x] Develop SignUpFormContent component
  - [x] Develop CAAuthTabs component for tabbed auth interface
  - [x] Add form validation for all auth forms
    - [x] Email validation using regex pattern
    - [x] Password length and matching validation
    - [x] Terms acceptance requirement
    - [x] Button disabled state based on form validity
  - [x] Implement visual enhancements for auth components
    - [x] Premium gradient styling
    - [x] Visual feedback for password matching
    - [x] Loading state animations
    - [x] Security section for visual balance
  - [x] Create auth-specific pages and routes
  - [x] Update Header component with auth links
  - [x] Enhance mobile-first design for all auth forms
  - [x] Add error handling with toast notifications
  - [x] Implement dark mode support for auth components
  - [x] Refactor auth components to comply with 200-line limit
    - [x] Split LoginForm into smaller components (137 lines)
      - [x] Created LoginFormFields component (73 lines)
      - [x] Created LoginFormSecurity component (27 lines)
    - [ ] Split SignUpFormContent into smaller components
  - [ ] Google Authentication Integration
    - [ ] Set up Google OAuth in Supabase
      - [ ] Configure Google OAuth provider in Supabase dashboard
      - [ ] Add Google OAuth credentials to environment variables
    - [ ] Create Google Sign-in Button Component
      - [ ] Design mobile-first Google sign-in button with Phosphor icon
      - [ ] Implement responsive styling with TailwindCSS
      - [ ] Add loading and error states
    - [ ] Update Authentication UI
      - [ ] Add "OR" divider in login tab
      - [ ] Add "OR" divider in signup tab
      - [ ] Position Google button after existing auth buttons
    - [ ] Implement Google Sign-in Flow
      - [ ] Add Google sign-in handler in Auth provider
      - [ ] Implement multiple account selection support
      - [ ] Handle sign-in success/failure states
    - [ ] Implement Google Sign-up Flow
      - [ ] Add Google sign-up handler in Auth provider
      - [ ] Implement multiple account selection support
      - [ ] Handle sign-up success/failure states
    - [ ] Add User Profile Handling
      - [ ] Create user profile extraction from Google data
      - [ ] Auto-populate onboarding form with Google profile data
    - [ ] Implement Redirect Logic
      - [ ] Add profile check before redirect
      - [ ] Redirect to onboarding if profile doesn't exist
      - [ ] Redirect to dashboard if profile exists
    - [ ] Add Error Handling
      - [ ] Implement error messages for failed authentication
      - [ ] Add toast notifications for success/failure states
    - [ ] Testing
      - [ ] Test Google sign-in flow
      - [ ] Test Google sign-up flow
      - [ ] Test profile auto-population
      - [ ] Test redirect logic
      - [ ] Test mobile responsiveness

- [ ] Role Selection Screen

  - [ ] Create RoleSelection component
    - [ ] Design mobile-first layout with glassmorphism panels
    - [ ] Add welcome heading and supportive subtext
    - [ ] Implement two visually distinct role selection cards
      - [ ] Add gradient headers in brand colors
      - [ ] Add Phosphor icons (Briefcase for CA, Handshake for Customer)
      - [ ] Add role labels and descriptions
      - [ ] Create interactive hover/tap states
    - [ ] Add decorative background elements
    - [ ] Implement accessibility features
      - [ ] High contrast text
      - [ ] Large touch targets
      - [ ] Keyboard navigation support
      - [ ] Screen reader friendly labels
    - [ ] Add dark mode support
  - [ ] Implement state management
    - [ ] Update user.store.ts to include role information
    - [ ] Create user role types
    - [ ] Implement role persistence
  - [ ] Add routing logic
    - [ ] Redirect to role selection after signup
    - [ ] Route to appropriate onboarding path based on selection
    - [ ] Create role-specific route guards
  - [ ] Integrate analytics
    - [ ] Track role selection screen impressions
    - [ ] Track role selection events
    - [ ] Track time spent on decision
  - [ ] Test implementation
    - [ ] Test responsive layout
    - [ ] Test role selection functionality
    - [ ] Test routing logic
    - [ ] Test accessibility compliance

- [ ] User Onboarding Flow

  - [ ] Create UserOnboardingForm component
    - [ ] Design mobile-first layout with glassmorphism panels
    - [ ] Add form fields with proper validation:
      - [ ] Profile picture upload
      - [ ] Phone number input (optional)
      - [ ] WhatsApp availability toggle
      - [ ] City & State dropdown
      - [ ] Services needed multi-select (using shared services list)
      - [ ] Urgency/timeline dropdown
      - [ ] Additional notes textarea
    - [ ] Implement progress indicator
    - [ ] Add form navigation controls
    - [ ] Add skip options for optional fields
    - [ ] Add decorative elements matching design spec
  - [ ] Create field components
    - [ ] ProfilePictureUpload component
    - [ ] PhoneNumberInput component
    - [ ] LocationSelect component
    - [ ] ServicesMultiSelect component
    - [ ] UrgencySelect component
  - [ ] Implement state management
    - [ ] Update user.store.ts for customer profile data
    - [ ] Create user profile types
    - [ ] Implement form state persistence
    - [ ] Connect to Supabase user profile
  - [ ] Add validation logic
    - [ ] Client-side validation for all fields
    - [ ] Error handling and messaging
    - [ ] Create validation helpers
  - [ ] Style per design spec
    - [ ] Apply premium visual styling
    - [ ] Add animations and transitions
    - [ ] Support dark mode
    - [ ] Ensure responsive behavior
  - [ ] Test implementation
    - [ ] Test form rendering and responsiveness
    - [ ] Test validation logic
    - [ ] Test data persistence
    - [ ] Test form submission
    - [ ] Test accessibility compliance

- [ ] Forum Feature

  - [ ] Core Components
    - [ ] ForumFeed component
      - [ ] Implement virtual scrolling
      - [ ] Add sort controls (trending, recent, relevant)
      - [ ] Add filter controls
      - [ ] Create empty and loading states
      - [ ] Implement infinite scroll
    - [ ] PostCard component
      - [ ] Create author header with avatar
      - [ ] Implement content display
      - [ ] Add image carousel for multiple images
      - [ ] Add hashtag display with links
      - [ ] Add timestamp with relative formatting
      - [ ] Implement responsive layout
    - [ ] ReactionSystem component
      - [ ] Create multiple reaction types
      - [ ] Add animated reaction selection
      - [ ] Implement reaction count display
      - [ ] Add user's current reaction highlighting
    - [ ] CommentThread component
      - [ ] Create nested replies with proper hierarchy
      - [ ] Add collapsible thread sections
      - [ ] Implement "Load more" for long threads
      - [ ] Add reply form with @mention support
    - [ ] CreatePost component
      - [ ] Implement rich text editor
      - [ ] Add image upload with preview
      - [ ] Create hashtag input with autocomplete
      - [ ] Add character limit indicator
      - [ ] Implement draft saving
    - [ ] SearchAndFilter component
      - [ ] Create keyword search with highlighting
      - [ ] Implement tag filtering with multi-select
      - [ ] Add user type filtering
      - [ ] Implement sort order controls
  - [ ] Integration
    - [ ] Connect components into cohesive forum experience
    - [ ] Implement data fetching and state management
    - [ ] Add authentication integration
    - [ ] Create permissions system
  - [ ] Analytics
    - [ ] Track post views and engagement
    - [ ] Monitor content creation metrics
    - [ ] Analyze user interaction patterns
  - [ ] Styling
    - [ ] Apply premium visual design to all components
    - [ ] Implement animations and transitions
    - [ ] Ensure dark mode support
    - [ ] Test responsive behavior across devices

- [ ] CA Dashboard

  - [ ] TDD Setup

    - [ ] Configure Jest tests for dashboard components
    - [ ] Create test utilities for CA-specific mocks
    - [ ] Setup testing patterns for all dashboard components
    - [ ] Create fixture data for leads and contact requests

  - [ ] Dashboard Layout

    - [ ] Write tests for Dashboard layout component (Red)
    - [ ] Build dashboard landing layout (Green)
    - [ ] Implement responsive navigation between sections
    - [ ] Create summary metrics display
    - [ ] Add notification system
    - [ ] Optimize for mobile (Refactor)
    - [ ] Test dark mode support

  - [ ] New Leads Section

    - [ ] Write tests for LeadCard component (Red)
    - [ ] Implement LeadCard UI (Green)
    - [ ] Create leads list view
    - [ ] Add sorting functionality by urgency, date, service
    - [ ] Implement filtering functionality
    - [ ] Create lead action buttons (contact, dismiss, save)
    - [ ] Test responsiveness and accessibility (Refactor)
    - [ ] Ensure dark mode support

  - [ ] Contact Requests Section

    - [ ] Write tests for ContactRequestCard component (Red)
    - [ ] Implement ContactRequestCard UI (Green)
    - [ ] Create contact request list view
    - [ ] Add status indicators and management
    - [ ] Implement quick-reply functionality
    - [ ] Create bulk action system
    - [ ] Test responsiveness and accessibility (Refactor)
    - [ ] Ensure dark mode support

  - [ ] Forum Post Creation

    - [ ] Write tests for PostComposer component (Red)
    - [ ] Implement PostComposer UI reusing forum logic (Green)
    - [ ] Add title and content inputs
    - [ ] Create image upload with preview
    - [ ] Add hashtag input with autocomplete
    - [ ] Implement draft saving
    - [ ] Add visibility options
    - [ ] Test responsiveness and accessibility (Refactor)
    - [ ] Ensure dark mode support

  - [ ] Data Integration

    - [ ] Connect to Supabase for lead data
    - [ ] Implement contact request fetching
    - [ ] Create post submission to forum system
    - [ ] Implement real-time updates where possible
    - [ ] Add error handling and recovery
    - [ ] Test data flows and state management

  - [ ] Analytics

    - [ ] Track lead interaction metrics
    - [ ] Measure contact request response times
    - [ ] Monitor forum post creation from dashboard
    - [ ] Track dashboard feature usage patterns
    - [ ] Analyze task completion rates

  - [ ] Styling and Polish
    - [ ] Apply premium visual design to all components
    - [ ] Implement animations and transitions
    - [ ] Create cohesive visual language across sections
    - [ ] Ensure accessibility compliance
    - [ ] Test responsive behavior across devices

- [ ] Dark Theme Implementation
  - [x] Install and configure next-themes
  - [x] Create theme toggle component
  - [x] Update TailwindCSS for dark mode
  - [x] Implement dark mode color system
  - [x] Update components for dark mode support
    - [x] Header component
    - [x] Footer component
    - [x] SearchBar component
    - [x] CACard component
    - [x] Container component
    - [x] Buttons and text elements
  - [x] Add system preference detection
  - [x] Implement theme persistence
  - [ ] Test dark mode across devices

## Phase 4: Testing, Integration & Deployment

- [x] Unit Testing Setup
  - [x] Configure Jest and React Testing Library
  - [x] Set up test utilities (test-utils.tsx)
    - [x] Created comprehensive test utilities for consistent testing
    - [x] Added utilities for dark mode testing
    - [x] Added utilities for accessibility testing
    - [x] Added utilities for responsive design testing
    - [x] Added utilities for common test data and edge cases
  - [x] Create mock data and services
  - [x] Implement test structure mirroring source code
  - [x] Create example Button component test
    - [x] Enhanced Button test with comprehensive coverage
    - [x] Added dark mode testing
    - [x] Added asChild prop testing
    - [x] Added accessibility testing with jest-axe
    - [x] Achieved 100% branch coverage
  - [x] Create example Input component test
    - [x] Created comprehensive test suite with 17 test cases
    - [x] Added dark mode testing
    - [x] Added accessibility testing with multiple states (default, error, dark mode)
    - [x] Added tests for different input types
    - [x] Achieved 100% code coverage
  - [x] Create example Avatar component test
    - [x] Created tests for all three subcomponents (Avatar, AvatarImage, AvatarFallback)
    - [x] Added tests for combinations and nesting of components
    - [x] Properly mocked Radix UI primitives
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Switch component test
    - [x] Created comprehensive test suite with 12 test cases
    - [x] Properly mocked Radix UI primitives with correct typing
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Textarea component test
    - [x] Created comprehensive test suite with 18 test cases
    - [x] Added tests for multiline input handling
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Card component test
    - [x] Created comprehensive test suite with 21 test cases
    - [x] Added tests for all 7 subcomponents (Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter)
    - [x] Added tests for component composition and nesting
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Checkbox component test
    - [x] Created comprehensive test suite with 18 test cases
    - [x] Added tests for label integration
    - [x] Added tests for form attributes (required, name)
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Select component test
    - [x] Created comprehensive test suite with 20 test cases
    - [x] Properly mocked Phosphor icon dependencies
    - [x] Added tests for multiple select mode
    - [x] Added tests for styling differences based on props
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example ThemeToggle component test
    - [x] Created comprehensive test suite with 13 test cases
    - [x] Properly mocked next-themes and useTheme hook
    - [x] Added tests for light/dark mode icon rendering
    - [x] Added tests for theme toggling functionality
    - [x] Added tests for mounted/unmounted states
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example AuthDivider component test
    - [x] Created comprehensive test suite with 11 test cases
    - [x] Added tests for default and custom text rendering
    - [x] Added tests for styling and composition
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example GoogleButton component test
    - [x] Created comprehensive test suite with 15 test cases
    - [x] Properly mocked Next/Image and Phosphor icons
    - [x] Added tests for loading state and disabled behavior
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example CheckboxGroup component test
    - [x] Created comprehensive test suite with 22 test cases
    - [x] Properly mocked Checkbox component
    - [x] Added tests for selection/deselection functionality
    - [x] Added tests for hidden input field behavior
    - [x] Added tests for mobile-first grid layout
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% branch coverage (87.5% due to default values)
  - [x] Create example FileUpload component test
    - [x] Created comprehensive test suite with 20 test cases
    - [x] Properly mocked Button component and Phosphor icons
    - [x] Added tests for file selection, removal, and drag-and-drop functionality
    - [x] Added tests for various file sizes and name lengths
    - [x] Added tests for error states and accessibility
    - [x] Added dark mode testing
    - [x] Achieved excellent coverage (100% lines, 92.85% branches)
  - [x] Create example DecorativeElements component test
    - [x] Created comprehensive test suite with 17 test cases
    - [x] Added tests for both DecorativeElements and AnimationStyles components
    - [x] Verified gradient positioning, sizing, and styling
    - [x] Tested animation classes and dark mode specific styling
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example Logo component test
    - [x] Created comprehensive test suite with 13 test cases
    - [x] Created improved mock for tw.helper's cn function
    - [x] Added tests for different logo sizes (sm, md, lg)
    - [x] Tested styling properties and custom class injection
    - [x] Added dark mode testing
    - [x] Added accessibility testing
    - [x] Achieved 100% code coverage
  - [x] Create example LoginForm component test
    - [x] Created test suite with 15 test cases for a complex component
    - [x] Successfully mocked multiple dependencies (next/navigation, Auth context, GoogleAuth context)
    - [x] Added tests for form rendering, input fields, button states
    - [x] Added dark mode testing
    - [x] Achieved good coverage for form rendering and validation
    - [x] Identified test limitations for complex form submission flows
  - [x] Achieved 100% overall UI components test coverage (15/15 components tested)
  - [ ] Create example Auth provider test
  - [ ] Create example SearchBar component test
  - [x] Document unit testing strategy in PRD
  - [x] Fix recursive console.error in jest.setup.js
- [ ] Integration Testing
- [ ] Finalize Progress & Cursor Rules
- [ ] Deployment

## Phase 5: State Management & Performance Optimization

- [x] Jotai Store Architecture Refactoring
  - [x] Identified and fixed "Multiple Jotai instances" error
  - [x] Ensured consistent import patterns across all files
  - [x] Renamed `analytics.atoms.ts` to `analytics.store.ts`
  - [x] Updated all store files to use centralized imports from index.ts
  - [x] Created centralized exports in `src/store/jotai/index.ts`
  - [x] Used `jotai/vanilla` for atom creation
  - [x] Used `jotai/react` for React-specific hooks
  - [x] Ensured all components import from centralized exports
  - [x] Preserved all Jotai state tracking in analytics components and hooks
  - [x] Fixed import paths in all components that reference Jotai stores
  - [x] Moved type definitions out of store files to dedicated type files
  - [x] Updated file naming to follow `.store.ts` convention
  - [x] Configured analytics atoms to persist in localStorage
  - [x] Configured onboarding atoms to persist in localStorage
  - [x] Used descriptive localStorage keys with xpertly\_ prefix
  - [x] Fixed testing infrastructure to support localStorage persistence
  - [x] Added window.gtag mocking for analytics testing
  - [x] Made Google Analytics helper more resilient with proper null checks
  - [x] Fixed test failures by handling undefined window.gtag cases
  - [x] Created dedicated JotaiProvider in store folder to avoid provider duplication
  - [x] Fixed build errors related to static generation and React context usage
  - [x] Correctly configured Next.js for client-side rendering of components using React context

## Phase 5: CA Onboarding Flow

- [x] Recreate onboarding page (`/ca/onboarding`)
- [x] Recreate dashboard page (`/ca/dashboard`)
- [x] Implement mock authentication using localStorage (no Supabase dependency)
- [x] Fix CA signup redirection to onboarding page
- [x] Resolve routing conflicts between dynamic `/ca/[id]` and static routes
- [x] Add dedicated CA signup page (`/signup/ca`)
- [x] Remove redundant "Personal Information" step from onboarding form
- [x] Add "Welcome" step to onboarding form
- [x] Improve multi-select UI using `CheckboxGroup` component
- [x] Fix double chevron issue on select inputs
- [x] Refactor `DynamicForm` component (< 200 lines)
  - [x] Extract `FormProgressIndicator` component
  - [x] Extract `FormStepTitle` component
  - [x] Extract `FormNavigation` component
- [x] Refactor `DynamicForm` to use base UI components directly (removed wrappers)
- [x] Move `CheckboxGroupField` to `ui` directory (`CheckboxGroup.ui.tsx`)
- [x] Move onboarding interfaces to `src/types/onboarding.type.ts`
- [x] Move auth interfaces (`MockUser`, `AuthState`) to `src/types/auth.type.ts`
- [x] Replace non-Phosphor icons in `FileUpload.ui.tsx` with Phosphor icons

## UI Components

### Layout Components

- [x] Container (`src/components/layout/Container.component.tsx`)

### UI Components

- [x] Button (`src/ui/Button.ui.tsx`)
- [x] Input (`src/ui/Input.ui.tsx`)
- [x] Card (`src/ui/Card.ui.tsx`)
- [x] Avatar (`src/ui/Avatar.ui.tsx`)
- [x] Checkbox (`src/ui/Checkbox.ui.tsx`)
- [x] Logo (`src/ui/Logo.ui.tsx`)
- [x] ThemeToggle (`src/ui/ThemeToggle.ui.tsx`)
- [x] DecorativeElements (`src/ui/DecorativeElements.ui.tsx`)
- [x] CheckboxGroup (`src/ui/CheckboxGroup.ui.tsx`)
- [x] FileUpload (`src/ui/FileUpload.ui.tsx`) (with Phosphor icons)
- [x] Switch (`src/ui/Switch.ui.tsx`)
- [x] Textarea (`src/ui/Textarea.ui.tsx`)
- [x] Select (`src/ui/Select.ui.tsx`)
- [x] AuthDivider (`src/ui/AuthDivider.ui.tsx`)
- [x] GoogleButton (`src/ui/GoogleButton.ui.tsx`)

### Feature Components

- [x] LoginForm (`src/components/features/auth/LoginForm.component.tsx`) - 137 lines
- [x] LoginFormFields (`src/components/features/auth/LoginFormFields.component.tsx`) - 73 lines
- [x] LoginFormSecurity (`src/components/features/auth/LoginFormSecurity.component.tsx`) - 27 lines
- [x] SignUpForm (`src/components/features/auth/SignUpForm.component.tsx`) - 113 lines
- [x] SignUpFormContent (`src/components/features/auth/SignUpFormContent.component.tsx`) - **232 lines**
- [x] CAAuthTabs (`src/components/features/auth/CAAuthTabs.component.tsx`) - 84 lines
- [x] SearchBar (`src/components/features/search/SearchBar.component.tsx`)
- [x] CACard (`src/components/features/common/CACard.component.tsx`)
- [ ] RoleSelection (`src/components/features/onboarding/RoleSelection.component.tsx`)
- [ ] UserOnboardingForm (`src/components/features/onboarding/UserOnboardingForm.component.tsx`)
- [ ] ForumFeed (`src/components/features/forum/ForumFeed.component.tsx`)
- [ ] PostCard (`src/components/features/forum/PostCard.component.tsx`)
- [ ] ReactionSystem (`src/components/features/forum/ReactionSystem.component.tsx`)
- [ ] CommentThread (`src/components/features/forum/CommentThread.component.tsx`)
- [ ] CreatePost (`src/components/features/forum/CreatePost.component.tsx`)
- [ ] SearchAndFilter (`src/components/features/forum/SearchAndFilter.component.tsx`)
- [ ] DashboardLayout (`src/components/features/dashboard/DashboardLayout.component.tsx`)
- [ ] LeadCard (`src/components/features/dashboard/LeadCard.component.tsx`)
- [ ] ContactRequestCard (`src/components/features/dashboard/ContactRequestCard.component.tsx`)
- [ ] PostComposer (`src/components/features/dashboard/PostComposer.component.tsx`)

## Analytics Integration

### Completed Tasks

- [x] Set up Google Analytics 4 configuration
- [x] Create analytics helper functions
- [x] Implement Jotai atoms for analytics state
- [x] Create GoogleAnalytics component
- [x] Add GA4 script to layout
- [x] Update documentation
- [x] Implement analytics tracking in components
  - [x] Added analytics tracking to SearchBar component
  - [x] Added analytics tracking to CACard component
- [x] Implement analytics opt-out functionality
  - [x] Created AnalyticsOptOut component
  - [x] Created useAnalyticsEnabled hook
  - [x] Updated useAnalytics hook to respect opt-out preferences
  - [x] Updated GoogleAnalytics component to respect opt-out preferences
- [x] Add analytics event tracking to forms
  - [x] Added analytics tracking to LoginForm component
  - [x] Track login attempts, successes, and failures
  - [x] Track Google authentication attempts
- [x] Document analytics events
  - [x] Created analytics_events.md documentation
  - [x] Documented all event categories and parameters
  - [x] Added implementation examples
  - [x] Documented opt-out functionality
- [x] Add analytics testing
  - [x] Created tests for useAnalytics hook
  - [x] Created tests for GoogleAnalytics component
  - [x] Created tests for AnalyticsOptOut component
  - [x] Tested all tracking methods
  - [x] Added mocks for Google Analytics
- [x] Set up analytics dashboard
  - [x] Created documentation for setting up GA4 dashboard
  - [x] Provided instructions for custom reports
  - [x] Added guide for funnel analysis setup
  - [x] Documented alert configuration
- [x] Create analytics reports
  - [x] Documented recommended report types
  - [x] Provided instructions for creating custom reports
  - [x] Added guide for interpreting analytics data
- [x] Set up analytics monitoring
  - [x] Created instructions for setting up alerts
  - [x] Added troubleshooting guide
  - [x] Documented key metrics to monitor
- [x] Create centralized Jest mock helper
  - [x] Created comprehensive `jestMock.helper.tsx` with common mocks
  - [x] Implemented mocks for navigation (usePathname, useSearchParams)
  - [x] Implemented mocks for Next.js components (Script, Link, Image)
  - [x] Implemented mocks for analytics functions and hooks
  - [x] Implemented mocks for storage (localStorage, sessionStorage)
  - [x] Implemented mocks for Supabase
  - [x] Implemented mocks for global window objects
  - [x] Implemented mocks for UI components
  - [x] Updated test files to use centralized mocks
  - [x] Documented proper mock usage in helper file
- [x] Create consolidated analytics documentation
  - [x] Combined analytics_events.md and google_analytics_setup.md into a single source of truth
  - [x] Created comprehensive inventory of components requiring analytics tracking
  - [x] Developed a phased implementation plan for remaining components
  - [x] Added detailed documentation for existing and planned analytics events
  - [x] Improved implementation examples for developers

### Analytics Implementation Todo

#### Phase 1: Critical User Flows

- [ ] **SignUp Flow Tracking**

  - [ ] `SignUpForm.component.tsx`
    - [ ] Track form submission attempts (`signup_attempt` event)
    - [ ] Track successful/failed signups (`signup_form` event with success/error params)
    - [ ] Track signup method (email vs Google)
  - [ ] `SignUpFormTerms.component.tsx`
    - [ ] Track terms acceptance clicks (`terms_acceptance` event)
  - [ ] `GoogleAuth.provider.tsx`
    - [ ] Track Google auth flow steps (`google_auth_flow` event)
    - [ ] Track error states and user cancellations
  - [ ] `RoleSelection.component.tsx`

    - [ ] Track role selection screen views
    - [ ] Track role selection events
    - [ ] Track time spent on decision
    - [ ] Track abandonment at this step

  - [ ] `UserOnboardingForm.component.tsx`

    - [ ] Track form starts and completions
    - [ ] Track field completion rates
    - [ ] Track time spent on each field
    - [ ] Track skip rates for optional fields
    - [ ] Monitor form submission success/failure

  - [ ] **Forum Components**
    - [ ] Track post views and engagement metrics
    - [ ] Monitor reaction usage patterns
    - [ ] Track comment creation and threading
    - [ ] Measure search and filter usage
    - [ ] Analyze content creation patterns
    - [ ] Track post sharing and virality
    - [ ] Monitor hashtag popularity and growth

- [ ] **Profile Engagement Tracking**

  - [ ] `CAProfileHero.component.tsx`
    - [ ] Track hero section impressions (`profile_view` event)
    - [ ] Track social link clicks (`social_link_click` event)
    - [ ] Track profile image clicks for enlargement
  - [ ] `CAContactInfo.component.tsx`
    - [ ] Track contact method clicks (phone, email, etc.)
    - [ ] Track copy-to-clipboard actions
    - [ ] Track expanded section views

- [ ] **Onboarding Funnel Tracking**
  - [ ] `DynamicForm.component.tsx`
    - [ ] Track form step completions (`onboarding_step_complete` event)
    - [ ] Track form step views (`onboarding_step_view` event)
    - [ ] Track form submission attempts and validations
  - [ ] `FormNavigation.component.tsx`
    - [ ] Track navigation actions (next/back/skip buttons)
    - [ ] Track abandonment points in the flow

#### Phase 2: Enhanced User Experience

- [ ] **Detailed Auth Tracking**

  - [ ] `CAAuthTabs.component.tsx` / `AuthTabs.component.tsx`
    - [ ] Track tab switches (`tab_change` event)
    - [ ] Track dwell time on each tab
  - [ ] `ForgotPasswordForm.component.tsx`
    - [ ] Track password reset requests (`password_reset` event)
    - [ ] Track email submission success/failure
    - [ ] Track reset link clicks

- [ ] **Profile Component Tracking**

  - [ ] `CAProfessionalDetails.component.tsx`
    - [ ] Track section expansion/collapse
    - [ ] Track interaction with certification details
  - [ ] `CAServicesSection.component.tsx`
    - [ ] Track service tag clicks
    - [ ] Track section scrolling behavior
  - [ ] `CAReviewsSection.component.tsx`
    - [ ] Track review impressions
    - [ ] Track pagination/navigation through reviews
    - [ ] Track sorting/filtering of reviews

- [ ] **Page-level Enhancements**
  - [ ] `app/page.tsx` (Homepage)
    - [ ] Track CTA button clicks
    - [ ] Track scroll depth and section viewability
    - [ ] Track entry points to other sections
  - [ ] `app/search/page.tsx`
    - [ ] Track filter usage patterns
    - [ ] Track search refinements
    - [ ] Track pagination interactions

#### Phase 3: Complete Coverage

- [ ] **Detailed Form Interactions**

  - [ ] `SignUpFormFields.component.tsx` / `LoginFormFields.component.tsx`
    - [ ] Track field validation errors
    - [ ] Track field completion rates
    - [ ] Track field focus time
  - [ ] `SignUpFormButton.component.tsx`
    - [ ] Track button state changes
    - [ ] Track time to clickability

- [ ] **Edge Case Handling**

  - [ ] Track error states throughout the application
  - [ ] Track browser-specific behaviors
  - [ ] Track performance issues encountered

- [ ] **Additional App Pages**
  - [ ] `app/ca/dashboard/page.tsx` (Standardized dashboard location)
    - [ ] Track dashboard widget interactions
    - [ ] Track notification handling
    - [ ] Track settings changes
  - [ ] `app/auth/page.tsx`
    - [ ] Track auth entry points
    - [ ] Track authentication method preferences

#### Phase 4: Optimization

- [ ] Review analytics data quality
- [ ] Optimize event parameters for better reporting
- [ ] Add custom dimensions for enhanced segmentation
- [ ] Implement enhanced e-commerce tracking if applicable

### Next Steps

- [ ] Integrate analytics with other components like SignUpForm
- [ ] Consider implementing a cookie consent banner

- [ ] Admin Dashboard
- [ ] SEO Optimization

  - [ ] Meta tags configuration
  - [ ] Open Graph tags
  - [ ] Dynamic meta descriptions
  - [ ] Structured data (JSON-LD)
  - [ ] Heading hierarchy
  - [ ] Sitemap generation
  - [ ] robots.txt configuration
  - [ ] Canonical URLs
  - [ ] Image alt text
  - [ ] Performance optimization
  - [ ] URL structure and slugs
  - [ ] Breadcrumb navigation
