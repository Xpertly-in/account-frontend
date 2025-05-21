"use client";

import { useState, useEffect } from "react";
import { Container } from "@/components/layout/Container.component";
import {
  CAProfileHero,
  CAContactInfo,
  CAProfessionalDetails,
  CAAboutSection,
  CAServicesSection,
  CAReviewsSection,
  CAExperienceSection,
  CAEducationSection,
} from "@/components/features/profile";
import { DecorativeElements, AnimationStyles } from "@/ui/DecorativeElements.ui";
import { AdditionalInfo, ContactDetails } from "@/types/ca.type";
import { CA } from "@/types/ca.type";

type CAProfileContentProps = {
  ca: CA;
  initials: string;
  city: string;
  state: string;
  contactDetails: ContactDetails;
  additionalInfo: AdditionalInfo;
  experiences: Array<{
    id: string;
    title: string;
    employmentType: string;
    companyName: string;
    location: string;
    isCurrent: boolean;
    startDate: string;
    endDate: string;
    industry: string;
    description: string;
    recentService: string;
  }>;
  educations: Array<{
    id: string;
    instituteName: string;
    degree: string;
    fieldOfStudy: string;
    startDate: string;
    endDate: string;
    grade: string;
    description: string;
    isCurrent: boolean;
  }>;
};

export function CAProfileContent({
  ca,
  initials,
  city,
  state,
  contactDetails,
  additionalInfo,
  experiences,
  educations,
}: CAProfileContentProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-blue-50 dark:from-gray-900 dark:to-blue-950 overflow-hidden">
      <DecorativeElements />

      <CAProfileHero 
        ca={ca} 
        isLoaded={isLoaded} 
        initials={initials} 
        city={city} 
        state={state} 
      />

      <Container className="relative z-10 mt-6 md:mt-12 mb-10 md:mb-16 px-4 sm:px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-4 md:space-y-6">
            <CAContactInfo 
              contactDetails={contactDetails} 
              isLoaded={isLoaded} 
              caId={ca.id} 
            />
            <CAProfessionalDetails 
              additionalInfo={additionalInfo} 
              isLoaded={isLoaded} 
            />
          </div>

          {/* Right Column */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <CAAboutSection 
              about={additionalInfo.about} 
              isLoaded={isLoaded} 
            />
            <CAExperienceSection 
              experiences={experiences}
              isLoaded={isLoaded}
            />
            <CAEducationSection 
              educations={educations}
              isLoaded={isLoaded}
            />
            <CAServicesSection 
              services={additionalInfo.services} 
              isLoaded={isLoaded} 
            />
            <CAReviewsSection 
              rating={ca.rating} 
              reviews={ca.reviews} 
              isLoaded={isLoaded} 
            />
          </div>
        </div>
      </Container>

      <AnimationStyles />
    </div>
  );
}