# Xpertly Project Guidelines

## 1. Mobile-First Design

- All components must be designed for mobile devices first
- Use TailwindCSS responsive classes (sm:, md:, lg:, xl:)
- Test all components on mobile viewports first

## 2. Component Size Limit

- Maximum 200 lines of code per component
- Break down complex components into smaller, reusable pieces
- Keep components focused on a single responsibility

## 3. File Naming Conventions

- Feature/layout component files must be named: `ComponentName.component.tsx` (PascalCase)
- UI component files must be named: `ComponentName.ui.tsx` (PascalCase)
- Provider components must be named: `Name.provider.tsx` (PascalCase)
- Helper functions must be named: `name.helper.ts` (camelCase)
- Interface/type files must be in `/types` folder (TypeScript interface files)
- Constants must be stored in the `/constants` directory

## 4. Directory Structure

The project follows this directory structure:

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

## 5. Progress Tracking

- Update progress.md after every task and sub-task
- Include detailed notes about:
  - Component construction
  - Mobile-first validation
  - Integration of specified libraries
  - Any challenges faced and solutions implemented

## 6. Technology Stack

- Next.js for the framework
- TailwindCSS for styling (with custom theme colors)
- shadcn UI components for consistent UI
- react-query for state management
- Phosphoricons for icons
- Supabase for backend services

## 7. Code Quality

- Follow ESLint and Prettier configurations
- Write clean, maintainable code
- Include appropriate comments and documentation
- Ensure proper TypeScript typing

## 8. Theme Colors

- Primary: #1E3A8A (Deep Blue)
- Secondary: #3B82F6 (Lighter Blue)
- Accent: #10B981 (Emerald Green)
- Neutrals:
  - White: #FFFFFF
  - Light Gray: #F3F4F6
  - Dark Slate: #1F2937
  - Muted Gray: #6B7280

## 9. Dark Mode Guidelines

- Use next-themes for theme management
- Follow semantic color naming
- Maintain proper contrast ratios (WCAG AA standards)
- Dark mode colors:
  - Background hierarchy:
    - Primary: #0F172A
    - Secondary: #1E293B
    - Surface: #334155
  - Text hierarchy:
    - Primary: #F8FAFC
    - Secondary: #CBD5E1
    - Muted: #64748B
  - Accent colors:
    - Primary: #3B82F6 → #60A5FA
    - Secondary: #1D4ED8 → #3B82F6
    - Accent: #10B981 → #34D399
  - Interactive states:
    - Hover: Lighten colors by 10%
    - Active: Darken colors by 10%
    - Focus: Use light ring colors
  - Shadows:
    - Use opacity-based shadows
    - Adjust blur and spread for visibility

## 10. Component Guidelines

- Use shadcn UI components as base
- Maintain consistent spacing and typography
- Ensure proper accessibility
- Implement proper error handling
- Follow responsive design patterns

## 11. Visual Design Requirements

- Use vibrant gradients for backgrounds and accent elements
- Apply proper shadow depths for visual hierarchy
- Implement interactive hover effects including:
  - Transform effects (scale, translate, rotate)
  - Shadow transitions
  - Color shifts
- Add subtle pattern backgrounds and decorative elements
- Ensure all design elements are responsive
- Use rounded corners consistently
- Include visual feedback for all interactive elements
- Maintain proper spacing that scales with viewport size
- Use only Phosphor icons for all icon needs

## 12. Documentation

- Keep all documentation up to date
- Include setup instructions
- Document any environment variables
- Maintain clear API documentation
