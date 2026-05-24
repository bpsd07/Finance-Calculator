import type { Metadata } from "next";
import { SIPCalculator } from "@/components/calculators/sip-calculator";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "SIP Calculator India 2025 - Mutual Fund SIP Calculator with AI",
  description:
    "Free SIP calculator for mutual fund investments. Calculate monthly SIP returns, total corpus, and wealth growth. AI-powered financial advisor explains your results.",
  path: "/sip-calculator",
});

export default function SIPCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    name: "SIP Calculator India",
    description: "Free Indian SIP calculator with AI explanations for mutual fund investments and wealth projection.",
    url: "https://aifinancecalculator.in/sip-calculator",
    category: "Finance",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SIPCalculator />
    </div>
  );
}
