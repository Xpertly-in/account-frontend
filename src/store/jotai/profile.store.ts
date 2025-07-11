import { atom } from "jotai/vanilla";
import { ProfileSection } from "@/types/profile.type";

// ============================================================================
// PROFILE CLIENT STATE ATOMS
// ============================================================================

/**
 * Profile Edit Mode Atom
 * Tracks which section is currently being edited in the profile
 * null means no section is being edited (view mode)
 */
export const profileEditSectionAtom = atom<ProfileSection | null>(null);

/**
 * Profile Form Dirty State Atom
 * Tracks whether there are unsaved changes in the profile form
 */
export const profileFormDirtyAtom = atom<boolean>(false);

/**
 * Profile Upload Progress Atom
 * Tracks the upload progress for profile picture uploads
 * null means no upload in progress
 */
export const profileUploadProgressAtom = atom<number | null>(null);

/**
 * Profile View Mode Atom
 * Tracks whether the profile is in preview mode or edit mode
 * Useful for toggling between preview and edit views
 */
export const profileViewModeAtom = atom<"view" | "edit">("view");

/**
 * Profile Completion Expanded Sections Atom
 * Tracks which sections are expanded in the profile completion tracker
 * Helps maintain UI state across component re-renders
 */
export const profileCompletionExpandedAtom = atom<Set<ProfileSection>>(new Set());

/**
 * Profile Onboarding Step Atom
 * Tracks the current step in the profile onboarding process
 * Only used during initial profile setup
 */
export const profileOnboardingStepAtom = atom<number>(0);

/**
 * Profile Validation Errors Atom
 * Stores client-side validation errors for profile forms
 * Complements server-side validation
 */
export const profileValidationErrorsAtom = atom<Record<string, string>>({});

// ============================================================================
// DERIVED ATOMS
// ============================================================================

/**
 * Is Profile Being Edited Atom
 * Derived atom that checks if any section is currently being edited
 */
export const isProfileBeingEditedAtom = atom(get => get(profileEditSectionAtom) !== null);

/**
 * Has Unsaved Changes Atom
 * Derived atom that checks if there are any unsaved changes
 */
export const hasUnsavedChangesAtom = atom(
  get => get(profileFormDirtyAtom) && get(isProfileBeingEditedAtom)
);

// ============================================================================
// ACTION ATOMS
// ============================================================================

/**
 * Start Editing Section Atom
 * Action to start editing a specific profile section
 */
export const startEditingSectionAtom = atom(null, (get, set, section: ProfileSection) => {
  set(profileEditSectionAtom, section);
  set(profileViewModeAtom, "edit");
});

/**
 * Stop Editing Atom
 * Action to stop editing and return to view mode
 */
export const stopEditingAtom = atom(null, (get, set) => {
  set(profileEditSectionAtom, null);
  set(profileViewModeAtom, "view");
  set(profileFormDirtyAtom, false);
  set(profileValidationErrorsAtom, {});
});

/**
 * Toggle Profile Completion Section Atom
 * Action to toggle the expanded state of a profile completion section
 */
export const toggleCompletionSectionAtom = atom(null, (get, set, section: ProfileSection) => {
  const expanded = new Set(get(profileCompletionExpandedAtom));
  if (expanded.has(section)) {
    expanded.delete(section);
  } else {
    expanded.add(section);
  }
  set(profileCompletionExpandedAtom, expanded);
});

/**
 * Reset Profile Store Atom
 * Action to reset all profile-related atoms to their initial state
 */
export const resetProfileStoreAtom = atom(null, (get, set) => {
  set(profileEditSectionAtom, null);
  set(profileFormDirtyAtom, false);
  set(profileUploadProgressAtom, null);
  set(profileViewModeAtom, "view");
  set(profileCompletionExpandedAtom, new Set());
  set(profileOnboardingStepAtom, 0);
  set(profileValidationErrorsAtom, {});
});
