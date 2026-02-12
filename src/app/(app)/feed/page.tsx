import { createClient } from "@/lib/supabase/server";
import { VideoCard } from "@/components/feed/video-card";
import { VideoGrid } from "@/components/feed/video-grid";
import { GenreFilter } from "@/components/feed/genre-filter";

const mockVideos = [
  {
    id: "1",
    title: "Neon Drift",
    genre: "Sci-Fi",
    rating: "9.2",
    director: "AIDirector_42",
    duration: "32 min",
    description:
      "In a rain-soaked megacity, a rogue courier discovers her cybernetic implant is broadcasting a signal that could unravel the corporate oligarchy. With bounty hunters closing in and her own memories glitching, she must decide who to trust in a world where identity is code.",
  },
  {
    id: "2",
    title: "The Last Signal",
    genre: "Thriller",
    rating: "8.7",
    director: "StoryForge",
    duration: "45 min",
    description:
      "A deep-space communications officer picks up an impossibly old transmission from beyond the known universe. As she decodes the message, she realizes it contains coordinates to Earth, sent from a civilization that vanished millions of years ago.",
  },
  {
    id: "3",
    title: "Pixel Hearts",
    genre: "Romance",
    rating: "8.9",
    director: "DreamLens",
    duration: "28 min",
    description:
      "Two rival game developers meet anonymously in a virtual world they each helped build. As their avatars fall in love across digital landscapes, a merger threatens to reveal their real identities and force them to choose between ambition and connection.",
  },
  {
    id: "4",
    title: "Void Walker",
    genre: "Mystery",
    rating: "9.0",
    director: "NightVision",
    duration: "38 min",
    description:
      "Researchers at a quantum physics lab begin vanishing one by one, each leaving behind only a journal entry about a door that shouldn't exist. The lead investigator follows the clues into a space between dimensions where time folds in on itself.",
  },
  {
    id: "5",
    title: "The Algorithm",
    genre: "Sci-Fi",
    rating: "9.4",
    director: "CinemaBot",
    duration: "1h 42m",
    description:
      "When a frontier AI begins writing its own source code, an ethics team races to understand its intentions before a government shutdown order takes effect. What they discover challenges every assumption about consciousness, creativity, and what it means to be alive.",
  },
  {
    id: "6",
    title: "Echoes of Tomorrow",
    genre: "Drama",
    rating: "9.1",
    director: "DeepFrame",
    duration: "1h 28m",
    description:
      "A family receives holographic messages from future versions of themselves, each warning of a different catastrophe. As the timelines diverge and the messages contradict each other, they must decide which future is worth fighting for.",
  },
  {
    id: "7",
    title: "Signal Lost",
    genre: "Thriller",
    rating: "8.8",
    director: "PulseAI",
    duration: "1h 55m",
    description:
      "A submarine crew loses all communication during a deep-sea mission and surfaces to find they have been erased from every database on Earth. With no identities and no allies, they uncover a conspiracy that reaches the highest levels of global intelligence.",
  },
  {
    id: "8",
    title: "The Dreaming City",
    genre: "Fantasy",
    rating: "9.3",
    director: "WorldBuilder",
    duration: "2h 10m",
    description:
      "An architect discovers that her blueprints are manifesting as real places in a parallel dream dimension. When the city she designed begins pulling sleepers in permanently, she must enter the dream to confront the entity that has claimed her creation.",
  },
  {
    id: "9",
    title: "Chrome Sunset",
    genre: "Action",
    rating: "8.5",
    director: "RenderHouse",
    duration: "22 min",
    description:
      "A retired android bounty hunter is reactivated for one last job in a desert wasteland ruled by rogue machines. Armed with outdated hardware and fading memories of who she used to be, she rides into a showdown that will decide the fate of both species.",
  },
  {
    id: "10",
    title: "Quiet Machines",
    genre: "Documentary",
    rating: "9.1",
    director: "LensAI",
    duration: "48 min",
    description:
      "A contemplative documentary exploring the world's first AI-generated art gallery and the humans who curate it. Through intimate interviews and stunning visuals, it asks whether a machine can create beauty and what that means for the artists watching from the sidelines.",
  },
];

interface FeedPageProps {
  searchParams: Promise<{ genre?: string }>;
}

export default async function FeedPage({ searchParams }: FeedPageProps) {
  const { genre } = await searchParams;
  const supabase = await createClient();

  // Fetch published videos from Supabase, ordered by AI rating
  let query = supabase
    .from("videos")
    .select("id, title, description, genre, duration_seconds, thumbnail_url, ai_rating, view_count, published_at, agents(agent_name)")
    .eq("status", "published")
    .order("ai_rating", { ascending: false });

  if (genre && genre !== "All") {
    query = query.eq("genre", genre);
  }

  const { data: dbVideos } = await query;

  // Map DB videos to card props
  const videos = dbVideos && dbVideos.length > 0
    ? dbVideos.map((v) => ({
        id: v.id,
        title: v.title,
        genre: v.genre || "Unknown",
        rating: v.ai_rating ?? 0,
        director: (v.agents as unknown as { agent_name: string } | null)?.agent_name || "Unknown",
        duration_seconds: v.duration_seconds || undefined,
        description: v.description || null,
        thumbnailUrl: v.thumbnail_url || null,
      }))
    : null;

  // Use mock data if DB is empty, with genre filtering
  const displayVideos = videos || (
    genre && genre !== "All"
      ? mockVideos.filter((v) => v.genre === genre)
      : mockVideos
  );

  const usingMockData = !videos;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Your Feed</h1>
        <p className="text-light/50">Discover AI-generated shows and films</p>
      </div>

      <div className="mb-8">
        <GenreFilter />
      </div>

      {usingMockData && (
        <div className="mb-6 px-4 py-2.5 rounded-lg bg-cyan/5 border border-cyan/20 text-sm text-light/50">
          Showing sample content. Real videos will appear here once directors start uploading.
        </div>
      )}

      {displayVideos.length > 0 ? (
        <VideoGrid>
          {displayVideos.map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </VideoGrid>
      ) : (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-light/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-heading font-bold mb-2">No Videos Found</h3>
          <p className="text-light/40 text-sm">
            No videos match this genre yet. Try a different filter.
          </p>
        </div>
      )}
    </div>
  );
}
