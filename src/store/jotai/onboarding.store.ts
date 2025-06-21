import { atom, atomWithStorage } from "@/store/jotai";
import { FormField, FormStep, FormDefinition, FormValues } from "@/types/onboarding.type";
import { CAProfile } from "@/types/ca-profile.type";

// Current step atom - persist in localStorage
export const currentStepAtom = atomWithStorage<number>("xpertly_onboarding_current_step", 0);

// Form definition atom - will be loaded from a JSON file or API
export const formDefinitionAtom = atomWithStorage<FormDefinition | null>(
  "xpertly_onboarding_form_definition",
  null
);

// Form values atom - will be updated as the user fills out the form
export const formValuesAtom = atomWithStorage<FormValues>("xpertly_onboarding_form_values", {});

// Form validation state
export const formValidationAtom = atomWithStorage<{ [key: string]: boolean }>(
  "xpertly_onboarding_form_validation",
  {}
);

// CA profile atom
export const caProfileAtom = atomWithStorage<CAProfile | null>("xpertly_ca_profile", null);

// Loading state atom
export const isLoadingAtom = atom<boolean>(false);

// Form submission state atom
export const isSubmittingAtom = atom<boolean>(false);

// Form submission error atom
export const submissionErrorAtom = atom<string | null>(null);

// Derived atom for checking if the current step is valid
export const isCurrentStepValidAtom = atom(get => {
  const currentStep = get(currentStepAtom);
  const formDefinition = get(formDefinitionAtom);
  const validation = get(formValidationAtom);

  if (!formDefinition) return false;

  const stepFields = formDefinition.steps[currentStep]?.fields || [];
  return stepFields.every(
    field => !field.required || (field.id in validation && validation[field.id])
  );
});

// Derived atom for checking if form is complete
export const isFormCompleteAtom = atom(get => {
  const formDefinition = get(formDefinitionAtom);
  const validation = get(formValidationAtom);

  if (!formDefinition) return false;

  const allRequiredFields = formDefinition.steps.flatMap(step =>
    step.fields.filter(field => field.required)
  );

  return allRequiredFields.every(field => field.id in validation && validation[field.id]);
});
