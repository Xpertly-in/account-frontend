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

- **React Components:** Files containing React components must be named using PascalCase with a `.component.tsx` extension.
  - Example: `Header.component.tsx`, `CACard.component.tsx`
- **Types/Interfaces:** Type definitions must be stored in the `/types` directory with a `.type.ts` extension, using camelCase.
  - Example: `ca.type.ts`
- **Utilities:** Utility functions and constants must be stored in the `/utils` directory with a `.utils.ts` extension, using camelCase.
  - Example: `ca.utils.ts`

### Directory Structure

The project follows a structured approach to file organization:

```
src/
  ├── app/          # Next.js App Router pages
  ├── components/   # React components
  │   ├── ui/       # Base UI components
  │   ├── layout/   # Layout components
  │   └── features/ # Feature-specific components
  ├── types/        # TypeScript interfaces and types
  ├── utils/        # Utility functions and constants
  └── lib/          # Library configurations
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

### Phase 3: Page & Feature Development

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

#### Visual Enhancement Improvements

- **Task 10:** Implement Enhanced Card Components.

  - Create feature cards with gradient headers in different colors.
  - Add circular icon containers with hover animations.
  - Implement lift effects and shadow transitions on hover.
  - Ensure consistent spacing and visual hierarchy.

- **Task 11:** Optimize CTA Sections.

  - Design rich gradient backgrounds with pattern overlays.
  - Add decorative elements such as gradient dividers.
  - Implement high-impact button styles with transformations.
  - Create badge elements for additional context.

- **Task 12:** Replace Third-Party Icons with Phosphor Icons.

  - Remove any SVG or other icon libraries.
  - Implement appropriate Phosphor Icons for all interface elements.
  - Ensure consistent sizing and coloring of icons across the application.
  - Apply proper accessibility attributes to icons.

#### CA Listings & Profile Pages

- **Task 13:** Develop the CA Listings Page.

  - Build filter components using shadcn's Dropdown/Select.
  - Create CA listing cards using shadcn's Card.
  - Ensure a mobile-first design and that each component is under 200 lines.
  - Apply the enhanced visual design principles to listing cards.

- **Task 14:** Develop the CA Profile Page.

  - Build a detailed profile view with:
    - CA photo (using Avatar),
    - Contact details,
    - Services offered,
    - "Contact This CA" call-to-action.
  - Keep code modular and under the line limit.
  - Implement rich visual elements like gradient sections and decorative accents.

- **Task 15:** Build the Contact Form.
  - Use shadcn's Input, Textarea, and Button components.
  - Implement success/error states and integrate with react-query.
  - Create a visually appealing form with proper spacing and interactive elements.

#### CA & Admin Dashboards

- **Task 16:** Build CA Authentication & Profile Creation.
  - Implement the signup/login flows via Supabase Auth.
  - Develop a multi-step form for profile creation using shadcn UI components.
  - Ensure every component is less than 200 lines.
- **Task 17:** Develop the CA Dashboard.
  - Build a dashboard to view leads, upload documents, and edit profiles.
  - Include a progress indicator for profile completion.
- **Task 18:** Develop the Admin Dashboard.
  - Create an interface for verifying CA profiles with search and action buttons.
  - Use shadcn UI components to ensure consistency and mobile-first design.

#### SEO Optimization

- **Task 19:** Implement SEO Best Practices
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

### Phase 4: Testing, Integration & Deployment

- **Task 20:** Perform Integration Testing.
  - Validate all user flows (Home, Listings, Profile, Contact, Dashboards).
  - Ensure that every component meets the mobile-first design and 200-line rules.
- **Task 21:** Finalize Progress & Cursor Rules.
  - Confirm that `progress.md` is up-to-date.
  - Verify that `cursor_rules.md` (and optionally `.cursor_rules.json`) is current with all guidelines.
- **Task 22:** Deployment.
  - Deploy the application on Vercel.
  - Monitor deployment and update progress documentation as necessary.
- **Progress Update:** Document final testing and deployment status in `progress.md`.

---

## 10. Milestones & Timeline

- **Week 1:**
  - Complete Phase 1 tasks: Project initialization, environment setup, and TailwindCSS configuration.
- **Week 2:**
  - Finalize Phase 2 tasks: UI/UX design, design system, and foundational components.
- **Week 3:**
  - Execute Phase 3 tasks: Home, Listings, Profile, and Contact features.
- **Week 4:**
  - Finalize Phase 3 and complete Phase 4: CA/Admin dashboards, integration testing, and deployment.

---

## 11. Progress Tracking & Context Awareness

- **Progress Document (`progress.md`):**
  - Must be updated after every task and sub-task.
  - Include detailed notes on component construction (ensuring sub-200 lines), mobile-first validation, and integration of the specified libraries.
- **Cursor Rules Storage:**
  - Store AI agent guidelines in a dedicated file.
  - **Current Recommendation:** Use `cursor_rules.md` for human-readable instructions.
  - **Additional Option:** Create a machine-readable file, e.g., `.cursor_rules.json`, for automated context parsing.
  - The rules must outline:
    - Mobile-first design mandates.
    - Maximum of 200 lines per component.
    - Detailed instructions for regularly updating `progress.md`.
    - Mandatory use of Next.js, TailwindCSS (with our theme), shadcn UI components, react-query, and phosphoricons.

_Example Entry:_
Rule 1: All components must be designed with a mobile-first approach. Rule 2: No component should exceed 200 lines of code. Rule 3: Update progress.md after each task with detailed context. Rule 4: Use Next.js, TailwindCSS (with defined theme colors), shadcn UI, react-query, and phosphoricons.

---

## 12. Quality & Code Reviews

- **Code Quality:**
  - Enforce regular code reviews using Prettier and ESLint to uphold project guidelines.
  - Each component must be optimized for mobile and adhere to the 200-line maximum.
- **Documentation:**
  - Maintain and update this PRD, along with `progress.md` and the Cursor rules file, as project scope or guidelines evolve.
- **Future Enhancements:**
  - Replace the placeholder logo once the brand identity is finalized.
  - Update development guidelines based on evolving best practices and team feedback.

---

## 13. Summary

This comprehensive PRD provides a detailed roadmap for building the Xpertly – CA Listing Portal. Every phase—from initialization to deployment—is rooted in a mobile-first design approach, enforces a maximum of 200 lines of code per component, and includes thorough progress tracking via `progress.md`. The technical stack, including Next.js, TailwindCSS (with our custom theme), shadcn UI, react-query, and phosphoricons, is specified, and we include clear guidelines for maintaining context using the Cursor rules file. Based on current best practices, storing these rules in a dedicated Markdown file (and optionally a JSON file) is both acceptable and recommended.

_All team members and AI agents (Cursor) must follow these guidelines, ensuring that every task is documented, components remain modular, and the project context is preserved across sessions._
