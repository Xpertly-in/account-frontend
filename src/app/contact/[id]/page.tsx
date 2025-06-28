"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/layout/Container.component";
import { ContactForm } from "@/components/contact/ContactForm.component";
import { CAContactSidebar } from "@/components/contact-requests/CAContactSidebar.component";
import { supabase } from "@/helper/supabase.helper";
import { Skeleton } from "@/ui/Skeleton.ui";
import { Button } from "@/ui/Button.ui";
import { ArrowLeft } from "@phosphor-icons/react";

interface ContactCAPageProps {
  params: {
    id: string;
  };
}

interface CAData {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  profile_picture?: string;
  about?: string;
  years_of_experience?: number;
  is_verified?: boolean;
  city?: string;
  state?: string;
  location: string; // Required for ContactForm
  specialization: string[]; // Required for ContactForm
  services: string[]; // Required for ContactForm
  rating?: number;
  clients?: string;
  member_since?: string;
  website?: string;
  linkedin?: string;
}

export default function ContactCAPage({ params }: ContactCAPageProps) {
  const router = useRouter();
  const [ca, setCA] = useState<CAData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchCAProfile = async () => {
      try {
        setIsLoading(true);
        setIsError(false);

        // Fetch CA profile data
        const { data: caProfile, error: caError } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", params.id)
          .eq("role", "ACCOUNTANT")
          .eq("onboarding_completed", true)
          .single();

        if (caError || !caProfile) {
          console.error("Error fetching CA profile:", caError);
          setIsError(true);
          return;
        }

        // Fetch related data
        const [addressResult, socialProfileResult, servicesResult] = await Promise.all([
          supabase.from("address").select("*").eq("ca_id", params.id).single(),
          supabase.from("social_profile").select("*").eq("ca_id", params.id).single(),
          supabase.from("services").select("*").eq("ca_id", params.id).eq("is_active", true),
        ]);

        // Transform the data
        const location = addressResult.data
          ? `${addressResult.data.city}, ${addressResult.data.state}`
          : "Location not specified";

        const transformedCA: CAData = {
          id: caProfile.id,
          user_id: caProfile.user_id,
          name: caProfile.name,
          email: caProfile.email,
          phone: caProfile.phone,
          profile_picture: caProfile.profile_picture,
          about: caProfile.about || "",
          years_of_experience: caProfile.years_of_experience,
          is_verified: caProfile.is_verified,
          city: addressResult.data?.city || "",
          state: addressResult.data?.state || "",
          location: location,
          specialization: socialProfileResult.data?.areas_of_expertise?.split(",") || [],
          services: servicesResult.data?.map(service => service.service_name) || [],
          rating: 4.5, // This should come from a reviews table
          clients: "120+", // This should come from a separate table if available
          member_since: new Date(caProfile.created_at).getFullYear().toString(),
          website: socialProfileResult.data?.professional_website,
          linkedin: socialProfileResult.data?.linkedin_profile,
        };

        setCA(transformedCA);
      } catch (error) {
        console.error("Error in fetchCAProfile:", error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchCAProfile();
    }
  }, [params.id]);

  const handleBack = () => {
    router.back();
  };

  const handleSubmissionSuccess = () => {
    setIsSubmitted(true);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Container className="py-8">
          <div className="max-w-4xl mx-auto">
            <Skeleton className="h-8 w-32 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="lg:col-span-1">
                <Skeleton className="h-64 w-full" />
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  if (isError || !ca) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">CA Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The CA profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={handleBack} variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Container className="py-8">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sm:p-8">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-8 h-8 text-emerald-600 dark:text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Message Sent Successfully!
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Your message has been sent to {ca.name}. They will respond to you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={() => router.push(`/ca/${params.id}`)} variant="outline">
                  View CA Profile
                </Button>
                <Button onClick={() => router.push("/search")}>Find More CAs</Button>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <Container className="py-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </Container>
      </div>

      <Container className="py-6 sm:py-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm caId={params.id} ca={ca} onSubmissionSuccess={handleSubmissionSuccess} />
            </div>

            {/* CA Information Sidebar */}
            <div className="lg:col-span-1">
              <CAContactSidebar ca={ca} />
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
