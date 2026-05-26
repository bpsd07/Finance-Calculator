"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calculator, TrendingUp, FileText, IndianRupee, PiggyBank,
  ArrowRight, BarChart3, ShieldCheck, Brain,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const calculators = [
  {
    icon: Calculator, title: "EMI Calculator", desc: "Home, car & personal loan EMIs with full amortization schedule",
    href: "/emi-calculator", badge: "Popular", color: "accent",
  },
  {
    icon: TrendingUp, title: "SIP Calculator", desc: "Mutual fund wealth projection with year-by-year growth",
    href: "/sip-calculator", badge: "Investors", color: "accent",
  },
  {
    icon: FileText, title: "Tax Regime Calculator", desc: "Old vs New tax regime with smart comparison & savings",
    href: "/tax-regime-calculator", badge: "Advanced", color: "accent",
  },
  {
    icon: IndianRupee, title: "Salary Calculator", desc: "CTC breakup to monthly in-hand take-home pay",
    href: "/salary-calculator", badge: "Salaried", color: "accent",
  },
  {
    icon: PiggyBank, title: "Loan Prepayment", desc: "Interest saved & tenure reduced with extra payments",
    href: "/loan-prepayment-calculator", badge: "Savings", color: "accent",
  },
];

const features = [
  { icon: Brain, title: "AI-Powered Insights", desc: "DeepSeek AI analyzes your numbers and gives personalized financial advice in plain language." },
  { icon: BarChart3, title: "Beautiful Visuals", desc: "Interactive charts that make complex financial data easy to understand at a glance." },
  { icon: ShieldCheck, title: "100% Free", desc: "No sign-ups, no charges. All calculators and AI features are completely free." },
];

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative pt-20 pb-16 lg:pt-28 lg:pb-24 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-accent-subtle via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <Badge variant="accent" className="mb-6">
              <Brain className="w-3 h-3" />
              AI-Powered Financial Tools
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
              Smart Finance,
              <br />
              <span className="text-gradient">Calculated for India</span>
            </h1>
            <p className="text-lg text-foreground-secondary max-w-2xl mx-auto mb-8 leading-relaxed">
              India&apos;s intelligent finance platform. Calculate EMIs, SIP returns, tax savings — 
              with AI-powered insights that actually make sense.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link href="/emi-calculator">
                <Button size="lg">
                  Start Calculating <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link href="#calculators">
                <Button variant="secondary" size="lg">
                  Explore All Tools
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 lg:px-8 -mt-4 mb-16">
        <div className="border border-border rounded-xl bg-surface p-6 lg:p-8 grid grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Calculators", value: "5+" },
            { label: "AI-Powered", value: "100%" },
            { label: "Accuracy", value: "99.9%" },
            { label: "Free", value: "₹0" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl lg:text-3xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-foreground-secondary mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Calculators */}
      <section id="calculators" className="max-w-7xl mx-auto px-4 lg:px-8 mb-20 lg:mb-28">
        <div className="text-center mb-12">
          <Badge variant="accent" className="mb-4">Financial Tools</Badge>
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">All-in-One Finance Platform</h2>
          <p className="text-foreground-secondary max-w-xl mx-auto">
            Everything you need to plan your finances — loans, investments, tax, and salary.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">
          {calculators.map((calc, i) => (
            <motion.div
              key={calc.title}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <Link href={calc.href} className="block group">
                <Card hover className="h-full p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center text-accent group-hover:scale-105 transition-transform duration-200">
                      <calc.icon className="w-5 h-5" />
                    </div>
                    <Badge>{calc.badge}</Badge>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{calc.title}</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">{calc.desc}</p>
                  <div className="flex items-center gap-1.5 mt-4 text-sm text-accent font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    Calculate Now <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-surface-secondary border-y border-border py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 lg:px-8">
          <div className="text-center mb-12">
            <Badge variant="accent" className="mb-4">Why FinAI</Badge>
            <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Built for Smart Indians</h2>
            <p className="text-foreground-secondary max-w-xl mx-auto">
              We combine AI with deep knowledge of Indian finance to give you the clearest picture.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
              >
                <Card className="p-6 h-full text-center">
                  <div className="w-10 h-10 rounded-lg bg-accent-subtle flex items-center justify-center text-accent mx-auto mb-4">
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-foreground-secondary leading-relaxed">{feature.desc}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 lg:py-28">
        <div className="max-w-2xl mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold tracking-tight mb-3">Ready to Take Control?</h2>
          <p className="text-foreground-secondary mb-8 max-w-md mx-auto">
            Start with any calculator and get AI-powered insights in seconds. No sign-up needed.
          </p>
          <Link href="/tax-regime-calculator">
            <Button size="lg">
              Try Tax Calculator <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </div>
      </section>
    </>
  );
}
