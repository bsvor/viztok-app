export default function UploadLoading() {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <div className="h-8 w-36 bg-white/5 rounded animate-pulse mb-2" />
        <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
      </div>
      <div className="rounded-xl border border-white/10 bg-white/[0.02] p-6 space-y-5">
        <div>
          <div className="h-4 w-12 bg-white/5 rounded animate-pulse mb-1.5" />
          <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-20 bg-white/5 rounded animate-pulse mb-1.5" />
          <div className="h-24 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-14 bg-white/5 rounded animate-pulse mb-1.5" />
          <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div>
          <div className="h-4 w-20 bg-white/5 rounded animate-pulse mb-1.5" />
          <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
        </div>
        <div className="h-10 w-full bg-white/5 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}
