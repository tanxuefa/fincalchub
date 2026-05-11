import { describe, it, expect } from 'vitest';
import { calculateCompoundInterest, calculateCAGR, calculateFIRE } from '@/lib/finance';

describe('calculateCompoundInterest', () => {
  it('grows money over time with contributions', () => {
    const result = calculateCompoundInterest({
      principal: 10000,
      monthlyContribution: 500,
      annualRate: 7,
      years: 20,
    });
    expect(result.finalValue).toBeGreaterThan(10000);
    expect(result.totalInvested).toBeGreaterThan(10000);
    expect(result.totalInterest).toBeGreaterThan(0);
  });

  it('with 0% return, final value equals contributions plus principal', () => {
    const result = calculateCompoundInterest({
      principal: 1000,
      monthlyContribution: 100,
      annualRate: 0,
      years: 10,
    });
    expect(result.finalValue).toBeCloseTo(1000 + 100 * 12 * 10, -1);
  });
});

describe('calculateCAGR', () => {
  it('calculates correct CAGR for known values', () => {
    const result = calculateCAGR({
      initialValue: 10000,
      finalValue: 20000,
      years: 5,
    });
    expect(result.cagr).toBeCloseTo(14.87, 1);
  });

  it('returns 0 CAGR for zero initial value', () => {
    const result = calculateCAGR({
      initialValue: 0,
      finalValue: 1000,
      years: 5,
    });
    expect(result.cagr).toBe(0);
  });
});

describe('calculateFIRE', () => {
  it('calculates FIRE number as 25x annual expenses', () => {
    const result = calculateFIRE({
      currentAnnualExpenses: 40000,
      currentSavings: 100000,
      annualIncome: 100000,
      savingsRate: 40,
      annualReturn: 7,
    });
    expect(result.fireNumber).toBe(1000000); // 25 * 40000
    expect(result.yearsToFI).toBeGreaterThan(0);
  });
});
