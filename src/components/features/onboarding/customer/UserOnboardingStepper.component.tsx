"use client";
import { useState, useEffect } from "react";
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
import { uploadProfileImage } from "@/helper/customer-profile.helper";

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
  const [imageUploading, setImageUploading] = useState(false);
  const { auth } = useAuth();
  const router = useRouter();

  const StepComponent = steps[step].component;

  // Handle profile image upload
  const handleProfileImageChange = async (file: File | null) => {
    if (!file || !auth.user) return;
    setImageUploading(true);

    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setFormData((prev) => ({ ...prev, profilePhoto: file, profile_picture: previewUrl }));

      // Upload image using helper
      const { data: imageUrl, error } = await uploadProfileImage(auth.user.id, file);

      if (error) {
        throw new Error('Failed to upload image');
      }

      if (imageUrl) {
        setFormData((prev) => ({ ...prev, profile_picture: imageUrl }));
        toast.success('Profile image updated!');
      }
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to update profile image');
      setFormData((prev) => ({ ...prev, profilePhoto: null, profile_picture: '' }));
    } finally {
      setImageUploading(false);
    }
  };

  // Calculate completion percentage
  const calculateCompletionPercentage = (formData: any) => {
    const fields = [
      { key: 'name', weight: 2 }, // Name is more important
      { key: 'gender', weight: 1 },
      { key: 'mobile', weight: 1 },
      { key: 'userType', weight: 1 },
      { key: 'about', weight: 1 },
      { key: 'communication', weight: 1 },
      { key: 'address', weight: 1 },
      { key: 'city', weight: 1 },
      { key: 'state', weight: 1 },
      { key: 'pincode', weight: 1 },
      { key: 'services', weight: 1 },
      { key: 'profile_picture', weight: 1 }
    ];

    let totalWeight = 0;
    let filledWeight = 0;

    fields.forEach(field => {
      totalWeight += field.weight;
      const value = formData[field.key];
      
      if (field.key === 'services') {
        if (Array.isArray(value) && value.length > 0) {
          filledWeight += field.weight;
        }
      } else if (field.key === 'communication') {
        // Check if communication is a non-empty string
        if (typeof value === 'string' && value.trim() !== '') {
          filledWeight += field.weight;
        }
      } else if (value !== undefined && value !== null && value !== '') {
        filledWeight += field.weight;
      }
    });
    
    return Math.round((filledWeight / totalWeight) * 100);
  };

  // Step-wise validation logic
  const validateCurrentStep = () => {
    const newErrors: Record<string, string> = {};
    let hasErrors = false;
    if (step === 0) {
      if (!formData.name?.trim()) { newErrors.name = "Full Name is required"; hasErrors = true; }
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

  const handleNext = async () => {
    if (validateCurrentStep()) {
      try {
        // Save current step data
        if (!auth.user?.id) {
          toast.error("Not authenticated");
          return;
        }

        const currentData = { ...formData };
        
        // Save profile data
        const { error: profileError } = await supabase.from("profiles").upsert({
          user_id: auth.user.id,
          name: currentData.name,
          gender: currentData.gender,
          profile_picture: currentData.profile_picture,
          phone: currentData.mobile,
          about: currentData.about,
          type_of_user: currentData.userType,
          type_of_communication: currentData.communication,
          onboarding_completed: false,
          updated_at: new Date().toISOString()
        }, { onConflict: "user_id" });

        if (profileError) throw profileError;

        // Save address data if present
        if (currentData.address || currentData.city || currentData.state || currentData.pincode) {
          const { error: addressError } = await supabase.from("address").upsert({
            ca_id: auth.user.id,
            address: currentData.address,
            city: currentData.city,
            state: currentData.state,
            pincode: currentData.pincode,
            updated_at: new Date().toISOString(),
          }, { onConflict: "ca_id" });

          if (addressError) throw addressError;
        }

        // Save services if present
        if (Array.isArray(currentData.services) && currentData.services.length > 0 && auth.user?.id) {
          // First, deactivate all existing services
          await supabase
            .from("services")
            .update({ is_active: false })
            .eq("ca_id", auth.user.id);

          // Then insert new services
          const serviceRows = currentData.services.map((service: string) => ({
            ca_id: auth.user.id,
            service_name: service === "Other" ? currentData.otherService : service,
            is_active: true
          }));

          const { error: serviceError } = await supabase
            .from("services")
            .insert(serviceRows);

          if (serviceError) throw serviceError;
        }

        setStep(s => Math.min(s + 1, steps.length - 1));
      } catch (err: any) {
        toast.error("Failed to save step data", { description: err.message });
      }
    }
  };

  // Load saved data when component mounts
  useEffect(() => {
    const loadSavedData = async () => {
      if (!auth.user?.id) return;

      try {
        // Load profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", auth.user.id)
          .single();

        if (profileError) throw profileError;

        if (profile) {
          setFormData((prev: Record<string, any>) => ({
            ...prev,
            name: profile.name || "",
            gender: profile.gender || "",
            mobile: profile.phone || "",
            userType: profile.type_of_user || "",
            about: profile.about || "",
            communication: profile.type_of_communication || "",
            profile_picture: profile.profile_picture || null,
          }));
        }

        // Load address data
        const { data: address, error: addressError } = await supabase
          .from("address")
          .select("*")
          .eq("ca_id", auth.user.id)
          .single();

        if (address && !addressError) {
          setFormData((prev: Record<string, any>) => ({
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
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);

        if (services && !servicesError) {
          setFormData((prev: Record<string, any>) => ({
            ...prev,
            services: services.map(s => s.service_name),
          }));
        }
      } catch (error) {
        console.error("Error loading saved data:", error);
        toast.error("Failed to load saved data");
      }
    };

    loadSavedData();
  }, [auth.user]);

  const handleSubmit = async () => {
    if (!auth.user?.id) {
      toast.error("Not authenticated");
      return;
    }

    // Validate name before submission
    if (!formData.name?.trim()) {
      toast.error("Name is required");
      setErrors((prev: Record<string, string>) => ({ ...prev, name: "Full Name is required" }));
      setStep(0); // Go back to personal details step
      return;
    }

    setIsSubmitting(true);
    try {
      const { name, gender, mobile, about, userType, communication, address, city, state, pincode, services, otherService } = formData;
      
      // Upsert profile
      const { error: profileError } = await supabase.from("profiles").upsert({
        user_id: auth.user.id,
        name,
        gender,
        profile_picture: formData.profile_picture,
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
        // First, deactivate all existing services
        const { error: deactivateError } = await supabase
          .from("services")
          .update({ is_active: false })
          .eq("ca_id", auth.user.id);
        
        if (deactivateError) throw deactivateError;

        // Then insert new services
        const serviceRows = services.map((service: string) => ({
          ca_id: auth.user.id,
          service_name: service === "Other" ? otherService : service,
          is_active: true
        }));

        const { error: serviceError } = await supabase
          .from("services")
          .insert(serviceRows);

        if (serviceError) throw serviceError;
      }

      toast.success("Profile and onboarding saved successfully!");
      router.push("/user/dashboard");
    } catch (err: any) {
      toast.error("Failed to save onboarding info", { description: err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const completionPercentage = calculateCompletionPercentage(formData);

  return (
    <div className="flex flex-col md:flex-row w-full max-w-5xl mx-auto gap-2">
      {/* ProgressBar Sidebar */}
      <div className="md:w-1/4 w-full md:order-1 order-1 md:min-h-screen md:sticky md:top-0 flex md:items-start items-center md:justify-start justify-center bg-background">
        <div className="w-full">
          <div className="p-6 bg-gradient-to-br from-primary/10 via-secondary/5 to-transparent rounded-xl pb-0">
            <h3 className="text-lg font-semibold mb-2">Profile Completion</h3>
            <div className="flex items-center gap-2">
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${completionPercentage}%` }}
                />
              </div>
              <span className="text-sm font-medium">{completionPercentage}%</span>
            </div>
          </div>
          <ProgressBar
            steps={steps}
            currentStep={step}
            onStepClick={handleNext}
            errorSteps={errorSteps}
          />
        </div>
      </div>
      {/* Step Content */}
      <div className="flex-1 border-0 order-2 md:order-2 flex justify-center items-start mt-6">
        <Card className="p-6 flex w-full">
          {/* Section Header */}
          <div className="mb-2">
            <h2 className="text-xl font-bold text-foreground mb-1">{steps[step].label}</h2>
            <p className="text-sm text-muted-foreground">{steps[step].subtitle}</p>
          </div>
          <StepComponent 
            formData={formData} 
            setFormData={setFormData} 
            errors={errors} 
            setErrors={setErrors}
            onProfileImageChange={handleProfileImageChange}
            imageUploading={imageUploading}
          />
          {/* Navigation Buttons */}
          <div className="flex justify-between items-center gap-4 mt-8">
            {step > 0 ? (
              <Button
                onClick={() => setStep(s => Math.max(s - 1, 0))}
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