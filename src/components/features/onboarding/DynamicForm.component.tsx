"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/ui/Input.ui";
import { Select } from "@/ui/Select.ui";
import { FileUpload } from "@/ui/FileUpload.ui";
import { CheckboxGroup } from "@/ui/CheckboxGroup.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Switch } from "@/ui/Switch.ui";
import { useAuth } from "@/store/context/Auth.provider";
import FormProgressIndicator from "./FormProgressIndicator.component";
import FormStepTitle from "./FormStepTitle.component";
import FormNavigation from "./FormNavigation.component";
import { FormField, FormValues, FormDefinition } from "@/types/onboarding.type";
import { validateStep, getInitialFormValues, shouldShowField } from "@/helper/form.helper";
import formDefinitionData from "@/constants/ca-onboarding-form.json";
const formDefinition: FormDefinition = formDefinitionData as unknown as FormDefinition;

// Type for validation errors state
type ValidationErrors = { [key: string]: string | undefined };

export default function DynamicForm() {
  const router = useRouter();
  const { auth } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormValues>(() => getInitialFormValues(formDefinition));
  const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});
  const formRef = useRef<HTMLDivElement>(null);
  const [userName, setUserName] = useState<string>("CA");

  useEffect(() => {
    let name = "CA";
    if (auth.user?.name) {
      name = auth.user.name;
    } else {
      try {
        const storedUser = localStorage.getItem("mockUser");
        if (storedUser) name = JSON.parse(storedUser).name || name;
      } catch {}
    }
    setUserName(name);
  }, [auth.user]);

  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    setValidationErrors({});
  }, [currentStep]);

  const handleInputChange = (id: string, value: any) => {
    console.log(`Input Change - ID: ${id}, Value:`, value);
    setFormData(prev => ({ ...prev, [id]: value }));
    if (validationErrors[id]) {
      setValidationErrors(prev => ({ ...prev, [id]: undefined }));
    }
  };

  const runStepValidation = (): boolean => {
    console.log("--- Running Validation --- Step:", currentStep);
    console.log("Current formData:", formData);
    const stepErrors = validateStep(formDefinition, currentStep, formData);
    console.log("Validation Results:", stepErrors);
    const errors: ValidationErrors = {};
    let isValid = true;
    for (const fieldId in stepErrors) {
      if (!stepErrors[fieldId].isValid) {
        errors[fieldId] = stepErrors[fieldId].message;
        isValid = false;
      }
    }
    setValidationErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    // Only run validation if we are past the welcome step (step 0)
    const isValidationNeeded = currentStep > 0;
    if (!isValidationNeeded || runStepValidation()) {
      if (currentStep < formDefinition.steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    router.push("/ca/dashboard");
  };

  const renderField = (field: FormField) => {
    if (!shouldShowField(field, formData)) {
      return null;
    }

    const error = validationErrors[field.id];

    const renderLabel = (
      fieldId: string,
      labelText: string,
      isRequired?: boolean,
      description?: string
    ) => (
      <div className="mb-1">
        <label htmlFor={fieldId} className="text-sm font-medium text-foreground">
          {labelText} {isRequired && <span className="text-red-500">*</span>}
        </label>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
    );

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
        return (
          <div key={field.id} className="space-y-1">
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Input
              id={field.id}
              name={field.id}
              type={field.type === "number" ? "number" : field.type}
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ""}
              onChange={e => handleInputChange(field.id, e.target.value)}
              required={field.required}
              className={`w-full ${error ? "border-red-500" : ""}`}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      case "textarea":
        return (
          <div key={field.id} className="space-y-1">
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Textarea
              id={field.id}
              name={field.id}
              placeholder={field.placeholder}
              value={(formData[field.id] as string) || ""}
              onChange={e => handleInputChange(field.id, e.target.value)}
              required={field.required}
              className={`w-full ${error ? "border-red-500" : ""}`}
              aria-invalid={!!error}
            />
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      case "select":
        const selectValue = formData[field.id];
        const validSelectValue =
          typeof selectValue === "string" || Array.isArray(selectValue)
            ? selectValue
            : field.multiple
            ? []
            : "";
        return (
          <div key={field.id} className="space-y-1">
            {renderLabel(field.id, field.label, field.required, field.description)}
            <Select
              id={field.id}
              name={field.id}
              value={validSelectValue}
              onChange={e => {
                if (field.multiple) {
                  const selectedOptions = Array.from(e.target.selectedOptions).map(
                    option => option.value
                  );
                  handleInputChange(field.id, selectedOptions);
                } else {
                  handleInputChange(field.id, e.target.value);
                }
              }}
              multiple={field.multiple}
              required={field.required}
              className={`w-full ${field.multiple ? "min-h-[120px]" : ""} ${
                error ? "border-red-500" : ""
              }`}
              aria-invalid={!!error}
            >
              {!field.multiple && (
                <option value="" disabled={validSelectValue !== ""}>
                  {field.placeholder || "Select an option"}
                </option>
              )}
              {field.options?.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {field.multiple && (
              <p className="mt-1 text-xs text-muted-foreground">
                Hold Ctrl (or Cmd) to select multiple options
              </p>
            )}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        );
      case "checkbox":
        if (field.options && field.options.length > 1) {
          return (
            <CheckboxGroup
              key={field.id}
              id={field.id}
              label={field.label}
              description={field.description}
              options={field.options || []}
              value={(formData[field.id] as string[]) || []}
              onChange={(value: string[]) => handleInputChange(field.id, value)}
              required={field.required}
              error={error}
            />
          );
        } else {
          const singleOption = field.options?.[0];
          const checkboxLabel = singleOption ? singleOption.label : field.label;
          const checkboxValue = singleOption ? singleOption.value : "true";
          const isChecked = Array.isArray(formData[field.id])
            ? (formData[field.id] as string[]).includes(checkboxValue)
            : !!formData[field.id];

          return (
            <div
              key={field.id}
              className="flex items-start space-x-3 rounded-md border border-input p-4"
            >
              <input
                type="checkbox"
                id={field.id}
                name={field.id}
                checked={isChecked}
                onChange={e => {
                  if (field.options && field.options.length === 1) {
                    // If it's a single option from options array, store as array for consistency
                    handleInputChange(field.id, e.target.checked ? [checkboxValue] : []);
                  } else {
                    // Simple boolean checkbox
                    handleInputChange(field.id, e.target.checked);
                  }
                }}
                required={field.required}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary mt-1"
                aria-invalid={!!error}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={field.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {checkboxLabel}
                  {field.required && <span className="text-red-500">*</span>}
                </label>
                {field.description && (
                  <p className="text-xs text-muted-foreground">{field.description}</p>
                )}
                {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
              </div>
            </div>
          );
        }
      case "switch":
        return (
          <div
            key={field.id}
            className="flex items-center justify-between rounded-md border border-input p-4"
          >
            <div className="space-y-0.5">
              {renderLabel(field.id, field.label, field.required, field.description)}
            </div>
            <Switch
              id={field.id}
              name={field.id}
              checked={!!formData[field.id]}
              onCheckedChange={checked => handleInputChange(field.id, checked)}
              required={field.required}
              aria-invalid={!!error}
            />
          </div>
        );
      case "file":
        return (
          <FileUpload
            key={field.id}
            id={field.id}
            label={field.label}
            description={field.description}
            accept={field.accept}
            onChange={(file: File | null) => handleInputChange(field.id, file)}
            required={field.required}
            error={error}
          />
        );
      default:
        console.warn("Unhandled field type in renderField:", field.type, field);
        const _: never = field;
        return null;
    }
  };

  const currentStepData = formDefinition.steps[currentStep];

  return (
    <div className="relative" ref={formRef}>
      <FormProgressIndicator steps={formDefinition.steps} currentStepIndex={currentStep} />
      <FormStepTitle
        title={currentStepData.title}
        subtitle={currentStepData.subtitle}
        currentStepIndex={currentStep}
        totalSteps={formDefinition.steps.length}
      />

      <div
        className={`px-4 pb-6 sm:px-6 ${
          currentStep > 0 ? "min-h-[calc(100vh-280px)] md:min-h-0" : "min-h-[300px]"
        }`}
      >
        {currentStep === 0 ? (
          <div className="mx-auto flex max-w-2xl flex-col items-center justify-center py-8 text-center sm:py-12">
            {/* Consider adding a relevant Phosphor icon here if desired */}
            {/* e.g., <Smiley size={48} className="mb-4 text-primary" /> */}
            <h3 className="mb-4 text-2xl font-semibold text-foreground sm:text-3xl">
              Welcome aboard, {userName}!
            </h3>
            <p className="mb-6 text-base text-muted-foreground sm:text-lg">
              {formDefinition.description}
            </p>
            <p className="text-sm text-muted-foreground">
              Click 'Next' to begin setting up your profile.
            </p>
          </div>
        ) : (
          <div className="mx-auto grid max-w-2xl gap-6">
            {currentStepData.fields.map(field => renderField(field))}
          </div>
        )}
      </div>

      <FormNavigation
        currentStepIndex={currentStep}
        totalSteps={formDefinition.steps.length}
        isStepComplete={true}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
