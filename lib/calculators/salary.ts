import { calculateIncomeTax, type TaxInputs } from "./tax";

export interface SalaryComponent {
  label: string;
  amount: number;
  type: "earning" | "deduction" | "tax";
  description: string;
}

export interface SalaryBreakdown {
  ctc: number;
  basic: number;
  hra: number;
  specialAllowance: number;
  grossAnnual: number;
  grossMonthly: number;
  employerEPF: number;
  employeeEPF: number;
  gratuity: number;
  professionalTax: number;
  incomeTax: number;
  monthlyInHand: number;
  annualInHand: number;
  totalDeductions: number;
  deductionsPercent: number;
  takeHomePercent: number;
  components: SalaryComponent[];
}

export function calculateSalaryBreakdown(
  ctc: number,
  taxRegime: "new" | "old" = "new",
  deductions80C: number = 0,
  deductions80D: number = 0,
): SalaryBreakdown {
  const safeCtc = Math.max(0, Math.round(ctc || 0));

  // Standard Indian salary structure ratios
  const basic = Math.round(safeCtc * 0.40);
  const hra = Math.round(basic * 0.50); // HRA ~50% of basic for metro
  const specialAllowance = Math.round(safeCtc * 0.10);

  // Employer-side deductions
  const employerEPF = Math.round(basic * 0.12);
  const gratuity = Math.round(basic * 0.0481);

  // Gross annual = CTC minus employer-side deductions
  const grossAnnual = Math.max(0, safeCtc - employerEPF - gratuity);
  const grossMonthly = Math.round(grossAnnual / 12);

  // Employee-side deductions
  const employeeEPF = Math.round(basic * 0.12);
  const professionalTax = 2400; // Typical annual

  // Income tax — use the updated tax calculator
  const taxInputs: TaxInputs = {
    grossIncome: grossAnnual,
    isSalaried: true,
    ageGroup: "below60",
    investment80C: Math.min(deductions80C, 150000),
    healthInsurance80D: Math.min(deductions80D, 75000),
    hraReceived: hra,
    nps80CCD1B: 0,
    homeLoanInterest24b: 0,
    educationLoan80E: 0,
    otherIncome: 0,
  };
  const taxResult = calculateIncomeTax(taxInputs);
  const incomeTax = Math.round(
    taxRegime === "new" ? taxResult.newRegime.totalTax : taxResult.oldRegime.totalTax
  );

  // Monthly in-hand
  const annualDeductions = employeeEPF + professionalTax + incomeTax;
  const annualInHand = Math.max(0, grossAnnual - annualDeductions);
  const monthlyInHand = Math.round(annualInHand / 12);
  const totalDeductions = safeCtc - annualInHand;
  const deductionsPercent = safeCtc > 0 ? Math.round((totalDeductions / safeCtc) * 100) : 0;
  const takeHomePercent = 100 - deductionsPercent;

  const components: SalaryComponent[] = [
    { label: "Basic Salary", amount: basic * 12, type: "earning", description: "~40% of CTC, fully taxable" },
    { label: "HRA", amount: hra * 12, type: "earning", description: "House Rent Allowance, partially exempt" },
    { label: "Special Allowance", amount: specialAllowance * 12, type: "earning", description: "Residual component, fully taxable" },
    { label: "Employer EPF", amount: employerEPF, type: "deduction", description: "12% of basic, employer contribution" },
    { label: "Employee EPF", amount: employeeEPF, type: "deduction", description: "12% of basic, employee contribution" },
    { label: "Gratuity", amount: gratuity, type: "deduction", description: "~4.81% of basic, paid after 5 years" },
    { label: "Professional Tax", amount: professionalTax, type: "tax", description: "State government tax, ~₹200/month" },
    { label: "Income Tax", amount: incomeTax, type: "tax", description: `Under ${taxRegime.toUpperCase()} regime` },
  ];

  return {
    ctc: safeCtc,
    basic: Math.round(basic),
    hra: Math.round(hra),
    specialAllowance: Math.round(specialAllowance),
    grossAnnual,
    grossMonthly,
    employerEPF,
    employeeEPF,
    gratuity,
    professionalTax,
    incomeTax,
    monthlyInHand,
    annualInHand,
    totalDeductions,
    deductionsPercent,
    takeHomePercent,
    components,
  };
}
