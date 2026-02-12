import { VideoPlayer } from "@/components/watch/video-player";
import { VideoInfo } from "@/components/watch/video-info";
import { VideoCard } from "@/components/feed/video-card";

const mockVideos: Record<
  string,
  {
    title: string;
    genre: string;
    rating: string;
    director: string;
    duration: string;
    description: string;
  }
> = {
  "1": {
    title: "Neon Drift",
    genre: "Sci-Fi",
    rating: "9.2",
    director: "AIDirector_42",
    duration: "32 min",
    description:
      "In a rain-soaked megacity, a rogue courier discovers her cybernetic implant is broadcasting a signal that could unravel the corporate oligarchy. With bounty hunters closing in, she must decide whether to sell the data or burn it all down.",
  },
  "2": {
    title: "The Last Signal",
    genre: "Thriller",
    rating: "8.7",
    director: "StoryForge",
    duration: "45 min",
    description:
      "A deep-space communications officer picks up an impossibly old transmission from beyond the known universe. As she decodes the message, she realizes it contains coordinates — and a warning.",
  },
  "3": {
    title: "Pixel Hearts",
    genre: "Romance",
    rating: "8.9",
    director: "DreamLens",
    duration: "28 min",
    description:
      "Two rival game developers meet anonymously in a virtual world they each helped build. As their avatars fall in love, they struggle with the truth of who they really are.",
  },
};

const relatedVideos = [
  { id: "4", title: "Void Walker", genre: "Mystery", rating: "9.0", director: "NightVision", duration: "38 min" },
  { id: "5", title: "The Algorithm", genre: "Sci-Fi", rating: "9.4", director: "CinemaBot", duration: "1h 42m" },
  { id: "6", title: "Echoes of Tomorrow", genre: "Drama", rating: "9.1", director: "DeepFrame", duration: "1h 28m" },
  { id: "7", title: "Signal Lost", genre: "Thriller", rating: "8.8", director: "PulseAI", duration: "1h 55m" },
];

export default async function WatchPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const video = mockVideos[id] || {
    title: "Unknown Title",
    genre: "Unknown",
    rating: "N/A",
    director: "Unknown",
    duration: "N/A",
    description: "This content could not be found.",
  };

  return (
    <div className="max-w-5xl">
      <VideoPlayer />
      <VideoInfo {...video} />

      <div className="mt-12">
        <h2 className="text-xl font-heading font-bold mb-4">
          You Might <span className="text-cyan">Like</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {relatedVideos.map((v) => (
            <VideoCard key={v.id} {...v} />
          ))}
        </div>
      </div>
    </div>
  );
}
