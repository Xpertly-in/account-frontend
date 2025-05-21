import { FormField, FormDefinition, FormValues, ValidationErrors } from "@/types/onboarding.type";
import { FormField as FormFieldConfig } from "@/constants/form-sections.config";

/**
 * Validates a field value based on specified validation rules
 * @param field - Form field definition
 * @param value - Current field value
 * @returns Object containing isValid flag and error message if invalid
 */
export const validateField = (
  field: FormField,
  value: any
): { isValid: boolean; message?: string } => {
  if (
    field.required &&
    (value === undefined ||
      value === null ||
      value === "" ||
      (field.type === "checkbox" && Array.isArray(value) && value.length === 0))
  ) {
    return { isValid: false, message: `${field.label} is required` };
  }

  if (!field.validation || value === "" || value === undefined || value === null) {
    return { isValid: true };
  }

  const { validation } = field;

  if (validation.pattern && typeof value === "string") {
    const regex = new RegExp(validation.pattern);
    if (!regex.test(value)) {
      return { isValid: false, message: validation.message || `Invalid format for ${field.label}` };
    }
  }

  if (validation.minLength && typeof value === "string" && value.length < validation.minLength) {
    return {
      isValid: false,
      message:
        validation.message || `${field.label} must be at least ${validation.minLength} characters`,
    };
  }

  if (validation.maxLength && typeof value === "string" && value.length > validation.maxLength) {
    return {
      isValid: false,
      message:
        validation.message || `${field.label} must be at most ${validation.maxLength} characters`,
    };
  }

  if (validation.min !== undefined && typeof value === "number" && value < validation.min) {
    return {
      isValid: false,
      message: validation.message || `${field.label} must be at least ${validation.min}`,
    };
  }

  if (validation.max !== undefined && typeof value === "number" && value > validation.max) {
    return {
      isValid: false,
      message: validation.message || `${field.label} must be at most ${validation.max}`,
    };
  }

  return { isValid: true };
};

/**
 * Validates all visible fields in a form step
 * @param formDefinition - The form definition
 * @param stepIndex - Current step index
 * @param formValues - Current form values
 * @returns Object mapping field IDs to validation results
 */
export const validateStep = (
  formDefinition: FormDefinition,
  stepIndex: number,
  formValues: FormValues
): { [key: string]: { isValid: boolean; message?: string } } => {
  if (!formDefinition || !formDefinition.steps[stepIndex]) {
    return {};
  }

  const step = formDefinition.steps[stepIndex];
  const result: { [key: string]: { isValid: boolean; message?: string } } = {};

  for (const field of step.fields) {
    // Skip validation for fields that depend on other fields that aren't satisfied
    if (field.dependsOn) {
      const { field: dependentField, value: dependentValue } = field.dependsOn;
      if (formValues[dependentField] !== dependentValue) {
        result[field.id] = { isValid: true };
        continue;
      }
    }

    result[field.id] = validateField(field, formValues[field.id]);
  }

  return result;
};

/**
 * Transforms raw form values into the format expected by the API
 * @param formValues - Raw form values from the form
 * @returns Structured data for API submission
 */
export const transformFormValuesToProfile = (formValues: FormValues): Record<string, any> => {
  // This would be customized based on your API requirements
  // This is a simplified example
  return {
    name: formValues.name,
    phone: formValues.phone,
    profilePicture: formValues.profilePicture,
    qualification: formValues.qualification,
    experience: formValues.experience,
    specializations: formValues.specializations,
    about: formValues.about,
    services: formValues.services,
    fees: {
      consultationFee: formValues.consultationFee,
      hourlyRate: formValues.hourlyRate,
    },
    address: {
      street: formValues.street,
      city: formValues.city,
      state: formValues.state,
      zipCode: formValues.zipCode,
    },
    availability: {
      days: formValues.workingDays,
      hours: {
        start: formValues.startTime,
        end: formValues.endTime,
      },
    },
    documents: [], // This would be handled separately since they're file uploads
    socialLinks: {
      website: formValues.website,
      linkedin: formValues.linkedin,
      twitter: formValues.twitter,
      facebook: formValues.facebook,
    },
    verificationStatus: "pending",
  };
};

/**
 * Gets the dependency field value that controls whether a field should be shown
 * @param field - The field with potential dependencies
 * @param formValues - Current form values
 * @returns Boolean indicating if the field should be shown
 */
export const shouldShowField = (field: FormField, formValues: FormValues): boolean => {
  if (!field.dependsOn) return true;

  const { field: dependentField, value: dependentValue } = field.dependsOn;
  return formValues[dependentField] === dependentValue;
};

/**
 * Prepares initial form values with default values from the form definition
 * @param formDefinition - The form definition
 * @returns Object with initial form values
 */
export const getInitialFormValues = (formDefinition: FormDefinition): FormValues => {
  if (!formDefinition) return {};

  const initialValues: FormValues = {};

  formDefinition.steps.forEach(step => {
    step.fields.forEach(field => {
      if (field.defaultValue !== undefined) {
        initialValues[field.id] = field.defaultValue;
      } else if (field.type === "checkbox" && field.options) {
        initialValues[field.id] = [];
      } else if (field.type === "switch") {
        initialValues[field.id] = false;
      }
    });
  });

  return initialValues;
};

/**
 * Provides a summary of form progress
 * @param formDefinition - The form definition
 * @param formValues - Current form values
 * @returns Object with completion metrics
 */
export const getFormProgress = (
  formDefinition: FormDefinition,
  formValues: FormValues
): { completedFields: number; totalRequiredFields: number; percentComplete: number } => {
  if (!formDefinition) {
    return { completedFields: 0, totalRequiredFields: 0, percentComplete: 0 };
  }

  let completedFields = 0;
  let totalRequiredFields = 0;

  formDefinition.steps.forEach(step => {
    step.fields.forEach(field => {
      if (field.required) {
        totalRequiredFields++;

        const hasValue =
          formValues[field.id] !== undefined &&
          formValues[field.id] !== null &&
          formValues[field.id] !== "" &&
          (field.type !== "checkbox" ||
            (Array.isArray(formValues[field.id]) && formValues[field.id].length > 0));

        if (hasValue) {
          const validation = validateField(field, formValues[field.id]);
          if (validation.isValid) {
            completedFields++;
          }
        }
      }
    });
  });

  const percentComplete =
    totalRequiredFields > 0 ? Math.round((completedFields / totalRequiredFields) * 100) : 0;

  return { completedFields, totalRequiredFields, percentComplete };
};

export const validateForm = (formData: FormValues): ValidationErrors => {
  const errors: ValidationErrors = {};

  // Required fields validation
  const requiredFields = {
    name: "Full Name",
    phone: "Phone Number",
    about: "About",
    yearsOfExperience: "Years of Experience",
    address: "Address",
    city: "City",
    state: "State",
    pincode: "Pincode",
    icaiNumber: "ICAI Membership Number",
    licenseNumber: "Practice License Number",
    professionalEmail: "Professional Email",
  };

  for (const [field, label] of Object.entries(requiredFields)) {
    if (!formData[field] || (typeof formData[field] === "string" && !formData[field].trim())) {
      errors[field] = `${label} is required`;
    }
  }

  // Email validation
  if (formData.professionalEmail && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.professionalEmail)) {
    errors.professionalEmail = "Please enter a valid email address";
  }

  // Phone number validation (Indian format)
  if (formData.phone && !/^\+?[1-9]\d{9,14}$/.test(formData.phone.replace(/[\s-]/g, ""))) {
    errors.phone = "Please enter a valid phone number";
  }

  // Pincode validation (6 digits)
  if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
    errors.pincode = "Pincode must be 6 digits";
  }

  // URL validation for LinkedIn and website
  if (formData.linkedin && !isValidUrl(formData.linkedin)) {
    errors.linkedin = "Please enter a valid LinkedIn URL";
  }

  if (formData.website && !isValidUrl(formData.website)) {
    errors.website = "Please enter a valid website URL";
  }

  // Years of experience validation
  if (formData.yearsOfExperience) {
    const years = Number(formData.yearsOfExperience);
    if (isNaN(years) || years < 0 || years > 50) {
      errors.yearsOfExperience = "Years of experience must be between 0 and 50";
    }
  }

  return errors;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phone;
};

export const validateExperience = (exp: any) => {
  const errors: Record<string, string> = {};

  if (!exp.title?.trim()) {
    errors.title = "Job title is required";
  }

  if (!exp.companyName?.trim()) {
    errors.companyName = "Company name is required";
  }

  if (!exp.location?.trim()) {
    errors.location = "Location is required";
  }

  if (!exp.employmentType) {
    errors.employmentType = "Employment type is required";
  }

  if (!exp.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!exp.isCurrent && !exp.endDate) {
    errors.endDate = "End date is required";
  }

  if (exp.startDate && exp.endDate && !exp.isCurrent && exp.endDate < exp.startDate) {
    errors.endDate = "End date cannot be before start date";
  }

  if (!exp.industry) {
    errors.industry = "Industry is required";
  }

  if (!exp.recentService?.trim()) {
    errors.recentService = "Recent service is required";
  }

  return errors;
};

export const validateEducation = (edu: any) => {
  const errors: Record<string, string> = {};

  if (!edu.degree?.trim()) {
    errors.degree = "Degree is required";
  }

  if (!edu.instituteName?.trim()) {
    errors.instituteName = "Institute name is required";
  }

  if (!edu.fieldOfStudy?.trim()) {
    errors.fieldOfStudy = "Field of study is required";
  }

  if (!edu.startDate) {
    errors.startDate = "Start date is required";
  }

  if (!edu.isCurrent && !edu.endDate) {
    errors.endDate = "End date is required";
  }

  if (edu.startDate && edu.endDate && !edu.isCurrent && edu.endDate < edu.startDate) {
    errors.endDate = "End date cannot be before start date";
  }

  return errors;
};

export const validateService = (service: any) => {
  const errors: Record<string, string> = {};

  if (!service.name?.trim()) {
    errors.name = "Service name is required";
  }

  if (!service.description?.trim()) {
    errors.description = "Service description is required";
  }

  if (!service.price?.trim()) {
    errors.price = "Service price is required";
  }

  if (!service.duration?.trim()) {
    errors.duration = "Service duration is required";
  }

  return errors;
};

// Helper function to validate URLs
const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};
