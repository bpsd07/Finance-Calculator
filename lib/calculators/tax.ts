export interface DeductionEntry {
  section: string;
  name: string;
  amount: number;
  maxLimit: number;
  description: string;
}

export interface TaxDetails {
  grossIncome: number;
  standardDeduction: number;
  deductions: DeductionEntry[];
  totalDeductions: number;
  taxableIncome: number;
  baseTax: number;
  rebate87A: number;
  marginalRelief: number;
  cess: number;
  totalTax: number;
  effectiveTaxRate: number;
  monthlyTax: number;
  slabBreakdown: TaxSlabBreakdown[];
}

export interface TaxSlabBreakdown {
  slab: string;
  rate: number;
  taxableAmount: number;
  taxAmount: number;
}

export interface TaxComparisonResult {
  oldRegime: TaxDetails;
  newRegime: TaxDetails;
  betterRegime: "old" | "new" | "equal";
  taxSavings: number;
}

export interface TaxInputs {
  grossIncome: number;
  isSalaried: boolean;
  ageGroup: "below60" | "senior" | "supersenior";
  // Simple mode
  investment80C: number;
  healthInsurance80D: number;
  hraReceived: number;
  // Advanced mode
  nps80CCD1B: number;
  homeLoanInterest24b: number;
  educationLoan80E: number;
  otherIncome: number;
}

function getSlabsAnd87A(
  regime: "old" | "new",
  ageGroup: "below60" | "senior" | "supersenior"
): { slabs: { limit: number; rate: number }[]; rebateLimit: number; rebateMax: number; marginalRebateLimit: number } {
  if (regime === "old") {
    let slabs: { limit: number; rate: number }[];
    if (ageGroup === "below60") {
      slabs = [
        { limit: 250000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    } else if (ageGroup === "senior") {
      slabs = [
        { limit: 300000, rate: 0 },
        { limit: 500000, rate: 0.05 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    } else {
      slabs = [
        { limit: 500000, rate: 0 },
        { limit: 1000000, rate: 0.20 },
        { limit: Infinity, rate: 0.30 },
      ];
    }
    return { slabs, rebateLimit: 500000, rebateMax: 12500, marginalRebateLimit: 0 };
  }

  // New regime slabs (FY 2024-25)
  const slabs = [
    { limit: 300000, rate: 0 },
    { limit: 700000, rate: 0.05 },
    { limit: 1000000, rate: 0.10 },
    { limit: 1200000, rate: 0.15 },
    { limit: 1500000, rate: 0.20 },
    { limit: Infinity, rate: 0.30 },
  ];
  return { slabs, rebateLimit: 700000, rebateMax: 25000, marginalRebateLimit: 727777 };
}

function computeTaxForRegime(
  income: number,
  deductions: DeductionEntry[],
  stdDeduction: number,
  regime: "old" | "new",
  ageGroup: "below60" | "senior" | "supersenior",
): TaxDetails {
  const { slabs, rebateLimit, rebateMax, marginalRebateLimit } = getSlabsAnd87A(regime, ageGroup);
  const totalDeductions = stdDeduction + deductions.reduce((s, d) => s + d.amount, 0);
  const taxableIncome = Math.max(0, income - totalDeductions);

  let remaining = taxableIncome;
  let baseTax = 0;
  const slabBreakdown: TaxSlabBreakdown[] = [];
  let previousLimit = 0;

  for (const slab of slabs) {
    const slabWidth = slab.limit - previousLimit;
    const taxableAmountInSlab = Math.max(0, Math.min(remaining, slabWidth));
    const taxInSlab = taxableAmountInSlab * slab.rate;
    baseTax += taxInSlab;
    remaining -= taxableAmountInSlab;
    slabBreakdown.push({
      slab: slab.limit === Infinity
        ? `Above ₹${(previousLimit / 100000).toFixed(1)}L`
        : `₹${(previousLimit / 100000).toFixed(1)}L – ₹${(slab.limit / 100000).toFixed(1)}L`,
      rate: slab.rate * 100,
      taxableAmount: Math.round(taxableAmountInSlab),
      taxAmount: Math.round(taxInSlab),
    });
    previousLimit = slab.limit;
  }

  // 87A Rebate
  let rebate87A = 0;
  if (taxableIncome <= rebateLimit) {
    rebate87A = Math.min(baseTax, rebateMax);
  }

  // Marginal relief for new regime (income just above 7L)
  let marginalRelief = 0;
  if (regime === "new" && taxableIncome > 700000 && taxableIncome <= marginalRebateLimit) {
    const taxWithoutRebate = baseTax;
    const excessOver7L = taxableIncome - 700000;
    const maxTaxPayable = excessOver7L;
    if (taxWithoutRebate > maxTaxPayable) {
      marginalRelief = taxWithoutRebate - maxTaxPayable;
    }
  }

  const taxAfterRebate = Math.max(0, baseTax - rebate87A - marginalRelief);
  const cess = Math.round(taxAfterRebate * 0.04);
  const totalTax = Math.round(taxAfterRebate + cess);
  const effectiveTaxRate = income > 0 ? (totalTax / income) * 100 : 0;

  return {
    grossIncome: income,
    standardDeduction: stdDeduction,
    deductions,
    totalDeductions,
    taxableIncome: Math.round(taxableIncome),
    baseTax: Math.round(baseTax),
    rebate87A: Math.round(rebate87A),
    marginalRelief: Math.round(marginalRelief),
    cess,
    totalTax,
    effectiveTaxRate,
    monthlyTax: Math.round(totalTax / 12),
    slabBreakdown,
  };
}

export function calculateIncomeTax(inputs: TaxInputs): TaxComparisonResult {
  const { grossIncome, isSalaried, ageGroup, investment80C, healthInsurance80D, hraReceived, nps80CCD1B, homeLoanInterest24b, educationLoan80E, otherIncome } = inputs;

  const totalIncome = grossIncome + otherIncome;
  const stdDeductionOld = isSalaried ? 50000 : 0;
  const stdDeductionNew = isSalaried ? 75000 : 0;

  // Build deduction entries
  const oldDeductions: DeductionEntry[] = [];
  const newDeductions: DeductionEntry[] = [];

  // 80C
  const actual80C = Math.min(investment80C, 150000);
  if (actual80C > 0) {
    oldDeductions.push({ section: "80C", name: "PPF, ELSS, LIC, EPF", amount: actual80C, maxLimit: 150000, description: "Investments in specified instruments" });
  }

  // 80D
  const actual80D = Math.min(healthInsurance80D, ageGroup === "senior" ? 100000 : 75000);
  if (actual80D > 0) {
    oldDeductions.push({ section: "80D", name: "Health Insurance Premium", amount: actual80D, maxLimit: ageGroup === "senior" ? 100000 : 75000, description: "Medical insurance premiums" });
  }

  // HRA
  if (hraReceived > 0 && isSalaried) {
    // Simplified HRA: 50% of salary for metro, 40% for non-metro
    const hraExemption = Math.min(hraReceived, grossIncome * 0.5 - grossIncome * 0.1);
    const actualHRA = Math.max(0, Math.min(hraReceived, hraExemption));
    if (actualHRA > 0) {
      oldDeductions.push({ section: "HRA", name: "House Rent Allowance", amount: Math.round(actualHRA), maxLimit: hraReceived, description: "HRA exemption under Section 10(13A)" });
    }
  }

  // NPS 80CCD(1B) — additional ₹50,000
  const actualNPS = Math.min(nps80CCD1B, 50000);
  if (actualNPS > 0) {
    oldDeductions.push({ section: "80CCD(1B)", name: "NPS Additional (Self)", amount: actualNPS, maxLimit: 50000, description: "Additional NPS contribution for tax benefit" });
  }

  // Home Loan Interest 24(b)
  const actualHomeLoan = Math.min(homeLoanInterest24b, 200000);
  if (actualHomeLoan > 0) {
    oldDeductions.push({ section: "24(b)", name: "Home Loan Interest (Self-occupied)", amount: actualHomeLoan, maxLimit: 200000, description: "Interest on home loan for self-occupied property" });
  }

  // Education Loan 80E
  const actual80E = educationLoan80E;
  if (actual80E > 0) {
    oldDeductions.push({ section: "80E", name: "Education Loan Interest", amount: actual80E, maxLimit: Infinity, description: "Interest on education loan (no upper limit)" });
  }

  // New regime generally doesn't allow most deductions
  // But NPS employer contribution (80CCD(2)) is allowed — skip for simplicity
  // Actually NPS 80CCD(1B) is also not allowed in new regime

  const oldRegime = computeTaxForRegime(totalIncome, oldDeductions, stdDeductionOld, "old", ageGroup);
  const newRegime = computeTaxForRegime(totalIncome, newDeductions, stdDeductionNew, "new", ageGroup);

  let betterRegime: "old" | "new" | "equal" = "equal";
  let taxSavings = 0;

  if (oldRegime.totalTax < newRegime.totalTax) {
    betterRegime = "old";
    taxSavings = newRegime.totalTax - oldRegime.totalTax;
  } else if (newRegime.totalTax < oldRegime.totalTax) {
    betterRegime = "new";
    taxSavings = oldRegime.totalTax - newRegime.totalTax;
  }

  return { oldRegime, newRegime, betterRegime, taxSavings };
}
