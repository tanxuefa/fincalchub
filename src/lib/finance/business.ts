// Business & Real Estate Investing calculators

export interface ROIInput {
  initialInvestment: number;
  annualReturn: number;
  years: number;
  annualCosts?: number;
}

export interface ROIResult {
  totalReturn: number;
  roi: number; // percentage
  annualizedROI: number;
  netProfit: number;
  paybackPeriod: number; // years
}

export function calculateROI(input: ROIInput): ROIResult {
  const { initialInvestment, annualReturn, years, annualCosts = 0 } = input;

  const totalRevenue = annualReturn * years;
  const totalCosts = annualCosts * years;
  const netProfit = totalRevenue - totalCosts - initialInvestment;
  const roi = initialInvestment > 0 ? (netProfit / initialInvestment) * 100 : 0;
  const annualizedROI = (Math.pow(1 + roi / 100, 1 / years) - 1) * 100;
  const paybackPeriod = annualReturn > annualCosts ? initialInvestment / (annualReturn - annualCosts) : Infinity;

  return {
    totalReturn: Math.round(totalRevenue * 100) / 100,
    roi: Math.round(roi * 100) / 100,
    annualizedROI: Math.round(annualizedROI * 100) / 100,
    netProfit: Math.round(netProfit * 100) / 100,
    paybackPeriod: Math.round(paybackPeriod * 100) / 100,
  };
}

export interface RentalPropertyInput {
  purchasePrice: number;
  downPayment: number;
  interestRate: number;
  loanTerm: number;
  monthlyRent: number;
  vacancyRate?: number; // percentage
  propertyTax: number;
  insurance: number;
  maintenance: number; // annual
  propertyManagement?: number; // percentage of rent
  hoa?: number;
  appreciation?: number; // annual percentage
  holdYears?: number;
}

export interface RentalPropertyResult {
  monthlyCashflow: number;
  annualCashflow: number;
  cashOnCashReturn: number;
  capRate: number;
  totalReturn5Year: number;
  breakevenOccupancy: number;
  monthlyBreakdown: { income: number; expenses: number; cashflow: number };
}

export function calculateRentalProperty(input: RentalPropertyInput): RentalPropertyResult {
  const {
    purchasePrice,
    downPayment,
    interestRate,
    loanTerm,
    monthlyRent,
    vacancyRate = 5,
    propertyTax,
    insurance,
    maintenance,
    propertyManagement = 0,
    hoa = 0,
    appreciation = 3,
    holdYears = 5,
  } = input;

  const loanAmount = purchasePrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const totalPayments = loanTerm * 12;
  const monthlyPI =
    monthlyRate === 0
      ? loanAmount / totalPayments
      : (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalPayments)) /
        (Math.pow(1 + monthlyRate, totalPayments) - 1);

  const vacancyLoss = monthlyRent * (vacancyRate / 100);
  const grossIncome = monthlyRent - vacancyLoss;
  const managementFee = monthlyRent * (propertyManagement / 100);
  const expenses = propertyTax / 12 + insurance / 12 + maintenance / 12 + managementFee + hoa;
  const monthlyCashflow = grossIncome - monthlyPI - expenses;
  const annualCashflow = monthlyCashflow * 12;

  // Cash-on-cash return
  const totalInvestment = downPayment + purchasePrice * 0.03; // ~3% closing costs
  const cashOnCash = totalInvestment > 0 ? (annualCashflow / totalInvestment) * 100 : 0;

  // Cap rate
  const noi = (monthlyRent * 12) * (1 - vacancyRate / 100) - propertyTax - insurance - maintenance - managementFee * 12 - hoa * 12;
  const capRate = purchasePrice > 0 ? (noi / purchasePrice) * 100 : 0;

  // 5-year return (appreciation + cashflow)
  const futureValue = purchasePrice * Math.pow(1 + appreciation / 100, holdYears);
  const equityGain = futureValue - purchasePrice;
  const totalReturn5Year = equityGain + annualCashflow * holdYears;

  // Breakeven occupancy
  const totalMonthlyExpenses = monthlyPI + expenses;
  const breakevenOccupancy = monthlyRent > 0 ? (totalMonthlyExpenses / monthlyRent) * 100 : 100;

  return {
    monthlyCashflow: Math.round(monthlyCashflow * 100) / 100,
    annualCashflow: Math.round(annualCashflow * 100) / 100,
    cashOnCashReturn: Math.round(cashOnCash * 100) / 100,
    capRate: Math.round(capRate * 100) / 100,
    totalReturn5Year: Math.round(totalReturn5Year * 100) / 100,
    breakevenOccupancy: Math.round(breakevenOccupancy * 100) / 100,
    monthlyBreakdown: {
      income: Math.round(grossIncome * 100) / 100,
      expenses: Math.round(expenses * 100) / 100,
      cashflow: Math.round(monthlyCashflow * 100) / 100,
    },
  };
}

export interface BreakEvenInput {
  fixedCosts: number;
  variableCostPerUnit: number;
  pricePerUnit: number;
}

export interface BreakEvenResult {
  breakEvenUnits: number;
  breakEvenRevenue: number;
  contributionMargin: number;
  marginPerUnit: number;
}

export function calculateBreakEven(input: BreakEvenInput): BreakEvenResult {
  const { fixedCosts, variableCostPerUnit, pricePerUnit } = input;
  const marginPerUnit = pricePerUnit - variableCostPerUnit;
  const breakEvenUnits = marginPerUnit > 0 ? fixedCosts / marginPerUnit : Infinity;
  const contributionMargin = pricePerUnit > 0 ? (marginPerUnit / pricePerUnit) * 100 : 0;

  return {
    breakEvenUnits: Math.round(breakEvenUnits * 100) / 100,
    breakEvenRevenue: Math.round(breakEvenUnits * pricePerUnit * 100) / 100,
    contributionMargin: Math.round(contributionMargin * 100) / 100,
    marginPerUnit: Math.round(marginPerUnit * 100) / 100,
  };
}

export interface NPVInput {
  initialInvestment: number;
  cashFlows: number[];
  discountRate: number; // percentage
}

export interface NPVResult {
  npv: number;
  irr: number;
  profitabilityIndex: number;
  isPositive: boolean;
  discountedCashFlows: { year: number; cashflow: number; pv: number }[];
}

export function calculateNPV(input: NPVInput): NPVResult {
  const { initialInvestment, cashFlows, discountRate } = input;
  const rate = discountRate / 100;

  const discountedCashFlows = cashFlows.map((cf, i) => ({
    year: i + 1,
    cashflow: cf,
    pv: cf / Math.pow(1 + rate, i + 1),
  }));

  const totalPV = discountedCashFlows.reduce((s, d) => s + d.pv, 0);
  const npv = totalPV - initialInvestment;
  const profitabilityIndex = initialInvestment > 0 ? totalPV / initialInvestment : 0;

  // IRR via Newton's method
  let irrRate = 0.1;
  for (let iter = 0; iter < 100; iter++) {
    let npvVal = -initialInvestment;
    let npvDeriv = 0;
    for (let i = 0; i < cashFlows.length; i++) {
      npvVal += cashFlows[i] / Math.pow(1 + irrRate, i + 1);
      npvDeriv -= (i + 1) * cashFlows[i] / Math.pow(1 + irrRate, i + 2);
    }
    if (Math.abs(npvVal) < 0.01) break;
    if (npvDeriv === 0) break;
    irrRate -= npvVal / npvDeriv;
  }

  return {
    npv: Math.round(npv * 100) / 100,
    irr: Math.round(irrRate * 10000) / 100,
    profitabilityIndex: Math.round(profitabilityIndex * 1000) / 1000,
    isPositive: npv > 0,
    discountedCashFlows: discountedCashFlows.map(d => ({ ...d, pv: Math.round(d.pv * 100) / 100 })),
  };
}

export interface CashFlowInput {
  revenues: number[];
  expenses: number[];
  initialCash?: number;
}

export interface CashFlowResult {
  netCashFlows: number[];
  cumulativeCashFlow: number[];
  totalNet: number;
  averageMonthly: number;
  bestMonth: number;
  worstMonth: number;
}

export function calculateCashFlow(input: CashFlowInput): CashFlowResult {
  const { revenues, expenses, initialCash = 0 } = input;
  const netCashFlows = revenues.map((r, i) => r - expenses[i]);
  let cumulative = initialCash;
  const cumulativeCashFlow = netCashFlows.map(n => {
    cumulative += n;
    return cumulative;
  });

  return {
    netCashFlows: netCashFlows.map(n => Math.round(n * 100) / 100),
    cumulativeCashFlow: cumulativeCashFlow.map(c => Math.round(c * 100) / 100),
    totalNet: Math.round(netCashFlows.reduce((a, b) => a + b, 0) * 100) / 100,
    averageMonthly: Math.round((netCashFlows.reduce((a, b) => a + b, 0) / netCashFlows.length) * 100) / 100,
    bestMonth: netCashFlows.indexOf(Math.max(...netCashFlows)) + 1,
    worstMonth: netCashFlows.indexOf(Math.min(...netCashFlows)) + 1,
  };
}

export interface TVMInput {
  presentValue: number;
  payment: number;
  periods: number;
  interestRate: number;
  mode?: 'end' | 'beginning';
}

export interface TVMResult {
  futureValue: number;
  presentValue: number;
  totalPayments: number;
  totalInterest: number;
}

export function calculateTVM(input: TVMInput): TVMResult {
  const { presentValue, payment, periods, interestRate, mode = 'end' } = input;
  const rate = interestRate / 100;

  const futureValue =
    presentValue * Math.pow(1 + rate, periods) +
    payment * ((Math.pow(1 + rate, periods) - 1) / rate) * (mode === 'beginning' ? 1 + rate : 1);

  const totalPayments = payment * periods + presentValue;
  const totalInterest = futureValue - totalPayments;

  return {
    futureValue: Math.round(futureValue * 100) / 100,
    presentValue: Math.round(presentValue * 100) / 100,
    totalPayments: Math.round(totalPayments * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}
