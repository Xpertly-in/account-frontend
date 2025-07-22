// Profile Store - Minimal UI state management with Jotai
// TanStack Query handles all server data fetching

import { atom } from "jotai";
import { ProfileSection } from "@/types/profile.type";

// =============================================================================
// UI STATE ATOMS
// =============================================================================

/**
 * Currently editing profile section
 */
export const editingSectionAtom = atom<ProfileSection | null>(null);

/**
 * Profile form editing mode
 */
export const isEditingProfileAtom = atom<boolean>(false);

/**
 * Experience form editing state (experience ID being edited)
 */
export const editingExperienceIdAtom = atom<string | null>(null);

/**
 * Education form editing state (education ID being edited)
 */
export const editingEducationIdAtom = atom<string | null>(null);

/**
 * Social profile editing state
 */
export const isEditingSocialProfileAtom = atom<boolean>(false);

/**
 * Profile completion progress visibility
 */
export const showCompletionProgressAtom = atom<boolean>(true);

/**
 * Profile photo upload state
 */
export const isUploadingPhotoAtom = atom<boolean>(false);

// =============================================================================
// DERIVED ATOMS
// =============================================================================

/**
 * Check if any section is currently being edited
 */
export const isAnyEditingAtom = atom(get => {
  return (
    get(isEditingProfileAtom) ||
    get(editingExperienceIdAtom) !== null ||
    get(editingEducationIdAtom) !== null ||
    get(isEditingSocialProfileAtom) ||
    get(isUploadingPhotoAtom)
  );
});

/**
 * Get current editing context for UI feedback
 */
export const editingContextAtom = atom(get => {
  if (get(isEditingProfileAtom)) return "profile";
  if (get(editingExperienceIdAtom)) return "experience";
  if (get(editingEducationIdAtom)) return "education";
  if (get(isEditingSocialProfileAtom)) return "social";
  if (get(isUploadingPhotoAtom)) return "photo";
  return null;
});

// =============================================================================
// ACTION ATOMS (Write-only)
// =============================================================================

/**
 * Start editing a specific profile section
 */
export const startEditingSectionAtom = atom(null, (get, set, section: ProfileSection) => {
  // Clear any other editing states
  set(isEditingProfileAtom, false);
  set(editingExperienceIdAtom, null);
  set(editingEducationIdAtom, null);
  set(isEditingSocialProfileAtom, false);

  // Set the new editing section
  set(editingSectionAtom, section);

  switch (section) {
    case ProfileSection.BASIC_INFO:
    case ProfileSection.PROFESSIONAL_DETAILS:
      set(isEditingProfileAtom, true);
      break;
    case ProfileSection.SOCIAL_CONTACT:
      set(isEditingSocialProfileAtom, true);
      break;
  }
});

/**
 * Start editing a specific experience
 */
export const startEditingExperienceAtom = atom(null, (get, set, experienceId: string) => {
  // Clear other editing states
  set(isEditingProfileAtom, false);
  set(editingEducationIdAtom, null);
  set(isEditingSocialProfileAtom, false);

  set(editingSectionAtom, ProfileSection.EXPERIENCE);
  set(editingExperienceIdAtom, experienceId);
});

/**
 * Start editing a specific education
 */
export const startEditingEducationAtom = atom(null, (get, set, educationId: string) => {
  // Clear other editing states
  set(isEditingProfileAtom, false);
  set(editingExperienceIdAtom, null);
  set(isEditingSocialProfileAtom, false);

  set(editingSectionAtom, ProfileSection.EDUCATION);
  set(editingEducationIdAtom, educationId);
});

/**
 * Cancel all editing states
 */
export const cancelAllEditingAtom = atom(null, (get, set) => {
  set(editingSectionAtom, null);
  set(isEditingProfileAtom, false);
  set(editingExperienceIdAtom, null);
  set(editingEducationIdAtom, null);
  set(isEditingSocialProfileAtom, false);
  set(isUploadingPhotoAtom, false);
});

/**
 * Toggle completion progress visibility
 */
export const toggleCompletionProgressAtom = atom(null, (get, set) => {
  set(showCompletionProgressAtom, !get(showCompletionProgressAtom));
});
