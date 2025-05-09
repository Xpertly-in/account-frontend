# Xpertly CA Listing Portal: Unit Testing Strategy

## 1. Testing Framework Setup

### Testing Stack

- **Jest**: Primary testing framework
- **React Testing Library**: For testing React components
- **jest-dom**: For enhanced DOM matchers
- **msw (Mock Service Worker)**: For mocking API calls to Supabase
- **jest-axe**: For accessibility testing

### Configuration Files

- **jest.config.js**: Main Jest configuration
- **jest.setup.js**: Test setup file with global test configurations
- **test-utils.tsx**: Reusable testing utilities including custom render methods

## 2. Test Organization

All test files should follow these naming conventions:

- Component tests: `[ComponentName].test.tsx`
- Helper function tests: `[helperName].test.ts`
- Provider tests: `[ProviderName].test.tsx`

Tests should be organized in a structure mirroring the source code:

```
src/
  └── tests/
      ├── ui/
      ├── components/
      │   ├── layout/
      │   └── features/
      │       ├── auth/
      │       ├── search/
      │       ├── profile/
      │       ├── common/
      │       └── onboarding/
      ├── store/
      │   └── context/
      ├── helper/
      └── mocks/
          ├── handlers.ts
          ├── server.ts
          └── data/
```

## 3. Mock Data & Service Setup

### Mock Data

- Create comprehensive mock data for all entities:
  - CA profiles with all possible field variations
  - User authentication states
  - Form input data
  - Search results
  - API responses

### Mock Services

- Use MSW to intercept and mock all Supabase and external API calls
- Create dedicated mock handlers for:
  - Authentication operations
  - CA data operations
  - Profile operations
  - File upload operations
  - Search operations

## 4. Test Coverage Targets

Aim for the following coverage targets:

- **UI Components**: 100% coverage
- **Feature Components**: 90%+ coverage
- **Layout Components**: 95%+ coverage
- **Providers**: 95%+ coverage
- **Helper Functions**: 100% coverage
- **Pages**: 85%+ coverage

## 5. Common Test Cases for All Components

### Rendering Tests

1. **Default Rendering**: Component renders with default props
2. **Variations**: Component renders with different props/states
3. **Mobile-First Responsive Tests**: Component displays correctly on mobile devices
4. **Dark Mode Support**: Component displays correctly in dark mode
5. **Placeholder/Loading States**: Component displays loading states correctly

### Interaction Tests

1. **User Events**: Click, hover, input, etc.
2. **Form Interactions**: Validation, submission, error states
3. **State Changes**: Component responds to state changes correctly

### Accessibility Tests

1. **ARIA Attributes**: Proper ARIA roles and attributes
2. **Keyboard Navigation**: Tab order, focus management
3. **Screen Reader Compatibility**: Proper text alternatives
4. **Color Contrast**: Sufficient contrast ratios

### Integration Tests

1. **Component Composition**: Component works with other components
2. **Context Consumption**: Component consumes context correctly
3. **Event Propagation**: Events propagate correctly between components

### Edge Cases

1. **Empty Data**: Component handles empty data correctly
2. **Error States**: Component displays error states correctly
3. **Boundary Conditions**: Component handles extreme values correctly

## 6. Detailed Test Plan for Component Categories

### UI Components

#### Button.ui.tsx

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "@/ui/Button.ui";

describe("Button Component", () => {
  // Rendering tests
  test("renders default button", () => {});
  test("renders primary variant", () => {});
  test("renders secondary variant", () => {});
  test("renders outline variant", () => {});
  test("renders ghost variant", () => {});
  test("renders link variant", () => {});
  test("renders with different sizes", () => {});
  test("renders with icon", () => {});
  test("renders in loading state", () => {});
  test("renders with fullWidth prop", () => {});

  // Interaction tests
  test("calls onClick handler when clicked", () => {});
  test("doesn't call onClick when disabled", () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("is accessible to screen readers", () => {});

  // Edge cases
  test("handles long text content", () => {});
});
```

#### Input.ui.tsx

```typescript
// Input.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Input } from "@/ui/Input.ui";

describe("Input Component", () => {
  // Rendering tests
  test("renders default input", () => {});
  test("renders with placeholder", () => {});
  test("renders with label", () => {});
  test("renders with error state", () => {});
  test("renders with disabled state", () => {});
  test("renders with icon", () => {});

  // Interaction tests
  test("calls onChange handler when text is entered", () => {});
  test("doesn't call onChange when disabled", () => {});
  test("displays error message when in error state", () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("is accessible to screen readers", () => {});

  // Edge cases
  test("handles long input values", () => {});
});
```

Similar detailed test cases for each UI component:

- Card.ui.tsx
- Avatar.ui.tsx
- Checkbox.ui.tsx
- CheckboxGroup.ui.tsx
- DecorativeElements.ui.tsx
- FileUpload.ui.tsx
- Logo.ui.tsx
- Select.ui.tsx
- Switch.ui.tsx
- Textarea.ui.tsx
- ThemeToggle.ui.tsx
- GoogleButton.ui.tsx
- AuthDivider.ui.tsx

### Layout Components

#### Header.component.tsx

```typescript
// Header.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { Header } from "@/components/layout/Header.component";

describe("Header Component", () => {
  // Rendering tests
  test("renders header with logo", () => {});
  test("renders navigation links", () => {});
  test("renders header in mobile view", () => {});
  test("renders header in desktop view", () => {});
  test("renders login/signup links when user is not authenticated", () => {});
  test("renders user menu when user is authenticated", () => {});
  test("renders correctly in dark mode", () => {});

  // Interaction tests
  test("opens mobile menu when hamburger icon is clicked", () => {});
  test("closes mobile menu when close icon is clicked", () => {});
  test("navigates to correct page when navigation link is clicked", () => {});
  test("toggles theme when theme toggle is clicked", () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("is accessible to screen readers", () => {});
  test("supports keyboard navigation", () => {});

  // Edge cases
  test("handles long navigation link text", () => {});
});
```

Similar detailed test cases for each layout component:

- Footer.component.tsx
- Container.component.tsx

### Feature Components - Auth

#### LoginForm.component.tsx

```typescript
// LoginForm.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { LoginForm } from "@/components/features/auth/LoginForm.component";

describe("LoginForm Component", () => {
  // Rendering tests
  test("renders login form with all fields", () => {});
  test("renders form with email field", () => {});
  test("renders form with password field", () => {});
  test("renders remember me checkbox", () => {});
  test("renders forgot password link", () => {});
  test("renders login button", () => {});
  test("renders correctly in dark mode", () => {});

  // Validation tests
  test("validates email format", () => {});
  test("validates required fields", () => {});
  test("displays validation errors for invalid inputs", () => {});

  // Form submission tests
  test("submits form with valid data", async () => {});
  test("shows error message for invalid credentials", async () => {});
  test("shows loading state during form submission", async () => {});

  // Integration tests
  test("integrates with Auth provider", async () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("supports keyboard navigation", () => {});

  // Edge cases
  test("handles API errors gracefully", async () => {});
});
```

Similar detailed test cases for each auth feature component:

- SignUpForm.component.tsx
- CAAuthTabs.component.tsx
- LoginFormFields.component.tsx
- LoginFormSecurity.component.tsx
- SignUpFormContent.component.tsx
- SignUpFormFields.component.tsx
- SignUpFormTerms.component.tsx
- SignUpFormButton.component.tsx
- SignUpFormFooter.component.tsx
- SignUpFormHeader.component.tsx
- ForgotPasswordForm.component.tsx

### Feature Components - Search

#### SearchBar.component.tsx

```typescript
// SearchBar.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { SearchBar } from "@/components/features/search/SearchBar.component";

describe("SearchBar Component", () => {
  // Rendering tests
  test("renders search input", () => {});
  test("renders location dropdown", () => {});
  test("renders verified checkbox", () => {});
  test("renders search button", () => {});
  test("renders in mobile view", () => {});
  test("renders in desktop view", () => {});
  test("renders correctly in dark mode", () => {});

  // Interaction tests
  test("updates search text on input", () => {});
  test("selects location from dropdown", () => {});
  test("toggles verified checkbox", () => {});
  test("calls onSearch handler when search button is clicked", () => {});

  // Form submission tests
  test("submits search query with valid data", () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("supports keyboard navigation", () => {});

  // Edge cases
  test("handles empty search query", () => {});
});
```

### Feature Components - Profile

Test cases for each profile component:

- CAProfileWrapper.tsx
- CAProfileContent.tsx
- CAServicesSection.component.tsx
- CAReviewsSection.component.tsx
- CAContactInfo.component.tsx
- CAProfessionalDetails.component.tsx
- CAProfileHero.component.tsx
- CAAboutSection.component.tsx

### Feature Components - Common

#### CACard.component.tsx

```typescript
// CACard.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { CACard } from "@/components/features/common/CACard.component";

describe("CACard Component", () => {
  // Rendering tests
  test("renders CA card with name", () => {});
  test("renders CA card with image", () => {});
  test("renders CA card with rating", () => {});
  test("renders CA card with services", () => {});
  test("renders CA card with location", () => {});
  test("renders CA card with verified badge when verified", () => {});
  test("doesn't render verified badge when not verified", () => {});
  test("renders in mobile view", () => {});
  test("renders in desktop view", () => {});
  test("renders correctly in dark mode", () => {});

  // Interaction tests
  test("navigates to CA profile page when clicked", () => {});
  test("displays hover effect on hover", () => {});

  // Accessibility tests
  test("has proper ARIA attributes", () => {});
  test("is accessible to screen readers", () => {});

  // Edge cases
  test("handles long CA names", () => {});
  test("handles missing data fields", () => {});
});
```

### Feature Components - Onboarding

Test cases for each onboarding component:

- DynamicForm.component.tsx
- FormNavigation.component.tsx
- FormStepTitle.component.tsx
- FormProgressIndicator.component.tsx

### Store/Context Components

#### Auth.provider.tsx

```typescript
// Auth.provider.test.tsx
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/store/context/Auth.provider";

describe("Auth Provider", () => {
  // Rendering tests
  test("renders children components", () => {});

  // Authentication flow tests
  test("provides authentication state to children", () => {});
  test("handles sign up flow", async () => {});
  test("handles login flow", async () => {});
  test("handles sign out flow", async () => {});
  test("handles password reset flow", async () => {});
  test("updates auth state correctly after login", async () => {});
  test("updates auth state correctly after logout", async () => {});

  // Error handling tests
  test("handles authentication errors", async () => {});

  // Edge cases
  test("preserves auth state on page reload (localStorage)", async () => {});
  test("handles expired tokens", async () => {});
});
```

Similar test cases for each provider:

- GoogleAuth.provider.tsx
- Query.provider.tsx
- Theme.provider.tsx

### Helper Functions

Test cases for each helper function:

- googleAuth.helper.ts
- form.helper.ts
- ca-profile.helper.ts
- supabase.helper.ts
- tw.helper.ts

## 7. Implementation Example

Below is a complete implementation example for the Button component test:

```typescript
// Button.test.tsx
import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import { Button } from "@/ui/Button.ui";

describe("Button Component", () => {
  // Rendering tests
  test("renders default button", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  test("renders primary variant", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByRole("button", { name: /primary/i });
    expect(button).toHaveClass("bg-primary");
  });

  test("renders in loading state", () => {
    render(<Button isLoading>Loading</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
  });

  // Interaction tests
  test("calls onClick handler when clicked", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("doesn't call onClick when disabled", () => {
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Click me
      </Button>
    );
    fireEvent.click(screen.getByRole("button", { name: /click me/i }));
    expect(handleClick).not.toHaveBeenCalled();
  });

  // Accessibility tests
  test("has no accessibility violations", async () => {
    const { container } = render(<Button>Accessible Button</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  // Mobile responsiveness tests
  test("has touch-friendly size on mobile", () => {
    render(<Button>Mobile Button</Button>);
    const button = screen.getByRole("button");
    expect(button).toHaveClass("min-h-[44px]"); // Ensure minimum touch target size
  });
});
```

## 8. Mobile-First Design Testing

Specific tests to ensure the mobile-first design approach is followed:

1. **Viewport Size Testing**:
   - Test components at mobile viewport first (320px-375px width)
   - Test progressive enhancement at larger breakpoints
2. **Touch Target Testing**:
   - Verify interactive elements are at least 44px × 44px
   - Ensure adequate spacing between touch targets
3. **Responsive Layout Testing**:
   - Verify elements stack vertically on mobile views
   - Test that grids appropriately adjust columns
   - Verify text remains readable at all screen sizes
4. **Media Query Testing**:
   - Verify TailwindCSS responsive classes work correctly
   - Test that components respond to media query breakpoints

## 9. Testing Project Constraints

### 200-Line Rule Testing

Create utility functions to verify components adhere to the 200-line rule:

```typescript
// lineCount.test.ts
import fs from "fs";
import path from "path";

describe("200-Line Rule Compliance", () => {
  const COMPONENT_DIRS = [
    path.join(__dirname, "../../ui"),
    path.join(__dirname, "../../components"),
  ];

  const MAX_LINES = 200;

  test("all components should be under 200 lines", () => {
    // Implementation to check all component files
  });
});
```

### Dark Mode Support Testing

Create a special test utility to verify dark mode support:

```typescript
// darkMode.test.tsx
import { render } from "@testing-library/react";
import { ThemeProvider } from "@/store/context/Theme.provider";

const renderWithTheme = (ui, { theme = "light", ...options } = {}) => {
  return render(<ThemeProvider defaultTheme={theme}>{ui}</ThemeProvider>, options);
};

// Use this in component tests:
test("renders correctly in dark mode", () => {
  renderWithTheme(<ComponentToTest />, { theme: "dark" });
  // Assertions about dark mode styles
});
```

## 10. Testing Documentation

For each component, document:

1. **Test Coverage Report**: Generate and document test coverage statistics
2. **Testing Patterns**: Document common testing patterns and best practices
3. **Test Data Management**: Document how mock data is maintained and updated
4. **Failed Tests Handling**: Document process for addressing failed tests
5. **Testing Standards**: Document standards for writing new tests

## 11. Continuous Integration Setup

Configure Jest to run in CI pipeline:

1. **GitHub Actions Configuration**:

   - Run tests on pull requests
   - Run tests on merges to main branch
   - Generate and store coverage reports

2. **Coverage Reports**:

   - Set minimum coverage thresholds
   - Generate visual coverage reports

3. **Performance Monitoring**:
   - Track test execution time
   - Optimize slow-running tests
