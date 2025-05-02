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
  // Use only types present in the JSON definition
  type:
    | "text"
    | "email"
    | "tel"
    | "number"
    | "textarea"
    | "select"
    | "file"
    | "checkbox"
    | "switch";
  label: string;
  placeholder?: string;
  required?: boolean;
  description?: string;
  defaultValue?: any;
  validation?: FieldValidation;
  dependsOn?: FieldDependency;
  options?: Array<{ value: string; label: string }>;
  multiple?: boolean; // Primarily for select, but kept base for simplicity
  accept?: string; // For file type
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
  // Renamed to match helper usage
  [key: string]: any;
}

// FormDefinition compatible with helper functions AND JSON structure
export interface FormDefinition {
  id: string;
  title: string;
  description: string;
  steps: FormStep[];
}
