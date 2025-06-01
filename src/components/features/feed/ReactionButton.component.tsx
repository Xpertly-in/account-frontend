// src/components/features/feed/ReactionButton.component.tsx
"use client";
import { useRouter } from "next/navigation";
import React, { useState, useEffect, useRef } from "react";
import { fetchMyReaction, toggleReaction } from "@/services/reactions.service";
import { useAuth } from "@/store/context/Auth.provider";
import { ThumbsUp, Heart, Smiley, SmileySad, Flame } from "@phosphor-icons/react";
import type { ReactionType } from "@/types/reaction.type";

const REACTIONS: { type: ReactionType; icon: JSX.Element; bg: string; fg: string }[] = [
  { type: "like", icon: <ThumbsUp />, bg: "bg-blue-100", fg: "text-blue-500" },
  { type: "love", icon: <Heart />, bg: "bg-red-100", fg: "text-red-500" },
  { type: "laugh", icon: <Smiley />, bg: "bg-yellow-100", fg: "text-yellow-500" },
  { type: "sad", icon: <SmileySad />, bg: "bg-purple-100", fg: "text-purple-500" },
  { type: "fire", icon: <Flame />, bg: "bg-orange-100", fg: "text-orange-500" },
];

export function ReactionButton({
  targetType,
  targetId,
  onReactComplete,
}: {
  targetType: "post" | "comment";
  targetId: number;
  onReactComplete?: () => void;
}) {
  const router = useRouter();
  const { auth } = useAuth();
  const userId = auth.user?.id;
  const [myReaction, setMyReaction] = useState<string | null>(null);
  const [pickerVisible, setPickerVisible] = useState(false);
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
        picker.style.transform = "translateX(0)";
      } else if (overflowLeft) {
        picker.style.left = "0";
        picker.style.transform = "translateX(0)";
      } else {
        picker.style.left = "150%";
        picker.style.transform = "translateX(-50%)";
      }
    }
  }, [pickerVisible]);

  // load existing user reaction
  useEffect(() => {
    if (!userId) return;
    fetchMyReaction(userId, targetType, targetId)
      .then(reaction => setMyReaction(reaction))
      .catch(console.error);
  }, [userId, targetType, targetId]);

  // handle react / un-react
  const onReact = async (type: string) => {
    if (!userId) {
      router.push("/login/ca");
      return;
    }
    try {
      const newType = await toggleReaction(userId, targetType, targetId, type);
      setMyReaction(newType);
      onReactComplete?.();
    } catch (err) {
      console.error("Failed to toggle reaction", err);
    }
  };

  // show / hide picker
  const handleMouseEnter = () => setPickerVisible(true);
  const handleMouseLeave = () => setPickerVisible(false);
  const handleTouchStart = () => {
    holdTimer.current = window.setTimeout(() => setPickerVisible(true), 600);
  };
  const handleTouchEnd = () => clearTimeout(holdTimer.current);

  return (
    <div
      className="relative inline-block ml-1"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <button
        onClick={e => {
          e.stopPropagation();
          onReact("like");
        }}
        className={`flex items-center space-x-1 text-sm rounded-full px-2 py-1 transition ${
          myReaction
            ? `${REACTIONS.find(r => r.type === myReaction)!.fg}`
            : "text-gray-500 hover:text-primary hover:bg-gray-100 dark:hover:bg-gray-700"
        }`}
      >
        {myReaction ? (
          React.cloneElement(REACTIONS.find(r => r.type === myReaction)!.icon, {
            size: 18,
            weight: "fill",
          })
        ) : (
          <ThumbsUp size={18} weight="regular" />
        )}
        <span>
          {myReaction ? myReaction.charAt(0).toUpperCase() + myReaction.slice(1) : "Like"}
        </span>
      </button>

      {pickerVisible && (
        <div
          ref={pickerRef}
          className="absolute bottom-full left-1/2 transform -translate-x-1/2 flex bg-white dark:bg-gray-800 p-2 rounded-lg shadow-lg z-50 space-x-2"
        >
          {REACTIONS.map(({ type, icon, bg, fg }, i) => (
            <button
              key={type}
              onClick={e => {
                e.stopPropagation();
                onReact(type);
                setPickerVisible(false);
              }}
              className={`rounded-full p-1 shadow-md hover:scale-110 transition ${bg} ${fg} ${
                myReaction === type ? `ring-2 ring-primary ${fg}` : ""
              }`}
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {React.cloneElement(icon, {
                size: 24,
                weight: "fill",
              })}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
