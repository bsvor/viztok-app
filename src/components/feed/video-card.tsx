import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  genre: string;
  rating: string | number;
  director: string;
  duration?: string;
  duration_seconds?: number;
  thumbnailUrl?: string | null;
  description?: string | null;
}

const GENRE_STYLES: Record<string, { gradient: string; icon: string }> = {
  "Sci-Fi": {
    gradient: "from-cyan/30 via-teal/20 to-navy",
    icon: "M12 3L2 12h3v8h6v-6h2v6h6v-8h3L12 3z",
  },
  Thriller: {
    gradient: "from-red-900/40 via-red-950/20 to-navy",
    icon: "M12 9v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Romance: {
    gradient: "from-pink-900/40 via-purple-950/20 to-navy",
    icon: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z",
  },
  Mystery: {
    gradient: "from-indigo-900/40 via-indigo-950/20 to-navy",
    icon: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
  },
  Drama: {
    gradient: "from-amber-900/40 via-amber-950/20 to-navy",
    icon: "M15.536 8.464a5 5 0 010 7.072M12 9.5v5M18.364 5.636a9 9 0 010 12.728",
  },
  Fantasy: {
    gradient: "from-violet-900/40 via-purple-950/20 to-navy",
    icon: "M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z",
  },
  Action: {
    gradient: "from-orange-900/40 via-orange-950/20 to-navy",
    icon: "M13 10V3L4 14h7v7l9-11h-7z",
  },
  Documentary: {
    gradient: "from-emerald-900/40 via-emerald-950/20 to-navy",
    icon: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z",
  },
  Comedy: {
    gradient: "from-yellow-900/40 via-yellow-950/20 to-navy",
    icon: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
  },
  Horror: {
    gradient: "from-red-950/50 via-gray-950/30 to-navy",
    icon: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707",
  },
};

const DEFAULT_STYLE = {
  gradient: "from-teal/20 to-navy",
  icon: "M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z",
};

export function formatDuration(seconds: number): string {
  if (seconds >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    return `${h}h ${m}m`;
  }
  return `${Math.floor(seconds / 60)} min`;
}

export function VideoCard({
  id,
  title,
  genre,
  rating,
  director,
  duration,
  duration_seconds,
  thumbnailUrl,
  description,
}: VideoCardProps) {
  const displayDuration =
    duration || (duration_seconds ? formatDuration(duration_seconds) : undefined);
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : rating;
  const genreStyle = GENRE_STYLES[genre] || DEFAULT_STYLE;

  return (
    <Link href={`/watch/${id}`}>
      <div className="relative group rounded-xl overflow-hidden aspect-[2/3] border border-white/10 hover:border-cyan/50 transition-all cursor-pointer">
        {/* Poster layer */}
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className={`absolute inset-0 bg-gradient-to-br ${genreStyle.gradient}`}
          >
            {/* Genre icon watermark */}
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-24 h-24 text-white/[0.06]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d={genreStyle.icon}
                />
              </svg>
            </div>
          </div>
        )}

        {/* Bottom gradient + metadata (always visible) */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/60 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="text-[10px] text-cyan font-semibold uppercase tracking-wider">
            {genre}
          </span>
          <h3 className="font-heading text-base font-bold mt-1 leading-tight">
            {title}
          </h3>
          {/* Mobile-only description snippet */}
          {description && (
            <p className="text-[11px] text-light/40 mt-1 line-clamp-2 md:hidden">
              {description}
            </p>
          )}
          <div className="flex items-center gap-3 mt-2 text-xs text-light/60">
            <span className="text-cyan font-semibold">{displayRating}</span>
            {displayDuration && <span>{displayDuration}</span>}
            <span className="truncate">{director}</span>
          </div>
        </div>

        {/* Hover description overlay (desktop only) */}
        {description && (
          <div className="absolute inset-0 bg-navy/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden md:flex flex-col justify-center p-5">
            <span className="text-[10px] text-cyan font-semibold uppercase tracking-wider mb-1">
              {genre}
            </span>
            <h3 className="font-heading text-base font-bold mb-3">{title}</h3>
            <p className="text-sm text-light/60 leading-relaxed line-clamp-6">
              {description}
            </p>
          </div>
        )}
      </div>
    </Link>
  );
}
