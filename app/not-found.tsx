import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 rounded-xl bg-accent-subtle flex items-center justify-center text-accent mx-auto mb-6">
          <Calculator className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-bold tracking-tight mb-3">404</h1>
        <p className="text-foreground-secondary mb-8">This page doesn&apos;t exist. Try one of our calculators instead.</p>
        <Link href="/">
          <Button size="lg">Back to Home</Button>
        </Link>
      </div>
    </div>
  );
}
