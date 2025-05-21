/**
 * Jotai state management mocks for testing
 */

/**
 * Creates mocks for Jotai atoms with specified default values.
 *
 * @param setupFn - Function that sets up the mock values for atoms
 * @returns Object containing the useAtom mock function and setter functions
 *
 * @example
 * // In your test file:
 * import { leadsDataAtom, leadsLoadingAtom } from "@/store/jotai/dashboard.store";
 * import { createJotaiMocks } from "@/tests/mocks/state/jotai.mock";
 *
 * jest.mock("jotai/react");
 *
 * const mockLeads = [{ id: "1", name: "Test Lead" }];
 * const { setAtomValue } = createJotaiMocks((mock) => {
 *   mock(leadsDataAtom, mockLeads);
 *   mock(leadsLoadingAtom, false);
 * });
 *
 * // Later in tests you can update atom values:
 * setAtomValue(leadsLoadingAtom, true);
 */
export const createJotaiMocks = (setupFn?: (mockFn: (atom: any, value: any) => void) => void) => {
  // Create maps to store atom values and setters
  const atomValueStore = new Map<any, any>();
  const atomSetters = new Map<any, jest.Mock>();

  // Define the mock function that will be passed to setupFn
  const mockAtom = (atom: any, value: any) => {
    atomValueStore.set(atom, value);
  };

  // Run setup function if provided
  if (setupFn) {
    setupFn(mockAtom);
  }

  // Create the useAtom mock function
  const useAtomMock = jest.fn().mockImplementation((atom: any) => {
    // Create a setter for this atom if it doesn't exist
    if (!atomSetters.has(atom)) {
      atomSetters.set(
        atom,
        jest.fn((newValue: any) => {
          // Handle updater functions
          if (typeof newValue === "function") {
            const currentValue = atomValueStore.get(atom);
            atomValueStore.set(atom, newValue(currentValue));
          } else {
            atomValueStore.set(atom, newValue);
          }
        })
      );
    }

    // Return the current value and setter
    return [atomValueStore.get(atom), atomSetters.get(atom)];
  });

  // Mock the useAtom function
  jest.mock("jotai/react", () => ({
    __esModule: true,
    useAtom: useAtomMock,
  }));

  // Helper to update atom values programmatically during tests
  const setAtomValue = (atom: any, value: any) => {
    atomValueStore.set(atom, value);
  };

  return {
    useAtomMock,
    setAtomValue,
    atomValueStore,
    mockAtom,
  };
};
