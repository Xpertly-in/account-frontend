"use client";

import React from "react";
import { FC } from "react";
import {
  Star,
  MapPin,
  Briefcase,
  GraduationCap,
  Globe,
  LinkedinLogo,
  Phone,
  Envelope,
  Clock,
  CheckCircle,
} from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { Badge } from "@/ui/Badge.ui";

interface CAProfileDetailsProps {
  ca: {
    id: string;
    name: string;
    email: string;
    phone: string;
    imageUrl: string;
    about: string;
    experience: number;
    location: string;
    city: string;
    state: string;
    specialization: string[];
    qualification: string;
    firm_name: string;
    member_since: string;
    clients: string;
    services: string[];
    website: string;
    linkedin: string;
    verified: boolean;
    rating: number;
    reviews: number;
  };
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
}

const CAProfileDetails: FC<CAProfileDetailsProps> = ({ ca, experiences, educations }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative h-[300px] bg-gradient-to-br from-primary via-blue-700 to-blue-600 dark:from-blue-800 dark:via-blue-700 dark:to-blue-600 overflow-hidden">
        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-10 dark:opacity-5" />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/90" />

        {/* Decorative glows */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-400 to-blue-200 rounded-full filter blur-3xl opacity-20 -translate-y-1/2 translate-x-1/3 dark:opacity-0"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-blue-300 to-blue-200 rounded-full filter blur-3xl opacity-20 translate-y-1/3 -translate-x-1/2 dark:opacity-0"></div>

        <div className="container relative mx-auto px-4 h-full flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-6 w-full">
            <div className="relative">
              <div className="relative h-40 w-40 rounded-full border-4 border-background overflow-hidden bg-background shadow-xl">
                <img
                  src={ca.imageUrl || "/placeholder-avatar.png"}
                  alt={ca.name}
                  className="h-full w-full object-cover"
                />
                {ca.verified && (
                  <div className="absolute bottom-2 right-2 bg-background text-primary rounded-full p-1">
                    <CheckCircle weight="fill" size={20} />
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight text-background">{ca.name}</h1>
                  <p className="text-lg text-background/90">{ca.qualification}</p>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="lg"
                    className="gap-2 bg-background/10 hover:bg-background/20 text-background border-background/20"
                  >
                    <Phone size={20} />
                    Contact
                  </Button>
                  <Button
                    size="lg"
                    className="gap-2 bg-background text-primary hover:bg-background/90"
                  >
                    <Envelope size={20} />
                    Message
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-background/90">
                <div className="flex items-center gap-1">
                  <MapPin size={16} />
                  {ca.location}
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase size={16} />
                  {ca.experience} years experience
                </div>
                <div className="flex items-center gap-1">
                  <Star size={16} weight="fill" className="text-yellow-200" />
                  {ca.rating} ({ca.reviews} reviews)
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={16} />
                  Member since {ca.member_since}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About Section */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">About</h2>
              <p className="text-muted-foreground">{ca.about}</p>
            </Card>

            {/* Services Section */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Services Offered</h2>
              <div className="flex flex-wrap gap-2">
                {ca.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {service}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Experience Section */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Work Experience</h2>
              <div className="space-y-6">
                {experiences.map(exp => (
                  <div
                    key={exp.id}
                    className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border"
                  >
                    <div className="absolute left-0 top-0 -ml-[5px] h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="space-y-1">
                      <h3 className="font-medium">{exp.title}</h3>
                      <p className="text-sm text-muted-foreground">{exp.companyName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(exp.startDate).getFullYear()} -{" "}
                        {exp.isCurrent ? "Present" : new Date(exp.endDate).getFullYear()}
                      </p>
                      <p className="text-sm text-muted-foreground">{exp.location}</p>
                      {exp.description && <p className="text-sm mt-2">{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Education Section */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Education</h2>
              <div className="space-y-6">
                {educations.map(edu => (
                  <div
                    key={edu.id}
                    className="relative pl-6 before:absolute before:left-0 before:top-0 before:h-full before:w-px before:bg-border"
                  >
                    <div className="absolute left-0 top-0 -ml-[5px] h-3 w-3 rounded-full border-2 border-primary bg-background" />
                    <div className="space-y-1">
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-sm text-muted-foreground">{edu.instituteName}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(edu.startDate).getFullYear()} -{" "}
                        {edu.isCurrent ? "Present" : new Date(edu.endDate).getFullYear()}
                      </p>
                      {edu.grade && (
                        <p className="text-sm text-muted-foreground">Grade: {edu.grade}</p>
                      )}
                      {edu.description && <p className="text-sm mt-2">{edu.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Contact Card */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Contact Information</h2>
              <div className="space-y-4">
                {ca.phone && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone size={20} />
                    <span>{ca.phone}</span>
                  </div>
                )}
                {ca.email && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Envelope size={20} />
                    <span>{ca.email}</span>
                  </div>
                )}
                {ca.website && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe size={20} />
                    <a
                      href={ca.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      {ca.website}
                    </a>
                  </div>
                )}
                {ca.linkedin && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <LinkedinLogo size={20} />
                    <a
                      href={ca.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary"
                    >
                      LinkedIn Profile
                    </a>
                  </div>
                )}
              </div>
            </Card>

            {/* Specializations Card */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Areas of Expertise</h2>
              <div className="flex flex-wrap gap-2">
                {ca.specialization.map((spec, index) => (
                  <Badge key={index} variant="outline" className="text-sm">
                    {spec}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Stats Card */}
            <Card className="p-4">
              <h2 className="text-base font-semibold mb-2">Professional Stats</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Experience</p>
                  <p className="text-2xl font-semibold">{ca.experience} years</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Clients</p>
                  <p className="text-2xl font-semibold">{ca.clients}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Rating</p>
                  <p className="text-2xl font-semibold">{ca.rating}/5</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Reviews</p>
                  <p className="text-2xl font-semibold">{ca.reviews}</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAProfileDetails;
