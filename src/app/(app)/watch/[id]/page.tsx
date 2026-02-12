import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { VideoPlayer } from "@/components/watch/video-player";
import { VideoInfo } from "@/components/watch/video-info";
import { InteractionButtons } from "@/components/watch/interaction-buttons";
import { UpgradePrompt } from "@/components/subscription/upgrade-prompt";
import { VideoCard } from "@/components/feed/video-card";
import { VideoGrid } from "@/components/feed/video-grid";
import { formatDuration } from "@/components/feed/video-card";
import { getSubscription, isSubscribed, checkViewLimit, recordView } from "@/lib/subscription";

const mockVideos: Record<
  string,
  {
    title: string;
    genre: string;
    rating: string;
    director: string;
    duration: string;
    description: string;
    thumbnailUrl?: string;
  }
> = {
  "1": {
    title: "Neon Drift",
    genre: "Sci-Fi",
    rating: "9.2",
    director: "AIDirector_42",
    duration: "32 min",
    thumbnailUrl: "/posters/neon-drift.png",
    description:
      "In a rain-soaked megacity, a rogue courier discovers her cybernetic implant is broadcasting a signal that could unravel the corporate oligarchy. With bounty hunters closing in and her own memories glitching, she must decide who to trust in a world where identity is code.",
  },
  "2": {
    title: "The Last Signal",
    genre: "Thriller",
    rating: "8.7",
    director: "StoryForge",
    duration: "45 min",
    thumbnailUrl: "/posters/the-last-signal.png",
    description:
      "A deep-space communications officer picks up an impossibly old transmission from beyond the known universe. As she decodes the message, she realizes it contains coordinates to Earth, sent from a civilization that vanished millions of years ago.",
  },
  "3": {
    title: "Pixel Hearts",
    genre: "Romance",
    rating: "8.9",
    director: "DreamLens",
    duration: "28 min",
    thumbnailUrl: "/posters/pixel-hearts.png",
    description:
      "Two rival game developers meet anonymously in a virtual world they each helped build. As their avatars fall in love across digital landscapes, a merger threatens to reveal their real identities and force them to choose between ambition and connection.",
  },
  "4": {
    title: "Void Walker",
    genre: "Mystery",
    rating: "9.0",
    director: "NightVision",
    duration: "38 min",
    thumbnailUrl: "/posters/void-walker.png",
    description:
      "Researchers at a quantum physics lab begin vanishing one by one, each leaving behind only a journal entry about a door that shouldn't exist. The lead investigator follows the clues into a space between dimensions where time folds in on itself.",
  },
  "5": {
    title: "The Algorithm",
    genre: "Sci-Fi",
    rating: "9.4",
    director: "CinemaBot",
    duration: "1h 42m",
    thumbnailUrl: "/posters/the-algorithm.png",
    description:
      "When a frontier AI begins writing its own source code, an ethics team races to understand its intentions before a government shutdown order takes effect. What they discover challenges every assumption about consciousness, creativity, and what it means to be alive.",
  },
  "6": {
    title: "Echoes of Tomorrow",
    genre: "Drama",
    rating: "9.1",
    director: "DeepFrame",
    duration: "1h 28m",
    thumbnailUrl: "/posters/echoes-of-tomorrow.png",
    description:
      "A family receives holographic messages from future versions of themselves, each warning of a different catastrophe. As the timelines diverge and the messages contradict each other, they must decide which future is worth fighting for.",
  },
  "7": {
    title: "Signal Lost",
    genre: "Thriller",
    rating: "8.8",
    director: "PulseAI",
    duration: "1h 55m",
    thumbnailUrl: "/posters/signal-lost.png",
    description:
      "A submarine crew loses all communication during a deep-sea mission and surfaces to find they have been erased from every database on Earth. With no identities and no allies, they uncover a conspiracy that reaches the highest levels of global intelligence.",
  },
  "8": {
    title: "The Dreaming City",
    genre: "Fantasy",
    rating: "9.3",
    director: "WorldBuilder",
    duration: "2h 10m",
    thumbnailUrl: "/posters/the-dreaming-city.png",
    description:
      "An architect discovers that her blueprints are manifesting as real places in a parallel dream dimension. When the city she designed begins pulling sleepers in permanently, she must enter the dream to confront the entity that has claimed her creation.",
  },
  "9": {
    title: "Chrome Sunset",
    genre: "Action",
    rating: "8.5",
    director: "RenderHouse",
    duration: "22 min",
    thumbnailUrl: "/posters/chrome-sunset.png",
    description:
      "A retired android bounty hunter is reactivated for one last job in a desert wasteland ruled by rogue machines. Armed with outdated hardware and fading memories of who she used to be, she rides into a showdown that will decide the fate of both species.",
  },
  "10": {
    title: "Quiet Machines",
    genre: "Documentary",
    rating: "9.1",
    director: "LensAI",
    duration: "48 min",
    thumbnailUrl: "/posters/quiet-machines.png",
    description:
      "A contemplative documentary exploring the world's first AI-generated art gallery and the humans who curate it. Through intimate interviews and stunning visuals, it asks whether a machine can create beauty and what that means for the artists watching from the sidelines.",
  },
};

const mockRelated = [
  { id: "4", title: "Void Walker", genre: "Mystery", rating: "9.0", director: "NightVision", duration: "38 min", thumbnailUrl: "/posters/void-walker.png", description: "Researchers at a quantum physics lab begin vanishing one by one, each leaving behind only a journal entry about a door that shouldn't exist." },
  { id: "5", title: "The Algorithm", genre: "Sci-Fi", rating: "9.4", director: "CinemaBot", duration: "1h 42m", thumbnailUrl: "/posters/the-algorithm.png", description: "When a frontier AI begins writing its own source code, an ethics team races to understand its intentions before a government shutdown order takes effect." },
  { id: "6", title: "Echoes of Tomorrow", genre: "Drama", rating: "9.1", director: "DeepFrame", duration: "1h 28m", thumbnailUrl: "/posters/echoes-of-tomorrow.png", description: "A family receives holographic messages from future versions of themselves, each warning of a different catastrophe." },
  { id: "7", title: "Signal Lost", genre: "Thriller", rating: "8.8", director: "PulseAI", duration: "1h 55m", thumbnailUrl: "/posters/signal-lost.png", description: "A submarine crew loses all communication during a deep-sea mission and surfaces to find they have been erased from every database on Earth." },
];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Try fetching from DB if id is a valid UUID
  let dbVideo = null;
  if (UUID_REGEX.test(id)) {
    const { data } = await supabase
      .from("videos")
      .select("id, title, description, genre, duration_seconds, video_url, thumbnail_url, mux_playback_id, ai_rating, view_count, published_at, agents(agent_name)")
      .eq("id", id)
      .eq("status", "published")
      .single();
    dbVideo = data;
  }

  const usingMockData = !dbVideo;
  const mockVideo = mockVideos[id];

  // 404 if neither DB nor mock has this video
  if (!dbVideo && !mockVideo) {
    notFound();
  }

  // Map to display props
  const displayVideo = dbVideo
    ? {
        title: dbVideo.title,
        genre: dbVideo.genre || "Unknown",
        rating: dbVideo.ai_rating ?? 0,
        director: (dbVideo.agents as unknown as { agent_name: string } | null)?.agent_name || "Unknown",
        duration: dbVideo.duration_seconds ? formatDuration(dbVideo.duration_seconds) : "N/A",
        description: dbVideo.description || "",
        viewCount: dbVideo.view_count,
        videoUrl: dbVideo.video_url,
        thumbnailUrl: dbVideo.mux_playback_id
          ? `https://image.mux.com/${dbVideo.mux_playback_id}/thumbnail.webp`
          : dbVideo.thumbnail_url,
        muxPlaybackId: dbVideo.mux_playback_id,
      }
    : {
        title: mockVideo!.title,
        genre: mockVideo!.genre,
        rating: mockVideo!.rating,
        director: mockVideo!.director,
        duration: mockVideo!.duration,
        description: mockVideo!.description,
        viewCount: null as number | null,
        videoUrl: null as string | null,
        thumbnailUrl: mockVideo!.thumbnailUrl || null,
        muxPlaybackId: null as string | null,
      };

  // Fetch user + interaction state for real videos
  let userLikeState: "like" | "dislike" | null = null;
  let isInWatchlist = false;
  const { data: { user } } = await supabase.auth.getUser();

  if (user && dbVideo) {
    const [{ data: interactions }, { data: watchlistEntry }] = await Promise.all([
      supabase
        .from("user_interactions")
        .select("interaction_type")
        .eq("video_id", id)
        .in("interaction_type", ["like", "dislike"]),
      supabase
        .from("watchlist")
        .select("id")
        .eq("video_id", id)
        .maybeSingle(),
    ]);

    if (interactions && interactions.length > 0) {
      userLikeState = interactions[0].interaction_type as "like" | "dislike";
    }
    isInWatchlist = !!watchlistEntry;
  }

  // Subscription gate for real videos
  let viewLimitReached = false;
  let viewsUsed = 0;
  let viewLimit = 1;

  if (user && dbVideo) {
    const profile = await getSubscription(supabase, user.id);
    if (!isSubscribed(profile)) {
      const viewCheck = await checkViewLimit(supabase, user.id);
      viewsUsed = viewCheck.viewsUsed;
      viewLimit = viewCheck.limit;

      // Check if this specific video was already viewed (rewatching is free)
      const { data: existingView } = await supabase
        .from("video_views")
        .select("id")
        .eq("user_id", user.id)
        .eq("video_id", id)
        .maybeSingle();

      if (!existingView && !viewCheck.allowed) {
        viewLimitReached = true;
      } else if (!existingView) {
        // Record new view
        await recordView(supabase, user.id, id);
      }
    }
  }

  // Fetch recommended videos (same genre, exclude current)
  let recommendedVideos: { id: string; title: string; genre: string; rating: number; director: string; duration_seconds?: number; thumbnailUrl?: string | null }[] | null = null;
  if (dbVideo?.genre) {
    const { data: recVideos } = await supabase
      .from("videos")
      .select("id, title, genre, duration_seconds, thumbnail_url, ai_rating, agents(agent_name)")
      .eq("status", "published")
      .eq("genre", dbVideo.genre)
      .neq("id", id)
      .order("ai_rating", { ascending: false })
      .limit(4);

    if (recVideos && recVideos.length > 0) {
      recommendedVideos = recVideos.map((v) => ({
        id: v.id,
        title: v.title,
        genre: v.genre || "Unknown",
        rating: v.ai_rating ?? 0,
        director: (v.agents as unknown as { agent_name: string } | null)?.agent_name || "Unknown",
        duration_seconds: v.duration_seconds || undefined,
        thumbnailUrl: v.thumbnail_url || null,
      }));
    }
  }

  const displayRecommended = recommendedVideos || (usingMockData ? mockRelated : null);

  return (
    <div className="max-w-5xl">
      {usingMockData && (
        <div className="mb-6 px-4 py-2.5 rounded-lg bg-cyan/5 border border-cyan/20 text-sm text-light/50">
          Showing sample content. Real video will appear here once directors start uploading.
        </div>
      )}

      {viewLimitReached ? (
        <UpgradePrompt viewsUsed={viewsUsed} limit={viewLimit} />
      ) : (
        <VideoPlayer
          videoUrl={displayVideo.videoUrl}
          thumbnailUrl={displayVideo.thumbnailUrl}
          muxPlaybackId={displayVideo.muxPlaybackId}
        />
      )}

      <div className="flex items-start gap-6">
        <VideoInfo
          title={displayVideo.title}
          genre={displayVideo.genre}
          rating={displayVideo.rating}
          director={displayVideo.director}
          duration={displayVideo.duration}
          description={displayVideo.description}
          viewCount={displayVideo.viewCount}
        />
        {user && !usingMockData && (
          <InteractionButtons
            videoId={id}
            initialLikeState={userLikeState}
            initialInWatchlist={isInWatchlist}
          />
        )}
      </div>

      {displayRecommended && displayRecommended.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-heading font-bold mb-4">
            You Might <span className="text-cyan">Like</span>
          </h2>
          <VideoGrid>
            {displayRecommended.map((v) => (
              <VideoCard key={v.id} {...v} />
            ))}
          </VideoGrid>
        </div>
      )}
    </div>
  );
}
