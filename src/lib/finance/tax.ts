// Tax calculators (US-focused with EU template)

export interface USTaxInput {
  income: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_household';
  year?: number;
  deductions?: number; // itemized deductions (uses standard if less)
  dependents?: number;
  preTaxDeductions?: number; // 401k, HSA, etc.
  state?: string;
}

export interface USTaxResult {
  taxableIncome: number;
  federalTax: number;
  stateTax: number;
  totalTax: number;
  effectiveRate: number;
  marginalRate: number;
  fica: number;
  takeHome: number;
  breakdown: { bracket: string; amount: number; tax: number }[];
}

// 2024 US Federal Tax Brackets
const FEDERAL_BRACKETS_2024 = {
  single: [
    [0, 11600, 0.10],
    [11600, 47150, 0.12],
    [47150, 100525, 0.22],
    [100525, 191950, 0.24],
    [191950, 243725, 0.32],
    [243725, 609350, 0.35],
    [609350, Infinity, 0.37],
  ],
  married_joint: [
    [0, 23200, 0.10],
    [23200, 94300, 0.12],
    [94300, 201050, 0.22],
    [201050, 383900, 0.24],
    [383900, 487450, 0.32],
    [487450, 731200, 0.35],
    [731200, Infinity, 0.37],
  ],
  married_separate: [
    [0, 11600, 0.10],
    [11600, 47150, 0.12],
    [47150, 100525, 0.22],
    [100525, 191950, 0.24],
    [191950, 243725, 0.32],
    [243725, 365600, 0.35],
    [365600, Infinity, 0.37],
  ],
  head_household: [
    [0, 16550, 0.10],
    [16550, 63100, 0.12],
    [63100, 100500, 0.22],
    [100500, 191950, 0.24],
    [191950, 243700, 0.32],
    [243700, 609350, 0.35],
    [609350, Infinity, 0.37],
  ],
};

const STANDARD_DEDUCTION_2024 = {
  single: 14600,
  married_joint: 29200,
  married_separate: 14600,
  head_household: 21900,
};

const STATE_TAX_RATES: Record<string, number> = {
  CA: 0.093, NY: 0.0685, TX: 0, FL: 0, IL: 0.0495, PA: 0.0307,
  OH: 0.0399, GA: 0.0549, NC: 0.0475, MI: 0.0425, NJ: 0.0637,
  VA: 0.0575, WA: 0, NV: 0, AZ: 0.025, CO: 0.044, MA: 0.05,
  IN: 0.0315, TN: 0, WI: 0.053, MD: 0.0475, MN: 0.068, OR: 0.089,
};

export function calculateUSTax(input: USTaxInput): USTaxResult {
  const { income, filingStatus = 'single', deductions = 0, dependents = 0, preTaxDeductions = 0, state } = input;

  const standardDeduction = STANDARD_DEDUCTION_2024[filingStatus];
  const itemizedOrStandard = Math.max(standardDeduction, deductions);
  const adjustedIncome = income - preTaxDeductions;
  const taxableIncome = Math.max(0, adjustedIncome - itemizedOrStandard);

  const brackets = FEDERAL_BRACKETS_2024[filingStatus];
  let federalTax = 0;
  let lastRate = 0;
  const breakdown: USTaxResult['breakdown'] = [];

  for (const [low, high, rate] of brackets) {
    if (taxableIncome > low) {
      const amountInBracket = Math.min(taxableIncome, high) - low;
      const taxForBracket = amountInBracket * rate;
      federalTax += taxForBracket;
      lastRate = rate;
      if (amountInBracket > 0) {
        breakdown.push({
          bracket: `${(rate * 100).toFixed(0)}%`,
          amount: amountInBracket,
          tax: Math.round(taxForBracket * 100) / 100,
        });
      }
    }
  }

  // FICA: 6.2% SS (up to $168,600) + 1.45% Medicare (+ 0.9% over $200k)
  const ssWageBase = 168600;
  const socialSecurity = Math.min(adjustedIncome, ssWageBase) * 0.062;
  const medicare = adjustedIncome * 0.0145 + (adjustedIncome > 200000 ? (adjustedIncome - 200000) * 0.009 : 0);
  const fica = socialSecurity + medicare;

  const stateRate = state ? (STATE_TAX_RATES[state.toUpperCase()] ?? 0.05) : 0.05;
  const stateTax = taxableIncome * stateRate;

  const totalTax = federalTax + stateTax + fica;

  return {
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    totalTax: Math.round(totalTax * 100) / 100,
    effectiveRate: income > 0 ? Math.round((totalTax / income) * 10000) / 100 : 0,
    marginalRate: lastRate * 100,
    fica: Math.round(fica * 100) / 100,
    takeHome: Math.round((income - totalTax) * 100) / 100,
    breakdown,
  };
}

export interface CapitalGainsInput {
  purchasePrice: number;
  salePrice: number;
  holdingPeriod: number; // months
  taxableIncome: number;
  filingStatus: 'single' | 'married_joint' | 'married_separate' | 'head_household';
  expenses?: number; // improvements, commissions
}

export interface CapitalGainsResult {
  capitalGain: number;
  isShortTerm: boolean;
  taxRate: number;
  taxOwed: number;
  netProceeds: number;
}

export function calculateCapitalGains(input: CapitalGainsInput): CapitalGainsResult {
  const { purchasePrice, salePrice, holdingPeriod, taxableIncome, filingStatus = 'single', expenses = 0 } = input;

  const capitalGain = salePrice - purchasePrice - expenses;
  const isShortTerm = holdingPeriod < 12;

  let taxRate: number;
  if (isShortTerm) {
    // Taxed as ordinary income
    const brackets = FEDERAL_BRACKETS_2024[filingStatus];
    taxRate = 0.22; // simplified
    for (const [low, high, rate] of brackets) {
      if (taxableIncome > low) taxRate = rate;
    }
  } else {
    // Long-term capital gains rates
    const thresholds = filingStatus === 'married_joint'
      ? [[0, 94050, 0], [94050, 583750, 0.15], [583750, Infinity, 0.20]]
      : [[0, 47025, 0], [47025, 518900, 0.15], [518900, Infinity, 0.20]];
    taxRate = 0;
    for (const [low, high, rate] of thresholds) {
      if (taxableIncome + capitalGain > low) taxRate = rate;
    }
  }

  const taxOwed = capitalGain * taxRate;

  return {
    capitalGain: Math.round(capitalGain * 100) / 100,
    isShortTerm,
    taxRate: Math.round(taxRate * 10000) / 100,
    taxOwed: Math.round(taxOwed * 100) / 100,
    netProceeds: Math.round((salePrice - taxOwed - expenses) * 100) / 100,
  };
}

export function calculateVAT(
  amount: number,
  country: string = 'DE',
  includeVAT: boolean = true
): { vatRate: number; vatAmount: number; total: number; netAmount: number } {
  const vatRates: Record<string, number> = {
    GB: 20, DE: 19, FR: 20, IT: 22, ES: 21, NL: 21, BE: 21, AT: 20,
    PT: 23, IE: 23, SE: 25, DK: 25, FI: 24, PL: 23, CZ: 21, RO: 19,
    HU: 27, BG: 20, HR: 25, LT: 21, SK: 20, EE: 22, LV: 21, MT: 18,
    LU: 17, CY: 19, US: 0, CH: 7.7, NO: 25,
  };

  const rate = vatRates[country.toUpperCase()] ?? 20;

  if (includeVAT) {
    // Amount includes VAT, extract net
    const netAmount = amount / (1 + rate / 100);
    return {
      vatRate: rate,
      vatAmount: Math.round((amount - netAmount) * 100) / 100,
      total: amount,
      netAmount: Math.round(netAmount * 100) / 100,
    };
  } else {
    // Amount is net, add VAT
    const vatAmount = amount * (rate / 100);
    return {
      vatRate: rate,
      vatAmount: Math.round(vatAmount * 100) / 100,
      total: Math.round((amount + vatAmount) * 100) / 100,
      netAmount: amount,
    };
  }
}
