"use client";

import { Button } from "@/components/ui/button";
import { IndianRupee, AlertTriangle } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-14 h-14 rounded-xl bg-danger-subtle flex items-center justify-center text-danger mx-auto mb-5">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h1 className="text-xl font-bold tracking-tight mb-2">Salary Calculator Error</h1>
        <p className="text-sm text-foreground-secondary mb-6">
          Something went wrong with the salary calculator. Please try again.
        </p>
        <div className="flex gap-3 justify-center">
          <Button onClick={reset} size="md">Try Again</Button>
          <a href="/">
            <Button variant="secondary" size="md">Back to Home</Button>
          </a>
        </div>
      </div>
    </div>
  );
}
