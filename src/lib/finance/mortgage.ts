// Mortgage & Real Estate calculations

export interface MortgageInput {
  homePrice: number;
  downPayment: number;
  interestRate: number; // annual percentage
  loanTerm: number; // years
  propertyTax?: number; // annual
  homeInsurance?: number; // annual
  pmi?: number; // annual
  hoa?: number; // monthly
  extraPayment?: number; // monthly extra
}

export interface AmortizationRow {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  extraPayment: number;
  balance: number;
}

export interface MortgageResult {
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  principal: number;
  payoffDate: Date;
  schedule: AmortizationRow[];
}

export function calculateMortgage(input: MortgageInput): MortgageResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    propertyTax = 0,
    homeInsurance = 0,
    pmi = 0,
    hoa = 0,
    extraPayment = 0,
  } = input;

  const principal = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  const basePayment =
    monthlyRate === 0
      ? principal / totalPayments
      : (principal * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const taxMonthly = propertyTax / 12;
  const insuranceMonthly = homeInsurance / 12;
  const pmiMonthly = pmi / 12;

  const totalMonthlyPayment = basePayment + taxMonthly + insuranceMonthly + pmiMonthly + hoa;

  let balance = principal;
  const schedule: AmortizationRow[] = [];
  let totalInterest = 0;
  let month = 0;

  while (balance > 0 && month < totalPayments * 2) {
    month++;
    const interestPayment = balance * monthlyRate;
    let principalPayment = basePayment - interestPayment;
    const totalExtra = extraPayment;

    if (principalPayment + totalExtra >= balance) {
      principalPayment = balance;
      balance = 0;
    } else {
      balance -= principalPayment + totalExtra;
    }

    totalInterest += interestPayment;

    schedule.push({
      month,
      payment: basePayment + totalExtra,
      principal: principalPayment + totalExtra,
      interest: interestPayment,
      extraPayment: totalExtra,
      balance: Math.max(0, balance),
    });

    if (balance <= 0) break;
  }

  const payoffDate = new Date();
  payoffDate.setMonth(payoffDate.getMonth() + month);

  return {
    monthlyPayment: totalMonthlyPayment,
    totalPayment: schedule.reduce((s, r) => s + r.payment, 0),
    totalInterest,
    principal,
    payoffDate,
    schedule,
  };
}

export interface RefinanceInput {
  currentBalance: number;
  currentRate: number;
  currentTermRemaining: number; // months
  newRate: number;
  newTerm: number; // years
  closingCosts: number;
}

export interface RefinanceResult {
  currentMonthly: number;
  newMonthly: number;
  monthlySavings: number;
  breakEvenMonths: number;
  totalSavings: number;
  isWorthwhile: boolean;
}

export function calculateRefinance(input: RefinanceInput): RefinanceResult {
  const { currentBalance, currentRate, currentTermRemaining, newRate, newTerm, closingCosts } =
    input;

  const currentMonthlyRate = currentRate / 100 / 12;
  const newMonthlyRate = newRate / 100 / 12;

  const currentMonthly =
    currentMonthlyRate === 0
      ? currentBalance / currentTermRemaining
      : (currentBalance * currentMonthlyRate * Math.pow(1 + currentMonthlyRate, currentTermRemaining)) /
        (Math.pow(1 + currentMonthlyRate, currentTermRemaining) - 1);

  const newTotalPayments = newTerm * 12;
  const newMonthly =
    newMonthlyRate === 0
      ? currentBalance / newTotalPayments
      : (currentBalance * newMonthlyRate * Math.pow(1 + newMonthlyRate, newTotalPayments)) /
        (Math.pow(1 + newMonthlyRate, newTotalPayments) - 1);

  const monthlySavings = currentMonthly - newMonthly;
  const breakEvenMonths = monthlySavings > 0 ? Math.ceil(closingCosts / monthlySavings) : Infinity;
  const totalCostCurrent = currentMonthly * currentTermRemaining;
  const totalCostNew = newMonthly * newTotalPayments + closingCosts;
  const totalSavings = totalCostCurrent - totalCostNew;

  return {
    currentMonthly,
    newMonthly,
    monthlySavings,
    breakEvenMonths,
    totalSavings,
    isWorthwhile: totalSavings > 0,
  };
}

export interface AffordabilityInput {
  annualIncome: number;
  monthlyDebts: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  propertyTaxRate?: number; // percentage of home value
  homeInsurance?: number;
  hoa?: number;
  maxDTI?: number; // max debt-to-income ratio (default 36%)
}

export interface AffordabilityResult {
  maxHomePrice: number;
  maxLoan: number;
  monthlyPayment: number;
  breakdown: {
    principal: number;
    tax: number;
    insurance: number;
    pmi: number;
    hoa: number;
    debts: number;
  };
}

export function calculateAffordability(input: AffordabilityInput): AffordabilityResult {
  const {
    annualIncome,
    monthlyDebts,
    downPayment,
    interestRate,
    loanTerm,
    propertyTaxRate = 1.2,
    homeInsurance = 1200,
    hoa = 0,
    maxDTI = 36,
  } = input;

  const monthlyIncome = annualIncome / 12;
  const maxTotalMonthly = monthlyIncome * (maxDTI / 100);
  const maxHousingPayment = maxTotalMonthly - monthlyDebts;

  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;

  // Solve for max loan given max housing payment (excluding tax/insurance)
  const monthlyPIPerDollar =
    monthlyRate === 0
      ? 1 / totalPayments
      : monthlyRate / (1 - Math.pow(1 + monthlyRate, -totalPayments));

  // Binary search for max home price
  let low = downPayment;
  let high = downPayment + (maxHousingPayment * 12 * loanTerm); // rough upper bound
  for (let i = 0; i < 50; i++) {
    const mid = (low + high) / 2;
    const loan = mid - downPayment;
    const piPayment = loan * monthlyPIPerDollar;
    const taxMonthly = (mid * (propertyTaxRate / 100)) / 12;
    const insuranceMonthly = homeInsurance / 12;
    const totalPayment = piPayment + taxMonthly + insuranceMonthly + hoa;

    if (totalPayment > maxHousingPayment) {
      high = mid;
    } else {
      low = mid;
    }
  }
  const maxHomePrice = (low + high) / 2;

  const maxLoan = maxHomePrice - downPayment;
  const piPayment = maxLoan * monthlyPIPerDollar;

  return {
    maxHomePrice: Math.round(maxHomePrice),
    maxLoan: Math.round(maxLoan),
    monthlyPayment: piPayment + (maxHomePrice * (propertyTaxRate / 100)) / 12 + homeInsurance / 12 + hoa,
    breakdown: {
      principal: piPayment,
      tax: (maxHomePrice * (propertyTaxRate / 100)) / 12,
      insurance: homeInsurance / 12,
      pmi: downPayment < maxHomePrice * 0.2 ? maxLoan * 0.005 / 12 : 0,
      hoa,
      debts: monthlyDebts,
    },
  };
}

export interface RentVsBuyInput {
  homePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  rentIncreaseRate: number; // annual
  homeAppreciationRate: number; // annual
  propertyTaxRate: number;
  homeInsurance: number;
  maintenanceRate: number; // % of home value
  yearsToStay: number;
  closingCostsBuy: number; // % of home price
  closingCostsSell: number; // % of home price
  investmentReturnRate: number; // return on invested down payment if renting
}

export interface RentVsBuyResult {
  totalCostBuying: number;
  totalCostRenting: number;
  netProceedsBuying: number;
  netProceedsRenting: number;
  recommendation: 'buy' | 'rent';
  difference: number;
  breakEvenYear: number | null;
  yearlyComparison: { year: number; buyCost: number; rentCost: number; buyEquity: number; rentSavings: number }[];
}

export function calculateRentVsBuy(input: RentVsBuyInput): RentVsBuyResult {
  const {
    homePrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    rentIncreaseRate,
    homeAppreciationRate,
    propertyTaxRate,
    homeInsurance,
    maintenanceRate,
    yearsToStay,
    closingCostsBuy,
    closingCostsSell,
    investmentReturnRate,
  } = input;

  const loanAmount = homePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  const monthlyPI =
    monthlyRate === 0
      ? loanAmount / totalPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

  let totalBuyCost = 0;
  let totalRentCost = 0;
  let investedDownPayment = downPayment + homePrice * (closingCostsBuy / 100);
  let homeValue = homePrice;
  let balance = loanAmount;
  let buyEquity = downPayment;
  let rentSavings = investedDownPayment;
  const yearlyComparison: RentVsBuyResult['yearlyComparison'] = [];
  let breakEvenYear: number | null = null;

  for (let year = 1; year <= yearsToStay; year++) {
    const currentRent = monthlyRent * Math.pow(1 + rentIncreaseRate / 100, year - 1);

    // Buying costs this year
    let yearlyBuyCost = 0;
    for (let m = 0; m < 12; m++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = Math.min(monthlyPI - interestPayment, balance);
      yearlyBuyCost += monthlyPI + (homeValue * (propertyTaxRate / 100)) / 12 + homeInsurance / 12 + (homeValue * (maintenanceRate / 100)) / 12;
      balance -= principalPayment;
      buyEquity += principalPayment;
    }

    // Renting costs this year
    let yearlyRentCost = currentRent * 12;
    rentSavings += yearlyRentCost - yearlyBuyCost;
    rentSavings *= 1 + investmentReturnRate / 100;

    homeValue *= 1 + homeAppreciationRate / 100;
    buyEquity = homeValue - balance;

    totalBuyCost += yearlyBuyCost;
    totalRentCost += yearlyRentCost;

    const netBuyEquity = buyEquity - homeValue * (closingCostsSell / 100);

    yearlyComparison.push({
      year,
      buyCost: yearlyBuyCost,
      rentCost: yearlyRentCost,
      buyEquity: netBuyEquity,
      rentSavings,
    });

    if (breakEvenYear === null && netBuyEquity > rentSavings) {
      breakEvenYear = year;
    }
  }

  const netProceedsBuying = buyEquity - homeValue * (closingCostsSell / 100) - totalBuyCost;
  const netProceedsRenting = rentSavings - totalRentCost;

  return {
    totalCostBuying: totalBuyCost,
    totalCostRenting: totalRentCost,
    netProceedsBuying,
    netProceedsRenting,
    recommendation: netProceedsBuying > netProceedsRenting ? 'buy' : 'rent',
    difference: netProceedsBuying - netProceedsRenting,
    breakEvenYear,
    yearlyComparison,
  };
}

export function calculatePMI(
  homePrice: number,
  downPayment: number,
  annualPMIRate: number = 0.005
): { monthlyPMI: number; monthlyPMIPayment: number; monthsUntilRemoval: number } {
  const ltv = ((homePrice - downPayment) / homePrice) * 100;
  if (ltv <= 80) return { monthlyPMI: 0, monthlyPMIPayment: 0, monthsUntilRemoval: 0 };
  const pmiAmount = (homePrice - downPayment) * annualPMIRate;
  const monthlyPMIPayment = pmiAmount / 12;

  // months until LTV reaches 78% (automatic termination)
  const targetBalance = homePrice * 0.78;
  const monthsUntilRemoval = Infinity; // Simplified; real calculation needs amortization

  return { monthlyPMI: pmiAmount, monthlyPMIPayment, monthsUntilRemoval: 0 };
}
