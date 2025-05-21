"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { Briefcase, Handshake } from "@phosphor-icons/react";

export default function RoleSelectPage() {
  const router = useRouter();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      if (!auth.user) return;
      const { data: profile } = await supabase
        .from("ca_profiles")
        .select("role")
        .eq("user_id", auth.user.id)
        .single();
      if (profile?.role) {
        router.push(profile.role === "ca" ? "/ca/onboarding" : "/user/onboarding");
      } else {
        setLoading(false);
      }
    };
    checkRole();
  }, [auth.user]);

  const handleRoleSelect = async (role: "ca" | "user") => {
    if (!auth.user) return;
    await supabase
      .from("ca_profiles")
      .update({ role })
      .eq("user_id", auth.user.id);
    if (role === "ca") {
      router.push("/ca/onboarding");
    } else {
      router.push("/user/onboarding");
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
          className="flex-1 bg-gradient-to-br from-primary to-blue-500 text-white p-8 rounded-xl shadow-lg text-xl font-semibold hover:scale-105 transition flex flex-col items-center"
          onClick={() => handleRoleSelect("ca")}
        >
          <Briefcase size={48} className="mb-4" />
          I'm a CA
          <div className="text-base font-normal mt-2">Verified Chartered Accountant</div>
        </button>
        <button
          className="flex-1 bg-gradient-to-br from-green-400 to-teal-500 text-white p-8 rounded-xl shadow-lg text-xl font-semibold hover:scale-105 transition flex flex-col items-center"
          onClick={() => handleRoleSelect("user")}
        >
          <Handshake size={48} className="mb-4" />
          I'm a Customer
          <div className="text-base font-normal mt-2">Looking for CA services</div>
        </button>
      </div>
    </div>
  );
} 