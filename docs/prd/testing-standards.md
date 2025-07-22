# Testing Standards & Strategy

## Quick Summary

- **Testing Stack**: Jest + React Testing Library + MSW for comprehensive testing
- **Coverage Targets**: 90%+ for components, 100% for services and helpers
- **TDD Approach**: Write failing tests first, implement minimal code, then refactor
- **Organization**: Domain-based test structure mirroring source code organization

## Detailed Sections

### [Testing Framework & Setup](#testing-framework--setup)
### [Test Organization & Naming](#test-organization--naming)
### [Coverage Requirements](#coverage-requirements)
### [Testing Methodologies](#testing-methodologies)

---

## Testing Framework & Setup

### Core Testing Stack

#### Primary Tools
- **Jest**: Primary testing framework for unit and integration tests
- **React Testing Library**: Component testing with focus on user behavior
- **jest-dom**: Enhanced DOM matchers for better assertions
- **MSW (Mock Service Worker)**: API mocking for Supabase and external services
- **jest-axe**: Accessibility testing integration

#### Configuration Files
```javascript
// jest.config.js - Main Jest configuration
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.js'],
  testMatch: ['<rootDir>/src/tests/**/*.test.{ts,tsx}'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/app/**', // Exclude Next.js app directory
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};
```

#### Test Utilities Setup
```typescript
// test-utils.tsx - Custom render methods with providers
import { render } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'next-themes';

export function renderWithProviders(ui: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class">
        {ui}
      </ThemeProvider>
    </QueryClientProvider>
  );
}
```

### Mock Service Worker (MSW) Setup

#### API Mocking Strategy
```typescript
// mocks/handlers.ts - Centralized API mocking
import { rest } from 'msw';

export const handlers = [
  // Profile operations
  rest.get('/rest/v1/profiles', (req, res, ctx) => {
    return res(ctx.json(mockProfiles));
  }),
  
  // Contact request operations
  rest.post('/rest/v1/contact_requests', (req, res, ctx) => {
    return res(ctx.json({ id: 'new-request-id', ...req.body }));
  }),
  
  // Authentication
  rest.post('/auth/v1/token', (req, res, ctx) => {
    return res(ctx.json(mockAuthResponse));
  }),
];
```

---

## Test Organization & Naming

### Directory Structure

Tests follow the same domain-based organization as source code:

```
src/tests/
├── ui/                      # UI component tests
├── components/              # Feature component tests
│   ├── contact-requests/    # Contact request component tests
│   ├── features/           # Feature-specific tests
│   │   ├── auth/           # Authentication tests
│   │   ├── profile/        # Profile management tests
│   │   └── search/         # Search functionality tests
│   └── layout/             # Layout component tests
├── services/               # Service layer tests
├── helper/                 # Helper function tests
├── store/                  # State management tests
└── mocks/                  # Mock data and services
    ├── data/              # Mock data objects
    └── handlers.ts        # MSW request handlers
```

### File Naming Conventions

#### Component Tests
```typescript
// Pattern: [ComponentName].test.tsx
ContactRequestCard.test.tsx
ProfileAvatar.test.tsx
SearchBar.test.tsx
```

#### Service Tests
```typescript
// Pattern: [serviceName].test.ts
profile.service.test.ts
contact-requests.service.test.ts
auth.service.test.ts
```

#### Helper Tests
```typescript
// Pattern: [helperName].test.ts
date.helper.test.ts
validation.helper.test.ts
tw.helper.test.ts
```

### Test File Location Mapping

```
Source File → Test File
src/components/contact-requests/Card.component.tsx → src/tests/components/contact-requests/Card.test.tsx
src/services/profile.service.ts → src/tests/services/profile.test.ts
src/helper/date.helper.ts → src/tests/helper/date.test.ts
```

---

## Coverage Requirements

### Target Coverage by Component Type

#### Critical Components (100% Coverage)
- **Services**: All data fetching and API operations
- **Helper Functions**: All utility functions
- **Authentication Components**: Login, signup, role selection
- **Payment Components**: Any future payment-related functionality

#### High Priority (90%+ Coverage)
- **UI Components**: Button, Input, Card, Modal components
- **Feature Components**: Profile forms, search components, contact request management
- **Layout Components**: Header, Footer, Navigation
- **State Management**: Providers, hooks, stores

#### Standard Priority (85%+ Coverage)
- **Page Components**: Landing pages, dashboard pages
- **Content Components**: Static content, testimonials, FAQs

### Coverage Validation

```bash
# Run coverage analysis
npm run test:coverage

# Coverage report breakdown
npm run test:coverage:report
```

#### Coverage Thresholds
```javascript
// Enforce coverage thresholds
coverageThreshold: {
  global: {
    branches: 80,
    functions: 80,
    lines: 80,
    statements: 80,
  },
  './src/services/': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
  './src/helper/': {
    branches: 100,
    functions: 100,
    lines: 100,
    statements: 100,
  },
}
```

---

## Testing Methodologies

### Test-Driven Development (TDD)

#### TDD Cycle Implementation
1. **RED**: Write a failing test that defines desired functionality
2. **GREEN**: Write minimal code to make the test pass
3. **REFACTOR**: Improve code while keeping tests green

#### TDD Example - Service Function
```typescript
// Step 1: RED - Write failing test
describe('fetchProfile', () => {
  it('should fetch profile by user ID', async () => {
    const userId = 'test-user-id';
    const expectedProfile = mockProfile;
    
    const result = await fetchProfile(userId);
    
    expect(result).toEqual(expectedProfile);
  });
});

// Step 2: GREEN - Minimal implementation
export async function fetchProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
    
  if (error) throw error;
  return data;
}

// Step 3: REFACTOR - Add error handling, type safety, etc.
```

### Component Testing Strategies

#### User-Centric Testing Approach
```typescript
// ✅ Test user interactions, not implementation details
test('allows user to submit contact request', async () => {
  const user = userEvent.setup();
  const onSubmit = jest.fn();
  
  render(<ContactRequestForm onSubmit={onSubmit} />);
  
  // User fills out form
  await user.type(screen.getByLabelText(/name/i), 'John Doe');
  await user.type(screen.getByLabelText(/email/i), 'john@example.com');
  await user.click(screen.getByRole('button', { name: /submit/i }));
  
  // Verify user's expected outcome
  expect(onSubmit).toHaveBeenCalledWith({
    name: 'John Doe',
    email: 'john@example.com',
  });
});
```

#### Component Testing Patterns
```typescript
// Standard component test structure
describe('ContactRequestCard', () => {
  const defaultProps = {
    request: mockContactRequest,
    onStatusChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders all required information', () => {
      render(<ContactRequestCard {...defaultProps} />);
      
      expect(screen.getByText(mockContactRequest.customerName)).toBeInTheDocument();
      expect(screen.getByText(mockContactRequest.subject)).toBeInTheDocument();
    });
  });

  describe('Interactions', () => {
    it('calls onStatusChange when status button is clicked', async () => {
      const user = userEvent.setup();
      render(<ContactRequestCard {...defaultProps} />);
      
      await user.click(screen.getByRole('button', { name: /mark as completed/i }));
      
      expect(defaultProps.onStatusChange).toHaveBeenCalledWith('completed');
    });
  });

  describe('Accessibility', () => {
    it('has no accessibility violations', async () => {
      const { container } = render(<ContactRequestCard {...defaultProps} />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    });
  });
});
```

### Service Testing Strategies

#### Database Operation Testing
```typescript
// Service function testing with MSW
describe('profileService', () => {
  describe('fetchProfile', () => {
    it('successfully fetches profile data', async () => {
      const userId = 'test-user-id';
      
      // MSW will intercept and return mock data
      const result = await fetchProfile(userId);
      
      expect(result).toEqual(expect.objectContaining({
        id: userId,
        name: expect.any(String),
        email: expect.any(String),
      }));
    });

    it('handles fetch errors gracefully', async () => {
      // Mock server error response
      server.use(
        rest.get('/rest/v1/profiles', (req, res, ctx) => {
          return res(ctx.status(500), ctx.json({ error: 'Server error' }));
        })
      );

      await expect(fetchProfile('invalid-id')).rejects.toThrow('Unable to load profile');
    });
  });
});
```

### Integration Testing

#### Feature Flow Testing
```typescript
// Test complete user flows
describe('Contact Request Flow', () => {
  it('allows customer to submit and CA to receive contact request', async () => {
    const user = userEvent.setup();
    
    // Customer submits request
    render(<ContactRequestForm caId="ca-123" />);
    await user.type(screen.getByLabelText(/name/i), 'Jane Customer');
    await user.click(screen.getByRole('button', { name: /submit/i }));
    
    // Verify submission success
    expect(screen.getByText(/request submitted/i)).toBeInTheDocument();
    
    // CA receives notification (would be tested in CA dashboard)
    render(<CADashboard />);
    expect(screen.getByText(/new contact request/i)).toBeInTheDocument();
  });
});
```

### Mobile & Responsive Testing

#### Viewport Testing
```typescript
// Test responsive behavior
describe('ResponsiveComponent', () => {
  it('displays mobile layout on small screens', () => {
    // Mock mobile viewport
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 375,
    });
    
    render(<ResponsiveComponent />);
    
    expect(screen.getByTestId('mobile-menu')).toBeInTheDocument();
    expect(screen.queryByTestId('desktop-menu')).not.toBeInTheDocument();
  });
});
```

### Performance Testing

#### Component Performance
```typescript
// Test component render performance
describe('Performance', () => {
  it('renders large lists efficiently', () => {
    const startTime = performance.now();
    
    render(<ContactRequestList requests={largeContactRequestList} />);
    
    const endTime = performance.now();
    expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
  });
});
```

---

## Best Practices & Guidelines

### Writing Effective Tests

#### Test Structure (AAA Pattern)
```typescript
// Arrange, Act, Assert pattern
test('description of what is being tested', () => {
  // Arrange - Set up test data and conditions
  const mockData = createMockData();
  const onAction = jest.fn();
  
  // Act - Perform the action being tested
  render(<Component data={mockData} onAction={onAction} />);
  userEvent.click(screen.getByRole('button'));
  
  // Assert - Verify the expected outcome
  expect(onAction).toHaveBeenCalledWith(expectedValue);
});
```

#### Test Naming Conventions
```typescript
// ✅ Good: Descriptive test names
test('displays error message when form submission fails')
test('filters contact requests by status when filter is applied')
test('navigates to profile page when profile link is clicked')

// ❌ Bad: Vague test names
test('error handling')
test('filtering works')
test('navigation')
```

### Mock Management

#### Centralized Mocking Strategy
```typescript
// Centralized mock helpers
import { mockSupabaseClient, mockNextNavigation } from '@/tests/mocks';

// Apply mocks at test level
beforeEach(() => {
  mockSupabaseClient();
  mockNextNavigation();
});
```

#### Mock Data Organization
```typescript
// Organized mock data by domain
export const mockContactRequests = {
  new: createMockContactRequest({ status: 'new' }),
  completed: createMockContactRequest({ status: 'completed' }),
  urgent: createMockContactRequest({ urgency: 'immediate' }),
};
```

### Continuous Integration

#### Pre-commit Testing
```bash
# Run tests before commit
npm run test:pre-commit

# Includes:
# - Unit tests
# - Integration tests
# - Accessibility tests
# - Coverage validation
```

#### Pipeline Testing Strategy
1. **Fast Tests**: Unit tests for immediate feedback
2. **Integration Tests**: Component integration and user flows
3. **E2E Tests**: Critical user journeys (future implementation)
4. **Performance Tests**: Load and render performance validation

---

## Testing Tools & Utilities

### Custom Testing Utilities

#### Component Testing Helpers
```typescript
// Custom render with common providers
export function renderWithAuth(ui: React.ReactElement, user = mockUser) {
  return renderWithProviders(
    <AuthProvider value={{ user, isAuthenticated: true }}>
      {ui}
    </AuthProvider>
  );
}

// Screen query helpers
export const getSubmitButton = () => screen.getByRole('button', { name: /submit/i });
export const getErrorMessage = () => screen.getByRole('alert');
```

#### Mock Data Factories
```typescript
// Factory functions for consistent mock data
export function createMockProfile(overrides: Partial<Profile> = {}): Profile {
  return {
    id: 'test-profile-id',
    name: 'Test User',
    email: 'test@example.com',
    role: 'ca',
    ...overrides,
  };
}
```

### Debugging Test Issues

#### Common Debugging Techniques
```typescript
// Debug component output
screen.debug(); // Prints current DOM
screen.logTestingPlaygroundURL(); // Interactive debugging

// Debug specific elements
screen.debug(screen.getByRole('button'));

// Check what's rendered
console.log(prettyDOM(container));
```

---

## Related Documentation

- [Overview](./overview.md) - Project description and objectives
- [Architecture Guidelines](./architecture-guidelines.md) - Service layer and state management patterns
- [Database Schema](./database-schema.md) - Database design and relationships
- [Component Standards](./component-standards.md) - Development standards and naming conventions
- [UI/UX Guidelines](./ui-ux-guidelines.md) - Design system and visual guidelines 