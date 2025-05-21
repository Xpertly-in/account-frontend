/**
 * @deprecated This file is maintained for backward compatibility.
 * Please use more focused imports from the new modular structure.
 *
 * Example:
 * // Instead of:
 * import { createNavigationMocks } from '@/tests/mocks/jestMock.helper';
 *
 * // Use:
 * import { createNavigationMocks } from '@/tests/mocks/core/navigation.mock';
 *
 * // Or for multiple imports from different categories:
 * import { createNavigationMocks } from '@/tests/mocks/core/navigation.mock';
 * import { createJotaiMocks } from '@/tests/mocks/state/jotai.mock';
 */

// Re-export everything from the new modular structure
export * from "./index";
