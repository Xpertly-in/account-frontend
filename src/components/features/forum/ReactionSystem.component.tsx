// src/components/features/forum/ReactionSystem.component.tsx
"use client";
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

  // load counts and user’s reaction
  useEffect(() => {
    async function load() {
      // load all reactions then count by type client-side
      const { data: rows, error } = await supabase
        .from("reactions")
        .select("reaction_type")
        .eq("target_type", targetType)
        .eq("target_id", targetId);

      if (error) {
        console.error("Error fetching reactions:", error);
        return;
      }

      const newCounts: Record<string, number> = {};
      rows?.forEach((r: any) => {
        newCounts[r.reaction_type] = (newCounts[r.reaction_type] ?? 0) + 1;
      });
      setCounts(newCounts);

      // load my reaction
      if (userId) {
        const { data: me, error: meError } = await supabase
          .from("reactions")
          .select("reaction_type")
          .eq("target_type", targetType)
          .eq("target_id", targetId)
          .eq("user_id", userId)
          .limit(1)
          .single();

        if (meError) {
          console.error("Error fetching user reaction:", meError);
          return;
        }

        setMyReaction(me?.reaction_type ?? null);
      }
    }
    load();
  }, [targetType, targetId, userId]);

  const onReact = async (type: string) => {
    if (!userId) return;

    // Check if the user already has a reaction
    const { data: existingReaction, error: fetchError } = await supabase
      .from("reactions")
      .select("reaction_type")
      .eq("user_id", userId)
      .eq("target_type", targetType)
      .eq("target_id", targetId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "No rows found" error
      console.error("Error fetching existing reaction:", fetchError);
      return;
    }

    // If the user is toggling off the same reaction type
    if (existingReaction && existingReaction.reaction_type === type) {
      await supabase
        .from("reactions")
        .delete()
        .match({ user_id: userId, target_type: targetType, target_id: targetId });

      setMyReaction(null);
      setCounts(c => ({ ...c, [type]: (c[type] || 1) - 1 }));

      // Decrement the count in the posts table
      await supabase.rpc("update_reaction_count_jsonb", {
        post_id: targetId,
        reaction_type: type,
        increment: false,
      });

      return;
    }

    // If the user has a different reaction, update it
    if (existingReaction) {
      await supabase
        .from("reactions")
        .update({ reaction_type: type })
        .match({ user_id: userId, target_type: targetType, target_id: targetId });

      // Update counts
      setCounts(c => ({
        ...c,
        [existingReaction.reaction_type]: (c[existingReaction.reaction_type] || 1) - 1,
        [type]: (c[type] || 0) + 1,
      }));

      // Update the counts in the posts table
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

    // Insert new reaction
    await supabase
      .from("reactions")
      .insert([
        { user_id: userId, target_type: targetType, target_id: targetId, reaction_type: type },
      ]);

    setMyReaction(type);
    setCounts(c => ({ ...c, [type]: (c[type] || 0) + 1 }));

    // Increment the count in the posts table
    await supabase.rpc("update_reaction_count_jsonb", {
      post_id: targetId,
      reaction_type: type,
      increment: true,
    });
  };

  // show picker on hover or long-press
  const handleMouseEnter = () => setPickerVisible(true);
  const handleMouseLeave = () => setPickerVisible(false);
  const handleTouchStart = () => {
    holdTimer.current = window.setTimeout(() => setPickerVisible(true), 600);
  };
  const handleTouchEnd = () => clearTimeout(holdTimer.current);

  // default like count
  const likeCount = counts["like"] || 0;
  const isLiked = myReaction === "like";

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* default 👍 button */}
      <button
        onClick={() => onReact("like")}
        className={`flex items-center space-x-1 text-sm rounded-full px-2 py-1 transition transform 
          ${
            isLiked
              ? "bg-primary/10 text-primary"
              : "text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}
      >
        <ThumbsUp size={18} weight={isLiked ? "fill" : "regular"} />
        <span>{likeCount}</span>
      </button>

      {/* reaction picker */}
      {pickerVisible && (
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 flex bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-10 space-x-2">
          {REACTIONS.map(({ type, icon }, idx) => (
            <button
              key={type}
              onClick={() => {
                onReact(type);
                setPickerVisible(false);
              }}
              className="bg-white dark:bg-gray-700 rounded-full p-1 shadow-md hover:scale-110 transform transition"
              style={{ animationDelay: `${idx * 50}ms` }}
            >
              {React.cloneElement(icon as any, {
                size: 24,
                className: "animate-pop text-gray-600 dark:text-gray-200",
              })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
