"use client";

import { Container } from "@/components/layout/Container.component";
import { mockCAs } from "@/lib/utils/ca.utils";
import { notFound } from "next/navigation";
import { useState, useEffect } from "react";
import {
  CAProfileHero,
  CAContactInfo,
  CAProfessionalDetails,
  CAAboutSection,
  CAServicesSection,
  CAReviewsSection,
} from "@/components/features/profile";
import { DecorativeElements, AnimationStyles } from "@/components/ui/DecorativeElements.component";
import { AdditionalInfo, ContactDetails } from "@/lib/types/ca.types";

export default function CAProfile({ params }: { params: { id: string } }) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  // Find the CA from mock data
  const ca = mockCAs.find(ca => ca.id === params.id);

  // If CA not found, show 404
  if (!ca) {
    notFound();
  }

  // Calculate initials for avatar
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  // Separate city and state from location string
  const [city, state] = ca.location.split(", ");

  // Additional mock data for profile page
  const contactDetails: ContactDetails = {
    email: `${ca.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    phone: `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    website: `www.${ca.name.toLowerCase().replace(/\s+/g, "")}ca.in`,
  };

  const additionalInfo: AdditionalInfo = {
    qualification: "CA, CMA",
    firmName: `${ca.name} & Associates`,
    memberSince: "2018",
    clients: "120+",
    about: `${ca.name} is a highly skilled Chartered Accountant with over ${
      ca.experience
    } years of experience specializing in ${ca.specialization.join(
      ", "
    )}. Dedicated to providing personalized financial solutions to individuals and businesses alike, with a focus on maximizing tax efficiency and ensuring compliance with all regulatory requirements.`,
    services: [
      "Income Tax Return Filing",
      "GST Registration & Filing",
      "Business Accounting",
      "Tax Planning",
      "Audit Services",
      "Financial Advisory",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 overflow-hidden">
      {/* Background decorative elements */}
      <DecorativeElements />

      {/* Hero section */}
      <CAProfileHero ca={ca} isLoaded={isLoaded} initials={initials} city={city} state={state} />

      {/* Main content */}
      <Container className="relative z-10 mt-6 md:mt-12 mb-10 md:mb-16 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column - Contact Information and Professional Details */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            {/* Contact Info */}
            <CAContactInfo contactDetails={contactDetails} isLoaded={isLoaded} caId={ca.id} />

            {/* Professional Details */}
            <CAProfessionalDetails additionalInfo={additionalInfo} isLoaded={isLoaded} />
          </div>

          {/* Right Column - About, Services, and Reviews */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            {/* About */}
            <CAAboutSection about={additionalInfo.about} isLoaded={isLoaded} />

            {/* Services */}
            <CAServicesSection services={additionalInfo.services} isLoaded={isLoaded} />

            {/* Reviews */}
            <CAReviewsSection rating={ca.rating} reviews={ca.reviews} isLoaded={isLoaded} />
          </div>
        </div>
      </Container>

      {/* Animation styles */}
      <AnimationStyles />
    </div>
  );
}
