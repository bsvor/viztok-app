"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function WatchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  return (
    <div className="max-w-4xl">
      <Card>
        <div className="text-center py-8">
          <p className="text-light/50 text-sm mb-4">
            We couldn&apos;t load this video. It may have been removed or is still processing.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={reset}>Try Again</Button>
            <Button variant="secondary" onClick={() => router.push("/feed")}>
              Back to Feed
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
