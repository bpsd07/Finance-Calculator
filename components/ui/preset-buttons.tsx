import React from "react";

interface PresetButtonsProps {
  options: { label: string; value: number }[];
  currentValue: number;
  onSelect: (value: number) => void;
  className?: string;
}

export function PresetButtons({ options, currentValue, onSelect, className = "" }: PresetButtonsProps) {
  const isSelected = (value: number) => Math.abs(currentValue - value) / Math.max(currentValue, value) < 0.05;

  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {options.map((opt) => (
        <button
          key={opt.value}
          onClick={() => onSelect(opt.value)}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 border ${
            isSelected(opt.value)
              ? "bg-accent-subtle text-accent border-accent/30"
              : "bg-surface-secondary text-foreground-tertiary border-border hover:text-foreground-secondary hover:border-border-light"
          }`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
