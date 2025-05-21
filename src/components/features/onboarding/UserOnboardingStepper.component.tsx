"use client";
import { useState } from "react";
import CustomerPersonalDetailsForm from "./CustomerPersonalDetailsForm.component";
import CustomerAddressForm from "./CustomerAddressForm.component";
import CustomerServicesForm from "./CustomerServicesForm.component";
import CustomerCommunicationForm from "./CustomerCommunicationForm.component";
import { Button } from "@/ui/Button.ui";

const steps = [
  { label: "Personal Details", component: CustomerPersonalDetailsForm },
  { label: "Address", component: CustomerAddressForm },
  { label: "Services Required", component: CustomerServicesForm },
  { label: "Preferred Communication", component: CustomerCommunicationForm },
];

export default function UserOnboardingStepper() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>({});
  const [errors, setErrors] = useState<any>({});

  const StepComponent = steps[step].component;

  const handleNext = () => {
    // Add validation per step if needed
    setStep(s => Math.min(s + 1, steps.length - 1));
  };
  const handlePrev = () => setStep(s => Math.max(s - 1, 0));

  return (
    <div className="w-full max-w-md mx-auto p-4 flex flex-col gap-4 bg-gradient-to-b from-background to-background/90 rounded-xl shadow-lg mt-8">
      <div className="flex justify-between mb-4">
        {steps.map((s, i) => (
          <div key={s.label} className={`flex-1 text-center text-xs font-medium ${i === step ? "text-primary" : "text-muted-foreground"}`}>{s.label}</div>
        ))}
      </div>
      <StepComponent formData={formData} setFormData={setFormData} errors={errors} setErrors={setErrors} />
      <div className="flex justify-between mt-4">
        <Button type="button" onClick={handlePrev} disabled={step === 0}>Previous</Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={handleNext}>Next</Button>
        ) : (
          <Button type="submit">Submit</Button>
        )}
      </div>
    </div>
  );
} 