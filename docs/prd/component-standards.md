# Component Standards & Development Guidelines

## Quick Reference

| **Standard**       | **Requirement**               | **Details**                                             |
| ------------------ | ----------------------------- | ------------------------------------------------------- |
| **Component Size** | 200 lines max                 | [Component Size Limits](#component-size-limits)         |
| **Naming**         | `ComponentName.component.tsx` | [File Naming Conventions](#file-naming-conventions)     |
| **Mobile-First**   | Always required               | [Mobile-First Requirements](#mobile-first-requirements) |
| **TypeScript**     | Strict mode                   | [Type Safety Requirements](#type-safety-requirements)   |

## Component Size Limits

### Maximum Component Size: 200 Lines

Every React component must be **under 200 lines** including imports, exports, and comments. This ensures:

- **Maintainability**: Easier to understand and modify
- **Testability**: Simpler to write comprehensive tests
- **Reusability**: Focused components are more reusable
- **Code Review**: Faster and more thorough reviews

### Enforcement Strategy

```typescript
// ✅ GOOD: Focused component under 200 lines
export const ContactRequestCard = ({ request, onStatusUpdate }: Props) => {
  // Single responsibility: Display contact request information
  // Implementation fits comfortably under 200 lines
};

// ❌ BAD: Large component exceeding 200 lines
export const ContactRequestManagement = ({ requests }: Props) => {
  // Multiple responsibilities: filtering, sorting, display, editing
  // Needs decomposition into smaller components
};
```

### Decomposition Strategies

When components exceed 200 lines:

1. **Extract Sub-components**: Move logical sections to separate files
2. **Create Helper Functions**: Move complex logic to utility files
3. **Split by Responsibility**: Each component should have one clear purpose
4. **Compose at Parent Level**: Build complex UIs from simple components

> 💡 **Related**: See [Architecture Guidelines](../prd/architecture-guidelines.md#component-architecture) for composition patterns

## File Naming Conventions

### Component Files

- **Format**: `ComponentName.component.tsx`
- **Case**: PascalCase for component names
- **Suffix**: Always include `.component.tsx`

### Type Files

- **Format**: `entityName.type.ts`
- **Case**: camelCase for entity names
- **Location**: `/src/types/` directory

### Service Files

- **Format**: `entityName.service.ts`
- **Case**: camelCase for entity names
- **Location**: `/src/services/` directory

### Helper/Utility Files

- **Format**: `entityName.helper.ts` or `entityName.utils.ts`
- **Case**: camelCase for entity names
- **Location**: `/src/helper/` or `/src/utils/` directory

```typescript
// ✅ GOOD: Proper naming conventions
src / components / contact - requests / Card.component.tsx;
src / types / contact - request.type.ts;
src / services / contact - request.service.ts;
src / helper / contact - request.helper.ts;

// ❌ BAD: Inconsistent naming
src / components / ContactRequestCard.tsx;
src / types / ContactRequestTypes.ts;
src / services / ContactRequestService.ts;
src / utils / ContactRequestUtils.ts;
```

> 💡 **Related**: See [Database Schema](./database-schema.md#naming-conventions) for database naming standards

## Mobile-First Requirements

### Design Philosophy

All components **must** be designed for mobile devices first, then enhanced for larger screens.

### Implementation Pattern

```typescript
// ✅ GOOD: Mobile-first responsive classes
<div className="p-4 sm:p-6 lg:p-8">
  <h2 className="text-lg sm:text-xl lg:text-2xl">Title</h2>
  <div className="space-y-3 sm:space-y-4 lg:space-y-6">
    {/* Content */}
  </div>
</div>

// ❌ BAD: Desktop-first approach
<div className="p-8 md:p-6 sm:p-4">
  <h2 className="text-2xl md:text-xl sm:text-lg">Title</h2>
</div>
```

### Breakpoint Strategy

- **Base**: Mobile design (320px+)
- **sm**: Small tablets (640px+)
- **md**: Tablets (768px+)
- **lg**: Laptops (1024px+)
- **xl**: Desktops (1280px+)

> 💡 **Related**: See [UI/UX Guidelines](./ui-ux-guidelines.md#responsive-design) for detailed responsive patterns

## Type Safety Requirements

### TypeScript Strict Mode

All components must pass TypeScript strict mode compilation with zero errors.

### Required Typing

```typescript
// ✅ GOOD: Comprehensive typing
interface ContactRequestCardProps {
  request: ContactRequest;
  onStatusUpdate: (id: string, status: ContactRequestStatus) => void;
  onNotesUpdate?: (id: string, notes: string) => void;
  className?: string;
}

export const ContactRequestCard = ({
  request,
  onStatusUpdate,
  onNotesUpdate,
  className,
}: ContactRequestCardProps) => {
  // Implementation
};

// ❌ BAD: Missing or incomplete typing
export const ContactRequestCard = ({ request, onStatusUpdate }: any) => {
  // Implementation
};
```

### Type Import Standards

```typescript
// ✅ GOOD: Specific type imports
import type { ContactRequest, ContactRequestStatus } from "@/types/contact-request.type";
import type { User } from "@/types/auth.type";

// ❌ BAD: Namespace imports or missing types
import * as ContactRequestTypes from "@/types/contact-request.type";
```

> 💡 **Related**: See [Testing Standards](./testing-standards.md#type-testing) for type testing strategies

## Services vs Helpers Architecture

### Clear Separation of Concerns

#### Services (`/src/services/`)

**Purpose**: Handle all data fetching, API calls, and database operations

```typescript
// ✅ Services handle data operations
export const ContactRequestService = {
  fetchContactRequests: async (filters: ContactRequestFilter) => {
    // Supabase queries, error handling, data transformation
  },
  updateContactRequestStatus: async (id: string, status: ContactRequestStatus) => {
    // Database update operations
  },
};
```

#### Helpers (`/src/helper/`)

**Purpose**: Provide pure utility functions, formatting, and validation

```typescript
// ✅ Helpers provide pure utilities
export const contactRequestHelper = {
  formatContactRequestDate: (date: string) => {
    // Pure formatting function
  },
  validateContactRequestData: (data: ContactRequest) => {
    // Pure validation logic
  },
};
```

### Architectural Rules

1. **No Data Fetching in Helpers**: Helpers must be pure functions
2. **Services Own External APIs**: Only services communicate with Supabase/external APIs
3. **Helpers Are Testable**: All helper functions must be easily unit testable
4. **Clear Dependencies**: Services may use helpers, helpers never use services

> 💡 **Related**: See [Architecture Guidelines](./architecture-guidelines.md#service-layer-patterns) for detailed patterns

## Icon Library Standards

### Phosphor Icons with "Icon" Suffix

All icons must be imported from `@phosphor-icons/react` with the "Icon" suffix pattern:

```typescript
// ✅ GOOD: Correct icon imports
import { UserIcon, CameraIcon, CheckCircleIcon } from "@phosphor-icons/react";

// ❌ BAD: Old pattern without suffix
import { User, Camera, CheckCircle } from "@phosphor-icons/react";
```

### Icon Usage Patterns

```typescript
// ✅ GOOD: Consistent icon usage
<UserIcon className="h-5 w-5 text-gray-600" weight="duotone" />
<CameraIcon className="h-4 w-4 text-blue-500" weight="bold" />

// ❌ BAD: Inconsistent sizing or missing weight
<UserIcon className="h-5 w-5" />
<CameraIcon size={16} color="blue" />
```

> 💡 **Related**: See [UI/UX Guidelines](./ui-ux-guidelines.md#icon-system) for complete icon standards

## Component Testing Requirements

### Test Coverage Standards

- **Unit Tests**: 90%+ coverage for component logic
- **Integration Tests**: Cover component interactions
- **Accessibility Tests**: WCAG AA compliance verification

### Test File Organization

```typescript
// Test file naming: ComponentName.test.tsx
src / tests / components / contact - requests / Card.test.tsx;
src / tests / ui / Button.test.tsx;
src / tests / helper / contact - request.helper.test.ts;
```

### Required Test Suites

1. **Rendering Tests**: Component renders without errors
2. **Props Tests**: All props handled correctly
3. **Interaction Tests**: User interactions work as expected
4. **Accessibility Tests**: Screen reader and keyboard navigation
5. **Responsive Tests**: Mobile-first responsive behavior

> 💡 **Related**: See [Testing Standards](./testing-standards.md) for comprehensive testing requirements

## Performance Standards

### Bundle Size Optimization

- **Code Splitting**: Use dynamic imports for large components
- **Tree Shaking**: Import only needed utilities and functions
- **Image Optimization**: Use Next.js Image component with proper sizing

### Rendering Performance

```typescript
// ✅ GOOD: Optimized rendering
const ContactRequestCard = memo(({ request, onStatusUpdate }: Props) => {
  const handleStatusUpdate = useCallback((status: ContactRequestStatus) => {
    onStatusUpdate(request.id, status);
  }, [request.id, onStatusUpdate]);

  return (
    // Component implementation
  );
});

// ❌ BAD: Unoptimized rendering
const ContactRequestCard = ({ request, onStatusUpdate }: Props) => {
  const handleStatusUpdate = (status: ContactRequestStatus) => {
    onStatusUpdate(request.id, status);
  };

  return (
    // Component re-renders unnecessarily
  );
};
```

> 💡 **Related**: See [Architecture Guidelines](./architecture-guidelines.md#performance-optimization) for advanced patterns

## Error Handling Standards

### Error Boundaries

All major component sections must be wrapped in error boundaries:

```typescript
// ✅ GOOD: Proper error boundary usage
<ErrorBoundary fallback={<ContactRequestErrorFallback />}>
  <ContactRequestCard request={request} />
</ErrorBoundary>
```

### Error State Management

```typescript
// ✅ GOOD: Comprehensive error handling
const ContactRequestCard = ({ request }: Props) => {
  const [error, setError] = useState<string | null>(null);

  const handleStatusUpdate = async (status: ContactRequestStatus) => {
    try {
      await updateStatus(request.id, status);
      setError(null);
    } catch (err) {
      setError('Failed to update status. Please try again.');
      console.error('Status update failed:', err);
    }
  };

  if (error) {
    return <ErrorMessage message={error} onRetry={() => setError(null)} />;
  }

  return (
    // Component implementation
  );
};
```

> 💡 **Related**: See [Testing Standards](./testing-standards.md#error-testing) for error scenario testing

## Accessibility Requirements

### WCAG AA Compliance

All components must meet WCAG AA accessibility standards:

- **Keyboard Navigation**: All interactive elements accessible via keyboard
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: Minimum 4.5:1 contrast ratio for text
- **Focus Management**: Clear focus indicators and logical tab order

### Async Resource Management

For handling async resources like profile pictures, follow these patterns:

```typescript
// ✅ GOOD: Using dedicated hook for async URLs
const { url, loading, error } = useProfilePictureUrl(profilePicturePath);

// ✅ GOOD: Proper fallback handling
<Avatar
  src={url || undefined}
  name={name}
  className={loading ? "animate-pulse" : ""}
/>

// ❌ BAD: Synchronous URL generation in render
const displayUrl = getProfilePictureUrl(profilePicturePath); // Causes re-renders
```

### Caching Best Practices

- **URL Caching**: Use intelligent caching for expensive operations
- **Cache Invalidation**: Clear cache when resources are updated
- **Expiry Management**: Set appropriate expiry times (default: 55 minutes)

### Implementation Standards

```typescript
// ✅ GOOD: Accessible component
<button
  onClick={handleStatusUpdate}
  aria-label={`Update status for ${request.customerName}`}
  className="focus:ring-2 focus:ring-blue-500 focus:outline-none"
>
  Update Status
</button>

// ❌ BAD: Inaccessible component
<div onClick={handleStatusUpdate} className="cursor-pointer">
  Update Status
</div>
```

> 💡 **Related**: See [UI/UX Guidelines](./ui-ux-guidelines.md#accessibility-standards) for detailed accessibility requirements

---

## Compliance Checklist

Before submitting any component for review, ensure:

- [ ] **Size**: Component is under 200 lines
- [ ] **Naming**: Follows `ComponentName.component.tsx` convention
- [ ] **Mobile-First**: Uses mobile-first responsive design
- [ ] **TypeScript**: Passes strict mode compilation with proper type safety
- [ ] **Testing**: Has 90%+ test coverage
- [ ] **Icons**: Uses Phosphor icons with "Icon" suffix
- [ ] **Performance**: Optimized for rendering and bundle size
- [ ] **Accessibility**: Meets WCAG AA standards
- [ ] **Error Handling**: Includes proper error states and boundaries
- [ ] **Async Resources**: Uses dedicated hooks for async URL management
- [ ] **Caching**: Implements proper cache invalidation for resource updates
- [ ] **Re-rendering**: Avoids infinite loops with proper dependency management

---

_These standards ensure consistent, maintainable, and high-quality component development across the Xpertly CA Platform._
