import { supabase } from "@/lib/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";

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

  const uids = rows.map(r => r.user_id);
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
    .maybeSingle();
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
  await supabase
    .from("reactions")
    .insert([
      { user_id: userId, target_type: targetType, target_id: targetId, reaction_type: type },
    ]);
  await supabase.rpc("update_reaction_count_jsonb", {
    post_id: targetId,
    reaction_type: type,
    increment: true,
  });
  return type;
}

// fetch every reaction row for a list of posts in one shot
export async function fetchReactionsForPosts(
  targetType: "post" | "comment",
  targetIds: number[]
): Promise<{
  [postId: number]: { counts: Record<string, number>; latestNames: string[] };
}> {
  // pull back all reactions + user_ids in one query
  const { data: rows, error } = await supabase
    .from("reactions")
    .select("target_id, reaction_type, user_id, created_at")
    .eq("target_type", targetType)
    .in("target_id", targetIds)
    .order("created_at", { ascending: false });
  if (error) throw error;

  // batch‐grab the unique user_ids so you can join profiles once
  const uids = Array.from(new Set(rows.map(r => r.user_id)));
  const { data: profiles, error: pErr } = await supabase
    .from("profiles")
    .select("user_id, name")
    .in("user_id", uids);
  if (pErr) throw pErr;

  // build a map[id] = { counts: { like: 3 … }, latestNames: ["Alice", …] }
  const map: Record<number, { counts: Record<string, number>; latestNames: string[] }> = {};
  targetIds.forEach(id => {
    map[id] = { counts: {}, latestNames: [] };
  });

  for (const r of rows) {
    const bucket = map[r.target_id]!;
    bucket.counts[r.reaction_type] = (bucket.counts[r.reaction_type] || 0) + 1;
    // collect first 3 distinct names
    if (bucket.latestNames.length < 3) {
      const prof = profiles.find(p => p.user_id === r.user_id);
      if (prof && !bucket.latestNames.includes(prof.name)) {
        bucket.latestNames.push(prof.name);
      }
    }
  }

  return map;
}

// Optimistic mutation for toggling a reaction on a post or comment
export function useOptimisticToggleReaction(
  userId: string,
  targetType: "post" | "comment",
  targetId: number
) {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (type: string) => toggleReaction(userId, targetType, targetId, type),
    // 1) before the mutation fn runs
    onMutate: async newType => {
      await qc.cancelQueries({ queryKey: ["reactionsBatch", targetId] });

      // snapshot the old batch
      const previous = qc.getQueryData<{ counts: Record<string, number> }>([
        "reactionsBatch",
        targetId,
      ]);

      // apply optimistic update
      qc.setQueryData(["reactionsBatch", targetId], (old: any) => {
        const counts = { ...(old?.counts || {}) };
        // decrement old
        if (old.myReaction) {
          counts[old.myReaction] = Math.max((counts[old.myReaction] || 1) - 1, 0);
        }
        // increment new
        counts[newType] = (counts[newType] || 0) + 1;
        return { counts, myReaction: newType };
      });

      return { previous };
    },

    // 2) on error, roll back
    onError: (_err, _vars, context: any) => {
      if (context?.previous) {
        qc.setQueryData(["reactionsBatch", targetId], context.previous);
      }
    },

    // 3) always refetch in the end to sync with the server
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["reactionsBatch", targetId] });
      qc.invalidateQueries({ queryKey: ["posts"] });
    },
  });
}
