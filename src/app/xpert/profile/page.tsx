"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { UserRole } from "@/types/auth.type";
import type { CAProfile } from "@/types/profile.type";
import { ProfileLoader } from "@/components/profile/shared/Loader.component";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { Badge } from "@/ui/Badge.ui";
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  CheckIcon,
  UserIcon,
  GraduationCapIcon,
  BriefcaseIcon,
  LinkIcon,
} from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useProfile, useUpdateProfile } from "@/services/profile.service";

// Step Components
import PersonalInfoStep from "@/components/profile/xpert/PersonalInfoStep.component";
import EducationMembershipStep from "@/components/profile/xpert/EducationMembershipStep.component";
import ExperienceStep from "@/components/profile/xpert/ExperienceStep.component";
import SocialLinksStep from "@/components/profile/xpert/SocialLinksStep.component";

const STEPS = [
  {
    id: 1,
    title: "Personal Info",
    description: "Basic information and specializations",
    icon: UserIcon,
    component: PersonalInfoStep,
  },
  {
    id: 2,
    title: "Education & Membership",
    description: "Qualifications and CA verification",
    icon: GraduationCapIcon,
    component: EducationMembershipStep,
  },
  {
    id: 3,
    title: "Experience",
    description: "Work history and achievements",
    icon: BriefcaseIcon,
    component: ExperienceStep,
  },
  {
    id: 4,
    title: "Social Links",
    description: "Professional online presence",
    icon: LinkIcon,
    component: SocialLinksStep,
  },
];

export default function ProfilePage() {
  const { auth } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CAProfile>>({});
  const [saving, setSaving] = useState(false);

  // Use the profile service hook
  const { data: profile, isLoading: loading, error: profileError } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  // Handle authentication and role checking
  useEffect(() => {
    // Don't redirect if still loading authentication
    if (auth.isLoading) {
      return;
    }

      if (!auth.user) {
        router.push("/login");
        return;
      }

    // Check if user is CA when profile is loaded
    if (profile && profile.role !== UserRole.ACCOUNTANT) {
          router.replace("/user/profile");
          return;
        }

    // Initialize form data when profile is loaded
    if (profile) {
      setFormData(profile);
    }
  }, [auth.user, auth.isLoading, router, profile]);

  const error = profileError ? "Failed to load profile. Please try again." : null;

  const handleNext = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleStepClick = (stepId: number) => {
    setCurrentStep(stepId);
  };

  const handleSave = async () => {
    if (!profile || profile.role !== UserRole.ACCOUNTANT) return;

    setSaving(true);
    try {
      await updateProfileMutation.mutateAsync({
        profileId: profile.id,
        data: formData,
          });

      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleFormDataChange = (stepData: Partial<CAProfile>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
  };

  if (auth.isLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <ProfileLoader />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center py-12">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Profile Error
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "Failed to load profile"}
              </p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Complete Your Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Build your professional presence step by step
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {STEPS.map((step, index) => {
                const isActive = currentStep === step.id;
                const isCompleted = currentStep > step.id;
                const IconComponent = step.icon;

                return (
                  <div key={step.id} className="flex items-center flex-1">
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleStepClick(step.id)}
                        className={cn(
                          "w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-200 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2",
                          isCompleted
                            ? "bg-green-500 border-green-500 text-white hover:bg-green-600"
                            : isActive
                            ? "bg-blue-500 border-blue-500 text-white hover:bg-blue-600"
                            : "bg-white border-gray-300 text-gray-400 dark:bg-gray-800 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500"
                        )}
                      >
                        {isCompleted ? (
                          <CheckIcon className="w-5 h-5" />
                        ) : (
                          <IconComponent className="w-5 h-5" />
                        )}
                      </button>
                      <div className="mt-2 text-center">
                        <button
                          onClick={() => handleStepClick(step.id)}
                          className={cn(
                            "text-sm font-medium hover:underline focus:outline-none focus:underline",
                            isActive || isCompleted
                              ? "text-gray-900 dark:text-white"
                              : "text-gray-500 dark:text-gray-400"
                          )}
                        >
                          {step.title}
                        </button>
                        <div className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
                          {step.description}
                        </div>
                      </div>
                    </div>
                    {index < STEPS.length - 1 && (
                      <div
                        className={cn(
                          "flex-1 h-0.5 mx-4 transition-all duration-200",
                          isCompleted ? "bg-green-500" : "bg-gray-300 dark:bg-gray-600"
                        )}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Step Content */}
          <Card className="p-6 sm:p-8 mb-8">
            <CurrentStepComponent
              profile={profile as CAProfile}
              formData={formData}
              onFormDataChange={handleFormDataChange}
            />
          </Card>

          {/* Navigation */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {/* Step indicator */}
            <div className="flex justify-center mb-4">
              <Badge variant="outline" className="px-3 py-1.5 text-sm">
                Step {currentStep} of {STEPS.length}
              </Badge>
            </div>

            {/* Mobile Navigation - Full width buttons */}
            <div className="block sm:hidden space-y-3">
              {/* Primary action button */}
              {currentStep === STEPS.length ? (
                <Button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  <CheckIcon className="w-5 h-5 mr-2" />
                  Complete Profile
                </Button>
              ) : (
                <Button
                  onClick={handleNext}
                  className="w-full h-12 text-base font-medium"
                  size="lg"
                >
                  Next
                  <ArrowRightIcon className="w-5 h-5 ml-2" />
                </Button>
              )}

              {/* Secondary actions */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentStep === 1}
                  className="flex-1 h-11"
                >
                  <ArrowLeftIcon className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 h-11"
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
              </div>
            </div>

            {/* Desktop Navigation - Horizontal layout */}
            <div className="hidden sm:flex sm:justify-between sm:items-center">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center gap-2"
              >
                <ArrowLeftIcon className="w-4 h-4" />
                Previous
              </Button>

              <div className="flex gap-3">
                <Button variant="outline" onClick={handleSave} disabled={saving}>
                  {saving ? "Saving..." : "Save Progress"}
                </Button>

                {currentStep === STEPS.length ? (
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2"
                  >
                    <CheckIcon className="w-4 h-4" />
                    Complete Profile
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex items-center gap-2">
                    Next
                    <ArrowRightIcon className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
