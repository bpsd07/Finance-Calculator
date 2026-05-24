"use client";

import React, { useState, useRef, useEffect } from "react";
import { Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface InfoTooltipProps {
  title: string;
  content: string;
  limit?: string;
  example?: string;
  tip?: string;
}

export function InfoTooltip({ title, content, limit, example, tip }: InfoTooltipProps) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative inline-flex">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-center w-4 h-4 rounded-md text-foreground-tertiary hover:text-accent hover:bg-accent-subtle transition-all duration-150"
        aria-label={`Learn more about ${title}`}
      >
        <Info className="w-3.5 h-3.5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 bottom-full mb-2 z-50 w-72"
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
