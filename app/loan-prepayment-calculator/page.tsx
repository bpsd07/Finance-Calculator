import type { Metadata } from "next";
import { PrepaymentCalculator } from "@/components/calculators/prepayment-calculator";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Loan Prepayment Calculator India - Save Interest on Home Loan",
  description:
    "Free loan prepayment calculator for Indian home loans. Calculate interest saved and tenure reduced with extra monthly payments. AI-powered financial insights.",
  path: "/loan-prepayment-calculator",
});

export default function PrepaymentCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    name: "Loan Prepayment Calculator India",
    description: "Free Indian loan prepayment calculator with AI explanations.",
    url: "https://aifinancecalculator.in/loan-prepayment-calculator",
    category: "Finance",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <PrepaymentCalculator />
    </div>
  );
}
