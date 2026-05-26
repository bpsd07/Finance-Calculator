"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IndianRupee, CalendarDays, Percent, Brain, Copy, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Gauge } from "@/components/ui/gauge";
import { NumericInput } from "@/components/ui/numeric-input";
import { PresetButtons } from "@/components/ui/preset-buttons";
import { ShareCard } from "@/components/ui/share-card";
import { useToast } from "@/components/ui/toast";
import { EMIChart } from "@/components/charts/emi-chart";
import { calculateEMI } from "@/lib/calculators/emi";
import { seoContent } from "@/lib/seo/content";
import { Accordion } from "@/components/ui/accordion";

export function EMICalculator() {
  const [principal, setPrincipal] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();

  const result = calculateEMI(principal, interestRate, tenure);
  const incomeRatio = Math.round((result.monthlyEMI / (principal * 0.008)) * 10);
  const riskPercent = Math.min(100, Math.max(0, incomeRatio));
  const gaugeVariant = riskPercent <= 33 ? "emerald" : riskPercent <= 66 ? "amber" : "rose";

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "EMI",
          inputs: { principal, interestRate, tenure },
          results: {
            monthlyEMI: result.monthlyEMI,
            totalInterest: result.totalInterest,
            totalPayment: result.totalPayment,
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
  }, [principal, interestRate, tenure, result]);

  const handleCopy = useCallback(async () => {
    const text = `🏦 EMI Calculator Result\nLoan: ₹${principal.toLocaleString("en-IN")}\nRate: ${interestRate}%\nTenure: ${tenure} years\nEMI: ₹${result.monthlyEMI.toLocaleString("en-IN")}\nTotal Interest: ₹${result.totalInterest.toLocaleString("en-IN")}\n\nCalculate yours at FinAI India`;
    await navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard!", "success");
  }, [principal, interestRate, tenure, result, showToast]);

  const content = seoContent.emi;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-foreground mb-6">Loan Details</h2>
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
                    value={interestRate}
                    onChange={setInterestRate}
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
                  value={interestRate}
                  onChange={(e) => setInterestRate(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((interestRate - 0.1) / (20 - 0.1)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "7%", value: 7 },
                    { label: "8.5%", value: 8.5 },
                    { label: "10%", value: 10 },
                    { label: "12%", value: 12 },
                  ]}
                  currentValue={interestRate}
                  onSelect={setInterestRate}
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
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="card-glow p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-foreground">Your Results</h2>
              <Badge variant="emerald">Instant</Badge>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-foreground-tertiary mb-1">Monthly EMI</p>
              <p className="text-4xl lg:text-5xl font-bold text-gradient-emerald">
                <AnimatedCounter value={result.monthlyEMI} prefix="₹" />
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <Gauge
                value={riskPercent}
                label="EMI Burden"
                size="sm"
                variant={gaugeVariant}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-panel rounded-xl p-4 border border-rose-500/10 text-center">
                <p className="text-xs text-foreground-tertiary">Total Interest</p>
                <p className="text-lg font-bold text-rose-400">
                  <AnimatedCounter value={result.totalInterest} prefix="₹" />
                </p>
              </div>
              <div className="glass-panel rounded-xl p-4 border border-amber-500/10 text-center">
                <p className="text-xs text-foreground-tertiary">Total Payment</p>
                <p className="text-lg font-bold text-amber-400">
                  <AnimatedCounter value={result.totalPayment} prefix="₹" />
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

      {/* AI Explanation */}
      {explanation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 lg:p-8 border-emerald-500/20 bg-emerald-500/5 card-glow">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-accent" />
              <h3 className="font-semibold text-foreground">AI Advisor Insights</h3>
              <Badge variant="emerald">AI</Badge>
            </div>
            <div className="text-sm text-foreground-secondary leading-relaxed whitespace-pre-line">
              {explanation}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Charts (auto-show) */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 lg:p-8">
          <EMIChart
            principalPercent={result.principalPercent}
            interestPercent={result.interestPercent}
            amortizationSchedule={result.amortizationSchedule}
          />
        </Card>
      </motion.div>

      {/* Share Card */}
      {showShare && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 lg:p-8">
            <ShareCard
              title="EMI Calculation"
              type="emi"
              values={[
                { label: "Loan Amount", value: `₹${principal.toLocaleString("en-IN")}` },
                { label: "Interest Rate", value: `${interestRate}%` },
                { label: "Tenure", value: `${tenure} years` },
                { label: "Monthly EMI", value: `₹${result.monthlyEMI.toLocaleString("en-IN")}` },
                { label: "Total Interest", value: `₹${result.totalInterest.toLocaleString("en-IN")}` },
              ]}
            />
          </Card>
        </motion.div>
      )}

      {/* SEO Content */}
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
