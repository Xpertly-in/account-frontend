import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/helper/supabase.helper";
import { useAuth } from "@/store/context/Auth.provider";
import { ThumbsUp, Heart, Smiley, SmileySad, Flame } from "@phosphor-icons/react";

const REACTIONS = [
  { type: "like", icon: <ThumbsUp /> },
  { type: "love", icon: <Heart /> },
  { type: "laugh", icon: <Smiley /> },
  { type: "sad", icon: <SmileySad /> },
  { type: "angry", icon: <Flame /> },
];

export function ReactionSystem({
  targetType,
  targetId,
}: {
  targetType: "post" | "comment";
  targetId: number;
}) {
  const { auth } = useAuth();
  const userId = auth.user?.id;
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [latestReactor, setLatestReactor] = useState<string | null>(null);
  const [reactionsList, setReactionsList] = useState<{ name: string; type: string }[]>([]);
  const [modalVisible, setModalVisible] = useState(false);
  const holdTimer = useRef<number>();
  const pickerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (pickerVisible && pickerRef.current) {
      const picker = pickerRef.current;
      const rect = picker.getBoundingClientRect();
      const overflowRight = rect.right > window.innerWidth;
      const overflowLeft = rect.left < 0;

      if (overflowRight) {
        picker.style.left = `calc(100% - ${rect.width}px)`;
        picker.style.transform = 'translateX(0)';
      } else if (overflowLeft) {
        picker.style.left = '0';
        picker.style.transform = 'translateX(0)';
      } else {
        picker.style.left = '100%';
        picker.style.transform = 'translateX(-50%)';
      }
    }
  }, [pickerVisible]);

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from("reactions")
        .select("reaction_type, user_id")
        .eq("target_type", targetType)
        .eq("target_id", targetId);

      const newCounts: Record<string, number> = {};
      const userIds = rows?.map(r => r.user_id) || [];
      const { data: users } = await supabase
        .from("profiles")
        .select("user_id, name")
        .in("user_id", userIds);

      const reactionsWithNames = rows?.map(r => ({
        type: r.reaction_type,
        name: users?.find(u => u.user_id === r.user_id)?.name || "Unknown",
      }));

      setReactionsList(reactionsWithNames || []);
      rows?.forEach((r: any) => {
        newCounts[r.reaction_type] = (newCounts[r.reaction_type] ?? 0) + 1;
      });
      setCounts(newCounts);

      if (userId) {
        const { data: me } = await supabase
          .from("reactions")
          .select("reaction_type")
          .eq("target_type", targetType)
          .eq("target_id", targetId)
          .eq("user_id", userId)
          .single();
        setMyReaction(me?.reaction_type ?? null);
      }

      if (rows?.length) {
        const latestUserId = rows[0].user_id;
        const { data: user } = await supabase
          .from("profiles")
          .select("name")
          .eq("user_id", latestUserId)
          .single();
        setLatestReactor(user?.name ?? null);
      }
    }
    load();
  }, [targetType, targetId, userId]);

  const onReact = async (type: string) => {
    if (!userId) return;

    const { data: existingReaction } = await supabase
      .from("reactions")
      .select("reaction_type")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .single();

    if (existingReaction && existingReaction.reaction_type === type) {
      await supabase
        .from("reactions")
        .delete()
        .match({ user_id: userId, target_type: targetType, target_id: targetId });

      setMyReaction(null);
      setCounts(c => ({ ...c, [type]: (c[type] || 1) - 1 }));

      await supabase.rpc("update_reaction_count_jsonb", {
        post_id: targetId,
        reaction_type: type,
        increment: false,
      });

      return;
    }

    if (existingReaction) {
      await supabase
        .from("reactions")
        .update({ reaction_type: type })
        .match({ user_id: userId, target_type: targetType, target_id: targetId });

      setCounts(c => ({
        ...c,
        [existingReaction.reaction_type]: (c[existingReaction.reaction_type] || 1) - 1,
        [type]: (c[type] || 0) + 1,
      }));

      await supabase.rpc("update_reaction_count_jsonb", {
        post_id: targetId,
        reaction_type: existingReaction.reaction_type,
        increment: false,
      });
      await supabase.rpc("update_reaction_count_jsonb", {
        post_id: targetId,
        reaction_type: type,
        increment: true,
      });

      setMyReaction(type);
      return;
    }

    await supabase
      .from("reactions")
      .insert([
        { user_id: userId, target_type: targetType, target_id: targetId, reaction_type: type },
      ]);

    setMyReaction(type);
    setCounts(c => ({ ...c, [type]: (c[type] || 0) + 1 }));

    await supabase.rpc("update_reaction_count_jsonb", {
      post_id: targetId,
      reaction_type: type,
      increment: true,
    });
  };

  const handleMouseEnter = () => setPickerVisible(true);
  const handleMouseLeave = () => setPickerVisible(false);
  const handleTouchStart = () => {
    holdTimer.current = window.setTimeout(() => setPickerVisible(true), 600);
  };
  const handleTouchEnd = () => clearTimeout(holdTimer.current);

  // Calculate total reaction count
  const totalReactions = Object.values(counts).reduce((sum, count) => sum + count, 0);

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Reaction Button */}
      <button
        onClick={() => onReact("like")}
        className={`flex items-center space-x-1 text-sm rounded-full px-2 py-1 transition transform 
          ${
            myReaction
              ? "bg-primary/10 text-primary"
              : "text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
      >
        {myReaction ? (
          React.cloneElement(
            REACTIONS.find(reaction => reaction.type === myReaction)?.icon as any,
            { size: 18, weight: "fill" }
          )
        ) : (
          <ThumbsUp size={18} weight="regular" />
        )}
        <span>
          {myReaction ? myReaction.charAt(0).toUpperCase() + myReaction.slice(1) : "Like"}
        </span>
      </button>

      {/* Reaction Picker */}
      {pickerVisible && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 flex bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 space-x-2"
        >
          {REACTIONS.map(({ type, icon }, idx) => (
            <button
              key={type}
              onClick={() => {
                onReact(type);
                setPickerVisible(false);
              }}
              className={`bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:scale-110 transform transition ${
                myReaction === type ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {React.cloneElement(icon as any, {
                size: 24,
                weight: myReaction === type ? "fill" : "regular",
                className: "animate-pop text-gray-600 dark:text-gray-200",
              })}
            </button>
          ))}
        </div>
      )}

      {/* Top Reactions and Latest Reactor */}
      <div className="flex items-center space-x-2 mb-2">
        {Object.entries(counts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([type]) => (
            <span key={type}>
              {React.cloneElement(REACTIONS.find(reaction => reaction.type === type)?.icon as any, {
                size: 18,
                weight: "fill",
              })}
            </span>
          ))}

        <button
          onClick={() => {setModalVisible(true); setPickerVisible(false);}}
          className="text-sm text-primary hover:underline"
        >
          <span className="text-sm text-gray-600 dark:text-gray-400">
            {latestReactor ? `${latestReactor}` : ""}
            {totalReactions - 1 > 0 ? ` and ${totalReactions - 1} others` : ""}
          </span>
        </button>
      </div>

      {/* Modal for Reactions List */}
      {modalVisible && (
        
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-lg font-semibold mb-4">Reactions</h2>
            <ul>
              {reactionsList.map((reaction, idx) => (
                <li key={idx} className="flex items-center space-x-2 mb-2">
                  {React.cloneElement(REACTIONS.find(r => r.type === reaction.type)?.icon as any, {
                    size: 18,
                    weight: "fill",
                  })}
                  <span className="text-sm">{reaction.name}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={() => setModalVisible(false)}
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
