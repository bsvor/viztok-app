"use client";

export function VideoPlayer() {
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
