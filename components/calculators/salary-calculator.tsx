"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IndianRupee, Brain, Sparkles, Copy, BarChart3, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { NumericInput } from "@/components/ui/numeric-input";
import { SalaryChart } from "@/components/charts/salary-chart";
import { calculateSalaryBreakdown, type SalaryComponent } from "@/lib/calculators/salary";
import { useToast } from "@/components/ui/toast";

const tooltips: Record<string, { title: string; content: string }> = {
  basic: { title: "Basic Salary", content: "~40% of CTC. This is the core component and is fully taxable. Used to calculate EPF, gratuity, and other benefits." },
  hra: { title: "HRA", content: "House Rent Allowance — ~50% of basic for metro cities. Partially exempt from tax under Section 10(13A) if you pay rent." },
  special: { title: "Special Allowance", content: "The balancing component after allocating basic, HRA, and other heads. Fully taxable." },
  epf: { title: "EPF", content: "Employee Provident Fund. 12% of basic each from employer and employee. Employer EPF is over and above CTC." },
  gratuity: { title: "Gratuity", content: "A lump sum paid after 5+ years of service. ~4.81% of basic. Part of employer cost, over and above gross salary." },
  pt: { title: "Professional Tax", content: "State government tax on employment. Varies by state. Typically ₹200-300/month. Karnataka and Maharashtra have the highest." },
};

export function SalaryCalculator() {
  const [ctc, setCtc] = useState(1200000);
  const [regime, setRegime] = useState<"new" | "old">("new");
  const [deduction80C, setDeduction80C] = useState(150000);
  const [deduction80D, setDeduction80D] = useState(25000);
  const [view, setView] = useState<"monthly" | "annual">("monthly");
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { showToast } = useToast();

  const result = calculateSalaryBreakdown(ctc, regime, deduction80C, deduction80D);

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "SALARY",
          inputs: { ctc, taxRegime: regime, deductions80C: deduction80C },
          results: {
            monthlyInHand: result.monthlyInHand,
            grossAnnual: result.grossAnnual,
            takeHomePercent: result.takeHomePercent,
            employerEPF: result.employerEPF,
            employeeEPF: result.employeeEPF,
            incomeTax: result.incomeTax,
          },
          language: "en",
        }),
      });
      const data = await res.json();
      setExplanation(data.explanation || "Unable to generate explanation.");
    } catch {
      setExplanation("Our AI advisor is currently unavailable. Please try again later.");
    }
    setIsExplaining(false);
  }, [ctc, regime, deduction80C, result]);

  const handleCopy = useCallback(async () => {
    const monthly = result.monthlyInHand;
    const text = `💰 Salary Intelligence — FinAI India\nCTC: ₹${ctc.toLocaleString("en-IN")}\nMonthly In-Hand: ₹${monthly.toLocaleString("en-IN")}\nTake Home: ${result.takeHomePercent}%\nIncome Tax: ₹${result.incomeTax.toLocaleString("en-IN")}\nEPF: ₹${(result.employerEPF + result.employeeEPF).toLocaleString("en-IN")}`;
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  }, [ctc, result, showToast]);

  const safe = (v: number) => isNaN(v) || !isFinite(v) ? 0 : v;
  const pct = (v: number) => ctc > 0 ? Math.round((safe(v) / ctc) * 100) : 0;
  const monthDiv = view === "monthly" ? 12 : 1;

  const tooltipKeyMap: Record<string, string> = {
    "Basic Salary": "basic",
    "HRA": "hra",
    "Special Allowance": "special",
    "Employer EPF": "epf",
    "Employee EPF": "epf",
    "Gratuity": "gratuity",
    "Professional Tax": "pt",
  };

  const ComponentRow = ({ comp }: { comp: SalaryComponent }) => {
    const monthVal = view === "monthly" ? Math.round(comp.amount / 12) : comp.amount;
    const barWidth = pct(comp.amount);
    const barColor = comp.type === "earning" ? "bg-accent" : comp.type === "tax" ? "bg-danger" : "bg-foreground-tertiary";
    const tk = tooltipKeyMap[comp.label];
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-1.5 truncate">
              <span className="text-xs font-medium text-foreground truncate">{comp.label}</span>
              {tk && tooltips[tk] && (
                <InfoTooltip {...tooltips[tk]} />
              )}
            </div>
            <span className="text-xs font-semibold text-foreground shrink-0 ml-2">
              ₹{safe(monthVal).toLocaleString("en-IN")}
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-surface-secondary overflow-hidden">
            <div className={`h-full rounded-full ${barColor} transition-all duration-500`} style={{ width: `${Math.min(barWidth, 100)}%` }} />
          </div>
          <p className="text-[10px] text-foreground-tertiary mt-0.5">{comp.description}</p>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Salary Intelligence</h1>
          <p className="text-foreground-secondary mt-1">Complete CTC breakdown to monthly in-hand take-home pay</p>
        </div>
        <div className="segmented-control">
          <button onClick={() => setView("monthly")} className={`segmented-option ${view === "monthly" ? "active" : ""}`}>Monthly</button>
          <button onClick={() => setView("annual")} className={`segmented-option ${view === "annual" ? "active" : ""}`}>Annual</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Inputs */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">CTC & Deductions</h3>
            <div className="space-y-5">
              <div>
                <label className="text-sm text-foreground-secondary mb-2 block">Cost to Company (CTC)</label>
                <NumericInput value={ctc} onChange={setCtc} min={0} max={5000000} className="input input-lg" />
                <input type="range" min={0} max={5000000} step={50000} value={ctc} onChange={(e) => setCtc(Number(e.target.value))} className="w-full mt-2" />
                <div className="flex gap-2 mt-2">
                  {[500000, 1000000, 1500000, 2000000, 3000000, 5000000].map(v => (
                    <button key={v} onClick={() => setCtc(v)} className={`px-2.5 py-1 text-[10px] font-medium rounded-md transition-all ${ctc === v ? "bg-accent text-white" : "bg-surface-secondary text-foreground-tertiary hover:text-foreground"}`}>₹{(v / 100000).toFixed(0)}L</button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground-secondary mb-2 block">Tax Regime</label>
                <div className="segmented-control">
                  <button onClick={() => setRegime("new")} className={`segmented-option ${regime === "new" ? "active" : ""}`}>New Regime</button>
                  <button onClick={() => setRegime("old")} className={`segmented-option ${regime === "old" ? "active" : ""}`}>Old Regime</button>
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground-secondary mb-2 block">80C Investments (PPF, ELSS, LIC)</label>
                <input type="range" min={0} max={150000} step={5000} value={deduction80C} onChange={(e) => setDeduction80C(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-foreground-tertiary">₹0</span>
                  <span className="text-[10px] text-foreground font-medium">₹{deduction80C.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-foreground-tertiary">₹1,50,000</span>
                </div>
              </div>

              <div>
                <label className="text-sm text-foreground-secondary mb-2 block">80D Health Insurance</label>
                <input type="range" min={0} max={75000} step={5000} value={deduction80D} onChange={(e) => setDeduction80D(Number(e.target.value))} className="w-full" />
                <div className="flex justify-between mt-1">
                  <span className="text-[10px] text-foreground-tertiary">₹0</span>
                  <span className="text-[10px] text-foreground font-medium">₹{deduction80D.toLocaleString("en-IN")}</span>
                  <span className="text-[10px] text-foreground-tertiary">₹75,000</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Component Breakdown */}
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Salary Structure</h3>
            <div className="space-y-0">
              {result.components.map((comp, i) => (
                <ComponentRow key={i} comp={comp} />
              ))}
            </div>
            <div className="divider my-3" />
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs font-medium text-foreground">{view === "monthly" ? "Monthly In-Hand" : "Annual In-Hand"}</span>
              <span className="text-base font-bold text-accent">
                ₹{safe(view === "monthly" ? result.monthlyInHand : result.annualInHand).toLocaleString("en-IN")}
              </span>
            </div>
          </Card>
        </div>

        {/* Right — Summary */}
        <div className="lg:col-span-1">
          <div className="summary-panel space-y-5">
            <div className="text-center">
              <p className="text-xs text-foreground-tertiary mb-1">{view === "monthly" ? "Monthly" : "Annual"} Take-Home</p>
              <p className="text-3xl font-bold text-foreground">₹<AnimatedCounter value={view === "monthly" ? result.monthlyInHand : result.annualInHand} /></p>
            </div>

            <div className="divider" />

            <div className="flex items-center justify-center gap-2">
              <div className="flex-1 p-3 rounded-lg bg-surface-secondary text-center">
                <p className="text-[10px] text-foreground-tertiary">Gross {view === "monthly" ? "Monthly" : "Annual"}</p>
                <p className="text-sm font-semibold text-foreground">₹{safe(view === "monthly" ? result.grossMonthly : result.grossAnnual).toLocaleString("en-IN")}</p>
              </div>
              <div className="flex-1 p-3 rounded-lg bg-surface-secondary text-center">
                <p className="text-[10px] text-foreground-tertiary">Take-Home %</p>
                <p className="text-sm font-semibold text-accent">{safe(result.takeHomePercent)}%</p>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between text-xs">
                <span className="text-foreground-tertiary">Income Tax</span>
                <span className="font-medium text-foreground">₹{safe(result.incomeTax / monthDiv).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-tertiary">Employee EPF</span>
                <span className="font-medium text-foreground">₹{safe(result.employeeEPF / monthDiv).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-tertiary">Employer EPF</span>
                <span className="font-medium text-foreground">₹{safe(result.employerEPF / monthDiv).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-tertiary">Professional Tax</span>
                <span className="font-medium text-foreground">₹{safe(result.professionalTax / monthDiv).toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-foreground-tertiary">Gratuity</span>
                <span className="font-medium text-foreground">₹{safe(result.gratuity / monthDiv).toLocaleString("en-IN")}</span>
              </div>
              <div className="divider" />
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-foreground">Total Deductions</span>
                <span className="text-danger">₹{safe(result.totalDeductions / monthDiv).toLocaleString("en-IN")}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Button onClick={handleExplain} isLoading={isExplaining} className="w-full" size="md">
                <Brain className="w-4 h-4" /> AI Explain
              </Button>
              <Button variant="secondary" onClick={handleCopy} className="w-full" size="md">
                <Copy className="w-4 h-4" /> Copy Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      {explanation && (
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
          <Card className="ai-insight">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">AI Advisor</span>
              <Badge variant="accent">AI</Badge>
            </div>
            <p className="text-sm text-foreground-secondary leading-relaxed whitespace-pre-line">{explanation}</p>
          </Card>
        </motion.div>
      )}

      {/* Chart */}
      <div className="mt-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">Salary Composition</h3>
          <SalaryChart components={result.components} />
        </Card>
      </div>
    </div>
  );
}
