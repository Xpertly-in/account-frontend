"use client";

import { CA } from "@/types/ca.type";
import { CAProfileContent } from "./CAProfileContent";
import { AdditionalInfo, ContactDetails } from "@/types/ca.type";

type CAProfileWrapperProps = {
  ca: CA;
};

export default function CAProfileWrapper({ ca }: CAProfileWrapperProps) {
  const initials = ca.name
    .split(" ")
    .map(n => n[0])
    .join("")
    .toUpperCase();

  const [city, state] = ca.location.split(", ");

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
    <CAProfileContent
      ca={ca}
      initials={initials}
      city={city}
      state={state}
      contactDetails={contactDetails}
      additionalInfo={additionalInfo}
    />
  );
}