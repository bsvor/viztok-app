export default function FeedLoading() {
  return (
    <div>
      <div className="mb-8">
        <div className="h-8 w-48 bg-white/5 rounded animate-pulse mb-2" />
        <div className="h-4 w-72 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="mb-8">
        <div className="h-6 w-36 bg-white/5 rounded animate-pulse mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="aspect-[2/3] bg-white/5 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
