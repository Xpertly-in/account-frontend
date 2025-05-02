import { atom } from "jotai";

// Define types for form fields
export interface FormField {
  id: string;
  type:
    | "text"
    | "email"
    | "number"
    | "password"
    | "select"
    | "checkbox"
    | "radio"
    | "textarea"
    | "date"
    | "tel"
    | "file"
    | "switch";
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  options?: { value: string; label: string }[]; // For select, radio, etc.
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
  };
  defaultValue?: any;
  step?: number; // For form steps
  dependsOn?: {
    field: string;
    value: any;
  };
  className?: string;
}

export interface FormStep {
  id: string;
  title: string;
  subtitle?: string;
  fields: FormField[];
}

// Form definition interface
export interface FormDefinition {
  id: string;
  title: string;
  description?: string;
  steps: FormStep[];
}

// Form values interface
export interface FormValues {
  [key: string]: any;
}

// CA profile data interface
export interface CAProfile {
  id?: string;
  userId: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  qualification?: string;
  experience?: number;
  specializations?: string[];
  about?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  services?: string[];
  fees?: {
    consultationFee?: number;
    hourlyRate?: number;
  };
  availability?: {
    days?: string[];
    hours?: {
      start?: string;
      end?: string;
    };
  };
  documents?: {
    id: string;
    name: string;
    url: string;
    verified: boolean;
  }[];
  socialLinks?: {
    website?: string;
    linkedin?: string;
    twitter?: string;
    facebook?: string;
  };
  verificationStatus: "pending" | "verified" | "rejected";
  createdAt?: string;
  updatedAt?: string;
}

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
