"use client";

import React, { useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, AreaChart, Area,
} from "recharts";
import { Card } from "@/components/ui/card";

interface TaxChartProps {
  oldRegime: {
    totalTax: number;
    taxableIncome: number;
    slabBreakdown: { slab: string; rate: number; taxableAmount: number; taxAmount: number }[];
  };
  newRegime: {
    totalTax: number;
    taxableIncome: number;
    slabBreakdown: { slab: string; rate: number; taxableAmount: number; taxAmount: number }[];
  };
  deductionBreakdown?: { name: string; value: number; color: string }[];
  effectiveOld: number;
  effectiveNew: number;
}

type ChartView = "comparison" | "slabs" | "effective";

const COLORS = ["#0f766e", "#14b8a6", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"];
const SLAB_COLORS = ["#e2e8f0", "#cbd5e1", "#94a3b8", "#64748b", "#475569", "#334155"];

export function TaxChart({ oldRegime, newRegime, deductionBreakdown, effectiveOld, effectiveNew }: TaxChartProps) {
  const [view, setView] = useState<ChartView>("comparison");

  const tabs: { key: ChartView; label: string }[] = [
    { key: "comparison", label: "Comparison" },
    { key: "slabs", label: "Slab Analysis" },
    { key: "effective", label: "Effective Rate" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value.toLocaleString("en-IN")}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <div className="flex gap-1 mb-6 bg-surface-secondary rounded-lg p-0.5 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setView(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all duration-150 ${
              view === tab.key
                ? "bg-surface text-foreground border border-border shadow-sm"
                : "text-foreground-secondary hover:text-foreground"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {view === "comparison" && (
        <div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={[{ name: "Annual Tax Payable", Old: oldRegime.totalTax, New: newRegime.totalTax }]} barSize={48}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--color-text-tertiary)" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="Old" fill="#94a3b8" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={800} />
              <Bar dataKey="New" fill="var(--color-accent)" radius={[4, 4, 0, 0]} isAnimationActive animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-foreground-secondary">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: "#94a3b8" }} />
              Old Regime
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm" style={{ background: "var(--color-accent)" }} />
              New Regime
            </div>
          </div>

          <div className="divider my-4" />

          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <p className="text-xs text-foreground-secondary">Old Regime Tax</p>
              <p className="text-lg font-semibold text-foreground">₹{oldRegime.totalTax.toLocaleString("en-IN")}</p>
            </div>
            <div>
              <p className="text-xs text-foreground-secondary">New Regime Tax</p>
              <p className="text-lg font-semibold text-foreground">₹{newRegime.totalTax.toLocaleString("en-IN")}</p>
            </div>
          </div>
        </div>
      )}

      {view === "slabs" && (
        <div>
          <div className="mb-4">
            <p className="text-xs text-foreground-secondary mb-3">New Regime — Slab-wise Tax Breakdown</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={newRegime.slabBreakdown.filter(s => s.taxableAmount > 0)} barSize={28} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" horizontal={false} />
                <XAxis type="number" stroke="var(--color-text-tertiary)" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `₹${(v / 1000).toFixed(0)}K`} />
                <YAxis type="category" dataKey="slab" stroke="var(--color-text-tertiary)" tick={{ fontSize: 10 }} width={90} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="taxAmount" fill="var(--color-accent)" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="divider my-4" />

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {newRegime.slabBreakdown.filter(s => s.taxableAmount > 0).map((slab, i) => (
              <div key={i} className="text-center p-2 rounded-lg bg-surface-secondary">
                <p className="text-[10px] text-foreground-tertiary">{slab.slab}</p>
                <p className="text-xs font-medium text-foreground mt-0.5">{slab.rate}%</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {view === "effective" && (
        <div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={[
              { name: "Old Regime", rate: effectiveOld },
              { name: "New Regime", rate: effectiveNew },
            ]}>
              <defs>
                <linearGradient id="oldGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#94a3b8" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#94a3b8" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="newGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-accent)" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="var(--color-accent)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
              <XAxis dataKey="name" stroke="var(--color-text-tertiary)" tick={{ fontSize: 12 }} />
              <YAxis stroke="var(--color-text-tertiary)" tick={{ fontSize: 11 }} tickFormatter={(v: number) => `${v.toFixed(1)}%`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="rate" stroke="#94a3b8" fill="url(#oldGradient)" strokeWidth={2} dot={{ r: 5, fill: "#94a3b8" }} />
              <Area type="monotone" dataKey="rate" stroke="var(--color-accent)" fill="url(#newGradient)" strokeWidth={2} dot={{ r: 5, fill: "var(--color-accent)" }} />
            </AreaChart>
          </ResponsiveContainer>

          <div className="grid grid-cols-2 gap-4 mt-4 text-center">
            <div className="p-3 rounded-lg bg-surface-secondary">
              <p className="text-xs text-foreground-secondary">Old Regime</p>
              <p className="text-lg font-semibold text-foreground">{effectiveOld.toFixed(1)}%</p>
              <p className="text-[10px] text-foreground-tertiary">effective tax rate</p>
            </div>
            <div className="p-3 rounded-lg bg-surface-secondary">
              <p className="text-xs text-foreground-secondary">New Regime</p>
              <p className="text-lg font-semibold text-foreground">{effectiveNew.toFixed(1)}%</p>
              <p className="text-[10px] text-foreground-tertiary">effective tax rate</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
