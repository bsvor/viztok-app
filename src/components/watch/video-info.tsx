interface VideoInfoProps {
  title: string;
  genre: string;
  rating: string | number;
  director: string;
  duration: string;
  description: string;
  viewCount?: number | null;
}

export function VideoInfo({
  title,
  genre,
  rating,
  director,
  duration,
  description,
  viewCount,
}: VideoInfoProps) {
  const displayRating = typeof rating === "number" ? rating.toFixed(1) : rating;

  return (
    <div className="mt-6 flex-1 min-w-0">
      <div className="flex items-center gap-3 mb-2 flex-wrap">
        <span className="text-xs text-cyan font-semibold uppercase tracking-wider px-2 py-1 rounded bg-cyan/10">
          {genre}
        </span>
        <span className="text-xs text-light/50">{duration}</span>
        <span className="text-xs text-cyan font-semibold">AI Score: {displayRating}</span>
        {viewCount != null && (
          <span className="text-xs text-light/50">{viewCount.toLocaleString()} views</span>
        )}
      </div>
      <h1 className="text-3xl font-heading font-bold mb-2">{title}</h1>
      <p className="text-light/50 text-sm mb-4">Directed by {director}</p>
      <p className="text-light/60 leading-relaxed">{description}</p>
    </div>
  );
}
