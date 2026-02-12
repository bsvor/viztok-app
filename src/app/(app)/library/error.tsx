"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LibraryError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Library</h1>
        <p className="text-light/50">Something went wrong loading your library.</p>
      </div>
      <Card>
        <div className="text-center py-8">
          <p className="text-light/50 text-sm mb-4">
            We couldn&apos;t load your library right now. Please try again.
          </p>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </Card>
    </div>
  );
}
