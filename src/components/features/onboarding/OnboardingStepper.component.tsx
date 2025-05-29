import { useState } from "react";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { BasicInfoForm } from "./BasicInfoForm.component";
import { ServicesForm } from "./ServicesForm.component";
import { ExperienceForm } from "./ExperienceForm.component";
import { EducationForm } from "./EducationForm.component";
import { AddressForm } from "./AddressForm.component";
import { SocialForm } from "./SocialForm.component";
import { ProgressBar } from "./ProgressBar.component";
import { toast } from "sonner";
import { FormValues, ValidationErrors, Service, Education } from "@/types/onboarding.type";

interface OnboardingStepperProps {
  formData: FormValues;
  setFormData: (data: Partial<FormValues>) => void;
  validationErrors: ValidationErrors;
  setValidationErrors: (errors: ValidationErrors) => void;
  services: Service[];
  setServices: (services: Service[]) => void;
  experiences: any[]; // Replace 'any' with your Experience type if available
  setExperiences: (experiences: any[]) => void;
  educations: Education[];
  setEducations: (educations: Education[]) => void;
  isSubmitting: boolean;
  handleSubmit: () => void;
  servicesLoading: boolean;
  experiencesLoading: boolean;
  educationsLoading: boolean;
  profileImageUrl: string;
  onProfileImageChange: (file: File | null) => Promise<void>;
  imageUploading: boolean;
}

const steps = [
  { label: "Basic Info", subtitle: "Tell us about yourself.", component: BasicInfoForm },
  { label: "Services", subtitle: "What services do you offer?", component: ServicesForm },
  { label: "Experience", subtitle: "Share your professional experience.", component: ExperienceForm },
  { label: "Education", subtitle: "Add your educational background.", component: EducationForm },
  { label: "Address", subtitle: "Where is your office located?", component: AddressForm },
  { label: "Social", subtitle: "Add your professional links.", component: SocialForm },
];

export default function OnboardingStepper({
  formData,
  setFormData,
  validationErrors,
  setValidationErrors,
  services,
  setServices,
  experiences,
  setExperiences,
  educations,
  setEducations,
  isSubmitting,
  handleSubmit,
  servicesLoading,
  experiencesLoading,
  educationsLoading,
  profileImageUrl,
  onProfileImageChange,
  imageUploading,
}: OnboardingStepperProps) {
  const [step, setStep] = useState(0);
  const [errorSteps, setErrorSteps] = useState<number[]>([]);

  const StepComponent = steps[step].component;

  const updateValidationErrors = (newErrors: ValidationErrors) => {
    const updatedErrors: ValidationErrors = {};
    Object.entries(newErrors).forEach(([key, value]) => {
      if (value !== undefined) {
        updatedErrors[key] = value;
      }
    });
    setValidationErrors(updatedErrors);
  };

  const validateCurrentStep = () => {
    const currentStepErrors: ValidationErrors = {};
    let hasErrors = false;

    // Basic Info validation
    if (step === 0) {
      if (!formData.name) {
        currentStepErrors.name = "Name is required";
        hasErrors = true;
      }
      if (!formData.gender) {
        currentStepErrors.gender = "Gender is required";
        hasErrors = true;
      }
      if (!formData.phone) {
        currentStepErrors.phone = "Phone number is required";
        hasErrors = true;
      }
      if (!formData.about) {
        currentStepErrors.about = "About is required";
        hasErrors = true;
      }
    }

    // Address validation
    if (step === 4) {
      if (!formData.address) {
        currentStepErrors.address = "Address is required";
        hasErrors = true;
      }
      if (!formData.city) {
        currentStepErrors.city = "City is required";
        hasErrors = true;
      }
      if (!formData.state) {
        currentStepErrors.state = "State is required";
        hasErrors = true;
      }
      if (!formData.pincode) {
        currentStepErrors.pincode = "Pincode is required";
        hasErrors = true;
      }
    }

    // Social validation
    if (step === 5) {
      if (!formData.icaiNumber) {
        currentStepErrors.icaiNumber = "ICAI Number is required";
        hasErrors = true;
      }
      if (!formData.licenseNumber) {
        currentStepErrors.licenseNumber = "License Number is required";
        hasErrors = true;
      }
      if (!formData.professionalEmail) {
        currentStepErrors.professionalEmail = "Professional Email is required";
        hasErrors = true;
      }
    }

    updateValidationErrors(currentStepErrors);
    
    if (hasErrors) {
      setErrorSteps((prev: number[]) => {
        if (!prev.includes(step)) {
          return [...prev, step];
        }
        return prev;
      });
    } else {
      setErrorSteps((prev: number[]) => prev.filter(s => s !== step));
    }

    return !hasErrors;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep((prev) => Math.min(prev + 1, steps.length - 1));
    } else {
      toast.error("Please fix the errors in the current step");
    }
  };

  const handlePrev = () => setStep((prev) => Math.max(prev - 1, 0));

  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < step) {
      setStep(stepIndex);
    } else if (stepIndex === step + 1) {
      handleNext();
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto gap-2">
      {/* Progress Bar (left, sticky, full height) */}
      <div className="md:w-1/4 w-full md:order-1 order-1 md:min-h-screen md:sticky md:top-0 flex md:items-start items-center md:justify-start justify-center bg-background">
        <ProgressBar 
          steps={steps} 
          currentStep={step} 
          onStepClick={handleStepClick}
          validationErrors={validationErrors}
          errorSteps={errorSteps}
        />
      </div>
      {/* Step Content */}
      <div className="flex-1 border-0 order-2 md:order-2">
        <div className="mb-8">
          <StepComponent
            formData={formData}
            onFormDataChange={(data: Partial<FormValues>) => {
              const updatedData = { ...formData };
              Object.assign(updatedData, data);
              setFormData(updatedData);
            }}
            validationErrors={validationErrors}
            services={services}
            onServicesChange={setServices}
            servicesLoading={servicesLoading}
            experiences={experiences}
            onExperiencesChange={setExperiences}
            experiencesLoading={experiencesLoading}
            educations={educations}
            onEducationsChange={setEducations}
            educationsLoading={educationsLoading}
            profileImageUrl={profileImageUrl}
            onProfileImageChange={onProfileImageChange}
            imageUploading={imageUploading}
          />
        </div>
        <div className="flex justify-between items-center gap-4">
          {step > 0 ? (
            <Button
              onClick={handlePrev}
              disabled={isSubmitting}
              variant="outline"
              className="min-w-[100px]"
            >
              Previous
            </Button>
          ) : (
            <div />
          )}
          {step < steps.length - 1 ? (
            <Button
              onClick={handleNext}
              className="bg-gradient-to-r from-primary to-secondary text-white min-w-[100px]"
              disabled={isSubmitting}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={() => {
                if (validateCurrentStep()) {
                  handleSubmit();
                } else {
                  toast.error("Please fix all errors before submitting");
                }
              }}
              className="bg-gradient-to-r from-primary to-secondary text-white min-w-[100px]"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Submit"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
} 