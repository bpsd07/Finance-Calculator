export interface PrepaymentResult {
  monthlyEMI: number;
  originalTotalInterest: number;
  originalTotalPayment: number;
  originalTenureMonths: number;
  
  prepaymentTotalInterest: number;
  prepaymentTotalPayment: number;
  prepaymentTenureMonths: number;
  
  interestSaved: number;
  monthsSaved: number;
  yearsSaved: number;
  
  scheduleComparison: ScheduleComparisonEntry[];
}

export interface ScheduleComparisonEntry {
  month: number;
  year: number;
  originalBalance: number;
  prepaymentBalance: number;
}

export function calculateLoanPrepayment(
  principal: number,
  annualRate: number,
  tenureYears: number,
  monthlyPrepayment: number,
  startMonth: number = 1
): PrepaymentResult {
  const monthlyRate = annualRate / 12 / 100;
  const originalTenureMonths = tenureYears * 12;

  // Calculate standard EMI
  let monthlyEMI = 0;
  if (monthlyRate === 0) {
    monthlyEMI = principal / originalTenureMonths;
  } else {
    monthlyEMI =
      (principal * monthlyRate * Math.pow(1 + monthlyRate, originalTenureMonths)) /
      (Math.pow(1 + monthlyRate, originalTenureMonths) - 1);
  }

  const originalTotalPayment = monthlyEMI * originalTenureMonths;
  const originalTotalInterest = originalTotalPayment - principal;

  // 1. Run Standard Schedule to compare remaining balances month-by-month
  let normalBalance = principal;
  const normalBalances: number[] = [principal];
  for (let m = 1; m <= originalTenureMonths; m++) {
    const interest = normalBalance * monthlyRate;
    const principalPaid = monthlyEMI - interest;
    normalBalance = Math.max(0, normalBalance - principalPaid);
    normalBalances.push(normalBalance);
  }

  // 2. Run Prepayment Schedule
  let prepBalance = principal;
  let prepTotalInterest = 0;
  let prepTotalPayment = 0;
  let prepMonths = 0;
  const prepBalances: number[] = [principal];

  for (let m = 1; m <= originalTenureMonths; m++) {
    if (prepBalance <= 0) {
      break;
    }

    const interest = prepBalance * monthlyRate;
    prepTotalInterest += interest;
    prepMonths++;

    // Standard EMI payment
    let standardPrincipalPaid = monthlyEMI - interest;
    
    // Check if extra prepayment is active for this month
    const extraPrepay = m >= startMonth ? monthlyPrepayment : 0;
    
    // Total principal being paid this month
    const totalPrincipalToPay = standardPrincipalPaid + extraPrepay;

    if (prepBalance <= totalPrincipalToPay) {
      // Loan finished!
      prepTotalPayment += prepBalance + interest;
      prepBalance = 0;
      prepBalances.push(0);
    } else {
      prepBalance -= totalPrincipalToPay;
      prepBalances.push(prepBalance);
      prepTotalPayment += monthlyEMI + extraPrepay;
    }
  }

  const interestSaved = Math.max(0, originalTotalInterest - prepTotalInterest);
  const monthsSaved = originalTenureMonths - prepMonths;
  const yearsSaved = Number((monthsSaved / 12).toFixed(1));

  // Generate a compressed yearly schedule comparison for charting
  const scheduleComparison: ScheduleComparisonEntry[] = [];
  
  // We'll sample yearly (every 12 months) + month 0 + final month
  scheduleComparison.push({
    month: 0,
    year: 0,
    originalBalance: Math.round(principal),
    prepaymentBalance: Math.round(principal),
  });

  for (let y = 1; y <= tenureYears; y++) {
    const m = y * 12;
    const origBal = m < normalBalances.length ? normalBalances[m] : 0;
    const prepBal = m < prepBalances.length ? prepBalances[m] : 0;

    scheduleComparison.push({
      month: m,
      year: y,
      originalBalance: Math.round(origBal),
      prepaymentBalance: Math.round(prepBal),
    });

    if (origBal === 0 && prepBal === 0) {
      break;
    }
  }

  return {
    monthlyEMI: Math.round(monthlyEMI),
    originalTotalInterest: Math.round(originalTotalInterest),
    originalTotalPayment: Math.round(originalTotalPayment),
    originalTenureMonths,
    
    prepaymentTotalInterest: Math.round(prepTotalInterest),
    prepaymentTotalPayment: Math.round(prepTotalPayment),
    prepaymentTenureMonths: prepMonths,
    
    interestSaved: Math.round(interestSaved),
    monthsSaved,
    yearsSaved,
    
    scheduleComparison,
  };
}
