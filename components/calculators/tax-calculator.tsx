"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IndianRupee, Brain, Sparkles, ChevronDown, ChevronUp,
  ShieldCheck, Home, GraduationCap, PiggyBank, Users,
  Info, CheckCircle2, ArrowRight, Download, Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { TaxChart } from "@/components/charts/tax-chart";
import { calculateIncomeTax, type TaxInputs, type DeductionEntry } from "@/lib/calculators/tax";
import { taxTooltips } from "@/components/ui/tax-tooltip-data";
import { useToast } from "@/components/ui/toast";
import { safe, safeClamp } from "@/lib/safe";

type CalcMode = "simple" | "advanced";

interface SectionState {
  income: boolean;
  deductions: boolean;
  advanced: boolean;
}

export function TaxCalculator() {
  const [mode, setMode] = useState<CalcMode>("simple");
  const [sections, setSections] = useState<SectionState>({ income: true, deductions: true, advanced: false });
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const { showToast } = useToast();

  // Form inputs
  const [inputs, setInputs] = useState<TaxInputs>({
    grossIncome: 1200000,
    isSalaried: true,
    ageGroup: "below60",
    investment80C: 150000,
    healthInsurance80D: 25000,
    hraReceived: 0,
    nps80CCD1B: 0,
    homeLoanInterest24b: 0,
    educationLoan80E: 0,
    otherIncome: 0,
  });

  const update = <K extends keyof TaxInputs>(key: K, value: TaxInputs[K]) =>
    setInputs(prev => ({ ...prev, [key]: value }));

  const toggleSection = (key: keyof SectionState) =>
    setSections(prev => ({ ...prev, [key]: !prev[key] }));

  const result = calculateIncomeTax(inputs);

  // Pick the better regime breakdown for charts
  const chartRegime = result.betterRegime === "old" ? result.oldRegime : result.newRegime;

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "TAX",
          inputs: { grossIncome: inputs.grossIncome, isSalaried: inputs.isSalaried, deductions80C: inputs.investment80C },
          results: {
            betterRegime: result.betterRegime,
            taxSavings: result.taxSavings,
            oldTax: result.oldRegime.totalTax,
            newTax: result.newRegime.totalTax,
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
  }, [inputs, result]);

  const handleCopy = useCallback(async () => {
    const text = `📊 Tax Comparison — FinAI India\nIncome: ₹${inputs.grossIncome.toLocaleString("en-IN")}\nBest: ${result.betterRegime.toUpperCase()}\nOld Tax: ₹${result.oldRegime.totalTax.toLocaleString("en-IN")}\nNew Tax: ₹${result.newRegime.totalTax.toLocaleString("en-IN")}\nSaving: ₹${result.taxSavings.toLocaleString("en-IN")}`;
    await navigator.clipboard.writeText(text);
    showToast("Copied to clipboard", "success");
  }, [inputs, result, showToast]);

  const Slider = ({ value, onChange, min, max, step = 5000 }: { value: number; onChange: (v: number) => void; min: number; max: number; step?: number }) => (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} step={step} value={safe(value)} onChange={(e) => onChange(safe(Number(e.target.value)))} className="flex-1" />
      <input type="number" value={safe(value)} onChange={(e) => onChange(safeClamp(Number(e.target.value), min, max))} className="input w-24 text-right text-base" />
    </div>
  );

  const FieldLabel = ({ label, tooltipKey }: { label: string; tooltipKey: string }) => (
    <div className="flex items-center gap-1.5 mb-1.5">
      <span className="text-sm text-foreground-secondary">{label}</span>
      {taxTooltips[tooltipKey] && <InfoTooltip {...taxTooltips[tooltipKey]} />}
    </div>
  );

  const ToggleGroup = ({ options, value, onChange }: { options: { label: string; value: string }[]; value: string; onChange: (v: any) => void }) => (
    <div className="segmented-control">
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} className={`segmented-option ${value === opt.value ? "active" : ""}`}>
          {opt.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">Tax Regime Calculator</h1>
          <p className="text-foreground-secondary mt-1">Compare Old vs New tax regime and find your best option</p>
        </div>
        <div className="segmented-control">
          <button onClick={() => setMode("simple")} className={`segmented-option ${mode === "simple" ? "active" : ""}`}>Simple</button>
          <button onClick={() => setMode("advanced")} className={`segmented-option ${mode === "advanced" ? "active" : ""}`}>Advanced</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Form */}
        <div className="lg:col-span-2 space-y-4">
          {/* Section 1: Income */}
          <div className="section-card">
            <div className="section-header" onClick={() => toggleSection("income")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggleSection("income")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center text-accent"><IndianRupee className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Income Details</h3>
                  <p className="text-xs text-foreground-tertiary">Your annual income information</p>
                </div>
              </div>
              {sections.income ? <ChevronUp className="w-4 h-4 text-foreground-tertiary" /> : <ChevronDown className="w-4 h-4 text-foreground-tertiary" />}
            </div>
            <AnimatePresence>
              {sections.income && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="section-body space-y-4">
                    <div>
                      <FieldLabel label="Gross Annual Income" tooltipKey="grossIncome" />
                      <Slider value={inputs.grossIncome} onChange={(v) => update("grossIncome", v)} min={0} max={5000000} step={50000} />
                    </div>
                    <div>
                      <FieldLabel label="Other Income (interest, rentals, etc.)" tooltipKey="otherIncome" />
                      <Slider value={inputs.otherIncome} onChange={(v) => update("otherIncome", v)} min={0} max={500000} step={10000} />
                    </div>
                    <div className="flex flex-wrap gap-4">
                      <div>
                        <FieldLabel label="Employment Type" tooltipKey="isSalaried" />
                        <ToggleGroup options={[{ label: "Salaried", value: "true" }, { label: "Self-Employed", value: "false" }]} value={String(inputs.isSalaried)} onChange={(v) => update("isSalaried", v === "true")} />
                      </div>
                      <div>
                        <FieldLabel label="Age Group" tooltipKey="ageGroup" />
                        <ToggleGroup options={[{ label: "Below 60", value: "below60" }, { label: "Senior (60-80)", value: "senior" }, { label: "Super (80+)", value: "supersenior" }]} value={inputs.ageGroup} onChange={(v) => update("ageGroup", v as any)} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Section 2: Deductions */}
          <div className="section-card">
            <div className="section-header" onClick={() => toggleSection("deductions")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && toggleSection("deductions")}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-accent-subtle flex items-center justify-center text-accent"><ShieldCheck className="w-4 h-4" /></div>
                <div>
                  <h3 className="text-sm font-semibold text-foreground">Deductions</h3>
                  <p className="text-xs text-foreground-tertiary">80C, 80D, HRA & more</p>
                </div>
              </div>
              {sections.deductions ? <ChevronUp className="w-4 h-4 text-foreground-tertiary" /> : <ChevronDown className="w-4 h-4 text-foreground-tertiary" />}
            </div>
            <AnimatePresence>
              {sections.deductions && (
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                  <div className="section-body space-y-4">
                    <div>
                      <FieldLabel label="80C Investments (PPF, ELSS, LIC, EPF)" tooltipKey="investment80C" />
                      <Slider value={inputs.investment80C} onChange={(v) => update("investment80C", v)} min={0} max={150000} step={5000} />
                    </div>
                    <div>
                      <FieldLabel label="80D Health Insurance Premium" tooltipKey="healthInsurance80D" />
                      <Slider value={inputs.healthInsurance80D} onChange={(v) => update("healthInsurance80D", v)} min={0} max={100000} step={5000} />
                    </div>
                    <div>
                      <FieldLabel label="HRA Received (monthly)" tooltipKey="hra" />
                      <Slider value={inputs.hraReceived} onChange={(v) => update("hraReceived", v)} min={0} max={100000} step={5000} />
                    </div>

                    {mode === "advanced" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4 pt-2 border-t border-border">
                        <p className="text-xs font-medium text-foreground-tertiary uppercase tracking-wider">Advanced Deductions</p>
                        <div>
                          <FieldLabel label="NPS Additional (80CCD(1B))" tooltipKey="nps" />
                          <Slider value={inputs.nps80CCD1B} onChange={(v) => update("nps80CCD1B", v)} min={0} max={50000} step={5000} />
                        </div>
                        <div>
                          <FieldLabel label="Home Loan Interest (24(b))" tooltipKey="homeLoan" />
                          <Slider value={inputs.homeLoanInterest24b} onChange={(v) => update("homeLoanInterest24b", v)} min={0} max={200000} step={10000} />
                        </div>
                        <div>
                          <FieldLabel label="Education Loan Interest (80E)" tooltipKey="educationLoan" />
                          <Slider value={inputs.educationLoan80E} onChange={(v) => update("educationLoan80E", v)} min={0} max={200000} step={10000} />
                        </div>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right Panel — Sticky Summary */}
        <div className="lg:col-span-1">
          <div className="summary-panel space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">Tax Summary</h3>
              <Badge variant={result.betterRegime === "old" ? "warning" : "accent"}>
                {result.betterRegime === "old" ? "Old ✓" : result.betterRegime === "new" ? "New ✓" : "Equal"}
              </Badge>
            </div>

            {/* Regime cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-surface-secondary text-center">
                <p className="text-xs text-foreground-tertiary mb-1">Old Regime</p>
                <p className="text-lg font-bold text-foreground">₹<AnimatedCounter value={result.oldRegime.totalTax} /></p>
              </div>
              <div className="p-3 rounded-lg bg-surface-secondary text-center">
                <p className="text-xs text-foreground-tertiary mb-1">New Regime</p>
                <p className="text-lg font-bold text-foreground">₹<AnimatedCounter value={result.newRegime.totalTax} /></p>
              </div>
            </div>

            {/* Savings */}
            <div className="result-highlight text-center">
              <p className="text-xs text-foreground-secondary mb-1">Annual Tax Savings</p>
              <p className="text-2xl font-bold text-accent">₹<AnimatedCounter value={result.taxSavings} /></p>
            </div>

            {/* Details */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-foreground-tertiary">Taxable Income</span>
                <span className="text-foreground font-medium">₹{result.oldRegime.taxableIncome.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-tertiary">Effective Tax Rate</span>
                <span className="text-foreground font-medium">{result.oldRegime.effectiveTaxRate.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-foreground-tertiary">Monthly Tax</span>
                <span className="text-foreground font-medium">₹{result.oldRegime.monthlyTax.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <Button onClick={handleExplain} isLoading={isExplaining} className="w-full" size="md">
                <Brain className="w-4 h-4" /> AI Explain This
              </Button>
              <Button variant="secondary" onClick={handleCopy} className="w-full" size="md">
                <Copy className="w-4 h-4" /> Copy Results
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* AI Explanation */}
      <AnimatePresence>
        {explanation && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="mt-6">
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
      </AnimatePresence>

      {/* Charts */}
      <div className="mt-8">
        <Card className="p-6">
          <TaxChart
            oldRegime={result.oldRegime}
            newRegime={result.newRegime}
            effectiveOld={result.oldRegime.effectiveTaxRate}
            effectiveNew={result.newRegime.effectiveTaxRate}
          />
        </Card>
      </div>

      {/* Deduction Breakdown */}
      {result.oldRegime.deductions.length > 0 && (
        <div className="mt-6">
          <Card className="p-6">
            <h3 className="text-sm font-semibold text-foreground mb-4">Deduction Summary (Old Regime)</h3>
            <div className="space-y-3">
              {result.oldRegime.deductions.map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 px-3 rounded-lg bg-surface-secondary">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-accent" />
                    <div>
                      <p className="text-xs font-medium text-foreground">{d.section} — {d.name}</p>
                      <p className="text-[10px] text-foreground-tertiary">{d.description}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-foreground">₹{d.amount.toLocaleString("en-IN")}</p>
                    {d.maxLimit < Infinity && (
                      <p className="text-[10px] text-foreground-tertiary">of ₹{d.maxLimit.toLocaleString("en-IN")}</p>
                    )}
                  </div>
                </div>
              ))}
              <div className="flex items-center justify-between pt-3 border-t border-border">
                <span className="text-xs font-medium text-foreground">Total Deductions</span>
                <span className="text-sm font-bold text-accent">₹{result.oldRegime.totalDeductions.toLocaleString("en-IN")}</span>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Computation Steps */}
      <div className="mt-6">
        <Card className="p-6">
          <h3 className="text-sm font-semibold text-foreground mb-4">How Your Tax Is Calculated</h3>
          <div className="space-y-0">
            {[
              { label: "Gross Total Income", value: inputs.grossIncome + inputs.otherIncome, detail: "Salary + Other Income" },
              { label: "Standard Deduction", value: -75000, detail: "New Regime" },
              { label: "Taxable Income", value: result.newRegime.taxableIncome, detail: "After deductions" },
              { label: "Tax on Slabs", value: result.newRegime.baseTax, detail: "Before rebate" },
              { label: "87A Rebate", value: -result.newRegime.rebate87A, detail: "Income ≤ ₹7L" },
              { label: "Marginal Relief", value: -result.newRegime.marginalRelief, detail: "For income just above ₹7L" },
              { label: "Health & Education Cess (4%)", value: result.newRegime.cess, detail: "On tax after rebate" },
            ].map((step, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-border last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-surface-secondary flex items-center justify-center text-[10px] font-medium text-foreground-tertiary">{i + 1}</div>
                  <div>
                    <p className="text-xs text-foreground">{step.label}</p>
                    {step.detail && <p className="text-[10px] text-foreground-tertiary">{step.detail}</p>}
                  </div>
                </div>
                <span className={`text-xs font-semibold ${step.value < 0 ? "text-accent" : "text-foreground"}`}>
                  {step.value < 0 ? "-" : ""}₹{Math.abs(step.value).toLocaleString("en-IN")}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-between py-3 mt-2 rounded-lg bg-accent-subtle px-3">
              <span className="text-sm font-bold text-foreground">Net Tax Payable (New Regime)</span>
              <span className="text-lg font-bold text-accent">₹{result.newRegime.totalTax.toLocaleString("en-IN")}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Optimization Suggestions */}
      <div className="mt-6 space-y-3">
        {result.betterRegime === "new" && inputs.investment80C < 150000 && (
          <Card className="p-4 border-accent/30">
            <div className="flex items-start gap-3">
              <Sparkles className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Unused 80C Limit</p>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  You're using only <strong>₹{inputs.investment80C.toLocaleString("en-IN")}</strong> of the ₹1,50,000 80C limit. 
                  Maximizing it could save you ₹{(result.oldRegime.totalTax - calculateIncomeTax({ ...inputs, investment80C: 150000 }).oldRegime.totalTax).toLocaleString("en-IN")} in tax under Old Regime.
                  Consider PPF, ELSS, or tax-saving FDs.
                </p>
              </div>
            </div>
          </Card>
        )}
        {inputs.healthInsurance80D < 25000 && (
          <Card className="p-4 border-accent/30">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Health Insurance Cover</p>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  Section 80D allows up to ₹25,000 for self + family, plus ₹50,000 for senior citizen parents. 
                  You're claiming only ₹{inputs.healthInsurance80D.toLocaleString("en-IN")}.
                </p>
              </div>
            </div>
          </Card>
        )}
        {result.betterRegime === "old" && inputs.nps80CCD1B < 50000 && (
          <Card className="p-4 border-accent/30">
            <div className="flex items-start gap-3">
              <PiggyBank className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">NPS Additional Benefit</p>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  You can claim an extra ₹50,000 deduction under Section 80CCD(1B) by contributing to NPS — 
                  over and above the ₹1.5L 80C limit.
                </p>
              </div>
            </div>
          </Card>
        )}
        {inputs.homeLoanInterest24b < 200000 && inputs.homeLoanInterest24b > 0 && (
          <Card className="p-4 border-accent/30">
            <div className="flex items-start gap-3">
              <Home className="w-4 h-4 text-accent mt-0.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-foreground">Home Loan Interest</p>
                <p className="text-xs text-foreground-secondary mt-0.5">
                  You are claiming ₹{inputs.homeLoanInterest24b.toLocaleString("en-IN")} of the ₹2,00,000 limit under Section 24(b). 
                  If your actual home loan interest is higher, you can claim the full amount for self-occupied property.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}
