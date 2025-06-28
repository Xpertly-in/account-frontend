"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/store/context/Auth.provider";
import { useCreateContactRequest } from "@/services/contact-requests.service";
import { CreateContactRequestData } from "@/types/dashboard/contact-request.type";
import { UrgencyLevel, ContactPreference } from "@/types/common.type";
import { URGENCY_OPTIONS, CONTACT_PREFERENCE_OPTIONS } from "@/constants/services.constants";
import { Button } from "@/ui/Button.ui";
import { Input } from "@/ui/Input.ui";
import { Textarea } from "@/ui/Textarea.ui";
import { Select } from "@/ui/Select.ui";
import { Card } from "@/ui/Card.ui";
import { User, PaperPlaneTilt, Clock, CheckCircle } from "@phosphor-icons/react";
import { Toast } from "@/ui/Toast.ui";

// Zod validation schema
const contactFormSchema = z.object({
  customer_name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters"),
  customer_phone: z
    .string()
    .min(1, "Contact details are required")
    .min(10, "Please enter valid contact details"),
  service_needed: z.string().min(1, "Please select a service"),
  urgency: z.nativeEnum(UrgencyLevel, {
    errorMap: () => ({ message: "Please select urgency level" }),
  }),
  contact_preference: z.nativeEnum(ContactPreference, {
    errorMap: () => ({ message: "Please select contact preference" }),
  }),
  subject: z.string().min(1, "Subject is required").min(5, "Subject must be at least 5 characters"),
  message: z
    .string()
    .min(1, "Message is required")
    .min(10, "Message must be at least 10 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  caId: string;
  ca: {
    id: string;
    name: string;
    email: string;
    phone?: string;
    location: string;
    specialization: string[];
    services: string[];
  };
  onSubmissionSuccess: () => void;
}

export const ContactForm: React.FC<ContactFormProps> = ({ caId, ca, onSubmissionSuccess }) => {
  const { auth } = useAuth();
  const createContactRequest = useCreateContactRequest();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      customer_name: auth.user?.user_metadata?.full_name || "",
      customer_phone: "",
      service_needed: "",
      urgency: undefined,
      contact_preference: undefined,
      subject: "",
      message: "",
    },
  });

  const watchContactPreference = watch("contact_preference");

  const onSubmit = async (data: ContactFormData) => {
    try {
      // Get email from contact preference or use auth user email as fallback
      const customerEmail =
        data.contact_preference === ContactPreference.EMAIL
          ? data.customer_phone
          : auth.user?.email || "";

      const contactRequestData: CreateContactRequestData = {
        ca_id: caId,
        customer_name: data.customer_name,
        customer_email: customerEmail,
        customer_phone: data.customer_phone,
        service_needed: data.service_needed,
        urgency: data.urgency,
        contact_preference: data.contact_preference,
        contact_detail: data.customer_phone,
        subject: data.subject,
        message: data.message,
      };

      await createContactRequest.createContactRequest(contactRequestData);

      Toast.success({ title: "Contact request sent successfully!" });
      reset();
      onSubmissionSuccess();
    } catch (error) {
      console.error("Error submitting contact request:", error);
      Toast.error({ title: "Failed to send contact request. Please try again." });
    }
  };

  const getContactDetailPlaceholder = () => {
    switch (watchContactPreference) {
      case ContactPreference.PHONE:
        return "Enter your phone number";
      case ContactPreference.EMAIL:
        return "Enter your email address";
      default:
        return "Enter your contact details";
    }
  };

  return (
    <Card className="p-4 sm:p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact {ca.name}</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Get expert financial guidance tailored to your needs.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Personal Information */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
            <User className="h-5 w-5 mr-2 text-blue-600 dark:text-blue-400" />
            Personal Information
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Full Name *
            </label>
            <Input
              {...register("customer_name")}
              placeholder="Enter your full name"
              aria-invalid={!!errors.customer_name}
              className="w-full"
            />
            {errors.customer_name && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_name.message}</p>
            )}
          </div>
        </div>

        {/* Contact Preferences */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Preferences
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              How would you like to be contacted? *
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {CONTACT_PREFERENCE_OPTIONS.map(option => {
                const IconComponent = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`relative flex cursor-pointer rounded-lg border p-4 focus:outline-none transition-all ${
                      watchContactPreference === option.value
                        ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-500"
                        : "border-gray-300 bg-white hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-700"
                    }`}
                  >
                    <input
                      type="radio"
                      {...register("contact_preference")}
                      value={option.value}
                      className="sr-only"
                    />
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <IconComponent className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div className="ml-3">
                        <span className="block text-sm font-medium text-gray-900 dark:text-white">
                          {option.label}
                        </span>
                      </div>
                    </div>
                    {watchContactPreference === option.value && (
                      <CheckCircle className="absolute top-2 right-2 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    )}
                  </label>
                );
              })}
            </div>
            {errors.contact_preference && (
              <p className="text-red-500 text-sm mt-1">{errors.contact_preference.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Contact Details *
            </label>
            <Input
              type="tel"
              {...register("customer_phone")}
              placeholder={getContactDetailPlaceholder()}
              aria-invalid={!!errors.customer_phone}
              className="w-full"
            />
            {errors.customer_phone && (
              <p className="text-red-500 text-sm mt-1">{errors.customer_phone.message}</p>
            )}
          </div>
        </div>

        {/* Service Requirements */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Service Requirements
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Service Needed *
              </label>
              <Select {...register("service_needed")} aria-invalid={!!errors.service_needed}>
                <option value="">Select a service</option>
                {ca.services && ca.services.length > 0 ? (
                  ca.services.map(service => (
                    <option key={service} value={service}>
                      {service}
                    </option>
                  ))
                ) : (
                  <option value="General Consultation">General Consultation</option>
                )}
              </Select>
              {errors.service_needed && (
                <p className="text-red-500 text-sm mt-1">{errors.service_needed.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Urgency Level *
              </label>
              <Select {...register("urgency")} aria-invalid={!!errors.urgency}>
                <option value="">Select urgency</option>
                {URGENCY_OPTIONS.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
              {errors.urgency && (
                <p className="text-red-500 text-sm mt-1">{errors.urgency.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Subject *
            </label>
            <Input
              {...register("subject")}
              placeholder="Brief description of your inquiry"
              aria-invalid={!!errors.subject}
              className="w-full"
            />
            {errors.subject && (
              <p className="text-red-500 text-sm mt-1">{errors.subject.message}</p>
            )}
          </div>
        </div>

        {/* Message */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Message *
          </label>
          <Textarea
            {...register("message")}
            placeholder="Describe your requirements, questions, or how we can help you..."
            rows={4}
            aria-invalid={!!errors.message}
            className="w-full"
          />
          {errors.message && <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>}
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium transition-all duration-300 shadow-md hover:shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Sending...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <PaperPlaneTilt className="h-4 w-4 mr-2" weight="bold" />
                Send Message
              </div>
            )}
          </Button>
        </div>

        {/* Additional Info */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <div className="flex">
            <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                Response Time
              </h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
                {ca.name} typically responds to inquiries within 24 hours. You'll receive a
                notification when they reply.
              </p>
            </div>
          </div>
        </div>
      </form>
    </Card>
  );
};
