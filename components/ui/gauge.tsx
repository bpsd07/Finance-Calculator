"use client";

import React from "react";

interface GaugeProps {
  value: number; // 0-100
  label?: string;
  size?: "sm" | "md" | "lg";
  variant?: "emerald" | "amber" | "rose";
}

const sizeMap = {
  sm: { width: 80, stroke: 6, fontSize: "text-xs", valueSize: "text-base" },
  md: { width: 100, stroke: 8, fontSize: "text-xs", valueSize: "text-xl" },
  lg: { width: 130, stroke: 10, fontSize: "text-sm", valueSize: "text-2xl" },
};

const colorMap = {
  emerald: { track: "#10b981", bg: "rgba(16,185,129,0.08)" },
  amber: { track: "#f59e0b", bg: "rgba(245,158,11,0.08)" },
  rose: { track: "#f43f5e", bg: "rgba(244,63,94,0.08)" },
};

export function Gauge({ value, label, size = "md", variant = "emerald" }: GaugeProps) {
  const config = sizeMap[size];
  const colors = colorMap[variant];
  const radius = (config.width - config.stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (Math.min(value, 100) / 100) * circumference;

  const riskLabel =
    value <= 33 ? "Low Risk" : value <= 66 ? "Moderate" : "High Risk";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={config.width} height={config.width} className="gauge-ring">
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={colors.bg}
          strokeWidth={config.stroke}
        />
        <circle
          cx={config.width / 2}
          cy={config.width / 2}
          r={radius}
          fill="none"
          stroke={colors.track}
          strokeWidth={config.stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 1.5s cubic-bezier(0.16, 1, 0.3, 1)" }}
        />
      </svg>
      <span className={`${config.valueSize} font-bold text-white`}>
        {Math.round(value)}%
      </span>
      {label && <span className={`${config.fontSize} text-gray-500`}>{label}</span>}
      <span className={`text-[10px] font-medium uppercase tracking-wider ${
        variant === "emerald" ? "text-emerald-400" : variant === "amber" ? "text-amber-400" : "text-rose-400"
      }`}>
        {riskLabel}
      </span>
    </div>
  );
}
