import { useEffect, useState } from "react";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";

export function useCAProfile() {
  const { auth } = useAuth();
  const [profile, setProfile] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (auth.user) {
        const { data } = await supabase
          .from("profiles")
          .select("name, email")
          .eq("user_id", auth.user.id)
          .single();
        if (data) {
          setProfile({ name: data.name, email: data.email });
        } else {
          setProfile({
            name: auth.user.user_metadata?.name || "User",
            email: auth.user.email || "",
          });
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [auth.user]);

  return { profile, loading };
}
