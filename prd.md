# Xpertly – CA Listing Portal Product Requirements Document (PRD)

## 1. Overview

**Project Name:** Xpertly.in  
**Description:** A NoBroker-style platform where users can discover, filter, and contact Chartered Accountants (CAs).  
**Objective:** Build a mobile-first, modular, and maintainable CA listing portal from scratch. Every UI component must be kept under **200 lines of code** and all progress, context, and guidelines must be meticulously tracked via dedicated documents.

---

## 2. Immediate Tasks (Critical) ✅ COMPLETED

### Database Integration & Bug Fixes ✅

- [x] **Environment Configuration**

  - [x] Verify Supabase environment variables are properly set
  - [x] Test Supabase connection in development environment
  - [x] Ensure database schema migration has been applied

- [x] **Leads Integration Testing**

  - [x] ~~Test debug page at `/ca/dashboard/leads/debug` to verify data fetching~~ (Not needed - direct testing confirmed)
  - [x] Verify leads are displaying correctly in main dashboard
  - [x] Test lead filtering and sorting functionality
  - [x] Verify lead engagement tracking works correctly

- [x] **Schema Migration Completion**

  - [x] Run schema migration script if not already applied
  - [x] Verify all foreign key constraints are working
  - [x] Test all CRUD operations with new schema
  - [x] Update any remaining references to old `id` field

- [x] **Type System Updates**

  - [x] Update all TypeScript interfaces to reflect schema changes
  - [x] ~~Update helper functions to use `user_id` for profile operations~~ (Services layer handles this)
  - [x] ~~Update components that reference profile `id` field~~ (No direct references found)
  - [x] Ensure all enum values match database constraints

- [x] **Testing & Validation**
  - [x] Run all existing tests to ensure they pass (35/35 leads & dashboard tests passing)
  - [x] Add integration tests for leads functionality
  - [x] ~~Test authentication flow with new schema~~ (Auth tests have separate issues unrelated to schema)
  - [x] Verify data consistency across all features

**✅ RESULT**: All critical database integration and leads functionality is working perfectly. The platform is ready for user testing.

## 2.1 Immediate Tasks (Next Priority) - Leads System Enhancements

### Production-Ready Leads Management 🚧

**Objective**: Enhance the leads system with production-ready features including archive functionality, server-side pagination, search, and filtering.

- [ ] **Task 1: Archive Functionality**

  - [ ] **Database Schema Updates**

    - [ ] Add `archived_at` timestamp field to leads table
    - [ ] Create database migration script for archive field
    - [ ] Update RLS policies to handle archived leads
    - [ ] Add indexes for archive queries

  - [ ] **Service Layer Updates**

    - [ ] Add `archiveLead()` function to leads service
    - [ ] Add `unarchiveLead()` function to leads service
    - [ ] Update `fetchLeads()` to exclude archived leads by default
    - [ ] Add `fetchArchivedLeads()` function for archive view
    - [ ] Add comprehensive error handling for archive operations

  - [ ] **Type System Updates**

    - [ ] Update Lead interface to include `archivedAt?: string` field
    - [ ] Add archive-related enums and constants
    - [ ] Update LeadFilter interface to include archive status

  - [ ] **Component Updates**

    - [ ] Update LeadCard component to handle archive/unarchive actions
    - [ ] Add confirmation dialog for archive actions
    - [ ] Add archive filter to LeadFilter component
    - [ ] Add archived leads view to dashboard
    - [ ] Update loading and error states for archive operations

  - [ ] **Testing Implementation**
    - [ ] Write tests for archive service functions
    - [ ] Test archive/unarchive UI interactions
    - [ ] Test archive filtering functionality
    - [ ] Test error scenarios and edge cases

- [ ] **Task 2: Server-Side Pagination**

  - [ ] **Service Layer Implementation**

    - [ ] Update `fetchLeads()` to accept pagination parameters (page, pageSize)
    - [ ] Implement Supabase range queries for pagination
    - [ ] Add total count query for pagination metadata
    - [ ] Add pagination response interface with data and metadata

  - [ ] **State Management Updates**

    - [ ] Update dashboard store to handle pagination state
    - [ ] Add pagination atoms (currentPage, pageSize, totalCount, hasNextPage)
    - [ ] Implement pagination actions (nextPage, prevPage, goToPage)
    - [ ] Add pagination loading states

  - [ ] **Component Implementation**

    - [ ] Create Pagination component with navigation controls
    - [ ] Update Leads component to use pagination
    - [ ] Add page size selector (10, 25, 50 records per page)
    - [ ] Implement infinite scroll as alternative option
    - [ ] Add pagination loading states and skeleton loaders

  - [ ] **Testing Implementation**
    - [ ] Test pagination service functions
    - [ ] Test pagination component interactions
    - [ ] Test edge cases (empty pages, last page, first page)
    - [ ] Test pagination state management

- [ ] **Task 3: Server-Side Search with Debouncing**

  - [ ] **Service Layer Implementation**

    - [ ] Update `fetchLeads()` to accept search parameters
    - [ ] Implement full-text search across customer names, services, locations
    - [ ] Add search highlighting in results
    - [ ] Optimize search queries with proper indexing

  - [ ] **Debouncing Implementation**

    - [ ] Create custom useDebounce hook (300ms delay)
    - [ ] Implement search state management with debouncing
    - [ ] Add search loading indicators
    - [ ] Handle search cancellation for rapid typing

  - [ ] **Component Updates**

    - [ ] Update search input with debounced server requests
    - [ ] Add search suggestions/autocomplete
    - [ ] Add search result highlighting
    - [ ] Implement search history and saved searches

  - [ ] **Testing Implementation**
    - [ ] Test search service functions
    - [ ] Test debouncing behavior
    - [ ] Test search result accuracy
    - [ ] Test search performance and edge cases

- [ ] **Task 4: Server-Side Filtering**

  - [ ] **Service Layer Implementation**

    - [ ] Update `fetchLeads()` to accept comprehensive filter parameters
    - [ ] Implement filtering by urgency, services, status, date ranges
    - [ ] Add location-based filtering (city, state, radius)
    - [ ] Optimize filter queries with proper indexing

  - [ ] **Filter State Management**

    - [ ] Update filter state in dashboard store
    - [ ] Implement filter persistence in URL parameters
    - [ ] Add filter presets and saved filters
    - [ ] Handle complex filter combinations

  - [ ] **Component Updates**

    - [ ] Update LeadFilter component to trigger server requests
    - [ ] Add advanced filter options (date pickers, multi-select)
    - [ ] Implement filter chips for active filters
    - [ ] Add filter reset and clear all functionality

  - [ ] **Testing Implementation**
    - [ ] Test all filter combinations
    - [ ] Test filter persistence and URL state
    - [ ] Test filter performance with large datasets
    - [ ] Test filter edge cases and validation

### Implementation Guidelines

- **TDD Approach**: Write failing tests first, implement minimal code to pass, then refactor
- **Performance**: Optimize all database queries with proper indexing
- **User Experience**: Maintain responsive UI with proper loading states
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Accessibility**: Ensure all new components meet WCAG AA standards
- **Mobile-First**: All components must work seamlessly on mobile devices
- **Component Size**: Keep all components under 200 lines of code
- **Type Safety**: Full TypeScript coverage for all new functionality

---

## 3. Goals & Objectives

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

## 4. Target Audience

- **Primary Users:** Users searching for verified Chartered Accountants.
- **Secondary Users:** Chartered Accountants promoting their services and managing inquiries.
- **Administrators:** Users responsible for verifying profiles and managing administrative tasks.

---

## 5. Tech Stack & Libraries

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

The project follows a domain-based approach to file organization:

```
src/
  ├── app/           # Next.js App Router pages
  ├── components/    # React components
  │   ├── layout/    # Layout components (Header, Footer, etc.)
  │   ├── leads/     # Lead management components
  │   ├── features/  # Feature-specific components
  │   └── [domain]/  # Domain-specific components grouped by business functionality
  ├── ui/            # Base UI components (buttons, inputs, etc.)
  ├── services/      # Data fetching and API communication layer
  ├── store/         # State management
  │   ├── context/   # Context-based state providers
  │   └── jotai/     # Jotai state management
  ├── helper/        # Helper functions and utilities (NO data fetching)
  ├── constants/     # Constants and configuration values
  ├── types/         # TypeScript interfaces and types
  ├── tests/         # Test files following domain-based structure
  └── mock/          # Mock data for development
```

### Services Layer Architecture

The project implements a clear separation between helper functions and data fetching operations:

#### Services Layer (`/services`)

- **Purpose**: Handle all data fetching, API communication, and external service integration
- **Naming Convention**: `entityName.service.ts` (camelCase)
- **Responsibilities**:
  - Database queries and mutations
  - API calls to external services
  - Data transformation between external and internal formats
  - Error handling for data operations
- **Examples**: `leads.service.ts`, `auth.service.ts`, `profile.service.ts`

#### Helper Layer (`/helper`)

- **Purpose**: Provide utility functions and common operations (NO data fetching)
- **Naming Convention**: `entityName.helper.ts` (camelCase)
- **Responsibilities**:
  - Pure utility functions
  - Data formatting and validation
  - Common calculations
  - Client-side operations
- **Examples**: `tw.helper.ts`, `date.helper.ts`, `validation.helper.ts`

#### Key Architectural Rules

1. **Services handle data, helpers handle utilities**
2. **No data fetching operations in helper files**
3. **Services should be the only layer communicating with external APIs/databases**
4. **Helpers should contain pure functions without side effects**
5. **Both services and helpers should have comprehensive test coverage**

### Testing Structure

Tests follow the same domain-based organization as the source code:

#### Test Organization

- **Component Tests**: Mirror the component structure

  - `src/components/leads/LeadCard.component.tsx` → `src/tests/components/leads/LeadCard.test.tsx`
  - `src/components/features/auth/LoginForm.component.tsx` → `src/tests/components/features/auth/LoginForm.test.tsx`

- **Service Tests**: Test data fetching and API operations

  - `src/services/leads.service.ts` → `src/tests/services/leads.test.ts`
  - `src/services/auth.service.ts` → `src/tests/services/auth.test.ts`

- **Helper Tests**: Test utility functions
  - `src/helper/date.helper.ts` → `src/tests/helper/date.test.ts`
  - `src/helper/validation.helper.ts` → `src/tests/helper/validation.test.ts`

#### Test Naming Conventions

- Component tests: `ComponentName.test.tsx`
- Service tests: `serviceName.test.ts`
- Helper tests: `helperName.test.ts`
- Store tests: `storeName.test.ts`

#### Test Coverage Requirements

- **Services**: 100% coverage (critical for data integrity)
- **Components**: 90%+ coverage (UI reliability)
- **Helpers**: 100% coverage (utility function reliability)
- **Store**: 90%+ coverage (state management reliability)

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

### 8.2 Domain-Based Component Organization

The project follows a domain-based approach to component organization to ensure modularity and maintainability:

#### Organization Philosophy

The codebase is organized by business domain rather than technical function, which offers several advantages:

1. **Domain Cohesion:** Components related to the same business domain are grouped together, making the codebase more intuitive to navigate.
2. **Reduced Coupling:** Each domain has clear boundaries, reducing dependencies between unrelated features.
3. **Team Ownership:** Enables teams to take ownership of entire domains without stepping on each other's work.
4. **Scalability:** As the application grows, new domains can be added without reorganizing existing code.

#### Implementation

- Components are grouped by their business domain rather than their technical purpose
- Major domains have dedicated directories under `/src/components/`
- Example domains include:
  - `/components/leads/` - Components related to lead management
  - `/components/auth/` - Authentication-related components
  - `/components/forum/` - Forum and community components

#### Migration Example

The project recently migrated from a technical organization (`/components/dashboard/LeadCard.component.tsx`) to a domain-based organization (`/components/leads/LeadCard.component.tsx`). This reorganization:

1. Improved code discoverability by placing all lead-related components in one location
2. Enhanced maintainability by grouping related components
3. Established a pattern for future feature development
4. Clarified component ownership and purpose

#### Component Directory Structure

- **Layout Components:**
  - `Container.component.tsx`
- **UI Components:**
  - `Button.ui.tsx`, `Input.ui.tsx`, `Card.ui.tsx`, `Avatar.ui.tsx`, `Checkbox.ui.tsx`, `Logo.ui.tsx`, `ThemeToggle.ui.tsx`, `DecorativeElements.ui.tsx`, `CheckboxGroup.ui.tsx`, `FileUpload.ui.tsx`, `Switch.ui.tsx`, `Textarea.ui.tsx`, `Select.ui.tsx`, `AuthDivider.ui.tsx`, `GoogleButton.ui.tsx`, `BackButton.ui.tsx`
- **Feature Components:**
  - `LoginForm.component.tsx`, `LoginFormFields.component.tsx`, `LoginFormSecurity.component.tsx`, `SignUpForm.component.tsx`, `SignUpFormContent.component.tsx`, `CAAuthTabs.component.tsx`, `SearchBar.component.tsx`, `CACard.component.tsx`, `Leads.component.tsx`, `LeadCard.component.tsx`, `LeadFilter.component.tsx`, `LeadSkeleton.component.tsx`, `LeadEmptyState.component.tsx`, `RoleSelection.component.tsx`, `UserOnboardingForm.component.tsx`, `ForumFeed.component.tsx`, `PostCard.component.tsx`, `ReactionSystem.component.tsx`, `CommentThread.component.tsx`, `CreatePost.component.tsx`, `SearchAndFilter.component.tsx`, `DashboardLayout.component.tsx`

#### Best Practices

- When adding new components, identify the business domain first, then place in the appropriate directory
- If a component is used across multiple domains, consider if it belongs in a shared directory
- Keep all tests aligned with the domain structure to maintain consistency
- Update documentation whenever domain organization changes

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

#### CA Dashboard

- **Task 11:** Design and Implement the CA Dashboard.

  - **Objective:**

    - Provide CAs with a centralized hub to manage leads and interactions
    - Enable easy tracking of customer inquiries and contact requests
    - Streamline forum post creation from within the dashboard
    - Increase CA engagement and value derived from the platform

  - **User Flow:**

    - CAs are redirected to the dashboard upon completing their onboarding
    - Dashboard serves as the primary interface for CAs to manage their platform presence
    - Navigation provides quick access to all key dashboard features
    - Real-time updates for new leads and contact requests

  - **Feature Breakdown (with TDD Focus):**

    | Feature          | Description                                       | Key Component(s)                 |
    | ---------------- | ------------------------------------------------- | -------------------------------- |
    | New Leads        | Display filtered list of customer-submitted leads | LeadCard.component.tsx           |
    | Contact Requests | Show direct contact messages with metadata        | ContactRequestCard.component.tsx |
    | Create New Post  | Compose and submit forum posts                    | PostComposer.component.tsx       |

  - **Component Requirements:**

    - **Dashboard Layout Component:**

      - Responsive, mobile-first design
      - Navigation between dashboard sections
      - Summary metrics display (e.g., new leads count, unread requests)
      - Profile completion reminder (if applicable)
      - Notification system for new activity
      - Persistent access to key actions

    - **LeadCard Component:**

      - Display customer information (anonymized as needed)
      - Show requested services with visual indicators
      - Display urgency/timeline with appropriate styling
      - Show city/state for geographic context
      - Indicate contact preference (phone/WhatsApp/email)
      - Include action buttons (contact, dismiss, save)
      - Support sorting by urgency, date, or service type
      - Support filtering by multiple criteria

    - **ContactRequestCard Component:**

      - Display user message with proper formatting
      - Show timestamp with relative formatting
      - Indicate contact method preference
      - Include status indicators (new, replied, ignored)
      - Provide quick-reply functionality
      - Support bulk actions for multiple requests
      - Implement read/unread state tracking

    - **PostComposer Component:**
      - Title input with character limit
      - Rich text editor for post content
      - Image upload with preview functionality
      - Hashtag input with autocomplete from popular tags
      - Draft saving functionality
      - Preview option before posting
      - Post visibility options (public/CA-only)
      - Success/error feedback after submission

  - **TDD Enforcement:**

    - All components must follow Test-Driven Development methodology:

      - Write failing tests first (Red phase)
      - Implement minimal code to pass tests (Green phase)
      - Refactor while maintaining passing tests

    - Test coverage requirements:

      - 100% test coverage for all UI components
      - Unit tests for all utility functions
      - Integration tests for component interactions
      - Snapshot tests for UI consistency

    - Testing focus areas:
      - Component rendering in various states
      - Input validation and error handling
      - State changes from user interactions
      - API interaction mocking (Supabase)
      - Accessibility compliance
      - Responsive behavior
      - Dark mode support

  - **Data Requirements:**

    - **Leads Data:**

      - Customer ID (for internal reference)
      - Services requested (array of service types)
      - Urgency/timeline selection
      - City/state location
      - Contact preference (phone/email/WhatsApp)
      - Additional notes (if provided)
      - Submission timestamp
      - Status (new, contacted, closed)
      - CA engagements (records of CAs who viewed/contacted the lead with timestamps)

    - **Contact Requests Data:**

      - Request ID
      - User name (if provided)
      - User contact information
      - Message content
      - Submission timestamp
      - Status (new, replied, ignored)
      - CA notes (private)

    - **Forum Post Data:**
      - Inherits the same structure as the Forum Feature
      - Additional "created_from" field to track dashboard-originated posts
      - CA-specific fields for professional advice marking

  - **UI/UX Design Goals:**

    - **Layout:**

      - Mobile-first, responsive design
      - Card-based interface for each item
      - Clear visual hierarchy for information
      - Sticky navigation for easy section switching
      - Pull-to-refresh functionality on mobile

    - **Visual Style:**

      - Consistent with overall platform aesthetic
      - Bold gradients for section headers
      - Glassmorphism panels for cards and forms
      - Smooth rounded corners (min 12px radius)
      - Elegant shadow layering for depth
      - Animated transitions between states
      - Appropriate color coding for urgency/status

    - **User Experience:**
      - Quick-action buttons for common tasks
      - Swipe actions on mobile for lead/request management
      - Infinite scroll for long lists with lazy loading
      - Real-time updates when possible
      - Optimistic UI updates for action feedback
      - Comprehensive empty states and loading indicators

  - **Analytics & Metrics:**

    - Track lead response rates and time-to-response
    - Measure contact request handling efficiency
    - Monitor forum post creation frequency and engagement
    - Analyze dashboard feature usage patterns
    - Track conversion of leads to clients (future feature)

  - **Implementation Guidelines:**
    - Create all components under `/components/features/dashboard/`
    - Keep each component under 200 lines of code
    - Use Card component from shadcn UI for consistency
    - Use Phosphor icons exclusively
    - Implement proper loading and error states
    - Add appropriate animations for interactions
    - Ensure full dark mode support
    - Implement responsive design for all screen sizes
    - Add comprehensive accessibility features
    - Follow TDD methodology rigorously
    - Configure Jest + Testing Library for thorough testing

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

## Code Organization

### TypeScript Type System Standards

The project follows these type system standards:

1. **Type Definitions**:

   - All component props must have explicit type definitions
   - All data models must have interface definitions
   - All functions must have explicit return types and parameter types

2. **Enum Pattern**:

   - Enums MUST be defined in type files (e.g., `*.type.ts`)
   - Enums should be used for all string-based type values like status, categories, or actions
   - Example: `enum LeadStatus { NEW = "new", CONTACTED = "contacted" }`

3. **Constants Pattern**:

   - String constants for UI labels, messages, and other display text MUST be in constants files (e.g., `*.constants.ts`)
   - Constants should use UPPER_SNAKE_CASE naming convention
   - Example: `export const VALIDATION_MESSAGES = { REQUIRED: "This field is required" }`

4. **File Naming Conventions**:
   - React component files must be named: `ComponentName.component.tsx` (PascalCase)
   - Interface/type files must be named: `entityName.type.ts` (camelCase)
   - Constants files must be named: `entityName.constants.ts` (camelCase)
   - Utility files must be named: `entityName.utils.ts` (camelCase)

These standards ensure code consistency, reduce typos in string values, and improve maintainability.

## Testing Infrastructure

### Modular Testing Structure

The project follows a modular approach to testing that separates concerns and improves maintainability:

#### Test Mock Organization

- **Core Mocks (`/tests/mocks/core/`):**

  - `navigation.mock.tsx` - Next.js navigation (usePathname, useRouter, etc.)
  - `next.mock.tsx` - Next.js components (Link, Image, Script)
  - `storage.mock.ts` - Web storage (localStorage, sessionStorage)
  - `window.mock.ts` - Window globals (matchMedia, ResizeObserver, etc.)
  - `analytics.mock.ts` - Analytics functions and hooks
  - `supabase.mock.ts` - Supabase client, auth, and database

- **State Management Mocks (`/tests/mocks/state/`):**

  - `jotai.mock.ts` - Jotai atoms and state management
  - `context.mock.tsx` - React context providers (Auth, Theme, etc.)

- **UI Component Mocks (`/tests/mocks/ui/`):**

  - `shadcn.mock.tsx` - shadcn UI components
  - `phosphor.mock.tsx` - Phosphor icon library

- **Feature-specific Mocks (`/tests/mocks/features/`):**
  - `dashboard.mock.tsx` - Dashboard-specific test helpers

#### Import Patterns

Tests should import mocks from the most specific location possible:

```typescript
// Good: Targeted imports
import { createNavigationMocks } from "@/tests/mocks/core/navigation.mock";
import { createJotaiMocks } from "@/tests/mocks/state/jotai.mock";

// Less ideal: Using the compatibility layer
import { createNavigationMocks, createJotaiMocks } from "@/tests/mocks/jestMock.helper";
```

For backward compatibility, all mock functions are re-exported from `jestMock.helper.tsx`.

### Testing Best Practices

1. **Component Testing:**

   - Each component should have a dedicated test file
   - Tests should verify both appearance and behavior
   - Follow the AAA pattern (Arrange, Act, Assert)
   - Mock external dependencies

2. **Test Coverage Requirements:**

   - UI components: 100% coverage (statements, branches, functions)
   - Utility functions: 100% coverage (statements, branches, functions)
   - Pages and containers: Min. 80% coverage

3. **Accessibility Testing:**

   - All components should include accessibility tests
   - Use jest-axe for automated accessibility checks
   - Test keyboard navigation where applicable

4. **Test File Organization:**
   - Mirror the source code directory structure
   - Group tests by feature/functionality
   - Use descriptive test names

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
- [x] BackButton (`src/ui/BackButton.ui.tsx`) (reusable navigation component)

### Feature Components

- [x] LoginForm (`src/components/features/auth/LoginForm.component.tsx`) - 137 lines
- [x] LoginFormFields (`src/components/features/auth/LoginFormFields.component.tsx`) - 73 lines
- [x] LoginFormSecurity (`src/components/features/auth/LoginFormSecurity.component.tsx`) - 27 lines
- [x] SignUpForm (`src/components/features/auth/SignUpForm.component.tsx`) - 113 lines
- [x] SignUpFormContent (`src/components/features/auth/SignUpFormContent.component.tsx`) - **232 lines**
- [x] CAAuthTabs (`src/components/features/auth/CAAuthTabs.component.tsx`) - 84 lines
- [x] SearchBar (`src/components/features/search/SearchBar.component.tsx`)
- [x] CACard (`src/components/features/common/CACard.component.tsx`)
- [x] Leads (`src/components/leads/Leads.component.tsx`) - 85 lines
- [x] LeadCard (`src/components/leads/LeadCard.component.tsx`) - 119 lines
- [x] LeadFilter (`src/components/leads/LeadFilter.component.tsx`) - 89 lines
- [x] LeadSkeleton (`src/components/leads/LeadSkeleton.component.tsx`) - 45 lines
- [x] LeadEmptyState (`src/components/leads/LeadEmptyState.component.tsx`) - 20 lines
- [ ] RoleSelection (`src/components/features/onboarding/RoleSelection.component.tsx`)
- [ ] UserOnboardingForm (`src/components/features/onboarding/UserOnboardingForm.component.tsx`)
- [ ] ForumFeed (`src/components/features/forum/ForumFeed.component.tsx`)
- [ ] PostCard (`src/components/features/forum/PostCard.component.tsx`)
- [ ] ReactionSystem (`src/components/features/forum/ReactionSystem.component.tsx`)
- [ ] CommentThread (`src/components/features/forum/CommentThread.component.tsx`)
- [ ] CreatePost (`src/components/features/forum/CreatePost.component.tsx`)
- [ ] SearchAndFilter (`src/components/features/forum/SearchAndFilter.component.tsx`)
- [ ] DashboardLayout (`src/components/features/dashboard/DashboardLayout.component.tsx`)
