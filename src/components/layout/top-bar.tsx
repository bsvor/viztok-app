import { Avatar } from "@/components/ui/avatar";

interface TopBarProps {
  email?: string;
}

export function TopBar({ email }: TopBarProps) {
  return (
    <header className="sticky top-0 z-30 bg-navy/90 backdrop-blur-sm border-b border-white/10 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-light/30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search shows, movies, directors..."
              className="w-full bg-white/5 border border-white/10 text-light placeholder:text-light/30 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:border-cyan transition-colors"
            />
          </div>
        </div>
        <div className="flex items-center gap-3 ml-4">
          <span className="text-sm text-light/50 hidden sm:block">{email}</span>
          <Avatar email={email} />
        </div>
      </div>
    </header>
  );
}
