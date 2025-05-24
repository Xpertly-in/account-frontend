"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { Briefcase, Handshake } from "@phosphor-icons/react";
import { UserRole } from "@/types/onboarding.type";
import { toast } from "sonner";

export default function RoleSelectPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;
      
      try {
        // First check if user has a role set
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("user_id, role, onboarding_completed")
          .eq("user_id", auth.user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          toast.error("An error occurred while checking your profile");
          setLoading(false);
          return;
        }

        // If role exists, then check onboarding status
        if (profile?.role) {
          if (profile.onboarding_completed) {
            router.push("/ca/dashboard");
            return;
          } else {
            router.push(profile.role === UserRole.ACCOUNTANT ? "/ca/onboarding" : "/user/onboarding");
            return;
          }
        }

        // If no role exists, show role selection
        setLoading(false);
      } catch (error) {
        console.error("Error in checkRole:", error);
        toast.error("An error occurred while checking your profile");
        setLoading(false);
      }
    };
    checkRole();
  }, [auth.user]);

  const handleRoleSelect = async (role: UserRole) => {
    if (!auth.user) return;
    
    try {
      setUpdating(true);

      // First check if profile exists
      const { data: existingProfile, error: checkError } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", auth.user.id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      let error;
      if (existingProfile) {
        // Update existing profile
        const { error: updateError } = await supabase
          .from("profiles")
          .update({ 
            role,
            onboarding_completed: false // Reset onboarding status when role changes
          })
          .eq("user_id", auth.user.id);
        error = updateError;
      } else {
        // Create new profile
        const { error: insertError } = await supabase
          .from("profiles")
          .insert([{
            user_id: auth.user.id,
            role,
            onboarding_completed: false,
            created_at: new Date().toISOString()
          }]);
        error = insertError;
      }

      if (error) {
        toast.error("Failed to update role");
        console.error("Role update error:", error);
        return;
      }

      // Redirect to appropriate onboarding based on role
      router.push(role === UserRole.ACCOUNTANT ? "/ca/onboarding" : "/user/onboarding");
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error("Role selection error:", error);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-background to-background/90 px-4">
      <h1 className="text-3xl sm:text-4xl font-bold mb-2 text-center">Welcome to Xpertly</h1>
      <p className="mb-8 text-lg text-muted-foreground text-center">Let's get to know you a bit...</p>
      <div className="flex flex-col sm:flex-row gap-8 w-full max-w-xl justify-center">
        <button
          className="flex-1 bg-gradient-to-br from-primary to-blue-500 text-white p-8 rounded-xl shadow-lg text-xl font-semibold hover:scale-105 transition flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleRoleSelect(UserRole.ACCOUNTANT)}
          disabled={updating}
        >
          <Briefcase size={48} className="mb-4" />
          I'm a CA
          <div className="text-base font-normal mt-2">Verified Chartered Accountant</div>
        </button>
        <button
          className="flex-1 bg-gradient-to-br from-green-400 to-teal-500 text-white p-8 rounded-xl shadow-lg text-xl font-semibold hover:scale-105 transition flex flex-col items-center disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={() => handleRoleSelect(UserRole.CUSTOMER)}
          disabled={updating}
        >
          <Handshake size={48} className="mb-4" />
          I'm a Customer
          <div className="text-base font-normal mt-2">Looking for CA services</div>
        </button>
      </div>
    </div>
  );
} 