// Remove the specific import, rely on global File type
// import { File } from 'buffer';

// --- Base Types Aligned with form.helper.ts and JSON ---

export interface FieldValidation {
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
}

export interface FieldDependency {
  field: string;
  value: any;
}

// Base FormField compatible with helper functions AND JSON structure
export interface FormField {
  id: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'url' | 'textarea' | 'select' | 'checkbox' | 'switch' | 'file' | 'service' | 'experience' | 'education';
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  options?: Array<{ label: string; value: string }>;
  multiple?: boolean;
  accept?: string;
  min?: number;
  max?: number;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    message?: string;
  };
}

// Remove specific CheckboxGroupFieldDef if FormField covers it
// export interface CheckboxGroupFieldDef extends FieldBase {
//   type: "checkbox_group" | "checkbox"; // JSON uses "checkbox" for groups too
// }

// Remove SwitchFieldDef if FormField covers it
// export interface SwitchFieldDef extends FieldBase {
//   type: "switch";
// }

// Union type (can likely be simplified if FormField is comprehensive)
export type FieldDefinition = FormField; // Simplify if FormField covers all variants

// FormStep compatible with helper functions AND JSON structure
export interface FormStep {
  id: string;
  title: string;
  subtitle?: string;
  fields: FormField[]; // Use the unified FormField type
}

// FormData compatible with helper functions
export interface FormValues {
  [key: string]: string | string[] | boolean | File | null;
}

// FormDefinition compatible with helper functions AND JSON structure
export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  steps: FormStep[];
}

export interface FormSection {
  id: string;
  title: string;
  subtitle: string;
  order: number;
  fields: FormField[];
}

export interface FormConfig {
  sections: FormSection[];
}

export interface ValidationErrors {
  [key: string]: string | undefined;
}

export interface ServiceField {
  id: string;
  type: 'service';
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

export interface ExperienceField {
  id: string;
  type: 'experience';
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
  options?: Array<{ label: string; value: string }>;
}

export interface EducationField {
  id: string;
  type: 'education';
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  validation?: {
    minLength?: number;
    maxLength?: number;
    message?: string;
  };
}

// Add form validation types
export interface FormValidation {
  required?: boolean;
  pattern?: string;
  minLength?: number;
  maxLength?: number;
  min?: number;
  max?: number;
  message?: string;
  custom?: (value: any) => boolean;
}

export interface SectionValidation {
  [key: string]: FormValidation;
}

export interface FormValidationConfig {
  [sectionId: string]: SectionValidation;
}
