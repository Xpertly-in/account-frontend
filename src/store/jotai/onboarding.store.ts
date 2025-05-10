import { atom } from "@/store/jotai";
import { FormField, FormStep, FormDefinition, FormValues } from "@/types/onboarding.type";
import { CAProfile } from "@/types/ca-profile.type";

// Current step atom
export const currentStepAtom = atom<number>(0);

// Form definition atom - will be loaded from a JSON file or API
export const formDefinitionAtom = atom<FormDefinition | null>(null);

// Form values atom - will be updated as the user fills out the form
export const formValuesAtom = atom<FormValues>({});

// Form validation state
export const formValidationAtom = atom<{ [key: string]: boolean }>({});

// CA profile atom
export const caProfileAtom = atom<CAProfile | null>(null);

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
