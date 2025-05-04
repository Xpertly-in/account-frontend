import { createClient } from "@supabase/supabase-js";

// These will be replaced with actual values from .env
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET || "";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface GoogleProfile {
  id: string;
  email: string;
  name?: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
}

export const signInWithGoogle = async () => {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: {
          access_type: "offline",
          prompt: "consent",
        },
      },
    });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

export const extractGoogleProfile = (user: any): GoogleProfile => {
  return {
    id: user.id,
    email: user.email,
    name: user.user_metadata?.full_name,
    picture: user.user_metadata?.avatar_url,
    given_name: user.user_metadata?.first_name,
    family_name: user.user_metadata?.last_name,
  };
};

export const checkProfileExists = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return !!data;
  } catch (error) {
    console.error("Error checking profile:", error);
    return false;
  }
};

export const ensureCaProfile = async (user: any) => {
  try {
    // Check if profile exists
    const { data: profile, error: selectError } = await supabase
      .from("ca_profiles")
      .select("id, onboarding_completed")
      .eq("user_id", user.id)
      .single();

    // If profile exists, return onboarding_completed
    if (profile) {
      return profile.onboarding_completed;
    }

    // If error is not 'no rows found', throw it
    if (selectError && selectError.code !== "PGRST116") {
      throw selectError;
    }

    // If not found, upsert new profile (prevents duplicates)
    const { error: upsertError } = await supabase.from("ca_profiles").upsert([
      {
        user_id: user.id,
        name: user.user_metadata?.full_name || user.email,
        email: user.email,
        profile_picture: user.user_metadata?.avatar_url || null,
        onboarding_completed: false,
        // Other fields can be left null or set to defaults
      },
    ], { onConflict: 'user_id' });

    if (upsertError) throw upsertError;

    // New user, onboarding not completed
    return false;
  } catch (error) {
    console.error("Error ensuring ca_profile:", error);
    throw error;
  }
}; 