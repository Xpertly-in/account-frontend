"use client";

import { CA } from "@/types/ca.type";
import { CAProfileContent } from "./CAProfileContent";
import { AdditionalInfo, ContactDetails } from "@/types/ca.type";

type CAProfileWrapperProps = {
  ca: CA;
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

export default function CAProfileWrapper({ ca, experiences, educations }: CAProfileWrapperProps) {
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const [city, state] = ca.location.split(", ");

  // Use actual contact details from Supabase if available
  const contactDetails: ContactDetails = {
    email: ca.email || `${ca.name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
    phone: ca.phone || `+91 ${Math.floor(Math.random() * 9000000000) + 1000000000}`,
    website: ca.website || `www.${ca.name.toLowerCase().replace(/\s+/g, "")}ca.in`,
  };

  // Use actual additional info from Supabase if available
  const additionalInfo: AdditionalInfo = {
    qualification: ca.qualification || "CA, CMA",
    firmName: ca.firm_name || `${ca.name} & Associates`,
    memberSince: ca.member_since || "2018",
    clients: ca.clients || "120+",
    about: ca.about || `${ca.name} is a highly skilled Chartered Accountant with over ${
      ca.experience
    } years of experience specializing in ${ca.specialization.join(
      ", "
    )}. Dedicated to providing personalized financial solutions to individuals and businesses alike, with a focus on maximizing tax efficiency and ensuring compliance with all regulatory requirements.`,
    services: ca.services || [
      "Income Tax Return Filing",
      "GST Registration & Filing",
      "Business Accounting",
      "Tax Planning",
      "Audit Services",
      "Financial Advisory",
    ],
  };

  return (
    <CAProfileContent
      ca={ca}
      initials={initials}
      city={city}
      state={state}
      contactDetails={contactDetails}
      additionalInfo={additionalInfo}
      experiences={experiences}
      educations={educations}
    />
  );
}