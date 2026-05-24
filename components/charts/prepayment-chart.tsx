"use client";

import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

interface PrepaymentChartProps {
  scheduleComparison: { year: number; originalBalance: number; prepaymentBalance: number }[];
}

export function PrepaymentChart({ scheduleComparison }: PrepaymentChartProps) {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground mb-1">Year {label}</p>
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
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={scheduleComparison} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
          <XAxis dataKey="year" stroke="var(--color-chart-text)" tick={{ fontSize: 12 }} tickFormatter={(v) => `Y${v}`} />
          <YAxis stroke="var(--color-chart-text)" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
          <Tooltip content={<CustomTooltip />} />
          <Legend formatter={(value) => <span style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>{value}</span>} />
          <Line type="monotone" dataKey="originalBalance" stroke="#f43f5e" strokeWidth={2} strokeDasharray="5 5" dot={false} name="Without Prepayment" />
          <Line type="monotone" dataKey="prepaymentBalance" stroke="var(--color-accent)" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: "var(--color-accent)" }} name="With Prepayment" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
