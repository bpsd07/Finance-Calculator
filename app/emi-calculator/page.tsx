import type { Metadata } from "next";
import { EMICalculator } from "@/components/calculators/emi-calculator";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "EMI Calculator India 2025 - Home Loan EMI Calculator with AI",
  description:
    "Free EMI calculator for home, car & personal loans. Calculate monthly EMI instantly. Get AI-powered explanation, amortization schedule, and principal vs interest breakup.",
  path: "/emi-calculator",
});

export default function EMICalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    name: "EMI Calculator India",
    description: "Free Indian EMI calculator with AI explanations for home, car, and personal loans.",
    url: "https://aifinancecalculator.in/emi-calculator",
    category: "Finance",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <EMICalculator />
    </div>
  );
}
