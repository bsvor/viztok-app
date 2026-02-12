export default function SettingsLoading() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="h-8 w-36 bg-white/5 rounded animate-pulse mb-2" />
        <div className="h-4 w-48 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="space-y-6">
        {/* Account card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="h-5 w-20 bg-white/5 rounded animate-pulse mb-4" />
          <div className="h-4 w-12 bg-white/5 rounded animate-pulse mb-1" />
          <div className="h-5 w-48 bg-white/5 rounded animate-pulse" />
        </div>
        {/* Subscription card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="h-5 w-28 bg-white/5 rounded animate-pulse mb-4" />
          <div className="h-8 w-20 bg-white/5 rounded animate-pulse mb-3" />
          <div className="h-4 w-56 bg-white/5 rounded animate-pulse mb-4" />
          <div className="flex gap-4">
            <div className="flex-1 h-36 bg-white/5 rounded-lg animate-pulse" />
            <div className="flex-1 h-36 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
        {/* Password card */}
        <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="h-5 w-36 bg-white/5 rounded animate-pulse mb-4" />
          <div className="space-y-4">
            <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
            <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
            <div className="h-10 w-32 bg-white/5 rounded-lg animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
}
