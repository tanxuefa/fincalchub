import { describe, it, expect } from 'vitest';
import { calculateMortgage, calculateRefinance, calculateAffordability, calculateRentVsBuy } from '@/lib/finance';

describe('calculateMortgage', () => {
  it('calculates correct monthly payment for standard mortgage', () => {
    const result = calculateMortgage({
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 6.5,
      loanTerm: 30,
    });
    expect(result.monthlyPayment).toBeGreaterThan(1500);
    expect(result.monthlyPayment).toBeLessThan(1550);
    expect(result.principal).toBe(240000);
    expect(result.schedule.length).toBeGreaterThan(0);
  });

  it('handles zero interest rate', () => {
    const result = calculateMortgage({
      homePrice: 100000,
      downPayment: 0,
      interestRate: 0,
      loanTerm: 30,
    });
    expect(result.monthlyPayment).toBeGreaterThan(0);
    expect(result.totalInterest).toBe(0);
  });

  it('includes taxes and insurance in monthly payment', () => {
    const result = calculateMortgage({
      homePrice: 300000,
      downPayment: 60000,
      interestRate: 6.5,
      loanTerm: 30,
      propertyTax: 3600,
      homeInsurance: 1200,
    });
    expect(result.monthlyPayment).toBeGreaterThan(1800);
  });
});

describe('calculateRefinance', () => {
  it('shows savings when refinancing to lower rate with same remaining term', () => {
    const result = calculateRefinance({
      currentBalance: 200000,
      currentRate: 7,
      currentTermRemaining: 180,
      newRate: 5,
      newTerm: 15,
      closingCosts: 4000,
    });
    expect(result.monthlySavings).toBeGreaterThan(0);
    expect(result.isWorthwhile).toBe(true);
  });

  it('is not worthwhile when closing costs exceed savings', () => {
    // With huge closing costs on a tiny remaining term, should not be worthwhile
    const result = calculateRefinance({
      currentBalance: 10000,
      currentRate: 5,
      currentTermRemaining: 12,
      newRate: 4.9,
      newTerm: 15,
      closingCosts: 8000,
    });
    expect(result.isWorthwhile).toBe(false);
  });
});

describe('calculateAffordability', () => {
  it('calculates max home price based on income', () => {
    const result = calculateAffordability({
      annualIncome: 100000,
      monthlyDebts: 500,
      downPayment: 60000,
      interestRate: 6.5,
      loanTerm: 30,
    });
    expect(result.maxHomePrice).toBeGreaterThan(200000);
    expect(result.maxHomePrice).toBeLessThan(600000);
  });
});
