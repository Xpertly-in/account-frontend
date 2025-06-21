import { atom } from "jotai/vanilla";
import { useAtom, useAtomValue, useSetAtom } from "jotai/react";
import { Provider } from "jotai/react";
import { atomWithStorage } from "jotai/utils";

// Export commonly used Jotai hooks and functions
export { atom, useAtom, useAtomValue, useSetAtom, Provider, atomWithStorage };

// Export all atoms from other files
export * from "./onboarding.store";
export * from "./analytics.store";
export * from "./dashboard.store";
