import { VideoCard } from "@/components/feed/video-card";

interface SavedVideo {
  id: string;
  title: string;
  genre: string;
  rating: string;
  director: string;
  duration?: string;
}

interface SavedListProps {
  videos: SavedVideo[];
}

export function SavedList({ videos }: SavedListProps) {
  if (videos.length === 0) {
    return (
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
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
            />
          </svg>
        </div>
        <h3 className="text-lg font-heading font-bold mb-2">
          Your Library is Empty
        </h3>
        <p className="text-light/40 text-sm max-w-sm mx-auto">
          Save shows and movies from your feed to watch later. They&apos;ll show
          up here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}
