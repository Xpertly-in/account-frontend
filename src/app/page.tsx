"use client";

import { useState, useEffect } from "react";
import { SearchBar } from "@/components/features/search";
import { Container } from "@/components/layout/Container.component";
import { Feed } from "@/components/features/feed/Feed.component";
import { supabase } from "@/lib/supabase";
import Head from "next/head";
import Image from "next/image";
import { Button } from "@/ui/Button.ui";
import { Badge } from "@/ui/Badge.ui";
import { Card, CardContent } from "@/ui/Card.ui";
import HeroSection from "@/components/features/landing/HeroSection.component";
import CategorySection from "@/components/features/landing/CategorySection.component";
import TestimonialsSection from "@/components/features/landing/TestimonialsSection.component";
import FinanceNewsSection from "@/components/features/landing/FinanceNewsSection.component";
import FAQSection from "@/components/features/landing/FAQSection.component";

const CITIES = [
  { name: "Mumbai", href: "/search?city=Mumbai", image: "/mumbai-icon.svg" },
  { name: "Delhi", href: "/search?city=Delhi", image: "/delhi-icon.svg" },
  { name: "Chennai", href: "/search?city=Chennai", image: "/chennai-icon.svg" },
  { name: "Bengaluru", href: "/search?city=Bengaluru", image: "/bengaluru-icon.svg" },
];

const SERVICES = [
  { name: "GST Filing", icon: "/gst.svg", href: "/search?service=GST" },
  { name: "ITR", icon: "/itr.svg", href: "/search?service=ITR" },
  { name: "Audit", icon: "/audit.svg", href: "/search?service=Audit" },
  { name: "Business Advisory", icon: "/advisory.svg", href: "/search?service=Advisory" },
];

const TESTIMONIALS = [
  {
    name: "Priya S.",
    location: "Mumbai",
    quote: "Xpertly connected me with a CA in minutes. My GST filing was smooth and stress-free!",
    image: "/profile1.jpg",
    category: { name: "GST Filing", icon: "/globe.svg" },
  },
  {
    name: "Rahul M.",
    location: "Bengaluru",
    quote: "I got expert advice for my startup's finances. Highly recommend for any business owner!",
    image: "/profile2.jpg",
    category: { name: "Business Advisory", icon: "/next.svg" },
  },
  {
    name: "Anita D.",
    location: "Delhi",
    quote: "The online consultation was safe, easy, and saved me a trip. My CA was very knowledgeable.",
    image: "/profile3.jpg",
    category: { name: "Audit", icon: "/window.svg" },
  },
];

const FAQS = [
  {
    q: "What does a CA do?",
    a: "A Chartered Accountant (CA) provides services like tax filing, GST, audit, business advisory, and financial planning for individuals and businesses.",
  },
  {
    q: "How can I find a CA near me?",
    a: "Use our search to find verified CAs in your city. Filter by service, location, and expertise to get the best match.",
  },
  {
    q: "Is online CA consultation safe?",
    a: "Yes, all consultations are secure and confidential. We verify every CA on our platform for your peace of mind.",
  },
];

export default function Home() {
  const [testimonialIdx, setTestimonialIdx] = useState(0);

  // FAQPage JSON-LD
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": FAQS.map(faq => ({
      "@type": "Question",
      "name": faq.q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.a,
      },
    })),
  };

  // Website JSON-LD
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "Xpertly",
    "url": "https://thefinxperts.com",
    "potentialAction": {
      "@type": "SearchAction",
      "target": "https://thefinxperts.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <Head>
        <title>Find Trusted Chartered Accountants for Tax, GST, Audit & More | Xpertly</title>
        <meta
          name="description"
          content="Connect with verified Chartered Accountants for GST Filing, Income Tax, Audit, Business Advisory & more. Search by city or service. Secure, fast, and expert CA help online or near you." />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
      </Head>
      <main>
        {/* Hero Section */}
        <HeroSection />

        {/* Category Section */}
        <CategorySection />

        {/* Testimonials Section */}
        <TestimonialsSection />

        {/* Finance News Section */}
        <FinanceNewsSection />

        {/* FAQ Section */}
        <FAQSection />
      </main>
    </>
  );
}
