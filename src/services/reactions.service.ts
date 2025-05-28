import { supabase } from "@/helper/supabase.helper";

export interface ReactionRow {
  reaction_type: string;
  user_id: string;
  created_at: string;
}
export interface ProfileRow {
  user_id: string;
  name: string;
  profile_picture: string | null;
}

// fetch all reactions + profiles for a target
export async function fetchReactions(
  targetType: "post" | "comment",
  targetId: number
): Promise<{ rows: ReactionRow[]; profiles: ProfileRow[] }> {
  const { data: rows, error: rowsErr } = await supabase
    .from("reactions")
    .select("reaction_type, user_id, created_at")
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .order("created_at", { ascending: false });
  if (rowsErr) throw rowsErr;

  const uids = rows.map((r) => r.user_id);
  const { data: profiles, error: profErr } = await supabase
    .from("profiles")
    .select("user_id, name, profile_picture")
    .in("user_id", uids);
  if (profErr) throw profErr;

  return { rows, profiles: profiles ?? [] };
}

// fetch the current user’s reaction for a target
export async function fetchMyReaction(
  userId: string,
  targetType: "post" | "comment",
  targetId: number
): Promise<string | null> {
  const { data, error } = await supabase
    .from("reactions")
    .select("reaction_type")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();
  if (error) throw error;
  return data?.reaction_type ?? null;
}

// toggle/add/update/delete a reaction
export async function toggleReaction(
  userId: string,
  targetType: "post" | "comment",
  targetId: number,
  type: string
): Promise<string | null> {
  // find existing
  const { data: existing, error: exErr } = await supabase
    .from("reactions")
    .select("reaction_type")
    .eq("user_id", userId)
    .eq("target_type", targetType)
    .eq("target_id", targetId)
    .single();
  if (exErr) throw exErr;

  if (existing?.reaction_type === type) {
    // delete
    await supabase
      .from("reactions")
      .delete()
      .match({ user_id: userId, target_type: targetType, target_id: targetId });
    await supabase.rpc("update_reaction_count_jsonb", {
      post_id: targetId,
      reaction_type: type,
      increment: false,
    });
    return null;
  }

  if (existing) {
    // change
    await supabase
      .from("reactions")
      .update({ reaction_type: type })
      .match({ user_id: userId, target_type: targetType, target_id: targetId });
    await supabase.rpc("update_reaction_count_jsonb", {
      post_id: targetId,
      reaction_type: existing.reaction_type,
      increment: false,
    });
    await supabase.rpc("update_reaction_count_jsonb", {
      post_id: targetId,
      reaction_type: type,
      increment: true,
    });
    return type;
  }

  // brand new
  await supabase.from("reactions").insert([
    { user_id: userId, target_type: targetType, target_id: targetId, reaction_type: type },
  ]);
  await supabase.rpc("update_reaction_count_jsonb", {
    post_id: targetId,
    reaction_type: type,
    increment: true,
  });
  return type;
}