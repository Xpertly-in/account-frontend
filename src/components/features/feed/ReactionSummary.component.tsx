// src/components/features/feed/ReactionSummary.component.tsx
import React, { useState, useEffect, useRef } from "react";
import { fetchReactions } from "@/services/reactions.service";
import { useAuth } from "@/store/context/Auth.provider";
import { ThumbsUp, Heart, Smiley, SmileySad, Flame, X } from "@phosphor-icons/react";
import type { ReactionType } from "@/types/reaction.type";
import { Avatar, AvatarFallback, AvatarImage } from "@/ui/Avatar.ui";
import { useOutsideClick } from "@/hooks/useOutsideClick";

const REACTIONS: { type: ReactionType; icon: JSX.Element; bg: string; fg: string }[] = [
  { type: "like", icon: <ThumbsUp />, bg: "bg-blue-100", fg: "text-blue-500" },
  { type: "love", icon: <Heart />, bg: "bg-red-100", fg: "text-red-500" },
  { type: "laugh", icon: <Smiley />, bg: "bg-yellow-100", fg: "text-yellow-500" },
  { type: "sad", icon: <SmileySad />, bg: "bg-purple-100", fg: "text-purple-500" },
  { type: "fire", icon: <Flame />, bg: "bg-orange-100", fg: "text-orange-500" },
];

export function ReactionSummary({
  targetType,
  targetId,
  version,
}: {
  targetType: "post" | "comment";
  targetId: number;
  version: number;
}) {
  const { auth } = useAuth();
  const userId = auth.user?.id;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [latestName, setLatestName] = useState<string | null>(null);
  const [listOpen, setListOpen] = useState(false);
  const [allReactions, setAllReactions] = useState<
    { name: string; avatar?: string; type: string }[]
  >([]);
  const [selectedTab, setSelectedTab] = useState<string>("");
  const wrapperRef = useRef<HTMLDivElement>(null);
  useOutsideClick(wrapperRef, () => setListOpen(false));

  useEffect(() => {
    async function load() {
      // fetch both reactions and profiles via the service
      const { rows, profiles } = await fetchReactions(targetType, targetId);

      // build counts
      const newCounts: Record<string, number> = {};
      rows.forEach(r => {
        newCounts[r.reaction_type] = (newCounts[r.reaction_type] ?? 0) + 1;
      });
      setCounts(newCounts);

      // merge profile data into each reaction
      const withNames = rows.map(r => {
        const u = profiles.find(p => p.user_id === r.user_id);
        return {
          name: u?.name || "Unknown",
          avatar: u?.profile_picture ?? undefined,
          type: r.reaction_type,
        };
      });
      setAllReactions(withNames);

      // default selectedTab to the highest-count reaction
      const first = Object.entries(newCounts)
        .filter(([, c]) => c > 0)
        .sort(([, a], [, b]) => b - a)
        .map(([t]) => t)[0];
      if (first) setSelectedTab(first);

      // latest
      if (withNames.length) {
        setLatestName(withNames[0].name);
      }
    }
    load();
  }, [targetType, targetId, userId, version]);

  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  const top3 = Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([t]) => t);

  return (
    <div className="mb-2">
      {/* Top-3 overlapping reaction icons + total count */}
      <div className="flex items-center" ref={wrapperRef}>
        {top3.map((type, idx) => {
          const reaction = REACTIONS.find(r => r.type === type)!;
          // higher z-index for earlier icons
          const zClasses = ["z-10", "z-20", "z-30"];
          return (
            <div key={type} className={`${idx > 0 ? "-ml-2" : ""} ${zClasses[idx]}`}>
              <button
                onClick={() => setListOpen(true)}
                className={`p-1 rounded-full border-2 border-white ${reaction.bg} ${reaction.fg}`}
              >
                {React.cloneElement(reaction.icon, {
                  size: 16,
                  weight: "fill",
                })}
              </button>
            </div>
          );
        })}
        <span
          onClick={e => {
            e.stopPropagation();
            setListOpen(true);
          }}
          className="ml-2 text-sm font-medium hover:text-primary cursor-pointer hover:underline "
        >
          <span className="text-sm">
            {latestName && `${latestName}`}
            {total - 1 > 0 && ` and ${total - 1} others`}
          </span>
        </span>
      </div>

      {listOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full">
            {/* Close icon in top-right */}
            <button
              onClick={(e) => { e.stopPropagation(); setListOpen(false); }}
              aria-label="Close"
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:text-gray-400"
            >
              <X size={20} weight="bold" />
            </button>
            <h2 className="text-lg font-semibold mb-4">Reactions</h2>

            {/* ← New: Tab navigation */}
            <div className="flex space-x-4 border-b mb-4">
              {REACTIONS.filter(r => counts[r.type] > 0).map(r => (
                <button
                  key={r.type}
                  onClick={(e) => { e.stopPropagation(); setSelectedTab(r.type); }}
                  className={`flex items-center space-x-1 text-sm pb-1 ${
                    selectedTab === r.type
                      ? "border-b-4 border-primary text-primary"
                      : "text-gray-500 dark:text-gray-400"
                  } ${r.fg}`}
                >
                  {React.cloneElement(r.icon as any, { size: 20, weight: "fill" })}
                  <span>{counts[r.type]}</span>
                </button>
              ))}
            </div>

            {/* ← Filtered list */}
            <ul className="space-y-4 max-h-64 overflow-y-auto">
              {allReactions
                .filter(r => r.type === selectedTab)
                .map((r, i) => (
                  <li key={i} className="flex items-center space-x-2">
                    <Avatar className="h-8 w-8">
                      {r.avatar ? (
                        <AvatarImage src={r.avatar} alt={r.name} />
                      ) : (
                        <AvatarFallback>{r.name.charAt(0)}</AvatarFallback>
                      )}
                    </Avatar>
                    <span className="text-sm">{r.name}</span>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
