"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Info } from "lucide-react";

interface InfoTooltipProps {
  title: string;
  content: string;
  limit?: string;
  example?: string;
  tip?: string;
}

let tooltipCounter = 0;

export function InfoTooltip({ title, content, limit, example, tip }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number; placement: "top" | "bottom" } | null>(null);
  const [tooltipId] = useState(() => `tooltip-${++tooltipCounter}`);

  const updatePosition = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const tooltipWidth = 288;
    const tooltipHeightEstimate = 88;
    const margin = 8;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const centeredLeft = rect.left + rect.width / 2;
    const clampedLeft = Math.max(
      margin + tooltipWidth / 2,
      Math.min(viewportWidth - margin - tooltipWidth / 2, centeredLeft)
    );
    const spaceAbove = rect.top;
    const spaceBelow = viewportHeight - rect.bottom;
    const placement = spaceAbove < tooltipHeightEstimate + 16 && spaceBelow > spaceAbove ? "bottom" : "top";

    setPosition({
      top: placement === "bottom" ? rect.bottom + 12 : rect.top - 12,
      left: clampedLeft,
      placement,
    });
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    updatePosition();

    const handleViewportChange = () => updatePosition();
    window.addEventListener("resize", handleViewportChange);
    window.addEventListener("scroll", handleViewportChange, true);

    return () => {
      window.removeEventListener("resize", handleViewportChange);
      window.removeEventListener("scroll", handleViewportChange, true);
    };
  }, [isOpen, updatePosition]);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-describedby={isOpen ? tooltipId : undefined}
        className="inline-flex items-center justify-center w-4 h-4 rounded-md text-foreground-tertiary hover:text-accent hover:bg-accent-subtle transition-all duration-150"
        aria-label={`Learn more about ${title}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      {isOpen && position && typeof document !== "undefined" && createPortal(
        <div
          id={tooltipId}
          role="tooltip"
          className="z-[9999] w-72 max-w-[calc(100vw-1rem)] pointer-events-none"
          style={{
            position: "fixed",
            top: position.top,
            left: position.left,
            transform: position.placement === "bottom" ? "translate(-50%, 0)" : "translate(-50%, -100%)",
          }}
        >
          <div className="tooltip-content">
            <p className="text-sm font-semibold text-foreground mb-1">{title}</p>
            <p className="text-xs text-foreground-secondary leading-relaxed mb-2">{content}</p>
            {limit && (
              <p className="text-xs text-accent font-medium mb-1">Limit: {limit}</p>
            )}
            {example && (
              <p className="text-xs text-foreground-tertiary mb-1">Example: {example}</p>
            )}
            {tip && (
              <p className="text-xs text-foreground-tertiary italic mt-1">💡 {tip}</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
