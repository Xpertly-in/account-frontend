# Architecture Guidelines

## Quick Summary

- **State Management**: Jotai for client state, TanStack Query for server state
- **Service Layer**: Dedicated service files with pure async functions + React Query hooks
- **Architecture**: Domain-based organization with clear separation of concerns
- **Patterns**: Consistent service patterns, proper error handling, optimal caching

## Detailed Sections

### [State Management Strategy](#state-management-strategy)
### [Service Layer Architecture](#service-layer-architecture)
### [Component Organization](#component-organization)
### [Caching and Performance](#caching-and-performance)

---

## State Management Strategy

### Core Libraries

#### TanStack Query (React Query)
- **Purpose**: Server state management, caching, background updates
- **Usage**: All data fetching operations (API calls, database queries)
- **Benefits**: Automatic caching, background refetching, optimistic updates
- **Configuration**: Global query client with appropriate defaults

#### Jotai
- **Purpose**: Client-side state management for UI state
- **Usage**: Form state, UI toggles, temporary data, derived state
- **Benefits**: Atomic approach, minimal boilerplate, excellent TypeScript support
- **Patterns**: Atom-based state with computed derivatives

### State Management Patterns

```typescript
// ✅ Good: TanStack Query for server data
const { data: profile, isLoading, error } = useProfile(userId);

// ✅ Good: Jotai for UI state
const [isMenuOpen, setIsMenuOpen] = useAtom(menuOpenAtom);

// ❌ Avoid: useState for server data
const [profile, setProfile] = useState(null);
```

### Guidelines

1. **Server State**: Always use TanStack Query for data from APIs/database
2. **Client State**: Use Jotai for UI state that doesn't persist
3. **Form State**: Use react-hook-form with Jotai for complex forms
4. **Derived State**: Use Jotai's computed atoms for derived values

---

## Service Layer Architecture

### Core Principles

#### Pure Async Functions
- **No React Dependencies**: Service functions are pure async functions
- **Independently Testable**: Can be unit tested without React context
- **Reusable**: Can be used in different contexts (components, background tasks)

#### TanStack Query Integration
- **Separate Hooks**: Each operation gets its own custom hook
- **Consistent Patterns**: All hooks follow the same structure and naming
- **Proper Cache Keys**: Consistent cache key patterns across services

### Service File Structure

```typescript
// Service file structure pattern
import { supabase } from '@/lib/supabase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/store/context/Auth.provider';

// === CORE SERVICE FUNCTIONS ===

export async function fetchProfile(userId: string): Promise<Profile> {
  // Pure async function with comprehensive error handling
}

export async function updateProfile(data: UpdateProfileData): Promise<Profile> {
  // Pure async function with proper validation
}

// === TANSTACK QUERY HOOKS ===

export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    staleTime: 30 * 60 * 1000, // 30 minutes
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });
}
```

### Service Layer Guidelines

1. **File Organization**: One service file per domain (`profile.service.ts`, `contact-requests.service.ts`)
2. **Function Naming**: Clear, descriptive names following CRUD patterns
3. **Error Handling**: Comprehensive try-catch with logging and fallback data
4. **Type Safety**: Full TypeScript coverage with proper interfaces
5. **Cache Strategy**: Appropriate stale times based on data volatility

### Query Key Patterns

```typescript
// ✅ Consistent query key patterns
['profile', userId]                    // Single entity
['profiles', { role: 'ca' }]         // Collection with filters
['contact-requests', userId, filters] // Dependent queries
```

### Cache Management Strategy

#### Stale Time Guidelines
- **Static Data** (constants): 24 hours
- **User Profiles**: 30 minutes
- **Contact Requests**: 5 minutes
- **Real-time Data**: 0 (always fresh)

#### Invalidation Patterns
```typescript
// ✅ Granular invalidation
queryClient.invalidateQueries({ queryKey: ['profile', userId] });

// ✅ Pattern-based invalidation
queryClient.invalidateQueries({ queryKey: ['contact-requests'] });
```

---

## Component Organization

### Domain-Based Structure

```
src/components/
├── features/                    # Feature-specific components
│   ├── auth/                   # Authentication components
│   ├── profile/                # Profile management
│   ├── search/                 # CA search and filtering
│   └── common/                 # Shared feature components
├── contact-requests/           # Contact request management
├── layout/                     # Layout and navigation
└── ui/                        # Reusable UI components
```

### Service Layer Structure

```
src/services/
├── profile.service.ts          # Profile CRUD operations
├── contact-requests.service.ts # Contact request management
├── auth.service.ts            # Authentication operations
└── storage.service.ts         # File upload/storage
```

### Architectural Benefits

1. **Clear Boundaries**: Each domain has dedicated components and services
2. **Reusability**: UI components can be reused across features
3. **Maintainability**: Easy to locate and modify specific functionality
4. **Testability**: Clear separation enables focused testing

---

## Caching and Performance

### Performance Optimization Strategies

#### Smart Query Building
- Avoid N+1 problems with proper joins
- Use client-side processing for complex filtering when database queries become problematic
- Implement proper pagination with server-side support

#### Caching Strategy
```typescript
// Different caching strategies based on data type
const profileQuery = useQuery({
  queryKey: ['profile', userId],
  queryFn: () => fetchProfile(userId),
  staleTime: 30 * 60 * 1000, // 30 minutes - rarely changes
});

const contactRequestsQuery = useQuery({
  queryKey: ['contact-requests', userId],
  queryFn: () => fetchContactRequests(userId),
  staleTime: 5 * 60 * 1000, // 5 minutes - more dynamic
});
```

#### Error Handling Strategy

```typescript
// Service level error handling
export async function fetchProfile(userId: string): Promise<Profile> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) throw error;
    return transformProfile(data);
  } catch (error) {
    console.error('Failed to fetch profile:', error);
    throw new Error('Unable to load profile. Please try again.');
  }
}

// Hook level error handling
export function useProfile(userId: string) {
  return useQuery({
    queryKey: ['profile', userId],
    queryFn: () => fetchProfile(userId),
    retry: (failureCount, error) => {
      // Retry logic based on error type
      return failureCount < 3 && !error.message.includes('not found');
    },
  });
}
```

### Performance Guidelines

1. **Pagination**: Always implement server-side pagination for lists
2. **Caching**: Use appropriate stale times based on data volatility
3. **Error Recovery**: Implement retry logic with exponential backoff
4. **Optimistic Updates**: Use optimistic updates for better UX
5. **Background Sync**: Leverage TanStack Query's background refetching

---

## Best Practices Summary

### Service Layer
- **Consistency**: All services follow the same architectural patterns
- **Testability**: Core functions can be unit tested independently of React
- **Performance**: Optimal caching and query strategies established
- **Maintainability**: Clear separation of concerns between services and components
- **Type Safety**: Full TypeScript integration throughout the data flow

### Architecture Benefits
- **Scalability**: Easy to add new services and features
- **Maintainability**: Clear patterns make code easy to understand and modify
- **Performance**: Optimized caching and data fetching strategies
- **Developer Experience**: Predictable patterns for implementing new functionality

This architecture ensures scalable, maintainable, and performant data management across the entire application.

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Database Schema](./database-schema.md) - Database design and relationships
- [Component Standards](./component-standards.md) - Component development guidelines
- [Testing Standards](./testing-standards.md) - Testing approaches and coverage requirements 