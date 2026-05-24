"use client";

import React, { useRef, useCallback } from "react";
import { motion } from "framer-motion";
import html2canvas from "html2canvas";
import { Calculator, Download, Share2 } from "lucide-react";
import { Button } from "./button";
import { useToast } from "./toast";

interface ShareCardProps {
  title: string;
  values: { label: string; value: string }[];
  type: "emi" | "sip" | "tax" | "salary" | "prepayment";
  children?: React.ReactNode;
}

const typeGradients = {
  emi: "from-emerald-600 via-emerald-500 to-cyan-500",
  sip: "from-violet-600 via-violet-500 to-emerald-500",
  tax: "from-amber-600 via-amber-500 to-rose-500",
  salary: "from-cyan-600 via-cyan-500 to-blue-500",
  prepayment: "from-rose-600 via-rose-500 to-emerald-500",
};

export function ShareCard({ title, values, type, children }: ShareCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { showToast } = useToast();

  const handleDownload = useCallback(async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: "#030712",
        scale: 2,
        useCORS: true,
      });
      const link = document.createElement("a");
      link.download = `finai-${type}-result.png`;
      link.href = canvas.toDataURL();
      link.click();
      showToast("Image downloaded!", "success");
    } catch {
      showToast("Failed to generate image", "error");
    }
  }, [type, showToast]);

  const handleShare = useCallback(async () => {
    const text = `📊 ${title}\n\n${values.map((v) => `${v.label}: ${v.value}`).join("\n")}\n\nPowered by FinAI India`;
    try {
      if (navigator.share) {
        await navigator.share({ title, text });
      } else {
        await navigator.clipboard.writeText(text);
        showToast("Copied to clipboard!", "success");
      }
    } catch {
      showToast("Share cancelled", "info");
    }
  }, [title, values, showToast]);

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${typeGradients[type]} p-6 shadow-2xl`}
      >
        <div className="absolute inset-0 bg-black/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-4">
            <Calculator className="w-5 h-5 text-white/80" />
            <span className="text-sm font-semibold text-white/80">FinAI India</span>
          </div>
          <h3 className="text-lg font-bold text-white mb-4">{title}</h3>
          <div className="space-y-2">
            {values.map((v) => (
              <div key={v.label} className="flex justify-between items-center">
                <span className="text-sm text-white/70">{v.label}</span>
                <span className="text-sm font-bold text-white">{v.value}</span>
              </div>
            ))}
          </div>
          {children && <div className="mt-4">{children}</div>}
          <div className="mt-6 pt-4 border-t border-white/10 text-center">
            <span className="text-[10px] text-white/40 uppercase tracking-wider">
              aifinancecalculator.in
            </span>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" size="sm" onClick={handleDownload} className="flex-1">
          <Download className="w-4 h-4" /> Download
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare} className="flex-1">
          <Share2 className="w-4 h-4" /> Share
        </Button>
      </div>
    </div>
  );
}
