/**
 * Storage mocks for testing (localStorage, sessionStorage)
 */

/**
 * Creates a mock implementation of localStorage
 * @returns Object containing the mock implementation and store
 */
export const createLocalStorageMock = () => {
  const store: Record<string, string> = {};

  const localStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };

  Object.defineProperty(window, "localStorage", { value: localStorageMock });

  return { localStorageMock, store };
};

/**
 * Creates a mock implementation of sessionStorage
 * @returns Object containing the mock implementation and store
 */
export const createSessionStorageMock = () => {
  const store: Record<string, string> = {};

  const sessionStorageMock = {
    getItem: jest.fn((key: string) => store[key] || null),
    setItem: jest.fn((key: string, value: string) => {
      store[key] = value.toString();
    }),
    clear: jest.fn(() => {
      Object.keys(store).forEach(key => delete store[key]);
    }),
    removeItem: jest.fn((key: string) => {
      delete store[key];
    }),
    length: Object.keys(store).length,
    key: jest.fn((index: number) => Object.keys(store)[index] || null),
  };

  Object.defineProperty(window, "sessionStorage", { value: sessionStorageMock });

  return { sessionStorageMock, store };
};
