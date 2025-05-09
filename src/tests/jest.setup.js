// jest-dom adds custom jest matchers for asserting on DOM nodes
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
import "@testing-library/jest-dom";
import { toHaveNoViolations } from "jest-axe";

// Add jest-axe matchers
expect.extend(toHaveNoViolations);

// Mock the next/router
jest.mock("next/navigation", () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: "/",
    query: {},
  }),
  useSearchParams: jest.fn().mockReturnValue({
    get: jest.fn(),
    getAll: jest.fn(),
    has: jest.fn(),
    forEach: jest.fn(),
    entries: jest.fn(),
    keys: jest.fn(),
    values: jest.fn(),
    toString: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue("/"),
}));

// Mock the next/image
jest.mock("next/image", () => ({
  __esModule: true,
  default: props => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock the Phosphor Icons
jest.mock("@phosphor-icons/react", () => ({
  CaretDown: () => <div data-testid="caret-down-icon" />,
  CaretUp: () => <div data-testid="caret-up-icon" />,
  Check: () => <div data-testid="check-icon" />,
  User: () => <div data-testid="user-icon" />,
  Envelope: () => <div data-testid="envelope-icon" />,
  Lock: () => <div data-testid="lock-icon" />,
  MagnifyingGlass: () => <div data-testid="magnifying-glass-icon" />,
  MapPin: () => <div data-testid="map-pin-icon" />,
  Star: () => <div data-testid="star-icon" />,
  StarHalf: () => <div data-testid="star-half-icon" />,
  CheckCircle: () => <div data-testid="check-circle-icon" />,
  Moon: () => <div data-testid="moon-icon" />,
  Sun: () => <div data-testid="sun-icon" />,
  Upload: () => <div data-testid="upload-icon" />,
  File: () => <div data-testid="file-icon" />,
  X: () => <div data-testid="x-icon" />,
  PaperPlaneTilt: () => <div data-testid="paper-plane-tilt-icon" />,
  Phone: () => <div data-testid="phone-icon" />,
  GraduationCap: () => <div data-testid="graduation-cap-icon" />,
  GoogleLogo: () => <div data-testid="google-logo-icon" />,
}));

// Mock matchMedia
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: false,
      addListener: function () {},
      removeListener: function () {},
      addEventListener: function () {},
      removeEventListener: function () {},
      dispatchEvent: function () {
        return true;
      },
    };
  };

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor(callback) {
    this.callback = callback;
  }

  observe() {
    return null;
  }

  unobserve() {
    return null;
  }

  disconnect() {
    return null;
  }
};

// Suppress certain console errors during tests
const originalConsoleError = console.error;
console.error = function (...args) {
  // Filter out specific warnings
  if (
    /Warning.*not wrapped in act/i.test(args[0]) ||
    /Warning.*cannot update a component/i.test(args[0])
  ) {
    return;
  }
  originalConsoleError.apply(console, args);
};
