// Mock scrollIntoView for testing environment
Object.defineProperty(Element.prototype, "scrollIntoView", {
  value: jest.fn(),
  writable: true,
});

// Mock getBoundingClientRect for testing
Object.defineProperty(Element.prototype, "getBoundingClientRect", {
  value: jest.fn(() => ({
    bottom: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    width: 0,
    x: 0,
    y: 0,
  })),
  writable: true,
});

export {};
