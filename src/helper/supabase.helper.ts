import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "@/constants/app.constants";

if (!SUPABASE_URL) console.warn("Missing NEXT_PUBLIC_SUPABASE_URL environment variable");
if (!SUPABASE_ANON_KEY) console.warn("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable");

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
