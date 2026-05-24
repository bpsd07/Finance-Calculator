"use client";

import React, { useRef, useCallback } from "react";
import { Download } from "lucide-react";
import html2canvas from "html2canvas";
import { useToast } from "@/components/ui/toast";

interface ChartContainerProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartContainer({ title, children, className = "" }: ChartContainerProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleDownload = useCallback(async () => {
    if (!ref.current) return;
    try {
      const canvas = await html2canvas(ref.current, {
        backgroundColor: document.documentElement.getAttribute("data-theme") === "dark" ? "#030712" : "#f8fafc",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `finai-${title.toLowerCase().replace(/\s+/g, "-")}.png`;
      link.href = canvas.toDataURL();
      link.click();
      showToast("Chart downloaded!", "success");
    } catch {
      showToast("Failed to download chart", "error");
    }
  }, [title, showToast]);

  return (
    <div className={`relative ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-foreground/60">{title}</h4>
        <button
          onClick={handleDownload}
          className="p-1.5 rounded-lg text-foreground/50 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all"
          aria-label="Download chart"
        >
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div ref={ref}>{children}</div>
    </div>
  );
}
