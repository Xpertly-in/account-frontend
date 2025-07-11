// src/services/realtime.service.ts
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";

/**
 * Hook: subscribe to Supabase Realtime for posts, comments, reactions,
 * and invalidate React-Query caches so UI stays in sync.
 */
export function useFeedRealtimeUpdates() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const postsChannel = supabase
      .channel("public:posts")
      .on("postgres_changes", { event: "*", schema: "public", table: "posts" }, () => {
        queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" });
      })
      .subscribe();

    const commentsChannel = supabase
      .channel("public:comments")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "comments" }, payload => {
        // only invalidate the comment list for the affected post
        queryClient.invalidateQueries({ queryKey: ["comments", payload.new.post_id] });
        // still refresh feed counts if needed
        queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" });
      })
      .subscribe();

    const reactionsChannel = supabase
      .channel("public:reactions")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "reactions" }, () => {
        queryClient.invalidateQueries({ queryKey: ["posts"], refetchType: "all" });
      })
      .subscribe();

    return () => {
      postsChannel.unsubscribe();
      supabase.removeChannel(postsChannel);
      commentsChannel.unsubscribe();
      supabase.removeChannel(commentsChannel);
      reactionsChannel.unsubscribe();
      supabase.removeChannel(reactionsChannel);
    };
  }, [queryClient]);
}
