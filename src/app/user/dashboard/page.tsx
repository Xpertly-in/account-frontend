"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/store/context/Auth.provider";
import { Toaster } from "sonner";
import { User } from "@phosphor-icons/react";
import { supabase } from "@/lib/supabase";
import { UserRole } from "@/types/onboarding.type";
import { CustomerProfile } from "@/types/customer-profile.type";

export default function UserDashboardPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [userName, setUserName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [profile, setProfile] = useState<CustomerProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState<any>(null);
  const [services, setServices] = useState<string[]>([]);

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;
      
      try {
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("role")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          return;
        }

        // Redirect based on role
        if (profile?.role === UserRole.ACCOUNTANT) {
          router.push("/ca/dashboard");
        }
      } catch (error) {
        console.error("Error checking role:", error);
      }
    };

    checkRole();
  }, [auth.user, router]);

  useEffect(() => {
    // Set user information if available
    if (auth.user) {
      setUserName(auth.user.user_metadata?.name || "User");
      setUserEmail(auth.user.email || "");
    }
  }, [auth.user]);

  useEffect(() => {
    const loadProfileData = async () => {
      if (!auth.user?.id) return;
      
      try {
        // Load profile data
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select(`
            user_id,
            name,
            gender,
            profile_picture,
            phone,
            about,
            type_of_user,
            type_of_communication,
            created_at,
            updated_at,
            onboarding_completed
          `)
          .eq("user_id", auth.user.id)
          .single();

        if (profileError) throw profileError;
        setProfile(profileData);
        console.log("Profile Data:", profileData);

        // Load address data
        const { data: addressData, error: addressError } = await supabase
          .from("address")
          .select("*")
          .eq("ca_id", auth.user.id)
          .single();

        if (!addressError && addressData) {
          setAddress(addressData);
          console.log("Address Data:", addressData);
        }

        // Load services data
        const { data: servicesData, error: servicesError } = await supabase
          .from("services")
          .select("service_name")
          .eq("ca_id", auth.user.id)
          .eq("is_active", true);

        if (!servicesError && servicesData) {
          const serviceNames = servicesData.map(s => s.service_name);
          setServices(serviceNames);
          console.log("Services Data:", serviceNames);
        }
      } catch (error) {
        console.error("Error loading profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadProfileData();
  }, [auth.user]);

  const calculateCompletionPercentage = () => {
    if (!profile) return 0;

    const fields = [
      // Personal Details (Total weight: 8)
      { key: 'name', weight: 2 },
      { key: 'gender', weight: 1 },
      { key: 'phone', weight: 1 },
      { key: 'type_of_user', weight: 1 },
      { key: 'about', weight: 1 },
      { key: 'type_of_communication', weight: 1 },
      { key: 'profile_picture', weight: 1 },
      
      // Address Details (Total weight: 4)
      { key: 'address', weight: 1, source: address },
      { key: 'city', weight: 1, source: address },
      { key: 'state', weight: 1, source: address },
      { key: 'pincode', weight: 1, source: address },
      
      // Services (Total weight: 2)
      { key: 'services', weight: 2, source: services, isArray: true }
    ];

    let totalWeight = 0;
    let filledWeight = 0;

    fields.forEach(field => {
      totalWeight += field.weight;
      let value;
      
      if (field.key === 'services') {
        value = services; // Directly use the services array
      } else {
        value = field.source ? field.source[field.key] : profile[field.key as keyof CustomerProfile];
      }
      
      console.log(`Field ${field.key}:`, value);
      
      if (field.isArray) {
        if (Array.isArray(value) && value.length > 0) {
          filledWeight += field.weight;
          console.log(`${field.key} is filled (array) with length:`, value.length);
        }
      } else if (value !== undefined && value !== null && value !== '') {
        filledWeight += field.weight;
        console.log(`${field.key} is filled`);
      }
    });
    
    const percentage = Math.round((filledWeight / totalWeight) * 100);
    console.log("Completion Calculation:", {
      filledWeight,
      totalWeight,
      percentage,
      fields: fields.map(f => ({
        key: f.key,
        value: f.key === 'services' ? services : (f.source ? f.source[f.key] : profile[f.key as keyof CustomerProfile]),
        weight: f.weight
      }))
    });
    
    return percentage;
  };

  const completionPercentage = calculateCompletionPercentage();

  return (
    <div className="container mx-auto max-w-screen-xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold sm:text-4xl">Dashboard</h1>
        <p className="mt-2 text-muted-foreground">
          Welcome, {profile?.name || "User"}
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div
          className="cursor-pointer rounded-xl border border-border/50 bg-card p-6 shadow-md transition-all hover:shadow-lg dark:border-blue-800/30 dark:bg-gray-900/95"
          onClick={() => router.push("/user/profile")}
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 dark:bg-blue-900/20">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/30 dark:from-primary/30 dark:to-primary/40">
                <User className="h-5 w-5 text-primary dark:text-blue-400" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold">Profile</h3>
              <p className="text-sm text-muted-foreground">
                Manage your profile information
              </p>
            </div>
          </div>

          {/* Profile Completion Progress */}
          <div className="mt-6 pt-6 border-t border-border/50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Profile Completion</span>
              {loading ? (
                <div className="w-8 h-4 bg-muted animate-pulse rounded" />
              ) : (
                <span className="text-sm font-medium">{completionPercentage}%</span>
              )}
            </div>
            <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
              {loading ? (
                <div className="w-full h-full bg-gradient-to-r from-primary/20 to-secondary/20 animate-pulse" />
              ) : (
                <div 
                  className="bg-gradient-to-r from-primary to-secondary h-full rounded-full transition-all duration-500 ease-in-out"
                  style={{ 
                    width: `${completionPercentage}%`,
                    minWidth: '2%'
                  }}
                />
              )}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {loading ? (
                <span className="inline-block w-48 h-3 bg-muted animate-pulse rounded" />
              ) : (
                `Complete your profile to get the most out of our services. ${completionPercentage < 100 ? 'You\'re making progress!' : 'Great job!'}`
              )}
            </p>
          </div>
        </div>
      </div>

      <Toaster position="top-center" richColors expand closeButton />
    </div>
  );
} 