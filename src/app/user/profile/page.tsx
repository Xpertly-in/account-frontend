"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { Card } from "@/ui/Card.ui";
import { supabase } from "@/helper/supabase.helper";
import { UserRole } from "@/types/onboarding.type";
import CustomerPersonalDetailsForm from "@/components/features/onboarding/customer/CustomerPersonalDetailsForm.component";
import CustomerAddressForm from "@/components/features/onboarding/customer/CustomerAddressForm.component";
import CustomerServicesForm from "@/components/features/onboarding/customer/CustomerServicesForm.component";
import CustomerCommunicationForm from "@/components/features/onboarding/customer/CustomerCommunicationForm.component";
import { ProgressBar } from "@/components/features/onboarding/customer/ProgressBar.component";
import { Button } from "@/ui/Button.ui";
import { toast } from "sonner";

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

interface FormData {
  name: string;
  gender: string;
  mobile: string;
  userType: string;
  about: string;
  communication: string;
  profilePhoto: File | null;
  address: string;
  city: string;
  state: string;
  pincode: string;
  services: string[];
  otherService?: string;
}

export default function UserProfilePage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    gender: "",
    mobile: "",
    userType: "",
    about: "",
    communication: "",
    profilePhoto: null,
    address: "",
    city: "",
    state: "",
    pincode: "",
    services: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [errorSteps, setErrorSteps] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // Redirect based on role
        if (profile?.role === UserRole.ACCOUNTANT) {
          router.push("/ca/dashboard");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    };

    checkRole();
  }, [auth.user, router]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!auth.user) return;

      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", auth.user.id)
          .single();

        if (error) throw error;

        if (profile) {
          setFormData(prev => ({
            ...prev,
            name: profile.name || "",
            gender: profile.gender || "",
            mobile: profile.phone || "",
            userType: profile.type_of_user || "",
            about: profile.about || "",
            communication: profile.type_of_communication || "",
            profilePhoto: null, // We'll handle this separately if needed
          }));
        }

        // Load address data
        const { data: address, error: addressError } = await supabase
          .from("address")
          .select("*")
          .eq("ca_id", auth.user.id)
          .single();

        if (address && !addressError) {
          setFormData(prev => ({
            ...prev,
            address: address.address || "",
            city: address.city || "",
            state: address.state || "",
            pincode: address.pincode || "",
          }));
        }

        // Load services data
        const { data: services, error: servicesError } = await supabase
          .from("services")
          .select("service_name")
          .eq("ca_id", auth.user.id);

        if (services && !servicesError) {
          setFormData(prev => ({
            ...prev,
            services: services.map(s => s.service_name),
          }));
        }

        setIsLoading(false);
      } catch (error) {
        console.error("Error loading profile data:", error);
        toast.error("Failed to load profile data");
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [auth.user]);

  const StepComponent = steps[step].component;

  // Step-wise validation logic
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
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
    if (!auth.user) {
      toast.error("Not authenticated");
      return;
    }

    setIsSubmitting(true);
    try {
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

      // Upsert services
      if (Array.isArray(services) && services.length > 0) {
        // Remove old services for this user
        await supabase.from("services").delete().eq("ca_id", auth.user.id);
        // Insert new services
        const serviceRows = services.map((service: string) => ({
          ca_id: auth.user.id,
          service_name: service === "Other" ? otherService : service,
          is_active: true
        }));
        const { error: serviceError } = await supabase.from("services").insert(serviceRows);
        if (serviceError) throw serviceError;
      }

      toast.success("Profile updated successfully!");
      router.push("/user/dashboard");
    } catch (err: any) {
      toast.error("Failed to update profile", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

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
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
} 