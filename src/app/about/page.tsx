import type { Metadata } from "next";
import { FeaturesSection } from "@/components/about/FeaturesSection.component";
import { CTASection } from "@/components/about/CTASection.component";

export const metadata: Metadata = {
  title: "About | Xpertly",
  description:
    "Learn how Xpertly connects you with verified Chartered Accountants and why we are the best choice for your financial needs.",
  keywords: ["About", "Xpertly", "CA", "Chartered Accountant"],
  openGraph: {
    title: "About | Xpertly",
    description:
      "Discover why Xpertly is the leading platform for connecting with verified Chartered Accountants.",
    url: "https://xpertly.in/about",
    siteName: "Xpertly",
    images: [
      {
        url: "https://xpertly.in/og/about.jpg",
        width: 1200,
        height: 630,
        alt: "About Xpertly",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function About() {
  return (
    <>
      <FeaturesSection />
      <CTASection />
    </>
  );
}
