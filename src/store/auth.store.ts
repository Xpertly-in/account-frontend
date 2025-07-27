"use client";

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { AuthUser } from "@/src/types/auth.type";

// Auth user atom
export const authUserAtom = atom<AuthUser | null>(null);

// Note: Profile data is now managed by TanStack Query
// Loading states are handled by TanStack Query hooks

// Session persistence
export const sessionAtom = atomWithStorage<{
  access_token?: string;
  refresh_token?: string;
} | null>("auth_session", null);

// Computed atoms
export const isAuthenticatedAtom = atom((get) => {
  const user = get(authUserAtom);
  return !!user;
});

// Note: These computed values are now derived from TanStack Query data
// Keeping them for backward compatibility during transition
export const userRoleAtom = atom<string | null>(null);
export const isCAAtom = atom<boolean>(false);
export const isCustomerAtom = atom<boolean>(false);
export const profileCompletionAtom = atom<number>(0);
