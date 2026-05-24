"use client";

import React from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

interface EMIChartProps {
  principalPercent: number;
  interestPercent: number;
  amortizationSchedule: { year: number; remainingBalance: number }[];
}

export function EMIChart({ principalPercent, interestPercent, amortizationSchedule }: EMIChartProps) {
  const pieData = [
    { name: "Principal", value: principalPercent, color: "#10b981" },
    { name: "Interest", value: interestPercent, color: "#ef4444" },
  ];

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground mb-0.5">{label || payload[0].name}</p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-xs" style={{ color: entry.color }}>
            {entry.name}: {entry.value.toFixed(1)}%
          </p>
        ))}
      </div>
    );
  };

  const BalanceTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload) return null;
    return (
      <div className="tooltip-content">
        <p className="text-xs font-medium text-foreground mb-0.5">Year {label}</p>
        <p className="text-xs text-foreground-secondary">
          Balance: ₹{payload[0].value.toLocaleString("en-IN")}
        </p>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h4 className="text-sm font-medium text-foreground-secondary mb-4">Principal vs Interest Split</h4>
        <div className="flex justify-center">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none" isAnimationActive animationDuration={800}>
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend formatter={(value) => <span style={{ color: "var(--color-text-secondary)", fontSize: "13px" }}>{value}</span>} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div>
        <h4 className="text-sm font-medium text-foreground-secondary mb-4">Remaining Loan Balance Over Years</h4>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={amortizationSchedule} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--color-chart-grid)" vertical={false} />
            <XAxis dataKey="year" stroke="var(--color-chart-text)" tick={{ fontSize: 12 }} />
            <YAxis stroke="var(--color-chart-text)" tick={{ fontSize: 12 }} tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`} />
            <Tooltip content={<BalanceTooltip />} />
            <Line type="monotone" dataKey="remainingBalance" stroke="var(--color-accent)" strokeWidth={2} dot={false} activeDot={{ r: 5, fill: "var(--color-accent)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
