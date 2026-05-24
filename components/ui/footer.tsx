import React from "react";
import Link from "next/link";
import { Calculator, Heart, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24 no-print">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-foreground">FinAI</span>
            </div>
            <p className="text-sm text-foreground-secondary leading-relaxed max-w-xs">
              India&apos;s intelligent finance platform. Smart calculators, AI-powered insights.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-foreground-tertiary font-semibold mb-4">Calculators</h4>
            <ul className="space-y-3">
              <li><Link href="/emi-calculator" className="text-sm text-foreground-secondary hover:text-accent transition-colors">EMI Calculator</Link></li>
              <li><Link href="/sip-calculator" className="text-sm text-foreground-secondary hover:text-accent transition-colors">SIP Calculator</Link></li>
              <li><Link href="/tax-regime-calculator" className="text-sm text-foreground-secondary hover:text-accent transition-colors">Tax Regime Calculator</Link></li>
              <li><Link href="/salary-calculator" className="text-sm text-foreground-secondary hover:text-accent transition-colors">Salary Calculator</Link></li>
              <li><Link href="/loan-prepayment-calculator" className="text-sm text-foreground-secondary hover:text-accent transition-colors">Loan Prepayment Calculator</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-foreground-tertiary font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><span className="text-sm text-foreground-tertiary cursor-not-allowed">Tax Guide</span></li>
              <li><span className="text-sm text-foreground-tertiary cursor-not-allowed">Investment Tips</span></li>
              <li><span className="text-sm text-foreground-tertiary cursor-not-allowed">Loan Guide</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-widest text-foreground-tertiary font-semibold mb-4">Connect</h4>
            <ul className="space-y-3">
              <li>
                <a href="mailto:hello@finai.in" className="text-sm text-foreground-secondary hover:text-accent transition-colors flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> hello@finai.in
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-foreground-tertiary">
                Built with <Heart className="w-3.5 h-3.5 text-red-400" /> in India
              </li>
            </ul>
          </div>
        </div>

        <div className="divider mt-10 mb-8" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-foreground-tertiary">
            &copy; {new Date().getFullYear()} FinAI India. Not financial advice.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-xs text-foreground-tertiary cursor-not-allowed">Privacy Policy</span>
            <span className="text-xs text-foreground-tertiary cursor-not-allowed">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
