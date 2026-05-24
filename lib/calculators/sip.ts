export interface SIPResult {
  totalInvestment: number;
  estimatedReturns: number;
  totalValue: number;
  investmentPercent: number;
  returnsPercent: number;
  yearlyGrowth: YearlyGrowthEntry[];
}

export interface YearlyGrowthEntry {
  year: number;
  totalInvested: number;
  estimatedReturns: number;
  futureValue: number;
}

export function calculateSIP(
  monthlyInvestment: number,
  expectedReturnRate: number,
  years: number
): SIPResult {
  const monthlyRate = expectedReturnRate / 12 / 100;
  const totalMonths = years * 12;

  let totalValue = 0;
  if (monthlyRate === 0) {
    totalValue = monthlyInvestment * totalMonths;
  } else {
    // Standard SIP Formula
    // FV = P * [((1 + r)^n - 1) / r] * (1 + r)
    totalValue =
      monthlyInvestment *
      ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) *
      (1 + monthlyRate);
  }

  const totalInvestment = monthlyInvestment * totalMonths;
  const estimatedReturns = Math.max(0, totalValue - totalInvestment);

  const investmentPercent = Math.round((totalInvestment / totalValue) * 100) || 50;
  const returnsPercent = 100 - investmentPercent;

  // Generate Year-by-Year Growth Table
  const yearlyGrowth: YearlyGrowthEntry[] = [];
  for (let year = 1; year <= years; year++) {
    const months = year * 12;
    let yearValue = 0;

    if (monthlyRate === 0) {
      yearValue = monthlyInvestment * months;
    } else {
      yearValue =
        monthlyInvestment *
        ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
        (1 + monthlyRate);
    }

    const yearInvested = monthlyInvestment * months;
    const yearReturns = Math.max(0, yearValue - yearInvested);

    yearlyGrowth.push({
      year,
      totalInvested: Math.round(yearInvested),
      estimatedReturns: Math.round(yearReturns),
      futureValue: Math.round(yearValue),
    });
  }

  return {
    totalInvestment: Math.round(totalInvestment),
    estimatedReturns: Math.round(estimatedReturns),
    totalValue: Math.round(totalValue),
    investmentPercent,
    returnsPercent,
    yearlyGrowth,
  };
}
