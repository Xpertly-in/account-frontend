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
  const holdTimer = useRef<number>();

  useEffect(() => {
    async function load() {
      const { data: rows } = await supabase
        .from("reactions")
        .select("reaction_type")
        .eq("target_type", targetType)
        .eq("target_id", targetId);
      const newCounts: Record<string, number> = {};
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

      await supabase.rpc('update_reaction_count_jsonb', { post_id: targetId, reaction_type: type, increment: false });

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

      await supabase.rpc('update_reaction_count_jsonb', { post_id: targetId, reaction_type: existingReaction.reaction_type, increment: false });
      await supabase.rpc('update_reaction_count_jsonb', { post_id: targetId, reaction_type: type, increment: true });

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

    await supabase.rpc('update_reaction_count_jsonb', { post_id: targetId, reaction_type: type, increment: true });
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
      <button
        onClick={() => onReact("like")}
        className={`flex items-center space-x-1 text-sm rounded-full px-2 py-1 transition transform 
          ${
            myReaction
              ? "bg-primary/10 text-primary"
              : "text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
      >
        <ThumbsUp size={18} weight={myReaction ? "fill" : "regular"} />
        <span>{totalReactions} Likes</span>
      </button>

      {pickerVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 flex bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 space-x-2">
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
    </div>
  );
}