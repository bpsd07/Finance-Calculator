"use client";

import React, { useState, useCallback } from "react";
import { motion } from "framer-motion";
import { IndianRupee, TrendingUp, Percent, Clock, Brain, Copy, Share2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedCounter } from "@/components/ui/animated-counter";
import { Gauge } from "@/components/ui/gauge";
import { PresetButtons } from "@/components/ui/preset-buttons";
import { ShareCard } from "@/components/ui/share-card";
import { useToast } from "@/components/ui/toast";
import { SIPChart } from "@/components/charts/sip-chart";
import { calculateSIP } from "@/lib/calculators/sip";
import { seoContent } from "@/lib/seo/content";
import { Accordion } from "@/components/ui/accordion";

export function SIPCalculator() {
  const [monthly, setMonthly] = useState(10000);
  const [rate, setRate] = useState(12);
  const [years, setYears] = useState(15);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isExplaining, setIsExplaining] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const { showToast } = useToast();

  const result = calculateSIP(monthly, rate, years);
  const returnsPercent = result.estimatedReturnsPercent || 
    Math.round((result.estimatedReturns / result.totalInvestment) * 100);
  const gaugeValue = Math.min(100, Math.max(10, returnsPercent));

  const handleExplain = useCallback(async () => {
    setIsExplaining(true);
    setExplanation(null);
    try {
      const res = await fetch("/api/explain", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          calculatorType: "SIP",
          inputs: { monthlyInvestment: monthly, expectedReturnRate: rate, years },
          results: {
            totalInvestment: result.totalInvestment,
            estimatedReturns: result.estimatedReturns,
            totalValue: result.totalValue,
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
  }, [monthly, rate, years, result]);

  const handleCopy = useCallback(async () => {
    const text = `📈 SIP Calculator Result\nMonthly: ₹${monthly.toLocaleString("en-IN")}\nRate: ${rate}%\nTenure: ${years} years\nTotal Value: ₹${result.totalValue.toLocaleString("en-IN")}\nReturns: ₹${result.estimatedReturns.toLocaleString("en-IN")}\n\nCalculate yours at FinAI India`;
    await navigator.clipboard.writeText(text);
    showToast("Results copied to clipboard!", "success");
  }, [monthly, rate, years, result, showToast]);

  const content = seoContent.sip;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-white mb-6">Investment Details</h2>
            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <IndianRupee className="w-4 h-4 text-emerald-400" />
                    Monthly Investment
                  </label>
                  <input
                    type="number"
                    value={monthly}
                    onChange={(e) => setMonthly(Math.max(100, Number(e.target.value) || 0))}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-white w-24 text-right"
                  />
                </div>
                <input
                  type="range"
                  min={100}
                  max={500000}
                  step={500}
                  value={monthly}
                  onChange={(e) => setMonthly(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((monthly - 100) / (500000 - 100)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "₹500", value: 500 },
                    { label: "₹1K", value: 1000 },
                    { label: "₹5K", value: 5000 },
                    { label: "₹10K", value: 10000 },
                    { label: "₹25K", value: 25000 },
                    { label: "₹50K", value: 50000 },
                  ]}
                  currentValue={monthly}
                  onSelect={setMonthly}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Percent className="w-4 h-4 text-emerald-400" />
                    Expected Return (%)
                  </label>
                  <input
                    type="number"
                    value={rate}
                    onChange={(e) => setRate(Math.max(1, Math.min(30, Number(e.target.value) || 0)))}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-white w-20 text-right"
                    step="0.5"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={0.5}
                  value={rate}
                  onChange={(e) => setRate(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((rate - 1) / (30 - 1)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "8%", value: 8 },
                    { label: "10%", value: 10 },
                    { label: "12%", value: 12 },
                    { label: "15%", value: 15 },
                    { label: "20%", value: 20 },
                  ]}
                  currentValue={rate}
                  onSelect={setRate}
                  className="mt-2"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm text-gray-400 flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    Investment Period (Years)
                  </label>
                  <input
                    type="number"
                    value={years}
                    onChange={(e) => setYears(Math.max(1, Math.min(50, Number(e.target.value) || 0)))}
                    className="glass-input rounded-lg px-3 py-1.5 text-sm text-white w-16 text-right"
                  />
                </div>
                <input
                  type="range"
                  min={1}
                  max={50}
                  step={1}
                  value={years}
                  onChange={(e) => setYears(Number(e.target.value))}
                  className="w-full slider-filled"
                  style={{ "--slider-fill": `${((years - 1) / (50 - 1)) * 100}%` } as React.CSSProperties}
                />
                <PresetButtons
                  options={[
                    { label: "5yr", value: 5 },
                    { label: "10yr", value: 10 },
                    { label: "15yr", value: 15 },
                    { label: "20yr", value: 20 },
                    { label: "30yr", value: 30 },
                  ]}
                  currentValue={years}
                  onSelect={setYears}
                  className="mt-2"
                />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4 }}>
          <Card className="card-glow p-6 lg:p-8 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Wealth Projection</h2>
              <Badge variant="emerald">Instant</Badge>
            </div>

            <div className="text-center mb-4">
              <p className="text-sm text-gray-500 mb-1">Total Corpus</p>
              <p className="text-4xl lg:text-5xl font-bold text-gradient-emerald">
                ₹<AnimatedCounter value={result.totalValue / 10000000} decimals={2} suffix=" Cr" />
              </p>
            </div>

            <div className="flex justify-center mb-6">
              <Gauge value={gaugeValue} label="Returns Ratio" size="sm" variant="emerald" />
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="glass-panel rounded-xl p-4 border border-amber-500/10 text-center">
                <p className="text-xs text-gray-500">Invested</p>
                <p className="text-lg font-bold text-amber-400">
                  <AnimatedCounter value={result.totalInvestment} prefix="₹" />
                </p>
              </div>
              <div className="glass-panel rounded-xl p-4 border border-emerald-500/10 text-center">
                <p className="text-xs text-gray-500">Returns</p>
                <p className="text-lg font-bold text-emerald-400">
                  <AnimatedCounter value={result.estimatedReturns} prefix="₹" />
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
              <Sparkles className="w-5 h-5 text-emerald-400" />
              <h3 className="font-semibold text-white">AI Advisor Insights</h3>
              <Badge variant="emerald">AI</Badge>
            </div>
            <div className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">{explanation}</div>
          </Card>
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="p-6 lg:p-8">
          <SIPChart yearlyGrowth={result.yearlyGrowth} />
        </Card>
      </motion.div>

      {showShare && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="p-6 lg:p-8">
            <ShareCard
              title="SIP Wealth Projection"
              type="sip"
              values={[
                { label: "Monthly SIP", value: `₹${monthly.toLocaleString("en-IN")}` },
                { label: "Expected Return", value: `${rate}%` },
                { label: "Tenure", value: `${years} years` },
                { label: "Total Value", value: `₹${result.totalValue.toLocaleString("en-IN")}` },
                { label: "Total Returns", value: `₹${result.estimatedReturns.toLocaleString("en-IN")}` },
              ]}
            />
          </Card>
        </motion.div>
      )}

      <article className="space-y-8">
        <Card className="p-6 lg:p-8">
          <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">{content.title}</h1>
          <p className="text-gray-400 mb-6">{content.subtitle}</p>
          <p className="text-gray-300 leading-relaxed">{content.introduction}</p>
        </Card>
        {content.sections.map((section) => (
          <Card key={section.heading} className="p-6 lg:p-8">
            <h2 className="text-xl font-bold text-white mb-4">{section.heading}</h2>
            <div className="space-y-3">
              {section.paragraphs.map((p, i) => (
                <p key={i} className="text-gray-400 leading-relaxed text-sm">{p}</p>
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
