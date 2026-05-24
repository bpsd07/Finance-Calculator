import React from "react";

interface SkeletonProps {
  className?: string;
  variant?: "text" | "circular" | "rectangular";
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className = "", variant = "text", width, height }: SkeletonProps) {
  const base = "skeleton-shimmer rounded-lg";
  const variants = {
    text: "h-4 w-full rounded-md",
    circular: "rounded-full",
    rectangular: "rounded-xl",
  };

  return (
    <div
      className={`${base} ${variants[variant]} ${className}`}
      style={{ width, height }}
    />
  );
}

export function CalculatorSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="glass-panel rounded-2xl p-8">
        <Skeleton className="h-6 w-32 mb-8" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="mb-6">
            <Skeleton className="h-4 w-24 mb-3" />
            <Skeleton className="h-2 w-full mb-2" />
            <div className="flex justify-between">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-3 w-12" />
            </div>
          </div>
        ))}
      </div>
      <div className="glass-panel rounded-2xl p-8">
        <Skeleton className="h-6 w-28 mb-6" />
        <Skeleton variant="circular" width={120} height={120} className="mx-auto mb-6" />
        <div className="grid grid-cols-2 gap-3 mb-6">
          <Skeleton className="h-20 rounded-xl" />
          <Skeleton className="h-20 rounded-xl" />
        </div>
        <Skeleton className="h-10 w-full rounded-xl" />
      </div>
    </div>
  );
}
