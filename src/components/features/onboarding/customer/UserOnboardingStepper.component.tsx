"use client";
import { useState } from "react";
import { ProgressBar } from "./ProgressBar.component";

import CustomerAddressForm from "./CustomerAddressForm.component";

import CustomerCommunicationForm from "./CustomerCommunicationForm.component";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { useAuth } from "@/store/context/Auth.provider";
import { supabase } from "@/helper/supabase.helper";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import CustomerPersonalDetailsForm from "./CustomerPersonalDetailsForm.component";
import CustomerServicesForm from "./CustomerServicesForm.component";
import { v4 as uuidv4 } from 'uuid';

const steps = [
  {
    label: "Personal Details",
    subtitle: "Tell us about yourself or your business.",
    component: CustomerPersonalDetailsForm,
  },
  {
    label: "Address",
    subtitle: "Where are you located?",
    component: CustomerAddressForm,
  },
  {
    label: "Services Required",
    subtitle: "What services do you need?",
    component: CustomerServicesForm,
  },
  {
    label: "Preferred Communication",
    subtitle: "How should we contact you?",
    component: CustomerCommunicationForm,
  },
];

export default function UserOnboardingStepper() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();

  const StepComponent = steps[step].component;

  // Step-wise validation logic
  const validateCurrentStep = () => {
    const newErrors: any = {};
    let hasErrors = false;
    if (step === 0) {
      if (!formData.name) { newErrors.name = "Full Name is required"; hasErrors = true; }
      if (!formData.gender) { newErrors.gender = "Gender is required"; hasErrors = true; }
      if (!formData.mobile) { newErrors.mobile = "Phone Number is required"; hasErrors = true; }
      if (!formData.userType) { newErrors.userType = "Type of User is required"; hasErrors = true; }
      if (!formData.about) { newErrors.about = "About is required"; hasErrors = true; }
    }
    if (step === 1) {
      if (!formData.address) { newErrors.address = "Address is required"; hasErrors = true; }
      if (!formData.city) { newErrors.city = "City is required"; hasErrors = true; }
      if (!formData.state) { newErrors.state = "State is required"; hasErrors = true; }
      if (!formData.pincode) { newErrors.pincode = "Pincode is required"; hasErrors = true; }
    }
    if (step === 2) {
      if (!formData.services || formData.services.length === 0) { newErrors.services = "Select at least one service"; hasErrors = true; }
      if (formData.services && formData.services.includes("Other") && !formData.otherService) { newErrors.otherService = "Please specify other service"; hasErrors = true; }
    }
    if (step === 3) {
      if (!formData.communication) { newErrors.communication = "Preferred mode of communication is required"; hasErrors = true; }
    }
    setErrors(newErrors);
    if (hasErrors) {
      setErrorSteps(prev => prev.includes(step) ? prev : [...prev, step]);
      return false;
    } else {
      setErrorSteps(prev => prev.filter(s => s !== step));
      return true;
    }
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setStep(s => Math.min(s + 1, steps.length - 1));
    }
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));
  const handleStepClick = (stepIndex: number) => {
    if (stepIndex < step) setStep(stepIndex);
    else if (stepIndex === step + 1) handleNext();
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      if (!auth.user) throw new Error("Not authenticated");
      const { name, gender, profilePhoto, mobile, about, userType, communication, address, city, state, pincode, services, otherService } = formData;
      let profile_picture = null;
      // Upload profile picture if present
      if (profilePhoto) {
        const fileExt = profilePhoto.name.split('.').pop();
        const filePath = `${auth.user.id}/profile.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('images')
          .upload(filePath, profilePhoto, { upsert: true });
        if (uploadError) throw uploadError;
        const { data: { publicUrl } } = supabase.storage.from('images').getPublicUrl(filePath);
        profile_picture = publicUrl;
      }
      // Upsert profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: auth.user.id,
        name,
        gender,
        profile_picture,
        phone: mobile,
        about,
        type_of_user: userType,
        type_of_communication: communication,
        onboarding_completed: true,
      }, { onConflict: "user_id" });
      if (profileError) throw profileError;
      // Upsert address
      const { error: addressError } = await supabase.from("address").upsert({
        ca_id: auth.user.id,
        address,
        city,
        state,
        pincode,
        updated_at: new Date().toISOString(),
      }, { onConflict: "ca_id" });
      if (addressError) throw addressError;
      // Upsert services (as a simple array or as individual rows)
      if (Array.isArray(services) && services.length > 0) {
        // Remove old services for this user
        await supabase.from("services").delete().eq("ca_id", auth.user.id);
        // Insert new services
        const serviceRows = services.map((service: string) => ({
          id: uuidv4(),
          ca_id: auth.user!.id,
          service_name: service === "Other" ? otherService : service,
          is_active: true
        }));
        const { error: serviceError } = await supabase.from("services").insert(serviceRows);
        if (serviceError) throw serviceError;
      }
      toast.success("Profile and onboarding saved successfully!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error("Failed to save onboarding info", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto gap-2">
      {/* ProgressBar Sidebar */}
      <div className="md:w-1/4 w-full md:order-1 order-1 md:min-h-screen md:sticky md:top-0 flex md:items-start items-center md:justify-start justify-center bg-background">
        <ProgressBar
          steps={steps}
          currentStep={step}
          onStepClick={handleStepClick}
          errorSteps={errorSteps}
        />
      </div>
      {/* Step Content */}
      <div className="flex-1 border-0 order-2 md:order-2 flex justify-center items-start mt-6">
        <Card className="p-6 flex w-full">
          {/* Section Header */}
          <div className="mb-2">
            <h2 className="text-xl font-bold text-foreground mb-1">{steps[step].label}</h2>
            <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
          </div>
          <StepComponent formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8">
            {step > 0 ? (
              <Button
                onClick={handlePrev}
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
                onClick={handleSubmit}
                className="bg-gradient-to-r from-primary to-secondary text-white min-w-[100px]"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 