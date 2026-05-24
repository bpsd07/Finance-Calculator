export interface EMIResult {
  monthlyEMI: number;
  totalInterest: number;
  totalPayment: number;
  principalPercent: number;
  interestPercent: number;
  amortizationSchedule: AmortizationEntry[];
}

export interface AmortizationEntry {
  year: number;
  principalPaid: number;
  interestPaid: number;
  totalPaid: number;
  remainingBalance: number;
}

export function calculateEMI(
  principal: number,
  annualRate: number,
  tenureYears: number
): EMIResult {
  const monthlyRate = annualRate / 12 / 100;
  const totalMonths = tenureYears * 12;

  let monthlyEMI = 0;
  if (monthlyRate === 0) {
    monthlyEMI = principal / totalMonths;
  } else {
    monthlyEMI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
      (Math.pow(1 + monthlyRate, totalMonths) - 1);
  }

  const totalPayment = monthlyEMI * totalMonths;
  const totalInterest = totalPayment - principal;

  const principalPercent = Math.round((principal / totalPayment) * 100);
  const interestPercent = 100 - principalPercent;

  // Generate Amortization Schedule (Year-by-Year)
  const amortizationSchedule: AmortizationEntry[] = [];
  let remainingBalance = principal;

  for (let year = 1; year <= tenureYears; year++) {
    let yearlyPrincipal = 0;
    let yearlyInterest = 0;

    for (let month = 1; month <= 12; month++) {
      const interestForMonth = remainingBalance * monthlyRate;
      const principalForMonth = monthlyEMI - interestForMonth;

      if (remainingBalance > 0) {
        const actualPrincipal = Math.min(principalForMonth, remainingBalance);
        yearlyPrincipal += actualPrincipal;
        yearlyInterest += interestForMonth;
        remainingBalance -= actualPrincipal;
      }
    }

    amortizationSchedule.push({
      year,
      principalPaid: Math.round(yearlyPrincipal),
      interestPaid: Math.round(yearlyInterest),
      totalPaid: Math.round(yearlyPrincipal + yearlyInterest),
      remainingBalance: Math.max(0, Math.round(remainingBalance)),
    });
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    principalPercent,
    interestPercent,
    amortizationSchedule,
  };
}
