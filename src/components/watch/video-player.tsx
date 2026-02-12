"use client";

interface VideoPlayerProps {
  videoUrl?: string | null;
  thumbnailUrl?: string | null;
}

export function VideoPlayer({ videoUrl, thumbnailUrl }: VideoPlayerProps) {
  if (videoUrl) {
    return (
      <div className="relative w-full aspect-video bg-navy border border-white/10 rounded-xl overflow-hidden">
        <video
          className="w-full h-full"
          controls
          poster={thumbnailUrl || undefined}
          preload="metadata"
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  return (
    <div className="relative w-full aspect-video bg-gradient-to-br from-teal/10 to-navy border border-white/10 rounded-xl overflow-hidden flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-cyan/20 flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-cyan/30 transition-colors">
          <svg
            className="w-8 h-8 text-cyan ml-1"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <p className="text-light/40 text-sm">Video player coming soon</p>
      </div>
    </div>
  );
}
