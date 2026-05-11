// Savings calculators
import { calculateCompoundInterest } from './investment';

export interface SavingsGoalInput {
  targetAmount: number;
  currentSavings: number;
  monthlyContribution: number;
  annualInterestRate: number;
}

export interface SavingsGoalResult {
  monthsToGoal: number;
  targetDate: Date;
  finalBalance: number;
  totalContributions: number;
  totalInterest: number;
}

export function calculateSavingsGoal(input: SavingsGoalInput): SavingsGoalResult {
  const { targetAmount, currentSavings, monthlyContribution, annualInterestRate } = input;
  const monthlyRate = annualInterestRate / 100 / 12;

  let balance = currentSavings;
  let months = 0;
  let totalInterest = 0;

  while (balance < targetAmount && months < 1200) {
    balance += monthlyContribution;
    const interest = balance * monthlyRate;
    balance += interest;
    totalInterest += interest;
    months++;
  }

  const targetDate = new Date();
  targetDate.setMonth(targetDate.getMonth() + months);

  return {
    monthsToGoal: months,
    targetDate,
    finalBalance: Math.round(balance * 100) / 100,
    totalContributions: Math.round(monthlyContribution * months * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
  };
}

export interface EmergencyFundInput {
  monthlyExpenses: number;
  currentSavings: number;
  monthlyContribution: number;
  targetMonths?: number; // default 6 months
  interestRate?: number;
}

export interface EmergencyFundResult {
  targetAmount: number;
  progress: number; // percentage
  monthsToGoal: number;
  threeMonthTarget: number;
  sixMonthTarget: number;
  nineMonthTarget: number;
  recommendation: string;
}

export function calculateEmergencyFund(input: EmergencyFundInput): EmergencyFundResult {
  const { monthlyExpenses, currentSavings, monthlyContribution, targetMonths = 6, interestRate = 0 } = input;

  const threeMonth = monthlyExpenses * 3;
  const sixMonth = monthlyExpenses * 6;
  const nineMonth = monthlyExpenses * 9;
  const targetAmount = monthlyExpenses * targetMonths;

  const progress = targetAmount > 0 ? (currentSavings / targetAmount) * 100 : 100;

  const result = calculateSavingsGoal({
    targetAmount,
    currentSavings,
    monthlyContribution,
    annualInterestRate: interestRate,
  });

  let recommendation: string;
  if (progress >= 100) recommendation = 'fully_funded';
  else if (progress >= 75) recommendation = 'nearly_there';
  else if (monthlyContribution >= monthlyExpenses * 0.2) recommendation = 'on_track';
  else recommendation = 'increase_savings';

  return {
    targetAmount: Math.round(targetAmount),
    progress: Math.round(progress * 10) / 10,
    monthsToGoal: result.monthsToGoal,
    threeMonthTarget: Math.round(threeMonth),
    sixMonthTarget: Math.round(sixMonth),
    nineMonthTarget: Math.round(nineMonth),
    recommendation,
  };
}

export interface CDInput {
  depositAmount: number;
  annualInterestRate: number; // APY
  termMonths: number;
  compoundFrequency?: 'daily' | 'monthly' | 'quarterly' | 'annually';
  earlyWithdrawalPenalty?: number; // months of interest
}

export interface CDResult {
  finalValue: number;
  totalInterest: number;
  effectiveAnnualYield: number;
  earlyWithdrawalValue: number;
  comparisonToSavings: number; // vs 0.01% savings
}

export function calculateCD(input: CDInput): CDResult {
  const { depositAmount, annualInterestRate, termMonths, compoundFrequency = 'monthly', earlyWithdrawalPenalty = 3 } = input;

  const freqMap = { daily: 365, monthly: 12, quarterly: 4, annually: 1 };
  const periodsPerYear = freqMap[compoundFrequency];
  const ratePerPeriod = annualInterestRate / 100 / periodsPerYear;
  const totalPeriods = (termMonths / 12) * periodsPerYear;

  let balance = depositAmount;
  for (let i = 0; i < totalPeriods; i++) {
    balance *= 1 + ratePerPeriod;
  }

  const totalInterest = balance - depositAmount;

  // Early withdrawal penalty
  const monthlyRate = annualInterestRate / 100 / 12;
  const penalty = monthlyRate * depositAmount * earlyWithdrawalPenalty;
  const earlyWithdrawalValue = balance - penalty;

  // Compare to 0.01% savings account
  const savingsRate = 0.01 / 100 / 12;
  let savingsBalance = depositAmount;
  for (let i = 0; i < termMonths; i++) {
    savingsBalance *= 1 + savingsRate;
  }

  return {
    finalValue: Math.round(balance * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    effectiveAnnualYield: annualInterestRate,
    earlyWithdrawalValue: Math.round(earlyWithdrawalValue * 100) / 100,
    comparisonToSavings: Math.round((balance - savingsBalance) * 100) / 100,
  };
}

export interface College529Input {
  childAge: number;
  collegeStartAge: number;
  currentSavings: number;
  monthlyContribution: number;
  annualReturn: number;
  annualCollegeCost: number;
  collegeInflationRate?: number;
  collegeYears?: number;
}

export interface College529Result {
  projectedCollegeCost: number;
  totalProjectedCost: number;
  savingsAtCollege: number;
  gap: number;
  monthlyNeededToCloseGap: number;
  funded: boolean;
}

export function calculateCollege529(input: College529Input): College529Result {
  const {
    childAge,
    collegeStartAge,
    currentSavings,
    monthlyContribution,
    annualReturn,
    annualCollegeCost,
    collegeInflationRate = 5,
    collegeYears = 4,
  } = input;

  const yearsUntilCollege = collegeStartAge - childAge;
  const inflatedAnnualCost = annualCollegeCost * Math.pow(1 + collegeInflationRate / 100, yearsUntilCollege);
  const totalProjectedCost = inflatedAnnualCost * collegeYears;

  const compound = calculateCompoundInterest({
    principal: currentSavings,
    monthlyContribution,
    annualRate: annualReturn,
    years: yearsUntilCollege,
  });

  const savingsAtCollege = compound.finalValue;
  const gap = totalProjectedCost - savingsAtCollege;

  // Monthly needed to close gap (saving from now until college)
  const monthlyRate = annualReturn / 100 / 12;
  const totalMonths = yearsUntilCollege * 12;
  const monthlyNeeded =
    monthlyRate === 0
      ? gap / totalMonths
      : (gap * monthlyRate) / (Math.pow(1 + monthlyRate, totalMonths) - 1);

  return {
    projectedCollegeCost: Math.round(inflatedAnnualCost),
    totalProjectedCost: Math.round(totalProjectedCost),
    savingsAtCollege: Math.round(savingsAtCollege),
    gap: Math.round(gap),
    monthlyNeededToCloseGap: Math.round(Math.max(0, monthlyNeeded) * 100) / 100,
    funded: gap <= 0,
  };
}
