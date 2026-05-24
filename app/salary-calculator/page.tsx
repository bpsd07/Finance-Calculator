import type { Metadata } from "next";
import { SalaryCalculator } from "@/components/calculators/salary-calculator";
import { generatePageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = generatePageMetadata({
  title: "Salary Calculator India 2025 - CTC to In-Hand Salary Calculator",
  description:
    "Free salary calculator for Indian employees. Convert CTC to monthly in-hand salary. Get salary breakup with EPF, gratuity, professional tax & income tax deductions.",
  path: "/salary-calculator",
});

export default function SalaryCalculatorPage() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FinancialCalculator",
    name: "CTC to In-Hand Salary Calculator India",
    description: "Free Indian salary calculator with AI explanations. Calculate monthly in-hand from CTC.",
    url: "https://aifinancecalculator.in/salary-calculator",
    category: "Finance",
    offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 lg:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SalaryCalculator />
    </div>
  );
}
