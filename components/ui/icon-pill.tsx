import React from "react";

interface IconPillProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  variant?: "emerald" | "cyan" | "amber" | "rose" | "violet";
}

export function IconPill({ icon, label, value, variant = "emerald" }: IconPillProps) {
  const glowMap = {
    emerald: "shadow-emerald-500/20",
    cyan: "shadow-cyan-500/20",
    amber: "shadow-amber-500/20",
    rose: "shadow-rose-500/20",
    violet: "shadow-violet-500/20",
  };

  return (
    <div
      className={`glass-panel rounded-xl p-4 flex items-center gap-4 border border-card-border hover:border-white/10 transition-all duration-300 ${glowMap[variant]}`}
    >
      <div className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-emerald-400 shrink-0">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-xs text-gray-500 uppercase tracking-wider truncate">{label}</p>
        <p className="text-lg font-bold text-white truncate">{value}</p>
      </div>
    </div>
  );
}
