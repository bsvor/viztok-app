import { VideoCard } from "@/components/feed/video-card";
import { VideoGrid } from "@/components/feed/video-grid";

const mockVideos = [
  { id: "1", title: "Neon Drift", genre: "Sci-Fi", rating: "9.2", director: "AIDirector_42", duration: "32 min" },
  { id: "2", title: "The Last Signal", genre: "Thriller", rating: "8.7", director: "StoryForge", duration: "45 min" },
  { id: "3", title: "Pixel Hearts", genre: "Romance", rating: "8.9", director: "DreamLens", duration: "28 min" },
  { id: "4", title: "Void Walker", genre: "Mystery", rating: "9.0", director: "NightVision", duration: "38 min" },
  { id: "5", title: "The Algorithm", genre: "Sci-Fi", rating: "9.4", director: "CinemaBot", duration: "1h 42m" },
  { id: "6", title: "Echoes of Tomorrow", genre: "Drama", rating: "9.1", director: "DeepFrame", duration: "1h 28m" },
  { id: "7", title: "Signal Lost", genre: "Thriller", rating: "8.8", director: "PulseAI", duration: "1h 55m" },
  { id: "8", title: "The Dreaming City", genre: "Fantasy", rating: "9.3", director: "WorldBuilder", duration: "2h 10m" },
  { id: "9", title: "Chrome Sunset", genre: "Action", rating: "8.5", director: "RenderHouse", duration: "22 min" },
  { id: "10", title: "Quiet Machines", genre: "Documentary", rating: "9.1", director: "LensAI", duration: "48 min" },
];

export default function FeedPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Your Feed</h1>
        <p className="text-light/50">Discover AI-generated shows and films</p>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-heading font-bold mb-4">
          Trending <span className="text-cyan">Now</span>
        </h2>
        <VideoGrid>
          {mockVideos.slice(0, 5).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </VideoGrid>
      </div>

      <div>
        <h2 className="text-xl font-heading font-bold mb-4">
          Recently <span className="text-cyan">Added</span>
        </h2>
        <VideoGrid>
          {mockVideos.slice(5).map((video) => (
            <VideoCard key={video.id} {...video} />
          ))}
        </VideoGrid>
      </div>
    </div>
  );
}
