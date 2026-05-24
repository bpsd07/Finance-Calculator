"use client";

import React from "react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

interface SIPChartProps {
  yearlyGrowth: { year: number; totalInvested: number; futureValue: number }[];
}

export function SIPChart({ yearlyGrowth }: SIPChartProps) {
  const data = yearlyGrowth.map((y) => ({
    year: `Y${y.year}`,
    Invested: Math.round(y.totalInvested / 100000),
    "Future Value": Math.round(y.futureValue / 100000),
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    // Reorder: green (Future Value) first since it's visually on top, then yellow (Invested)
    const sorted = [...payload].sort((a, b) => {
      if (a.dataKey === "Future Value") return -1;
      if (b.dataKey === "Future Value") return 1;
      return 0;
    });
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground mb-1">{label}</p>
        {sorted.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: ₹{entry.value}L
          </p>
        ))}
      </div>
    );
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="sipInvestedGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.12} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="sipValueGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
          <XAxis dataKey="year" stroke="var(--color-chart-text)" tick={{ fontSize: 11 }} />
          <YAxis stroke="var(--color-chart-text)" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}L`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            formatter={(value) => <span style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>{value}</span>}
          />
          <Area type="monotone" dataKey="Invested" stroke="#f59e0b" strokeWidth={2} fill="url(#sipInvestedGrad)" />
          <Area type="monotone" dataKey="Future Value" stroke="#10b981" strokeWidth={2} fill="url(#sipValueGrad)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
