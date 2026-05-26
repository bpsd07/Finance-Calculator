"use client";

import { Button } from "@/components/ui/button";
import { Calculator, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-xl bg-danger-subtle flex items-center justify-center text-danger mx-auto mb-6">
          <AlertTriangle className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-3">Something went wrong</h1>
        <p className="text-foreground-secondary mb-2">
          An unexpected error occurred. Please try again.
        </p>
        {error.digest && (
          <p className="text-xs text-foreground-tertiary mb-6">Error ID: {error.digest}</p>
        )}
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="lg">Try Again</Button>
          <a href="/">
            <Button variant="secondary" size="lg">Back to Home</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
