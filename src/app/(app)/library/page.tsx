import { SavedList } from "@/components/library/saved-list";

export default function LibraryPage() {
  // In v1, show empty state. Later this will fetch from Supabase saved_videos table.
  const savedVideos: [] = [];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Your Library</h1>
        <p className="text-light/50">Shows and films you&apos;ve saved</p>
      </div>
      <SavedList videos={savedVideos} />
    </div>
  );
}
