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
  Medal,
  Users,
  Calendar,
  ArrowRight,
  Sparkle,
} from "@phosphor-icons/react";
import { Button } from "@/ui/Button.ui";
import { Card } from "@/ui/Card.ui";
import { Badge } from "@/ui/Badge.ui";
import { Avatar } from "@/ui/Avatar.ui";
import Link from "next/link";

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
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800">
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.1)_1px,_transparent_1px)] bg-[length:60px_60px]"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-white/5 to-transparent rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-12 lg:py-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-8 lg:gap-12">
            {/* Profile Picture */}
            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-white/5 rounded-full blur-sm"></div>
              <div className="relative">
                <Avatar
                  name={ca.name}
                  src={ca.imageUrl}
                  size="2xl"
                  className="h-32 w-32 lg:h-40 lg:w-40 border-4 border-white/20 shadow-2xl backdrop-blur-sm bg-white/10"
                />
                {ca.verified && (
                  <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full p-2 border-4 border-white shadow-lg">
                    <CheckCircle size={20} weight="fill" className="text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center lg:text-left text-white">
              <div className="space-y-4">
                {/* Name and Verification */}
                <div>
                  <div className="flex items-center justify-center lg:justify-start gap-3 mb-2">
                    <h1 className="text-3xl lg:text-5xl font-bold tracking-tight">{ca.name}</h1>
                    {ca.verified && (
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-sm font-medium flex items-center gap-1">
                          <Sparkle size={14} className="text-yellow-300" />
                          Verified
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xl text-white/90 font-medium">{ca.qualification}</p>
                  {ca.firm_name && <p className="text-lg text-white/75">{ca.firm_name}</p>}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-white/90">
                  <div className="flex items-center gap-2">
                    <MapPin size={18} />
                    <span>{ca.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={18} />
                    <span>{ca.experience} years</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star size={18} weight="fill" className="text-yellow-300" />
                    <span>
                      {ca.rating} ({ca.reviews} reviews)
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={18} />
                    <span>{ca.clients} clients</span>
                  </div>
                </div>

                {/* Action Button */}
                <div className="pt-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-blue-600 hover:bg-white/90 shadow-lg font-semibold px-8 py-3 rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Link href={`/contact/${ca.id}`} className="flex items-center gap-2">
                      <Phone size={20} />
                      Contact Now
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Left Column - Main Content */}
          <div className="xl:col-span-2 space-y-8">
            {/* About Section */}
            <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">About</h2>
              </div>
              <p className="text-gray-700 leading-relaxed text-lg">{ca.about}</p>
            </Card>

            {/* Services Section */}
            <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-1 bg-gradient-to-b from-emerald-500 to-teal-600 rounded-full"></div>
                <h2 className="text-2xl font-bold text-gray-900">Services Offered</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ca.services.map((service, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100"
                  >
                    <div className="h-2 w-2 bg-blue-500 rounded-full"></div>
                    <span className="font-medium text-gray-800">{service}</span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Experience Section */}
            {experiences.length > 0 && (
              <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-purple-500 to-pink-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Professional Experience</h2>
                </div>
                <div className="space-y-6">
                  {experiences.map((exp, index) => (
                    <div key={exp.id} className="relative pl-8">
                      {index !== experiences.length - 1 && (
                        <div className="absolute left-3 top-8 h-full w-px bg-gradient-to-b from-blue-200 to-transparent"></div>
                      )}
                      <div className="absolute left-0 top-2 h-6 w-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                        <Briefcase size={12} className="text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">{exp.title}</h3>
                        <p className="text-lg font-medium text-blue-600">{exp.companyName}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(exp.startDate).getFullYear()} -{" "}
                            {exp.isCurrent ? "Present" : new Date(exp.endDate).getFullYear()}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={14} />
                            {exp.location}
                          </span>
                        </div>
                        {exp.description && (
                          <p className="mt-4 text-gray-700 leading-relaxed">{exp.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Education Section */}
            {educations.length > 0 && (
              <Card className="p-8 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-1 bg-gradient-to-b from-orange-500 to-red-600 rounded-full"></div>
                  <h2 className="text-2xl font-bold text-gray-900">Education</h2>
                </div>
                <div className="space-y-6">
                  {educations.map((edu, index) => (
                    <div key={edu.id} className="relative pl-8">
                      {index !== educations.length - 1 && (
                        <div className="absolute left-3 top-8 h-full w-px bg-gradient-to-b from-orange-200 to-transparent"></div>
                      )}
                      <div className="absolute left-0 top-2 h-6 w-6 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center">
                        <GraduationCap size={12} className="text-white" />
                      </div>
                      <div className="bg-gradient-to-r from-gray-50 to-orange-50 rounded-xl p-6 border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-900">{edu.degree}</h3>
                        <p className="text-lg font-medium text-orange-600">{edu.instituteName}</p>
                        <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={14} />
                            {new Date(edu.startDate).getFullYear()} -{" "}
                            {edu.isCurrent ? "Present" : new Date(edu.endDate).getFullYear()}
                          </span>
                          {edu.grade && (
                            <span className="flex items-center gap-1">
                              <Medal size={14} />
                              Grade: {edu.grade}
                            </span>
                          )}
                        </div>
                        {edu.description && (
                          <p className="mt-4 text-gray-700 leading-relaxed">{edu.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats */}
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
              <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                <Medal size={20} />
                Professional Stats
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{ca.experience}</div>
                  <div className="text-sm text-blue-100">Years Experience</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{ca.clients}</div>
                  <div className="text-sm text-blue-100">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{ca.rating}/5</div>
                  <div className="text-sm text-blue-100">Rating</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{ca.member_since}</div>
                  <div className="text-sm text-blue-100">Member Since</div>
                </div>
              </div>
            </Card>

            {/* Areas of Expertise */}
            {ca.specialization.length > 0 && (
              <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
                <h3 className="text-lg font-bold mb-4 text-gray-900">Areas of Expertise</h3>
                <div className="space-y-2">
                  {ca.specialization.map((spec, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 p-3 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-lg border border-emerald-100"
                    >
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span className="text-gray-800 font-medium">{spec.trim()}</span>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Contact Information */}
            <Card className="p-6 shadow-lg border-0 bg-white/80 backdrop-blur-sm">
              <h3 className="text-lg font-bold mb-4 text-gray-900">Connect</h3>
              <div className="space-y-3">
                {ca.website && (
                  <a
                    href={ca.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300 group"
                  >
                    <Globe size={20} className="text-blue-600" />
                    <span className="text-gray-800 font-medium group-hover:text-blue-600">
                      Website
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 ml-auto group-hover:text-blue-600"
                    />
                  </a>
                )}
                {ca.linkedin && (
                  <a
                    href={ca.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 hover:shadow-md transition-all duration-300 group"
                  >
                    <LinkedinLogo size={20} className="text-blue-600" />
                    <span className="text-gray-800 font-medium group-hover:text-blue-600">
                      LinkedIn
                    </span>
                    <ArrowRight
                      size={16}
                      className="text-gray-400 ml-auto group-hover:text-blue-600"
                    />
                  </a>
                )}
              </div>
            </Card>

            {/* CTA Card */}
            <Card className="p-6 shadow-lg border-0 bg-gradient-to-br from-emerald-500 to-teal-600 text-white">
              <h3 className="text-lg font-bold mb-2">Ready to get started?</h3>
              <p className="text-emerald-100 mb-4 text-sm">
                Connect with {ca.name} today for professional accounting services.
              </p>
              <Button
                asChild
                className="w-full bg-white text-emerald-600 hover:bg-emerald-50 font-semibold"
              >
                <Link href={`/contact/${ca.id}`}>Get Free Consultation</Link>
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CAProfileDetails;
