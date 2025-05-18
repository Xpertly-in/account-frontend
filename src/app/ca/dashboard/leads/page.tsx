"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { LeadsComponent } from "@/components/leads/Leads.component";
import { useAtom } from "jotai/react";
import { leadsDataAtom, leadsLoadingAtom } from "@/store/jotai/dashboard.store";
import { Lead, LeadStatus, LeadUrgency, ContactPreference } from "@/types/dashboard/lead.type";
import { BackButton } from "@/ui/BackButton.ui";

// Mock data - will be replaced with Supabase integration
const mockLeads: Lead[] = [
  {
    id: "1",
    customerId: "customer1",
    customerName: "John Doe",
    services: ["Tax Filing", "GST Registration"],
    urgency: LeadUrgency.IMMEDIATELY,
    timestamp: new Date().toISOString(),
    location: {
      city: "Mumbai",
      state: "Maharashtra",
    },
    status: LeadStatus.NEW,
    contactPreference: ContactPreference.EMAIL,
    contactInfo: "john.doe@example.com",
  },
  {
    id: "2",
    customerId: "customer2",
    customerName: "Jane Smith",
    services: ["Financial Planning", "Investment Advisory"],
    urgency: LeadUrgency.THIS_MONTH,
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
    location: {
      city: "Bangalore",
      state: "Karnataka",
    },
    status: LeadStatus.CONTACTED,
    contactPreference: ContactPreference.PHONE,
    contactInfo: "+91 98765 43210",
    notes: "Looking for long-term financial planning advice for family investments.",
  },
  {
    id: "3",
    customerId: "customer3",
    customerName: "Amit Patel",
    services: ["Audit", "Tax Planning"],
    urgency: LeadUrgency.WITHIN_A_WEEK,
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
    location: {
      city: "Delhi",
      state: "Delhi",
    },
    status: LeadStatus.NEW,
    contactPreference: ContactPreference.WHATSAPP,
    contactInfo: "+91 91234 56789",
    notes: "Needs help with annual audit preparation.",
  },
  {
    id: "4",
    customerId: "customer4",
    customerName: "Priya Sharma",
    services: ["Startup Advisory", "Business Registration"],
    urgency: LeadUrgency.JUST_EXPLORING,
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
    location: {
      city: "Pune",
      state: "Maharashtra",
    },
    status: LeadStatus.ARCHIVED,
    contactPreference: ContactPreference.EMAIL,
    contactInfo: "priya.sharma@example.com",
  },
  {
    id: "5",
    customerId: "customer5",
    customerName: "Rajesh Kumar",
    services: ["Tax Planning", "Wealth Management"],
    urgency: LeadUrgency.IMMEDIATELY,
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
    location: {
      city: "Chennai",
      state: "Tamil Nadu",
    },
    status: LeadStatus.CLOSED,
    contactPreference: ContactPreference.PHONE,
    contactInfo: "+91 87654 32109",
    notes: "Needs urgent tax planning advice before end of financial year.",
  },
];

export default function LeadsPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [, setLeadsData] = useAtom(leadsDataAtom);
  const [, setLeadsLoading] = useAtom(leadsLoadingAtom);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if user is authenticated
    if (!auth.isAuthenticated && isLoaded) {
      router.push("/login/ca");
      return;
    }

    // Simulate API loading delay
    setLeadsLoading(true);
    const timer = setTimeout(() => {
      setLeadsData(mockLeads);
      setLeadsLoading(false);
      setIsLoaded(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, [auth.isAuthenticated, router, setLeadsData, setLeadsLoading, isLoaded]);

  useEffect(() => {
    // Set isLoaded after checking auth state
    setIsLoaded(true);
  }, []);

  // Only redirect if explicitly not authenticated (after isLoaded is true)
  if (isLoaded && auth.isAuthenticated === false) {
    return null; // The useEffect will handle redirection
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <BackButton to="/ca/dashboard" label="Back to Dashboard" className="mb-4" />
      <LeadsComponent />
    </div>
  );
}
