"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IndianRupee, CalendarDays, Percent, PiggyBank, Brain, Copy, Share2, Clock, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Gauge } from "@/components/ui/gauge";
import { NumericInput } from "@/components/ui/numeric-input";
import { PresetButtons } from "@/components/ui/preset-buttons";
import { ShareCard } from "@/components/ui/share-card";
import { useToast } from "@/components/ui/toast";
import { PrepaymentChart } from "@/components/charts/prepayment-chart";
import { calculateLoanPrepayment } from "@/lib/calculators/prepayment";
import { seoContent } from "@/lib/seo/content";
import { Accordion } from "@/components/ui/accordion";

export function PrepaymentCalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [prepaymentAmount, setPrepaymentAmount] = useState(10000);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();

  const result = calculateLoanPrepayment(principal, rate, tenure, prepaymentAmount);
  const savingsPercent = Math.min(100, Math.max(0, Math.round((result.interestSaved / result.originalTotalInterest) * 100)));

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "PREPAYMENT",
          inputs: { principal, interestRate: rate, tenureYears: tenure, monthlyPrepayment: prepaymentAmount },
          results: {
            interestSaved: result.interestSaved,
            monthsSaved: result.monthsSaved,
            originalTotalInterest: result.originalTotalInterest,
            prepaymentTotalInterest: result.prepaymentTotalInterest,
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
  }, [principal, rate, tenure, prepaymentAmount, result]);

  const handleCopy = useCallback(async () => {
    const text = `🏠 Prepayment Result\nLoan: ₹${principal.toLocaleString("en-IN")}\nRate: ${rate}%\nMonthly Prepayment: ₹${prepaymentAmount.toLocaleString("en-IN")}\nInterest Saved: ₹${result.interestSaved.toLocaleString("en-IN")}\nTenure Reduced: ${result.monthsSaved} months\n\nCalculate yours at FinAI India`;
    await navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard!", "success");
  }, [principal, rate, prepaymentAmount, result, showToast]);

  const content = seoContent.prepayment;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Loan & Prepayment</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-foreground-secondary flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-accent" />
                    Loan Amount
                  </label>
                  <NumericInput
                    value={principal}
                    onChange={setPrincipal}
                    min={100000}
                    max={100000000}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-foreground w-28 text-right"
                  />
                </div>
                <input
                  type="range"
                  min={100000}
                  max={100000000}
                  step={100000}
                  value={principal}
                  onChange={(e) => setPrincipal(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((principal - 100000) / (100000000 - 100000)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "₹5L", value: 500000 },
                    { label: "₹10L", value: 1000000 },
                    { label: "₹25L", value: 2500000 },
                    { label: "₹50L", value: 5000000 },
                    { label: "₹1Cr", value: 10000000 },
                  ]}
                  currentValue={principal}
                  onSelect={setPrincipal}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-foreground-secondary flex items-center gap-2">
                    <Percent className="w-4 h-4 text-accent" />
                    Interest Rate (%)
                  </label>
                  <NumericInput
                    value={rate}
                    onChange={setRate}
                    min={0.1}
                    max={30}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-foreground w-20 text-right"
                    step="0.1"
                  />
                </div>
                <input
                  type="range"
                  min={0.1}
                  max={20}
                  step={0.1}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((rate - 0.1) / (20 - 0.1)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "7%", value: 7 },
                    { label: "8.5%", value: 8.5 },
                    { label: "10%", value: 10 },
                    { label: "12%", value: 12 },
                  ]}
                  currentValue={rate}
                  onSelect={setRate}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-foreground-secondary flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 text-accent" />
                    Tenure (Years)
                  </label>
                  <NumericInput
                    value={tenure}
                    onChange={setTenure}
                    min={1}
                    max={40}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-foreground w-16 text-right"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={40}
                  step={1}
                  value={tenure}
                  onChange={(e) => setTenure(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((tenure - 1) / (40 - 1)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "5yr", value: 5 },
                    { label: "10yr", value: 10 },
                    { label: "15yr", value: 15 },
                    { label: "20yr", value: 20 },
                    { label: "30yr", value: 30 },
                  ]}
                  currentValue={tenure}
                  onSelect={setTenure}
                  className="mt-2"
                />
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-foreground-secondary flex items-center gap-2">
                    <PiggyBank className="w-4 h-4 text-accent" />
                    Monthly Prepayment
                  </label>
                  <NumericInput
                    value={prepaymentAmount}
                    onChange={setPrepaymentAmount}
                    min={0}
                    max={50000}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-foreground w-24 text-right"
                  />
                </div>
                <input
                  type="range"
                  min={0}
                  max={50000}
                  step={1000}
                  value={prepaymentAmount}
                  onChange={(e) => setPrepaymentAmount(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${(prepaymentAmount / 50000) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "₹5K", value: 5000 },
                    { label: "₹10K", value: 10000 },
                    { label: "₹20K", value: 20000 },
                    { label: "₹50K", value: 50000 },
                  ]}
                  currentValue={prepaymentAmount}
                  onSelect={setPrepaymentAmount}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="card-glow p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Your Savings</h2>
              <Badge variant="emerald">Optimized</Badge>
            </div>

            <div className="glass-panel rounded-xl border border-emerald-500/10 p-5 bg-emerald-500/5 mb-4 text-center">
              <p className="text-xs text-foreground-tertiary mb-1">Total Interest Saved</p>
              <p className="text-3xl lg:text-4xl font-bold text-gradient-emerald">
                <AnimatedCounter value={result.interestSaved} prefix="₹" />
              </p>
            </div>

            <div className="flex justify-center mb-4">
              <Gauge value={savingsPercent} label="Interest Saved %" size="sm" variant="emerald" />
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              <Clock className="w-4 h-4 text-accent" />
              <span className="text-sm text-foreground-secondary">Tenure reduced by </span>
              <span className="text-lg font-bold text-foreground">
                {result.monthsSaved} months ({result.yearsSaved} yrs)
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-panel rounded-xl p-4 border border-rose-500/10 text-center">
                <p className="text-xs text-foreground-tertiary">Normal Interest</p>
                <p className="text-base font-bold text-rose-400">
                  <AnimatedCounter value={result.originalTotalInterest} prefix="₹" />
                </p>
              </div>
              <div className="glass-panel rounded-xl p-4 border border-emerald-500/10 text-center">
                <p className="text-xs text-foreground-tertiary">Prepay Interest</p>
                <p className="text-base font-bold text-accent">
                  <AnimatedCounter value={result.prepaymentTotalInterest} prefix="₹" />
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-auto">
              <Button variant="secondary" onClick={handleCopy} className="flex-1">
                <Copy className="w-4 h-4" /> Copy
              </Button>
              <Button onClick={handleExplain} isLoading={isExplaining} className="flex-1">
                <Brain className="w-4 h-4" /> Explain
              </Button>
              <Button variant="secondary" onClick={() => setShowShare(!showShare)} className="flex-1">
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {explanation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 lg:p-8 border-emerald-500/20 bg-emerald-500/5 card-glow">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">AI Advisor Insights</h3>
              <Badge variant="emerald">AI</Badge>
            </div>
            <div className="text-sm text-foreground-secondary leading-relaxed whitespace-pre-line">{explanation}</div>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 lg:p-8">
          <PrepaymentChart scheduleComparison={result.scheduleComparison} />
        </Card>
      </motion.div>

      {showShare && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 lg:p-8">
            <ShareCard
              title="Loan Prepayment Savings"
              type="prepayment"
              values={[
                { label: "Loan Amount", value: `₹${principal.toLocaleString("en-IN")}` },
                { label: "Interest Rate", value: `${rate}%` },
                { label: "Monthly Prepayment", value: `₹${prepaymentAmount.toLocaleString("en-IN")}` },
                { label: "Interest Saved", value: `₹${result.interestSaved.toLocaleString("en-IN")}` },
                { label: "Tenure Reduced", value: `${result.monthsSaved} months` },
              ]}
            />
          </Card>
        </motion.div>
      )}

      <article className="space-y-8">
        <Card className="p-6 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-foreground mb-2">{content.title}</h1>
          <p className="text-foreground-secondary mb-6">{content.subtitle}</p>
          <p className="text-foreground-secondary leading-relaxed">{content.introduction}</p>
        </Card>
        {content.sections.map((section) => (
          <Card key={section.heading} className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-foreground mb-4">{section.heading}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-foreground-secondary leading-relaxed text-sm">{p}</p>
              ))}
            </div>
          </Card>
        ))}
        <Card className="p-6 lg:p-8">
          <Accordion items={content.faqs} title="Frequently Asked Questions" />
        </Card>
      </article>
    </div>
  );
}
