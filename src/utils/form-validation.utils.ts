import { FormValidation, FormValidationConfig, FormValues } from '@/types/onboarding.type';

export const validateField = (value: any, validation: FormValidation): string | undefined => {
  if (validation.required && (!value || value.length === 0)) {
    return validation.message || 'This field is required';
  }

  if (value) {
    if (validation.pattern && !new RegExp(validation.pattern).test(value)) {
      return validation.message || 'Invalid format';
    }

    if (validation.minLength && value.length < validation.minLength) {
      return validation.message || `Minimum length is ${validation.minLength} characters`;
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return validation.message || `Maximum length is ${validation.maxLength} characters`;
    }

    if (validation.min !== undefined && Number(value) < validation.min) {
      return validation.message || `Minimum value is ${validation.min}`;
    }

    if (validation.max !== undefined && Number(value) > validation.max) {
      return validation.message || `Maximum value is ${validation.max}`;
    }

    if (validation.custom && !validation.custom(value)) {
      return validation.message || 'Invalid value';
    }
  }

  return undefined;
};

export const validateSection = (
  values: FormValues,
  sectionValidation: { [key: string]: FormValidation }
): { [key: string]: string } => {
  const errors: { [key: string]: string } = {};

  Object.entries(sectionValidation).forEach(([fieldName, validation]) => {
    const error = validateField(values[fieldName], validation);
    if (error) {
      errors[fieldName] = error;
    }
  });

  return errors;
};

export const validateForm = (
  values: FormValues,
  validationConfig: FormValidationConfig
): { [key: string]: { [key: string]: string } } => {
  const errors: { [key: string]: { [key: string]: string } } = {};

  Object.entries(validationConfig).forEach(([sectionId, sectionValidation]) => {
    const sectionErrors = validateSection(values, sectionValidation);
    if (Object.keys(sectionErrors).length > 0) {
      errors[sectionId] = sectionErrors;
    }
  });

  return errors;
};

export const isFormValid = (
  values: FormValues,
  validationConfig: FormValidationConfig
): boolean => {
  const errors = validateForm(values, validationConfig);
  return Object.keys(errors).length === 0;
};

// Special validation for services, experience, and education sections
export const validateServiceSection = (services: any[]): string | undefined => {
  if (!services || services.length === 0) {
    return 'Please add at least one service';
  }
  return undefined;
};

export const validateExperienceSection = (experiences: any[]): string | undefined => {
  if (!experiences || experiences.length === 0) {
    return 'Please add at least one work experience';
  }
  return undefined;
};

export const validateEducationSection = (educations: any[]): string | undefined => {
  if (!educations || educations.length === 0) {
    return 'Please add at least one education';
  }
  return undefined;
};

const validateSpecialSections = () => {
  const serviceError = validateServiceSection(services);
  const experienceError = validateExperienceSection(experiences);
  const educationError = validateEducationSection(educations);
  
  if (serviceError || experienceError || educationError) {
    setValidationErrors({
      services: serviceError,
      experience: experienceError,
      education: educationError
    });
    return false;
  }
  return true;
}; 