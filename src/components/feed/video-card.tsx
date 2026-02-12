import Link from "next/link";

interface VideoCardProps {
  id: string;
  title: string;
  genre: string;
  rating: string;
  director: string;
  duration?: string;
}

export function VideoCard({
  id,
  title,
  genre,
  rating,
  director,
  duration,
}: VideoCardProps) {
  return (
    <Link href={`/watch/${id}`}>
      <div className="relative group rounded-xl overflow-hidden bg-gradient-to-br from-teal/20 to-navy border border-white/10 aspect-[2/3] flex flex-col justify-end p-4 hover:border-cyan/50 transition-colors cursor-pointer">
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/50 to-transparent" />
        <div className="relative">
          <span className="text-xs text-cyan font-semibold uppercase tracking-wider">
            {genre}
          </span>
          <h3 className="font-heading text-base font-bold mt-1">{title}</h3>
          <div className="flex items-center gap-3 mt-2 text-xs text-light/60">
            <span className="text-cyan font-semibold">{rating}</span>
            {duration && <span>{duration}</span>}
            <span>{director}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
