"use client";

import { useRouter, useSearchParams } from "next/navigation";

const genres = [
  "All",
  "Sci-Fi",
  "Thriller",
  "Romance",
  "Mystery",
  "Drama",
  "Fantasy",
  "Action",
  "Documentary",
  "Comedy",
  "Horror",
];

export function GenreFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeGenre = searchParams.get("genre") || "All";

  function handleGenreClick(genre: string) {
    if (genre === "All") {
      router.push("/feed");
    } else {
      router.push(`/feed?genre=${encodeURIComponent(genre)}`);
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {genres.map((genre) => (
        <button
          key={genre}
          onClick={() => handleGenreClick(genre)}
          className={`px-4 py-1.5 rounded-full text-sm transition-colors ${
            activeGenre === genre
              ? "bg-cyan text-navy font-semibold"
              : "bg-white/5 text-light/60 border border-white/10 hover:border-cyan/30 hover:text-light"
          }`}
        >
          {genre}
        </button>
      ))}
    </div>
  );
}
