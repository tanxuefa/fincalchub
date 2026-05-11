// Investment & Retirement calculations

export interface CompoundInterestInput {
  principal: number;
  monthlyContribution: number;
  annualRate: number; // percentage
  years: number;
  compoundFrequency?: 'daily' | 'monthly' | 'quarterly' | 'annually';
  inflationRate?: number;
}

export interface CompoundInterestResult {
  totalInvested: number;
  totalInterest: number;
  finalValue: number;
  inflationAdjustedValue: number;
  yearlyBreakdown: { year: number; balance: number; contributions: number; interest: number }[];
}

export function calculateCompoundInterest(input: CompoundInterestInput): CompoundInterestResult {
  const { principal, monthlyContribution, annualRate, years, compoundFrequency = 'monthly', inflationRate = 0 } = input;

  const rateMap = { daily: 365, monthly: 12, quarterly: 4, annually: 1 };
  const periodsPerYear = rateMap[compoundFrequency];
  const ratePerPeriod = annualRate / 100 / periodsPerYear;
  const totalPeriods = years * periodsPerYear;

  let balance = principal;
  let totalContributions = principal;
  const yearlyBreakdown: CompoundInterestResult['yearlyBreakdown'] = [];

  const monthlyPerPeriod = periodsPerYear / 12;

  for (let period = 1; period <= totalPeriods; period++) {
    balance += monthlyContribution / monthlyPerPeriod;
    totalContributions += monthlyContribution / monthlyPerPeriod;
    balance *= 1 + ratePerPeriod;

    if (period % periodsPerYear === 0) {
      const year = period / periodsPerYear;
      yearlyBreakdown.push({
        year,
        balance: Math.round(balance * 100) / 100,
        contributions: Math.round((totalContributions) * 100) / 100,
        interest: Math.round((balance - totalContributions) * 100) / 100,
      });
    }
  }

  const finalValue = balance;
  const inflationAdjustedValue = finalValue / Math.pow(1 + inflationRate / 100, years);

  return {
    totalInvested: Math.round(totalContributions * 100) / 100,
    totalInterest: Math.round((finalValue - totalContributions) * 100) / 100,
    finalValue: Math.round(finalValue * 100) / 100,
    inflationAdjustedValue: Math.round(inflationAdjustedValue * 100) / 100,
    yearlyBreakdown,
  };
}

export interface RetirementInput {
  currentAge: number;
  retirementAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  employerMatch?: number; // percentage
  employerMatchCap?: number; // percentage of salary matched
  annualSalary: number;
  withdrawalRate?: number; // safe withdrawal rate
  lifeExpectancy?: number;
}

export interface RetirementResult {
  savingsAtRetirement: number;
  monthlyRetirementIncome: number;
  totalContributions: number;
  employerContributions: number;
  yearsOfRetirement: number;
  savingsDepleted: boolean;
  yearlyBreakdown: { age: number; balance: number; contributions: number }[];
}

export function calculateRetirement(input: RetirementInput): RetirementResult {
  const {
    currentAge,
    retirementAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    employerMatch = 0,
    employerMatchCap = 6,
    annualSalary,
    withdrawalRate = 4,
    lifeExpectancy = 90,
  } = input;

  const years = retirementAge - currentAge;
  const monthlyRate = annualReturn / 100 / 12;
  let balance = currentSavings;
  let totalContributions = 0;
  let totalEmployer = 0;

  const yearlyBreakdown: RetirementResult['yearlyBreakdown'] = [];

  for (let age = currentAge; age < retirementAge; age++) {
    for (let m = 0; m < 12; m++) {
      const match = Math.min(monthlyContribution * (employerMatch / 100), (annualSalary / 12) * (employerMatchCap / 100));
      balance += monthlyContribution + match;
      totalContributions += monthlyContribution;
      totalEmployer += match;
      balance *= 1 + monthlyRate;
    }
    yearlyBreakdown.push({ age: age + 1, balance: Math.round(balance), contributions: Math.round(totalContributions + totalEmployer) });
  }

  const retirementYears = lifeExpectancy - retirementAge;
  const monthlyWithdrawal = (balance * (withdrawalRate / 100)) / 12;
  const requiredForLife = balance / (retirementYears * 12);

  return {
    savingsAtRetirement: Math.round(balance),
    monthlyRetirementIncome: Math.round(monthlyWithdrawal),
    totalContributions: Math.round(totalContributions),
    employerContributions: Math.round(totalEmployer),
    yearsOfRetirement: retirementYears,
    savingsDepleted: monthlyWithdrawal * 12 * retirementYears > balance,
    yearlyBreakdown,
  };
}

export interface CAGRInput {
  initialValue: number;
  finalValue: number;
  years: number;
  contributions?: number; // total added
}

export interface CAGRResult {
  cagr: number; // percentage
  totalReturn: number;
  absoluteReturn: number;
  annualizedReturnWithContributions: number;
}

export function calculateCAGR(input: CAGRInput): CAGRResult {
  const { initialValue, finalValue, years, contributions = 0 } = input;
  const absoluteReturn = finalValue - initialValue;
  const totalReturn = ((finalValue - initialValue) / initialValue) * 100;

  let cagr: number;
  if (years > 0 && initialValue > 0) {
    cagr = (Math.pow(finalValue / initialValue, 1 / years) - 1) * 100;
  } else {
    cagr = 0;
  }

  const annualReturnWithContrib = contributions > 0 && years > 0
    ? ((finalValue - contributions) / initialValue > 0 ? (Math.pow((finalValue - contributions) / initialValue, 1 / years) - 1) * 100 : 0)
    : cagr;

  return {
    cagr: Math.round(cagr * 100) / 100,
    totalReturn: Math.round(totalReturn * 100) / 100,
    absoluteReturn: Math.round(absoluteReturn * 100) / 100,
    annualizedReturnWithContributions: Math.round(annualReturnWithContrib * 100) / 100,
  };
}

export interface DCAInput {
  investmentPerPeriod: number;
  periods: number;
  annualReturn: number;
  initialInvestment?: number;
}

export interface DCAResult {
  totalInvested: number;
  finalValue: number;
  totalGain: number;
  averageCostPerShare: number;
}

export function calculateDCA(input: DCAInput): DCAResult {
  const { investmentPerPeriod, periods, annualReturn, initialInvestment = 0 } = input;
  const periodRate = annualReturn / 100 / 12;
  let balance = initialInvestment;
  let totalInvested = initialInvestment;
  let totalShares = 0;
  let sharePrice = 10; // Starting share price for cost basis calc

  for (let p = 0; p < periods; p++) {
    sharePrice *= 1 + periodRate + (Math.random() - 0.5) * 0.04; // Simulated volatility
    totalShares += investmentPerPeriod / sharePrice;
    totalInvested += investmentPerPeriod;
    balance = totalShares * sharePrice;
  }

  return {
    totalInvested: Math.round(totalInvested * 100) / 100,
    finalValue: Math.round(balance * 100) / 100,
    totalGain: Math.round((balance - totalInvested) * 100) / 100,
    averageCostPerShare: Math.round((totalInvested / totalShares) * 100) / 100,
  };
}

export interface FIREInput {
  currentAnnualExpenses: number;
  currentSavings: number;
  annualIncome: number;
  savingsRate: number; // percentage of income saved
  annualReturn: number;
  withdrawalRate?: number; // safe withdrawal rate (default 4%)
  inflationRate?: number;
}

export interface FIREResult {
  fireNumber: number; // 25x annual expenses
  yearsToFI: number;
  fiDate: Date;
  monthlySaving: number;
  coastFIYears: number;
  leanFI: number;
  fatFI: number;
  yearlyBreakdown: { year: number; balance: number; expenses: number }[];
}

export function calculateFIRE(input: FIREInput): FIREResult {
  const {
    currentAnnualExpenses,
    currentSavings,
    annualIncome,
    savingsRate,
    annualReturn,
    withdrawalRate = 4,
    inflationRate = 3,
  } = input;

  const fireNumber = currentAnnualExpenses * (100 / withdrawalRate);
  const monthlySaving = (annualIncome * (savingsRate / 100)) / 12;
  const monthlyReturn = annualReturn / 100 / 12;

  let balance = currentSavings;
  let years = 0;
  const yearlyBreakdown: FIREResult['yearlyBreakdown'] = [];
  let inflationAdjustedExpenses = currentAnnualExpenses;

  while (balance < fireNumber && years < 80) {
    for (let m = 0; m < 12; m++) {
      balance += monthlySaving;
      balance *= 1 + monthlyReturn;
    }
    years++;
    inflationAdjustedExpenses *= 1 + inflationRate / 100;
    yearlyBreakdown.push({ year: years, balance: Math.round(balance), expenses: Math.round(inflationAdjustedExpenses) });
  }

  const fiDate = new Date();
  fiDate.setFullYear(fiDate.getFullYear() + years);

  // Coast FI: when you can stop saving and still hit FI by 65
  const coastYears = 65 - (fiDate.getFullYear() - years) > 0 ? 65 - (fiDate.getFullYear() - years) : 0;
  let coastBalance = currentSavings;
  const coastFireTarget = fireNumber / Math.pow(1 + annualReturn / 100, coastYears);
  let coastFIYears = 0;
  while (coastBalance < coastFireTarget && coastFIYears < coastYears) {
    for (let m = 0; m < 12; m++) {
      coastBalance += monthlySaving;
      coastBalance *= 1 + monthlyReturn;
    }
    coastFIYears++;
  }

  return {
    fireNumber: Math.round(fireNumber),
    yearsToFI: years,
    fiDate,
    monthlySaving: Math.round(monthlySaving),
    coastFIYears: Math.max(0, coastYears - coastFIYears),
    leanFI: Math.round(fireNumber * 0.75),
    fatFI: Math.round(fireNumber * 1.5),
    yearlyBreakdown,
  };
}

export interface DRIPInput {
  initialInvestment: number;
  sharePrice: number;
  annualDividendYield: number; // percentage
  dividendGrowthRate: number;
  sharePriceGrowth: number;
  years: number;
  dripDiscount?: number; // percentage discount on DRIP shares
}

export interface DRIPResult {
  finalValue: number;
  totalDividends: number;
  shares: number;
  finalSharePrice: number;
  yearlyBreakdown: { year: number; shares: number; dividends: number; value: number }[];
}

export function calculateDRIP(input: DRIPInput): DRIPResult {
  const { initialInvestment, sharePrice, annualDividendYield, dividendGrowthRate, sharePriceGrowth, years, dripDiscount = 0 } = input;

  let shares = initialInvestment / sharePrice;
  let currentPrice = sharePrice;
  let dividendPerShare = sharePrice * (annualDividendYield / 100);
  let totalDividends = 0;

  const yearlyBreakdown: DRIPResult['yearlyBreakdown'] = [];

  for (let y = 1; y <= years; y++) {
    const annualDividend = shares * dividendPerShare;
    totalDividends += annualDividend;
    const dripPrice = currentPrice * (1 - dripDiscount / 100);
    shares += annualDividend / dripPrice;
    currentPrice *= 1 + sharePriceGrowth / 100;
    dividendPerShare *= 1 + dividendGrowthRate / 100;

    yearlyBreakdown.push({
      year: y,
      shares: Math.round(shares * 1000) / 1000,
      dividends: Math.round(annualDividend * 100) / 100,
      value: Math.round(shares * currentPrice * 100) / 100,
    });
  }

  return {
    finalValue: Math.round(shares * currentPrice * 100) / 100,
    totalDividends: Math.round(totalDividends * 100) / 100,
    shares: Math.round(shares * 1000) / 1000,
    finalSharePrice: Math.round(currentPrice * 100) / 100,
    yearlyBreakdown,
  };
}
