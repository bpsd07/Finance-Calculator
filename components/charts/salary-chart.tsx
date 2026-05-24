"use client";

import React from "react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
} from "recharts";

interface SalaryChartProps {
  components: { label: string; amount: number; type: string }[];
}

const COLORS: Record<string, string> = {
  earning: "#0f766e",
  deduction: "#94a3b8",
  tax: "#dc2626",
};

export function SalaryChart({ components }: SalaryChartProps) {
  const data = components
    .filter(c => c.amount > 0)
    .map(c => ({
      name: c.label,
      value: c.amount,
      color: COLORS[c.type] || "#94a3b8",
    }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground">{payload[0].name}</p>
        <p className="text-sm font-semibold text-foreground mt-0.5">
          ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%" cy="50%"
          innerRadius={60} outerRadius={100}
          paddingAngle={2}
          dataKey="value"
          stroke="none"
          isAnimationActive
          animationDuration={800}
        >
          {data.map((entry, i) => (
            <Cell key={i} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend
          formatter={(value) => <span style={{ color: "var(--color-text-secondary)", fontSize: "12px" }}>{value}</span>}
          wrapperStyle={{ paddingTop: "8px" }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
