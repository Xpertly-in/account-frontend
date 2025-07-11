"use client";

import React, { useEffect } from "react";
import { useForm, FormProvider, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAtom } from "jotai";
import { profileFormDirtyAtom, profileValidationErrorsAtom } from "@/store/jotai/profile.store";
import { Card } from "@/ui/Card.ui";
import { Button } from "@/ui/Button.ui";
import { cn } from "@/helper/tw.helper";

// Base form data interface
export interface BaseFormData {
  [key: string]: any;
}

// Form validation schema type
export type FormSchema = z.ZodSchema<any>;

interface ProfileFormProps<T extends BaseFormData> {
  title?: string;
  description?: string;
  schema: FormSchema;
  defaultValues: T;
  onSubmit: (data: T) => Promise<void>;
  onCancel?: () => void;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
  autoSave?: boolean;
  autoSaveDelay?: number;
  showActions?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function ProfileForm<T extends BaseFormData>({
  title,
  description,
  schema,
  defaultValues,
  onSubmit,
  onCancel,
  children,
  autoSave = false,
  autoSaveDelay = 2000,
  showActions = true,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  className,
  disabled = false,
  isLoading = false,
}: ProfileFormProps<T>) {
  const [, setFormDirty] = useAtom(profileFormDirtyAtom);
  const [, setValidationErrors] = useAtom(profileValidationErrorsAtom);

  // Initialize form with react-hook-form
  const methods = useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: "onChange",
  });

  const {
    handleSubmit,
    formState: { errors, isDirty, isSubmitting, isValid },
    watch,
    reset,
  } = methods;

  // Watch for form changes
  const watchedValues = watch();

  // Update Jotai store when form dirty state changes
  useEffect(() => {
    setFormDirty(isDirty);
  }, [isDirty, setFormDirty]);

  // Update validation errors in Jotai store
  useEffect(() => {
    const errorMessages: Record<string, string> = {};

    Object.entries(errors).forEach(([key, error]) => {
      if (error?.message) {
        errorMessages[key] = error.message;
      }
    });

    setValidationErrors(errorMessages);
  }, [errors, setValidationErrors]);

  // Auto-save functionality
  useEffect(() => {
    if (!autoSave || !isDirty || !isValid) return;

    const timeoutId = setTimeout(async () => {
      try {
        await onSubmit(watchedValues);
        reset(watchedValues); // Reset form to mark as clean
      } catch (error) {
        console.error("Auto-save failed:", error);
      }
    }, autoSaveDelay);

    return () => clearTimeout(timeoutId);
  }, [watchedValues, isDirty, isValid, autoSave, autoSaveDelay, onSubmit, reset]);

  // Handle form submission
  const handleFormSubmit = async (data: T) => {
    try {
      await onSubmit(data);
      reset(data); // Reset form to mark as clean after successful submission
    } catch (error) {
      console.error("Form submission failed:", error);
      // Errors should be handled by the parent component
      throw error;
    }
  };

  // Handle form reset
  const handleCancel = () => {
    reset(defaultValues);
    setFormDirty(false);
    setValidationErrors({});
    onCancel?.();
  };

  return (
    <Card className={cn("p-6", className)}>
      {/* Form Header */}
      {(title || description) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
          )}
          {description && <p className="text-sm text-gray-600 dark:text-gray-400">{description}</p>}
        </div>
      )}

      {/* Form Content */}
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Form Fields */}
          <div className="space-y-4">{children(methods)}</div>

          {/* Auto-save Indicator */}
          {autoSave && isDirty && (
            <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-400">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span>Auto-saving changes...</span>
            </div>
          )}

          {/* Form Actions */}
          {showActions && (
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCancel}
                  disabled={disabled || isSubmitting}
                  className="min-w-[100px]"
                >
                  {cancelLabel}
                </Button>
              )}

              <Button
                type="submit"
                disabled={disabled || isSubmitting || !isDirty || !isValid}
                className={cn(
                  "min-w-[120px]",
                  "bg-gradient-to-r from-primary to-secondary text-white",
                  "hover:shadow-md transition-all duration-200"
                )}
              >
                {isSubmitting || isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving...</span>
                  </div>
                ) : (
                  submitLabel
                )}
              </Button>
            </div>
          )}
        </form>
      </FormProvider>
    </Card>
  );
}

// Utility function to create form schema with common validations
export const createProfileSchema = (fields: Record<string, z.ZodType>) => {
  return z.object(fields);
};

// Common field validations
export const profileValidations = {
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters")
    .regex(/^[a-zA-Z\s]+$/, "Name must contain only letters and spaces"),

  email: z.string().email("Please enter a valid email address").toLowerCase(),

  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must not exceed 15 digits")
    .regex(/^[+]?[\d\s\-\(\)]+$/, "Please enter a valid phone number"),

  bio: z.string().max(500, "Bio must not exceed 500 characters").optional(),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters")
    .optional(),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters")
    .optional(),

  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),

  linkedinProfile: z.string().url("Please enter a valid LinkedIn URL").optional().or(z.literal("")),
};
