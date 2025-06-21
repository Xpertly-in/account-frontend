/**
 * Centralized exports for all test mocks
 *
 * This file provides backward compatibility with the old jestMock.helper.tsx
 * while allowing more focused imports from individual mock modules.
 */

// Core mocks
export * from "./core/navigation.mock";
export * from "./core/next.mock";
export * from "./core/storage.mock";
export * from "./core/window.mock";
export * from "./core/analytics.mock";
export * from "./core/supabase.mock";

// State management mocks
export * from "./state/jotai.mock";
export * from "./state/context.mock";

// UI component mocks
export * from "./ui/shadcn.mock";
export * from "./ui/phosphor.mock";
export * from "./ui/scrollIntoView.mock";

// Feature-specific mocks
export * from "./features/dashboard.mock";
