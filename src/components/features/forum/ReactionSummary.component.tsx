// src/components/features/forum/ReactionSummary.component.tsx
import React, { useState, useEffect } from "react";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { ThumbsUp, Heart, Smiley, SmileySad, Flame } from "@phosphor-icons/react";

const REACTIONS = [
  { type: "like", icon: <ThumbsUp /> },
  { type: "love", icon: <Heart /> },
  { type: "laugh", icon: <Smiley /> },
  { type: "sad", icon: <SmileySad /> },
  { type: "fire", icon: <Flame /> },
];

export function ReactionSummary({
  targetType,
  targetId,
}: {
  targetType: "post" | "comment";
  targetId: number;
}) {
  const { auth } = useAuth();
  const userId = auth.user?.id;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [latestName, setLatestName] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [allReactions, setAllReactions] = useState<{ name: string; type: string }[]>([]);

  useEffect(() => {
    async function load() {
      // load counts + full list
      const { data: rows } = await supabase
        .from("reactions")
        .select("reaction_type, user_id, created_at")
        .eq("target_type", targetType)
        .eq("target_id", targetId)
        .order("created_at", { ascending: false });
      const newCounts: Record<string, number> = {};
      rows?.forEach(r => {
        newCounts[r.reaction_type] = (newCounts[r.reaction_type] ?? 0) + 1;
      });
      setCounts(newCounts);

      // join with profiles
      const uids = rows?.map(r => r.user_id) || [];
      const { data: users } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", uids);
      const withNames =
        rows?.map(r => ({
          name: users?.find(u => u.user_id === r.user_id)?.name || "Unknown",
          type: r.reaction_type,
        })) || [];
      setAllReactions(withNames);

      // latest
      if (withNames.length) {
        setLatestName(withNames[0].name);
      }
    }
    load();
  }, [targetType, targetId, userId]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top3 = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);

  return (
    <div className="mb-2">
      <div className="flex items-center space-x-2">
        {top3.map(t => (
          <span key={t}>
            {React.cloneElement(REACTIONS.find(r => r.type === t)!.icon, {
              size: 18,
              weight: "fill",
            })}
          </span>
        ))}
        <button onClick={() => setListOpen(true)} className="text-sm text-primary hover:underline">
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {latestName && `${latestName}`}
            {total - 1 > 0 && ` and ${total - 1} others`}
          </span>
        </button>
      </div>

      {listOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">All Reactions</h2>
            <ul className="space-y-2 max-h-64 overflow-y-auto">
              {allReactions.map((r, i) => (
                <li key={i} className="flex items-center space-x-2">
                  {React.cloneElement(REACTIONS.find(x => x.type === r.type)!.icon, {
                    size: 18,
                    weight: "fill",
                  })}
                  <span className="text-sm">{r.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setListOpen(false)}
              className="mt-4 text-sm text-primary hover:underline"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
