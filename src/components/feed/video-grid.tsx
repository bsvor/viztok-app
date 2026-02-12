interface VideoGridProps {
  children: React.ReactNode;
}

export function VideoGrid({ children }: VideoGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {children}
    </div>
  );
}
