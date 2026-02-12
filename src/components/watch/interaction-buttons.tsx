"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/browser";

interface InteractionButtonsProps {
  videoId: string;
  initialLikeState: "like" | "dislike" | null;
  initialInWatchlist: boolean;
}

export function InteractionButtons({
  videoId,
  initialLikeState,
  initialInWatchlist,
}: InteractionButtonsProps) {
  const [likeState, setLikeState] = useState<"like" | "dislike" | null>(initialLikeState);
  const [inWatchlist, setInWatchlist] = useState(initialInWatchlist);
  const [loading, setLoading] = useState(false);

  async function handleLikeDislike(type: "like" | "dislike") {
    if (loading) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    if (likeState === type) {
      await supabase
        .from("user_interactions")
        .delete()
        .eq("video_id", videoId)
        .eq("interaction_type", type);
      setLikeState(null);
    } else {
      if (likeState) {
        await supabase
          .from("user_interactions")
          .delete()
          .eq("video_id", videoId)
          .eq("interaction_type", likeState);
      }
      const { error } = await supabase
        .from("user_interactions")
        .insert({ user_id: user.id, video_id: videoId, interaction_type: type });
      if (error) { console.error("Like error:", error.message); setLoading(false); return; }
      setLikeState(type);
    }
    setLoading(false);
  }

  async function handleWatchlistToggle() {
    if (loading) return;
    setLoading(true);
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    if (inWatchlist) {
      await supabase
        .from("watchlist")
        .delete()
        .eq("video_id", videoId);
      setInWatchlist(false);
    } else {
      const { error } = await supabase
        .from("watchlist")
        .insert({ user_id: user.id, video_id: videoId });
      if (error) { console.error("Watchlist error:", error.message); setLoading(false); return; }
      setInWatchlist(true);
    }
    setLoading(false);
  }

  return (
    <div className="flex flex-col gap-2 shrink-0 mt-6">
      <button
        onClick={() => handleLikeDislike("like")}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          likeState === "like"
            ? "bg-cyan/20 text-cyan border border-cyan/40"
            : "bg-white/5 text-light/60 border border-white/10 hover:border-cyan/30 hover:text-light"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V3a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m7.723-9.752h-1.08M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
        </svg>
        Like
      </button>

      <button
        onClick={() => handleLikeDislike("dislike")}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          likeState === "dislike"
            ? "bg-red-500/20 text-red-400 border border-red-500/40"
            : "bg-white/5 text-light/60 border border-white/10 hover:border-white/30 hover:text-light"
        }`}
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7.498 15.25H4.372c-1.026 0-1.945-.694-2.054-1.715A12.137 12.137 0 0 1 2.25 12c0-2.848.992-5.464 2.649-7.521C5.287 3.997 5.886 3.75 6.504 3.75h4.369a4.5 4.5 0 0 1 1.423.23l3.114 1.04a4.5 4.5 0 0 0 1.423.23h1.294M7.498 15.25c.618 0 .991.724.725 1.282A7.471 7.471 0 0 0 7.5 19.5a2.25 2.25 0 0 0 2.25 2.25.75.75 0 0 0 .75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 0 0 2.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384m-10.253 1.5H9.7m8.075-9.752c.01.266.01.532 0 .797a12.048 12.048 0 0 1-.521 3.507c-.26.85-1.084 1.368-1.973 1.368H13.48" />
        </svg>
        Dislike
      </button>

      <button
        onClick={handleWatchlistToggle}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors ${
          inWatchlist
            ? "bg-teal/20 text-teal border border-teal/40"
            : "bg-white/5 text-light/60 border border-white/10 hover:border-teal/30 hover:text-light"
        }`}
      >
        <svg className="w-4 h-4" fill={inWatchlist ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0 1 11.186 0Z" />
        </svg>
        {inWatchlist ? "In Watchlist" : "Add to Watchlist"}
      </button>
    </div>
  );
}
