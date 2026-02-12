"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function UploadError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-heading font-bold mb-2">Upload</h1>
        <p className="text-light/50">Something went wrong.</p>
      </div>
      <Card>
        <div className="text-center py-8">
          <p className="text-light/50 text-sm mb-4">
            We couldn&apos;t load the upload page. Please try again.
          </p>
          <Button onClick={reset}>Try Again</Button>
        </div>
      </Card>
    </div>
  );
}
