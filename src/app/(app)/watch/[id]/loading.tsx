export default function WatchLoading() {
  return (
    <div className="max-w-5xl">
      <div className="aspect-video bg-white/5 rounded-xl animate-pulse" />
      <div className="mt-6 space-y-3">
        <div className="flex gap-3">
          <div className="h-5 w-16 bg-white/5 rounded animate-pulse" />
          <div className="h-5 w-20 bg-white/5 rounded animate-pulse" />
        </div>
        <div className="h-8 w-64 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-40 bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-full bg-white/5 rounded animate-pulse" />
        <div className="h-4 w-3/4 bg-white/5 rounded animate-pulse" />
      </div>
    </div>
  );
}
