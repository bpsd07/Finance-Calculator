import type { Metadata } from "next";
import { TaxCalculator } from "@/components/calculators/tax-calculator";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Old vs New Tax Regime Calculator 2025 - India Tax Comparison",
  description:
    "Compare Old vs New tax regime for FY 2024-25. Calculate income tax instantly with 80C, 80D deductions. AI-powered tax planning advisor.",
  path: "/tax-regime-calculator",
});

export default function TaxRegimeCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    name: "Old vs New Tax Regime Calculator India",
    description: "Free Indian tax regime comparison calculator with AI explanations for FY 2024-25.",
    url: "https://aifinancecalculator.in/tax-regime-calculator",
    category: "Finance",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <TaxCalculator />
    </div>
  );
}
