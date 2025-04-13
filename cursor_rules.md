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

- React component files must be named: `ComponentName.component.tsx` (PascalCase)
- Interface/type files must be in `/types` folder as `entityName.type.ts` (camelCase)
- Utility files must be in `/utils` folder as `entityName.utils.ts` (camelCase)
- Constants must be in `/utils` folder as `entityName.utils.ts` (camelCase)

## 4. Progress Tracking

- Update progress.md after every task and sub-task
- Include detailed notes about:
  - Component construction
  - Mobile-first validation
  - Integration of specified libraries
  - Any challenges faced and solutions implemented

## 5. Technology Stack

- Next.js for the framework
- TailwindCSS for styling (with custom theme colors)
- shadcn UI components for consistent UI
- react-query for state management
- Phosphoricons for icons
- Supabase for backend services

## 6. Code Quality

- Follow ESLint and Prettier configurations
- Write clean, maintainable code
- Include appropriate comments and documentation
- Ensure proper TypeScript typing

## 7. Theme Colors

- Primary: #1E3A8A (Deep Blue)
- Secondary: #3B82F6 (Lighter Blue)
- Accent: #10B981 (Emerald Green)
- Neutrals:
  - White: #FFFFFF
  - Light Gray: #F3F4F6
  - Dark Slate: #1F2937
  - Muted Gray: #6B7280

## 8. Component Guidelines

- Use shadcn UI components as base
- Maintain consistent spacing and typography
- Ensure proper accessibility
- Implement proper error handling
- Follow responsive design patterns

## 9. Visual Design Requirements

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

## 10. Documentation

- Keep all documentation up to date
- Include setup instructions
- Document any environment variables
- Maintain clear API documentation
