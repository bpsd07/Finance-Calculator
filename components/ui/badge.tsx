import React from "react";
import { clsx } from "clsx";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "accent" | "success" | "warning";
  className?: string;
}

export function Badge({ children, variant = "default", className = "" }: BadgeProps) {
  const variants = {
    default: "bg-surface-secondary text-foreground-secondary border border-border",
    accent: "bg-accent-subtle text-accent",
    success: "bg-emerald-500/10 text-success",
    warning: "bg-amber-500/10 text-warning",
  };

  return (
    <span className={clsx("inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full", variants[variant], className)}>
      {children}
    </span>
  );
}
